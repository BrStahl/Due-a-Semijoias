import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Stripe setup
  let stripe: Stripe | null = null;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey);
  }

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Fetch products from Stripe
  app.get('/api/products', async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    try {
      // Fetch active products and expand default_price
      const products = await stripe.products.list({
        active: true,
        expand: ['data.default_price']
      });

      const mappedProducts = products.data.map(p => {
        const price = p.default_price as Stripe.Price;
        let category = p.metadata.category || 'Geral';
        
        // Auto-categorization fallback based on name keywords if category is 'Geral'
        if (category === 'Geral') {
          const name = p.name.toLowerCase();
          if (name.includes('anel')) category = 'Anéis';
          else if (name.includes('colar')) category = 'Colares';
          else if (name.includes('brinco')) category = 'Brincos';
          else if (name.includes('pulseira')) category = 'Pulseiras';
          else if (name.includes('conjunto')) category = 'Conjuntos';
          else if (name.includes('piercing')) category = 'Piercing';
          else if (name.includes('tornozeleira')) category = 'Tornozeleira';
          else if (name.includes('pingente')) category = 'Pingentes';
        }

        return {
          id: p.id,
          name: p.name,
          category,
          price: price ? price.unit_amount! / 100 : 0,
          image: p.images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3f416?auto=format&fit=crop&q=80&w=600',
          badge: p.metadata.badge || undefined,
          description: p.description
        };
      });

      res.json(mappedProducts);
    } catch (error: any) {
      console.error('Stripe products error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout Session Endpoint
  app.post('/api/checkout', async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    try {
      const { items } = req.body;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'brl',
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100), // convert to cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}/?success=true`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/?canceled=true`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
