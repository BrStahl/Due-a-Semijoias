import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  Smartphone, 
  MapPin, 
  Clock, 
  Search,
  ChevronRight,
  ChevronLeft,
  Star,
  Package,
  RotateCcw,
  Tag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  CreditCard,
  Diamond
} from 'lucide-react';
import { Product, Category, CartItem } from './types.ts';
import { loadStripe } from '@stripe/stripe-js';
import { cn } from './lib/utils';
import { Analytics } from '@vercel/analytics/react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const BANNER_ITEMS = [
  {
    imageOnly: true,
    title: "Nova Coleção", // Fallbacks if needed by types or structure
    subtitle: "Exclusivo",
    description: "",
    image: "/banner-arte.png",
    color: "bg-black"
  },
  {
    title: "COLEÇÃO DIA DAS MÃES",
    subtitle: "Celebre Ela com Joias Elegantes",
    description: "Para a mulher mais importante da sua vida, uma coleção pensada para eternizar momentos e sentimentos.",
    image: "/banner-maes.jpeg",
    color: "bg-[#5D0B1B]" // Matching the deep red velvet from the image
  },
  {
    title: "O Brilho Que Você Merece.",
    subtitle: "Novidades Exclusivas",
    description: "Conheça nossa nova linha de colares e brincos inspirados na beleza clássica e moderna.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?auto=format&fit=crop&q=80&w=1000",
    color: "bg-[#5D1212]"
  },
  {
    title: "Coleção Atemporal Dueña.",
    subtitle: "Clássicos Inesquecíveis",
    description: "Peças que transcedem gerações. O presente perfeito para marcar momentos especiais.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000",
    color: "bg-[#3D0B0B]"
  }
];

const CATEGORIES: Category[] = [
  { id: 'rings', name: 'Anéis', subtitle: 'Estilosos & Atemporais', image: 'https://images.unsplash.com/photo-1573408302355-4e0b7caf3ad6?auto=format&fit=crop&q=80&w=800' },
  { id: 'necklaces', name: 'Colares', subtitle: 'Modernas & Marcantes', image: 'https://images.unsplash.com/photo-1534067783941-51c9c20e367a?auto=format&fit=crop&q=80&w=800' },
  { id: 'earrings', name: 'Brincos', subtitle: 'Exclusivos e Versáteis', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
  { id: 'bracelets', name: 'Pulseiras', subtitle: 'Delicadeza & Brilho', image: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&q=80&w=800' },
  { id: 'sets', name: 'Conjuntos', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600', subtitle: 'Elegância Completa' },
  { id: 'piercing', name: 'Piercing', image: 'https://images.unsplash.com/photo-1598560945593-979929841369?auto=format&fit=crop&q=80&w=600', subtitle: 'Estilo e Ousadia' },
  { id: 'anklets', name: 'Tornozeleira', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600', subtitle: 'Brilho nos Pés' },
  { id: 'pendants', name: 'Pingentes', image: 'https://images.unsplash.com/photo-1599643477877-537ef5278531?auto=format&fit=crop&q=80&w=600', subtitle: 'Toque Pessoal' },
];

const PRODUCT_CATEGORIES = [
  'Colares',
  'Conjuntos',
  'Anéis',
  'Pulseiras',
  'Piercing',
  'Tornozeleira',
  'Pingentes',
  'Brincos'
];

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isSuccessMenuVisible, setIsSuccessMenuVisible] = useState(false);

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentCollection, setCurrentCollection] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProductPage, setCurrentProductPage] = useState(0);
  const [currentDestaquesPage, setCurrentDestaquesPage] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Falha ao carregar produtos');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setIsProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNER_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      setIsSuccessMenuVisible(true);
      setCartItems([]);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setCheckoutLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erro ao processar o checkout. Por favor, tente novamente mais tarde.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const normalizeText = (text: string) => 
    text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory 
      ? normalizeText(p.category).includes(normalizeText(activeCategory))
      : true;
    
    const matchesSearch = searchQuery
      ? normalizeText(p.name).includes(normalizeText(searchQuery)) || 
        normalizeText(p.category).includes(normalizeText(searchQuery))
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen selection:bg-brand-gold selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 bg-white border-b border-brand-gold/10 h-[80px] flex items-center shadow-sm`}>
        <div className="container mx-auto px-6 md:px-[60px] flex justify-between items-center h-full">
          
          {/* Logo */}
          <div className="flex items-center shrink min-w-0 max-w-[140px] md:max-w-[200px] mr-4 md:mr-8 cursor-pointer" onClick={() => { setActiveCategory(null); window.scrollTo(0, 0); }}>
            <img src="/logo.png" alt="Dueña" className="w-full h-auto max-h-[35px] md:max-h-[45px] object-contain object-left" />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex flex-1 items-center">
            <ul className="flex gap-[30px] list-none text-brand-red items-center">
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap" onClick={() => setActiveCategory(null)}>
                <button>INÍCIO</button>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </li>
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap">
                <button onClick={() => document.getElementById('novidades')?.scrollIntoView({ behavior: 'smooth' })}>NOVIDADES</button>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </li>
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap" onClick={() => setIsContactOpen(true)}>
                <span>Contato</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </li>
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap">
                <div className="flex items-center gap-1 group/btn">
                  <span>Produtos</span>
                  <ChevronRight size={14} className="rotate-90 group-hover/btn:text-brand-gold transition-colors" />
                </div>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
                
                {/* Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                  <div className="bg-white border border-brand-gold/20 shadow-2xl min-w-[200px] py-4">
                    <ul className="list-none p-0 flex flex-col">
                      <li>
                        <button 
                          onClick={() => setActiveCategory(null)}
                          className="w-full text-left block px-6 py-3 text-[11px] uppercase tracking-[2px] hover:bg-brand-gold hover:text-brand-red transition-colors border-b border-brand-gold/10"
                        >
                          Todos os Produtos
                        </button>
                      </li>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <li key={cat}>
                          <button 
                            onClick={() => setActiveCategory(cat)}
                            className="w-full text-left block px-6 py-3 text-[11px] uppercase tracking-[2px] hover:bg-brand-gold hover:text-brand-red transition-colors border-b border-brand-gold/10 last:border-0"
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap" onClick={() => setIsPrivacyOpen(true)}>
                <span>Privacidade</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </li>
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap" onClick={() => setIsReturnOpen(true)}>
                <span>Trocas e Devoluções</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </li>
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap" onClick={() => setIsWarrantyOpen(true)}>
                <span>Garantia</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </li>
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap" onClick={() => setIsCareOpen(true)}>
                <span>Cuidado e Qualidades</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </li>
              <li className="relative group text-[10px] uppercase tracking-[1.5px] font-medium cursor-pointer transition-colors whitespace-nowrap" onClick={() => setIsAboutOpen(true)}>
                <span>Quem Somos</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4 ml-8">
            <div className="flex gap-4 items-center text-brand-red relative">
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 250, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute right-full mr-2 overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="Pesquisar joias..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-brand-off-white border border-brand-gold/20 px-4 py-2 text-xs focus:outline-none focus:border-brand-gold text-brand-red"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-gold"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <Search 
                  size={20} 
                  className={`hidden md:block cursor-pointer transition-colors ${isSearchOpen ? 'text-brand-gold' : 'hover:text-brand-gold'}`} 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                />
              </div>
              
              <motion.div 
                key={`cart-${cartCount}`}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                className="relative cursor-pointer group" 
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={20} className="group-hover:text-brand-gold transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </motion.div>
              <button 
                className="md:hidden text-brand-red"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-brand-gold/10 overflow-hidden absolute top-[80px] w-full left-0 shadow-lg"
            >
              <div className="flex flex-col p-6 gap-6 text-[13px] uppercase tracking-[1px] font-medium text-center text-brand-red">
                <button className="hover:text-brand-gold" onClick={() => { setActiveCategory(null); setIsMenuOpen(false); }}>Início</button>
                <button className="hover:text-brand-gold" onClick={() => { document.getElementById('novidades')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }}>Novidades</button>
                <button className="hover:text-brand-gold" onClick={() => { setIsContactOpen(true); setIsMenuOpen(false); }}>Contato</button>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="flex items-center justify-center gap-2 hover:text-brand-gold"
                  >
                    Produtos <ChevronRight size={16} className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isProductsOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-brand-off-white flex flex-col gap-3 py-4"
                      >
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <button 
                            key={cat} 
                            onClick={() => { setActiveCategory(cat); setIsMenuOpen(false); }}
                            className="text-[11px] text-brand-red hover:text-brand-gold uppercase tracking-widest font-bold"
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button className="hover:text-brand-gold" onClick={() => { setIsPrivacyOpen(true); setIsMenuOpen(false); }}>Privacidade</button>
                <button className="hover:text-brand-gold" onClick={() => { setIsReturnOpen(true); setIsMenuOpen(false); }}>Trocas e Devoluções</button>
                <button className="hover:text-brand-gold" onClick={() => { setIsWarrantyOpen(true); setIsMenuOpen(false); }}>Garantia</button>
                <button className="hover:text-brand-gold" onClick={() => { setIsCareOpen(true); setIsMenuOpen(false); }}>Cuidado e Qualidades</button>
                <button className="hover:text-brand-gold" onClick={() => { setIsAboutOpen(true); setIsMenuOpen(false); }}>Quem Somos</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Carousel */}
      {(!activeCategory && !searchQuery) && (
        <>
          <section className="relative overflow-hidden min-h-[calc(100vh-240px)] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className={BANNER_ITEMS[currentBanner].imageOnly ? "flex-1 flex" : "flex-1 grid grid-cols-1 md:grid-cols-2"}
              >
                {BANNER_ITEMS[currentBanner].imageOnly ? (
                  <div className="w-full h-full min-h-[500px] flex-1 relative cursor-pointer" onClick={() => document.getElementById('novidades')?.scrollIntoView({ behavior: 'smooth' })}>
                    <img 
                      src={BANNER_ITEMS[currentBanner].image} 
                      alt="Banner Exclusivo" 
                      className="absolute inset-0 w-full h-full object-cover md:object-[center_20%]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors z-10" />
                  </div>
                ) : (
                  <>
                    <div className={`${BANNER_ITEMS[currentBanner].color} p-6 md:p-[80px] md:px-[60px] flex flex-col justify-center border-r border-brand-gold/20 relative`}>
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        <span className="text-brand-gold text-sm uppercase tracking-[3px] mb-5 block font-medium">
                          {BANNER_ITEMS[currentBanner].subtitle}
                        </span>
                        <h2 className="text-5xl md:text-[56px] font-serif mb-6 leading-[1.1] text-brand-gold">
                          {BANNER_ITEMS[currentBanner].title}
                        </h2>
                        <p className="text-white/70 text-base leading-[1.6] mb-10 max-w-[400px]">
                          {BANNER_ITEMS[currentBanner].description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <a href="#colecoes" className="btn-gold group flex items-center justify-center gap-2">
                            Ver Coleção <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </a>
                          <a href="#loja" className="border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-red font-medium py-3 px-8 transition-all duration-300 uppercase tracking-[2px] text-xs text-center">
                            Ver Loja
                          </a>
                        </div>
                      </motion.div>
                    </div>

                    <div className="relative bg-[#2A0606] flex items-center justify-center overflow-hidden min-h-[400px]">
                      <div className="absolute top-[40px] right-[40px] text-brand-gold opacity-10 text-[200px] font-serif pointer-events-none leading-none">D</div>
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1 }}
                        className="relative z-10 w-[280px] md:w-[320px] aspect-[4/5] border border-brand-gold flex items-center justify-center"
                      >
                        <img 
                          src={BANNER_ITEMS[currentBanner].image} 
                          alt={BANNER_ITEMS[currentBanner].title} 
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1599643477877-537ef5278531?auto=format&fit=crop&q=80&w=1000' }}
                          className="absolute inset-0 w-full h-full object-cover p-2"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-5 left-5 right-[-20px] bottom-[-20px] border border-brand-gold-light -z-10 bg-brand-gold/10" />
                        <span className="absolute bottom-[-40px] left-0 text-brand-gold text-[10px] uppercase tracking-[3px] font-medium opacity-50 font-bold shadow-sm">
                          DUEÑA LUXURY CONCEPT
                        </span>
                      </motion.div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
              <button 
                onClick={() => setCurrentBanner((prev) => (prev - 1 + BANNER_ITEMS.length) % BANNER_ITEMS.length)}
                className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-red transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-3">
                {BANNER_ITEMS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentBanner ? 'bg-brand-gold w-8' : 'bg-brand-gold/30'}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setCurrentBanner((prev) => (prev + 1) % BANNER_ITEMS.length)}
                className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-red transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </section>

          {/* Product Strip Pattern Section */}
          <section className="bg-brand-red border-t border-b border-brand-gold/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center">
            {products.slice(0, 4).map((prod, idx) => (
              <div key={prod.id} className={`flex items-center p-[30px] border-v ${idx !== 3 ? 'lg:border-r border-brand-gold/10' : ''} hover:bg-brand-red-dark transition-colors cursor-pointer`} onClick={() => setSelectedProduct(prod)}>
                <div className="w-[60px] h-[60px] bg-brand-red-dark mr-[15px] border border-brand-gold/20 shrink-0 overflow-hidden">
                  <img src={prod.image} className="w-full h-full object-cover p-1" referrerPolicy="no-referrer" />
                </div>
                <div className="prod-info overflow-hidden">
                  <h3 className="text-[12px] uppercase mb-1 truncate text-brand-gold font-medium tracking-wider">{prod.name}</h3>
                  <p className="text-sm font-bold text-white">R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Novidades / Videos Section */}
          <section id="novidades" className="py-24 bg-brand-red border-b border-brand-gold/10">
            <div className="container mx-auto px-6 md:px-[60px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                  <span className="text-brand-gold text-sm uppercase tracking-[3px] mb-2 font-medium block">Inspire-se</span>
                  <h3 className="text-4xl font-serif text-brand-gold uppercase tracking-widest">Novidades</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                <div className="aspect-[9/16] md:aspect-video bg-black relative border border-brand-gold/20 overflow-hidden group">
                  <video 
                    src="/video1.mp4" 
                    className="w-full h-full object-cover"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    controls
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Categories Grid - Carousel Style */}
          <section id="colecoes" className="py-24 bg-brand-red border-b border-brand-gold/10 relative overflow-hidden">
            <div className="container mx-auto px-6 md:px-[60px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                  <h3 className="text-4xl font-serif text-brand-gold uppercase tracking-widest">Lançamentos</h3>
                </div>
                
                {/* Carousel Controls */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentCollection((prev) => (prev - 1 + CATEGORIES.length) % CATEGORIES.length)}
                    className="w-12 h-12 border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-red transition-all"
                    aria-label="Coleção anterior"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setCurrentCollection((prev) => (prev + 1) % CATEGORIES.length)}
                    className="w-12 h-12 border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-red transition-all"
                    aria-label="Próxima coleção"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {[0, 1, 2].map((offset) => {
                      const cat = CATEGORIES[(currentCollection + offset) % CATEGORIES.length];
                      return (
                        <motion.div
                          key={`${cat.id}-${currentCollection}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.5, delay: offset * 0.1 }}
                          onClick={() => { setActiveCategory(cat.name); document.getElementById('loja')?.scrollIntoView({ behavior: 'smooth' }); }}
                          className="group relative h-[450px] overflow-hidden cursor-pointer border border-brand-gold/10"
                        >
                          <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80" />
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6 text-center">
                            <h4 className="text-white text-3xl font-serif tracking-[4px] uppercase mb-2 drop-shadow-lg">{cat.name}</h4>
                            <p className="text-white/80 text-[11px] tracking-[1px] uppercase mb-6 font-light">{cat.subtitle}</p>
                            <span className="text-white text-[10px] uppercase tracking-[3px] font-bold border-b border-white pb-1 group-hover:text-brand-gold group-hover:border-brand-gold transition-colors">
                              Ver Produtos
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Pagination Indicators */}
              <div className="flex justify-center gap-2 mt-12">
                {CATEGORIES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCollection(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentCollection ? 'bg-brand-gold w-8' : 'bg-brand-gold/20 w-4'}`}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}


      {/* Featured Products */}
      <section id="loja" className="py-24 bg-brand-red border-b border-brand-gold/10">
        <div className="container mx-auto px-6 md:px-[60px]">
          <div className="flex justify-between items-end mb-16">
            <div>
              {(searchQuery || activeCategory) && (
                <span className="text-brand-gold text-xs uppercase tracking-[3px] font-medium block mb-2">
                  {searchQuery ? `Pesquisa: "${searchQuery}"` : `Categoria: ${activeCategory}`}
                </span>
              )}
              <h3 className="text-4xl font-serif text-brand-gold uppercase tracking-widest leading-tight">
                {searchQuery ? 'Resultados' : activeCategory ? activeCategory : 'Mais Vendidos'}
              </h3>
            </div>
            {(activeCategory || searchQuery) && (
              <button 
                onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
                className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-brand-gold hover:text-white transition-colors"
              >
                Limpar {searchQuery ? 'Pesquisa' : 'Filtro'} <X size={14} />
              </button>
            )}
            {(!activeCategory && !searchQuery) && (
              <a href="#" className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-brand-gold hover:text-white transition-colors">
                Catálogo completo <ChevronRight size={14} />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isProductsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-white/5 border border-brand-gold/10 mb-6" />
                  <div className="h-4 bg-white/5 w-1/3 mb-2" />
                  <div className="h-6 bg-white/5 w-2/3 mb-2" />
                  <div className="h-4 bg-white/5 w-1/4" />
                </div>
              ))
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentProductPage + (activeCategory || '') + searchQuery}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                {(activeCategory || searchQuery ? filteredProducts : filteredProducts.slice(currentProductPage * 4, (currentProductPage + 1) * 4)).map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div className="relative aspect-square mb-6 border border-brand-gold/20 bg-brand-red-dark overflow-hidden">
                      {product.badge && (
                        <span className="absolute top-0 left-0 z-10 bg-brand-gold text-white text-[9px] uppercase tracking-widest font-bold py-2 px-4">
                          {product.badge}
                        </span>
                      )}
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="bg-brand-red p-3 border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-red text-brand-gold transition-colors shadow-sm"
                        >
                          <Search size={18} />
                        </button>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-brand-gold text-white p-3 border border-brand-gold hover:bg-brand-red transition-colors shadow-sm"
                        >
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gold mb-1 font-bold">{product.category}</span>
                      <h4 className="text-lg font-serif mb-2 text-brand-gold truncate">{product.name}</h4>
                      <p className="text-white font-sans font-bold text-base">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </motion.div>
                ))}
                </motion.div>
              </AnimatePresence>
            )}
            {!isProductsLoading && filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-serif text-xl italic">Nenhum produto encontrado nesta categoria no momento.</p>
                <button 
                  onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
                  className="mt-6 text-brand-gold uppercase tracking-[2px] text-xs font-bold border-b border-brand-gold pb-1 hover:text-brand-gold-dark hover:border-brand-gold-dark transition-colors"
                >
                  Ver todos os produtos
                </button>
              </div>
            )}
          </div>
          
          {!activeCategory && !searchQuery && filteredProducts.length > 4 && (
            <div className="flex justify-center items-center gap-6 mt-12">
              <button 
                onClick={() => setCurrentProductPage((prev) => Math.max(0, prev - 1))}
                disabled={currentProductPage === 0}
                className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-red transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {[...Array(Math.ceil(filteredProducts.length / 4))].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentProductPage(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentProductPage ? 'bg-brand-gold w-6' : 'bg-brand-gold/30 w-1.5'}`}
                  />
                ))}
              </div>
              <button 
                onClick={() => setCurrentProductPage((prev) => Math.min(Math.ceil(filteredProducts.length / 4) - 1, prev + 1))}
                disabled={currentProductPage >= Math.ceil(filteredProducts.length / 4) - 1}
                className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-red transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-brand-gold/10 backdrop-blur-md"
            />
            <motion.div
              layoutId={`product-${selectedProduct.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-brand-red w-full max-w-4xl border border-brand-gold/20 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 bg-brand-red border border-brand-gold/10 p-2 hover:bg-brand-gold hover:text-brand-red text-brand-gold transition-all shadow-md"
              >
                <X size={20} />
              </button>
              
              <div className="w-full md:w-1/2 h-[400px] md:h-auto border-r border-brand-gold/20 bg-brand-red-dark">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-brand-red">
                <span className="text-brand-gold text-xs uppercase tracking-[3px] font-bold mb-3">{selectedProduct.category}</span>
                <h3 className="text-3xl md:text-5xl font-serif text-brand-gold mb-6 leading-tight">{selectedProduct.name}</h3>
                
                <p className="text-4xl font-sans font-bold text-white mb-10">
                  R$ {selectedProduct.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>

                <div className="space-y-6 mb-12">
                  <p className="text-sm text-white/70 font-light leading-relaxed">
                    Semi joia exclusiva banhada a ouro 18k com tecnologia hipoalergênica. Acabamento polido a mão com padrão de exportação.
                    <br /><br />
                    • Garantia de 1 ano no banho<br />
                    • Design assinado e limitado
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="btn-gold flex items-center justify-center gap-3 py-5"
                  >
                    Adicionar ao Carrinho
                  </button>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Produto em Estoque</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section id="sobre" className="py-24 bg-brand-red border-b border-brand-gold/10 overflow-hidden">
        <div className="container mx-auto px-6 md:px-[60px]">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-brand-gold text-xs uppercase tracking-[3px] font-medium block mb-2">
                Nossas Exclusividades
              </span>
              <h3 className="text-4xl font-serif text-brand-gold uppercase tracking-widest leading-tight">
                Destaques
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isProductsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-white/5 border border-brand-gold/10 mb-6" />
                  <div className="h-4 bg-white/5 w-1/3 mb-2" />
                  <div className="h-6 bg-white/5 w-2/3 mb-2" />
                  <div className="h-4 bg-white/5 w-1/4" />
                </div>
              ))
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentDestaquesPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                {products.filter(p => p.badge === 'Destaque' || p.badge === 'Luxo').slice(currentDestaquesPage * 4, (currentDestaquesPage + 1) * 4).map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div className="relative aspect-square mb-6 border border-brand-gold/20 bg-brand-red-dark overflow-hidden">
                      {product.badge && (
                        <span className="absolute top-0 left-0 z-10 bg-brand-gold text-white text-[9px] uppercase tracking-widest font-bold py-2 px-4">
                          {product.badge}
                        </span>
                      )}
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="bg-brand-red p-3 border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-red text-brand-gold transition-colors shadow-sm"
                        >
                          <Search size={18} />
                        </button>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-brand-gold text-white p-3 border border-brand-gold hover:bg-brand-red transition-colors shadow-sm"
                        >
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gold/70 block mb-2 font-semibold">
                        {product.category}
                      </span>
                      <h4 className="text-white font-serif text-lg mb-2 line-clamp-1">{product.name}</h4>
                      <p className="text-brand-gold font-sans font-bold tracking-wide">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          
          {/* Destaques Pagination */}
          {!isProductsLoading && products.filter(p => p.badge === 'Destaque' || p.badge === 'Luxo').length > 4 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <button 
                onClick={() => setCurrentDestaquesPage(prev => Math.max(0, prev - 1))}
                disabled={currentDestaquesPage === 0}
                className="p-2 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-red disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-gold transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[11px] uppercase tracking-widest text-brand-gold font-semibold">
                Página {currentDestaquesPage + 1} de {Math.ceil(products.filter(p => p.badge === 'Destaque' || p.badge === 'Luxo').length / 4)}
              </span>
              <button 
                onClick={() => setCurrentDestaquesPage(prev => Math.min(Math.ceil(products.filter(p => p.badge === 'Destaque' || p.badge === 'Luxo').length / 4) - 1, prev + 1))}
                disabled={currentDestaquesPage >= Math.ceil(products.filter(p => p.badge === 'Destaque' || p.badge === 'Luxo').length / 4) - 1}
                className="p-2 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-red disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-gold transition-colors"
                aria-label="Próxima página"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Content from Image */}
      <section className="bg-brand-red border-t border-brand-gold/10 py-16">
        <div className="container mx-auto px-6 md:px-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-brand-gold/10">
            {/* Benefit 1 */}
            <div className="flex flex-col items-center text-center p-8 group transition-colors hover:bg-brand-red-dark">
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-brand-red border border-brand-gold/20 rounded-none group-hover:bg-brand-red-dark transition-colors">
                <Package size={28} className="text-brand-gold" />
              </div>
              <h4 className="text-2xl font-serif text-brand-gold mb-2">Frete Grátis</h4>
              <p className="text-sm text-white/50 font-light">Acima de R$300</p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col items-center text-center p-8 group transition-colors hover:bg-brand-red-dark">
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-brand-red border border-brand-gold/20 rounded-none group-hover:bg-brand-red-dark transition-colors">
                <RotateCcw size={28} className="text-brand-gold" />
              </div>
              <h4 className="text-2xl font-serif text-brand-gold mb-2">Garantia de 6 meses</h4>
              <p className="text-sm text-white/50 font-light">Em todas as peças</p>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col items-center text-center p-8 group transition-colors hover:bg-brand-red-dark">
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-brand-red border border-brand-gold/20 rounded-none group-hover:bg-brand-red-dark transition-colors">
                <Tag size={28} className="text-brand-gold" />
              </div>
              <h4 className="text-2xl font-serif text-brand-gold mb-2">6% de desconto</h4>
              <p className="text-sm text-white/50 font-light">Pix</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-brand-red py-12 text-brand-gold border-t border-brand-gold/10">
        <div className="container mx-auto px-6 md:px-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="mb-6">
                <img src="/logo.png" alt="Dueña" className="w-full h-auto max-w-[180px] max-h-[48px] object-contain object-left" />
              </h2>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[3px] font-bold mb-6 text-brand-gold">Suporte</h4>
              <ul className="space-y-4 text-[12px] text-white/80 tracking-wide font-light">
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setIsAboutOpen(true)}>Quem Somos</li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setIsPrivacyOpen(true)}>Privacidade</li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setIsWarrantyOpen(true)}>Garantia</li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setIsCareOpen(true)}>Cuidados</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[3px] font-bold mb-6 text-brand-gold">Conecte-se</h4>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/duenasemijoias?igsh=MTRiMjhyOXhpOTR5Mg==" target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} className="hover:text-white cursor-pointer transition-colors" />
                </a>
                <a href="https://www.facebook.com/share/18beiyVNFe/" target="_blank" rel="noopener noreferrer">
                  <Facebook size={20} className="hover:text-white cursor-pointer transition-colors" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-brand-gold/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-[2px] text-brand-gold/50 font-medium">
              Dueña © 2026 — Todos os direitos reservados
            </p>
            <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="/bandeiras.png" 
                alt="Formas de Pagamento" 
                className="h-8 md:h-10 object-contain shadow-sm" 
                style={{ clipPath: 'inset(0 9.2% 0 0)' }} 
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-brand-red/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-red w-full max-w-2xl max-h-[80vh] border border-brand-gold/20 overflow-y-auto shadow-2xl p-8 md:p-12 text-white/80 font-light"
            >
              <button 
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-6 right-6 bg-brand-red border border-brand-gold/30 p-2 hover:bg-brand-gold hover:text-brand-red transition-all shadow-md z-10 text-brand-gold"
              >
                <X size={20} />
              </button>

              <div className="prose prose-sm max-w-none">
                <h2 className="text-3xl font-serif text-brand-gold mb-6 uppercase tracking-widest border-b border-brand-border pb-4">Política de Privacidade</h2>
                <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-8">Última atualização: 16/02/2026</p>
                
                <div className="space-y-8 leading-relaxed">
                  <p>A sua privacidade é muito importante para nós. Esta Política de Privacidade descreve como suas informações pessoais são coletadas, usadas e protegidas ao visitar ou fazer uma compra em nossa loja online.</p>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">1. Quem somos</h3>
                    <p>Esta loja é operada por pessoa física, sob o nome Karen Barbosa / Dueña Semijoias, registrada no CPF 443.980.098-09, localizada na Rua das Camélias, 87 – Residencial Fazenda Itapema, Limeira – SP. Prezamos pela segurança dos seus dados e seguimos as diretrizes da Lei Geral de Proteção de Dados Pessoais (LGPD - Lei 13.709/2018).</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">2. Informações que coletamos</h3>
                    <p>Ao navegar em nossa loja ou realizar uma compra, podemos coletar as seguintes informações:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Nome completo</li>
                      <li>CPF (quando necessário para emissão de nota fiscal ou envio)</li>
                      <li>Endereço de entrega</li>
                      <li>E-mail</li>
                      <li>Número de telefone</li>
                      <li>Informações de pagamento (processadas por plataformas seguras e terceirizadas)</li>
                      <li>Dados de navegação (cookies, endereço IP, dispositivo usado etc.)</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">3. Como usamos suas informações</h3>
                    <p>As informações coletadas são utilizadas para:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Processar e entregar seu pedido</li>
                      <li>Entrar em contato em caso de dúvidas ou atualizações do pedido</li>
                      <li>Emitir nota fiscal, quando aplicável</li>
                      <li>Enviar promoções, novidades e conteúdos, se você autorizar</li>
                      <li>Garantir a segurança e melhoria da navegação em nosso site</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">4. Compartilhamento de dados</h3>
                    <p>Seus dados não são vendidos ou repassados a terceiros, exceto quando necessário para:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Processamento de pagamentos (ex: Mercado Pago, Pix, PagSeguro)</li>
                      <li>Entrega (ex: Correios, transportadoras)</li>
                      <li>Cumprimento de obrigações legais e fiscais</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">5. Armazenamento de informações</h3>
                    <p>Seus dados são armazenados em plataformas seguras, com acesso restrito. O tempo de retenção das informações segue os prazos legais ou enquanto for necessário para finalidades comerciais legítimas.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">6. Cookies e tecnologias similares</h3>
                    <p>Utilizamos cookies para melhorar a experiência do usuário, como lembrar o carrinho de compras e entender o comportamento de navegação. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar algumas funcionalidades do site.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">7. Seus direitos</h3>
                    <p>Você tem o direito de:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Acessar seus dados pessoais</li>
                      <li>Corrigir dados incorretos ou desatualizados</li>
                      <li>Solicitar a exclusão dos dados, quando aplicável</li>
                      <li>Revogar o consentimento para uso de dados a qualquer momento</li>
                    </ul>
                    <p className="mt-4">Para exercer seus direitos, entre em contato pelo e-mail: <span className="font-bold text-brand-gold">duenajoias@gmail.com</span></p>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">8. Alterações nesta política</h3>
                    <p>Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você a revise sempre que visitar nossa loja.</p>
                  </section>

                  <section className="bg-brand-red-dark p-6 border border-brand-gold/20">
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">9. Contato</h3>
                    <div className="space-y-1 text-sm text-white/70">
                      <p><strong className="text-brand-gold">Responsável:</strong> Karen Barbosa</p>
                      <p><strong className="text-brand-gold">CPF:</strong> 443.980.098-09</p>
                      <p><strong className="text-brand-gold">Endereço:</strong> Rua das Camélias, 87 – Residencial Fazenda Itapema, Limeira – SP</p>
                      <p><strong className="text-brand-gold">Email:</strong> duenajoias@gmail.com</p>
                      <p><strong className="text-brand-gold">WhatsApp:</strong> (19) 97828-0928</p>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Returns and Exchanges Modal */}
      <AnimatePresence>
        {isReturnOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReturnOpen(false)}
              className="absolute inset-0 bg-brand-gold/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-red w-full max-w-2xl max-h-[80vh] border border-brand-gold/20 overflow-y-auto shadow-2xl p-8 md:p-12 text-white/80 font-light"
            >
              <button 
                onClick={() => setIsReturnOpen(false)}
                className="absolute top-6 right-6 bg-brand-red border border-brand-gold/30 p-2 hover:bg-brand-gold hover:text-brand-red transition-all shadow-md z-10 text-brand-gold"
              >
                <X size={20} />
              </button>

              <div className="prose prose-sm max-w-none">
                <h2 className="text-3xl font-serif text-brand-gold mb-6 uppercase tracking-widest border-b border-brand-border pb-4">Trocas e Devoluções</h2>
                
                <div className="space-y-8 leading-relaxed">
                  <p>De acordo com o Artigo 49 do Código de Defesa do Consumidor, o prazo para a troca ou devolução de um produto é de até <span className="font-bold">7 dias corridos</span>, contados a partir do dia seguinte à entrega do seu pedido.</p>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Requisitos para Troca ou Devolução</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>O produto deve estar em perfeitas condições, com a embalagem original, manual e acessórios intactos, sem sinais de uso indevido.</li>
                      <li>Para processar a troca ou devolução, o produto deverá ser enviado de volta ao nosso estoque, onde será analisado pela equipe responsável. O retorno da análise ocorrerá em até 4 dias úteis após o recebimento da solicitação.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Procedimento de Troca</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Se o produto não atender às condições mencionadas, ele será devolvido ao cliente sem aviso prévio.</li>
                      <li>O tempo total para a troca pode variar dependendo da localização da coleta e entrega ou da data de postagem do produto nos Correios.</li>
                      <li>Se o item solicitado não estiver mais disponível, será gerado um crédito em forma de cupom de desconto para novas compras.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Instruções para Embalagem</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Conserve a embalagem original do produto para o transporte seguro durante a devolução. O produto deve ser protegido adequadamente para evitar danos no transporte.</li>
                      <li>Se a entrega foi feita pelos Correios, será gerada uma autorização de postagem para a devolução. No caso de transportadoras, será agendada uma coleta no mesmo endereço de entrega.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Avarias e Defeitos no Produto</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Ao receber seu pedido, verifique imediatamente a embalagem e o produto. Se houver qualquer dano visível na embalagem ou no produto, recuse a entrega e anote o ocorrido na nota fiscal ou comprovante de entrega.</li>
                      <li>Em caso de entrega pelos Correios, se a avaria não for aparente na embalagem, você pode solicitar a troca por e-mail, incluindo o número do pedido e uma foto do produto danificado.</li>
                      <li>Caso você perceba que o produto entregue não corresponde ao que foi pedido, recuse a entrega e registre a ocorrência. Se notar o erro após o recebimento, entre em contato com a Central de Atendimento em até 7 dias corridos.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Devoluções</h3>
                    <p>Conforme o Artigo 49 do Código de Defesa do Consumidor, a devolução do produto pode ser realizada em até 7 dias corridos após a entrega, desde que o produto esteja em perfeitas condições, com embalagem original e sem sinais de mau uso.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Reembolsos e Créditos</h3>
                    <p>Após a devolução e processamento do produto, o valor será reembolsado conforme a forma de pagamento utilizada ou convertido em crédito para futuras compras.</p>
                  </section>

                  <section className="bg-brand-red-dark p-6 border border-brand-gold/20">
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Fale Conosco</h3>
                    <p className="text-white/70">Para solicitar uma troca ou devolução, entre em contato via:</p>
                    <div className="mt-3 space-y-1 font-bold text-brand-gold">
                      <p>WhatsApp: (19) 97828-0928</p>
                      <p>Email: duenajoias@gmail.com</p>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Warranty Modal */}
      <AnimatePresence>
        {isWarrantyOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWarrantyOpen(false)}
              className="absolute inset-0 bg-brand-gold/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-red w-full max-w-2xl max-h-[80vh] border border-brand-gold/20 overflow-y-auto shadow-2xl p-8 md:p-12 text-white/80 font-light"
            >
              <button 
                onClick={() => setIsWarrantyOpen(false)}
                className="absolute top-6 right-6 bg-brand-red border border-brand-gold/30 p-2 hover:bg-brand-gold hover:text-brand-red transition-all shadow-md z-10 text-brand-gold"
              >
                <X size={20} />
              </button>

              <div className="prose prose-sm max-w-none">
                <h2 className="text-3xl font-serif text-brand-gold mb-6 uppercase tracking-widest border-b border-brand-border pb-4">Política de Garantia</h2>
                
                <div className="space-y-8 leading-relaxed">
                  <div className="bg-brand-gold/5 p-6 border-l-4 border-brand-gold">
                    <p className="text-lg font-serif italic text-brand-gold">"Nossa garantia tem um tempo de <span className="font-bold">6 meses</span> após o pagamento do pedido."</p>
                  </div>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">O que a garantia cobre</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2 font-medium">
                      <li>Defeitos de fabricação.</li>
                      <li>Oxidação natural do banho.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">O que a garantia não cobre (mau uso)</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                       <li>Peças amassadas, riscadas, quebradas, danificadas ou desgastadas pelo mau uso.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Como acionar a garantia</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Envie uma foto da peça com o defeito para o nosso WhatsApp ou e-mail.</li>
                      <li>É indispensável a apresentação do <span className="font-bold">termo de garantia</span>.</li>
                    </ul>
                  </section>

                  <section className="bg-brand-red-dark p-6 border border-brand-gold/10">
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Dicas de Conservação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-2">Evitar</h4>
                        <p className="text-sm">Contato com produtos químicos, água do mar e piscina.</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-2">Após o Uso</h4>
                        <p className="text-sm">Secar suavemente as peças com uma flanela seca, guardar as peças separadamente, evitando atrito.</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Care and Quality Modal */}
      <AnimatePresence>
        {isCareOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCareOpen(false)}
              className="absolute inset-0 bg-brand-gold/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-red w-full max-w-2xl max-h-[80vh] border border-brand-gold/20 overflow-y-auto shadow-2xl p-8 md:p-12 text-white/80 font-light"
            >
              <button 
                onClick={() => setIsCareOpen(false)}
                className="absolute top-6 right-6 bg-brand-red border border-brand-gold/30 p-2 hover:bg-brand-gold hover:text-brand-red transition-all shadow-md z-10 text-brand-gold"
              >
                <X size={20} />
              </button>

              <div className="prose prose-sm max-w-none">
                <h2 className="text-3xl font-serif text-brand-gold mb-6 uppercase tracking-widest border-b border-brand-border pb-4">Cuidado e Qualidades</h2>
                
                <div className="space-y-8 leading-relaxed">
                  <p className="text-lg italic text-brand-gold/80 font-serif">Cada semijoia Dueña é cuidadosamente selecionada, unindo design sofisticado, alta durabilidade e acabamento impecável.</p>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Qualidade</h3>
                    <ul className="space-y-4">
                      <li className="flex gap-4">
                        <span className="text-brand-gold font-bold">01.</span>
                        <p><strong>Banhadas em Prata 925:</strong> Recebem um banho de <span className="text-brand-gold font-bold">50 milésimos de prata</span>, garantindo brilho intenso e durabilidade.</p>
                      </li>
                      <li className="flex gap-4">
                        <span className="text-brand-gold font-bold">02.</span>
                        <p><strong>Banhadas a Ouro 18k:</strong> Finalizadas com um banho de <span className="text-brand-gold font-bold">5 milésimos</span> e verniz cataforético, que protege contra oxidação e prolonga o brilho.</p>
                      </li>
                      <li className="flex gap-4">
                        <span className="text-brand-gold font-bold">03.</span>
                        <p><strong>Banhadas a Ródio Branco:</strong> Camada de metal nobre de alta resistência, finalizada com verniz cataforético.</p>
                      </li>
                      <li className="flex gap-4">
                        <span className="text-brand-gold font-bold">04.</span>
                        <p><strong>Hipoalergênicas:</strong> Todas as peças são livres de níquel, ideais para peles sensíveis.</p>
                      </li>
                    </ul>
                  </section>

                  <section className="bg-brand-red-dark p-6 border border-brand-gold/10">
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Cuidados Diários</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span> Evite molhar os acessórios</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span> Retire para atividades físicas</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span> Não utilize na praia (sal e areia)</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span> Evite perfumes e cosméticos diretos</li>
                    </ul>
                    <p className="mt-4 text-[12px] italic text-gray-400 font-bold">Dica: Guarde em saquinhos individuais, longe da umidade e luz direta.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-3">Como limpar suas peças?</h3>
                    <div className="space-y-6">
                      <div className="border-l-2 border-brand-gold pl-4">
                        <h4 className="font-serif text-brand-gold font-bold uppercase text-[11px] tracking-widest mb-2">Para Peças em Prata</h4>
                        <p className="text-sm">Escove suavemente com escova macia + <span className="font-bold">bicarbonato de sódio</span>. Enxágue bem e seque com secador no modo morno.</p>
                        <p className="text-[10px] text-brand-gold mt-1 font-bold">Extra: Use "Monzi" limpa-prata para sujeiras profundas.</p>
                      </div>
                      <div className="border-l-2 border-brand-gold pl-4">
                        <h4 className="font-serif text-brand-gold font-bold uppercase text-[11px] tracking-widest mb-2">Para Ouro e Ródio Branco</h4>
                        <p className="text-sm">Escove levemente com escova macia + <span className="font-bold">detergente neutro</span>. Enxágue e seque com secador morno.</p>
                        <p className="text-[10px] text-brand-gold mt-1 font-bold">Dica: Pode deixar 5min em água com "Veja" (sem esfregar).</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Us Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="absolute inset-0 bg-brand-gold/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-red w-full max-w-2xl max-h-[80vh] border border-brand-gold/20 overflow-y-auto shadow-2xl p-8 md:p-12 text-white/80 font-light"
            >
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-6 right-6 bg-brand-red border border-brand-gold/30 p-2 hover:bg-brand-gold hover:text-brand-red transition-all shadow-md z-10 text-brand-gold"
              >
                <X size={20} />
              </button>

              <div className="prose prose-sm max-w-none">
                <div className="flex justify-center mb-8">
                  <img src="/logo.png" alt="Dueña" className="w-full h-auto max-w-[200px] object-contain" />
                </div>
                <h2 className="text-3xl font-serif text-brand-gold mb-6 uppercase tracking-widest border-b border-brand-border pb-4">Quem Somos</h2>
                
                <div className="space-y-8 leading-relaxed text-base">
                  <p className="text-xl italic text-brand-gold/80 font-serif">Joias que transcendem o tempo. Criamos peças exclusivas com acabamento de alta joalheria para mulheres que buscam o equilíbrio perfeito entre luxo e autenticidade.</p>
                  
                  <p>A <span className="text-brand-gold font-bold">Dueña Semijoias</span> nasceu de um propósito da sua fundadora, <span className="text-brand-gold font-bold">Karen Neves</span>: empoderar mulheres através da beleza, do estilo e da autenticidade. Mais do que uma marca, a Dueña é a concretização de um sonho de fazer a diferença, não apenas sendo vista, mas criando conexões reais através de acessórios que contam histórias.</p>

                  <p>Mais do que acessórios, nossas peças são criadas para valorizar a força e a elegância de quem as usa, transformando o dia a dia em momentos de brilho e confiança.</p>

                  <p>Cada semijoia Dueña é cuidadosamente selecionada, unindo design sofisticado, alta durabilidade e acabamento impecável. Trabalhamos com materiais de qualidade e oferecemos garantia, porque acreditamos que você merece mais do que beleza: merece confiança e excelência em cada detalhe.</p>

                  <p>Somos apaixonados por tudo o que representa autoestima, personalidade e poder pessoal. E é isso que entregamos em cada coleção.</p>

                  <div className="text-center pt-8 border-t border-brand-gold/10">
                    <p className="font-serif italic text-2xl text-brand-gold mb-2">Seja dueña de si.</p>
                    <p className="font-serif text-3xl font-bold text-brand-gold tracking-[2px] uppercase">Seja Dueña.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="absolute inset-0 bg-brand-gold/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-red w-full max-w-2xl max-h-[80vh] border border-brand-gold/20 overflow-y-auto shadow-2xl p-8 md:p-12 text-white/80 font-light"
            >
              <button 
                onClick={() => setIsContactOpen(false)}
                className="absolute top-6 right-6 bg-brand-red border border-brand-gold/30 p-2 hover:bg-brand-gold hover:text-brand-red transition-all shadow-md z-10 text-brand-gold"
              >
                <X size={20} />
              </button>

              <div className="prose prose-sm max-w-none">
                <h2 className="text-3xl font-serif text-brand-gold mb-2 uppercase tracking-widest border-b border-brand-border pb-4 text-center">Entre em Contato</h2>
                <p className="text-center text-gray-400 mb-10 italic">Estamos aqui para tornar sua experiência Dueña inesquecível.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-serif text-brand-gold font-bold uppercase tracking-wider mb-6">Fale Conosco</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-red-dark flex items-center justify-center border border-brand-gold/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">WhatsApp</p>
                          <a href="https://wa.me/5519978280928" className="text-sm font-bold hover:text-brand-gold transition-colors">(19) 97828-0928</a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-red-dark flex items-center justify-center border border-brand-gold/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">E-mail</p>
                          <a href="mailto:duenajoias@gmail.com" className="text-sm font-bold hover:text-brand-gold transition-colors">duenajoias@gmail.com</a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-red-dark flex items-center justify-center border border-brand-gold/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Localização</p>
                          <p className="text-sm font-bold">Limeira - SP (Envios para todo Brasil)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-red-dark p-6 border border-brand-gold/20">
                    <form action="https://formsubmit.co/duenajoias@gmail.com" method="POST" className="flex flex-col gap-4">
                      {/* FormSubmit Configuration */}
                      <input type="hidden" name="_next" value={window.location.href} />
                      <input type="hidden" name="_subject" value="Novo Contato - Site Dueña" />
                      
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Nome Completo</label>
                        <input 
                          type="text" 
                          name="name" 
                          required 
                          className="w-full bg-brand-red-dark border border-brand-gold/20 px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">E-mail</label>
                        <input 
                          type="email" 
                          name="email" 
                          required 
                          className="w-full bg-brand-red-dark border border-brand-gold/20 px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Mensagem</label>
                        <textarea 
                          name="message" 
                          required 
                          rows={4}
                          className="w-full bg-brand-red-dark border border-brand-gold/20 px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-gold resize-none transition-colors"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-brand-gold text-white py-3 text-[11px] uppercase tracking-[2px] font-bold hover:bg-brand-red transition-all duration-300 mt-2"
                      >
                        Enviar Mensagem
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5519978280928" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
      </a>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-brand-gold/20 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-brand-red border-l border-brand-gold/20 z-[160] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-brand-gold/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-brand-gold" size={20} />
                  <h3 className="text-xl font-serif text-brand-gold uppercase tracking-widest">Seu Carrinho</h3>
                  <span className="bg-brand-gold text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{cartCount}</span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-brand-gold/10 text-brand-gold transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-brand-red-dark border border-brand-gold/10 flex items-center justify-center">
                      <ShoppingBag size={32} className="text-brand-gold/30" />
                    </div>
                    <div>
                      <p className="text-brand-gold font-serif text-lg">Seu carrinho está vazio</p>
                      <p className="text-white/50 text-xs uppercase tracking-widest mt-2">Adicione peças exclusivas para brilhar</p>
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-brand-gold text-[11px] uppercase tracking-[2px] font-bold border-b border-brand-gold pb-1 pt-4 hover:text-white hover:border-white transition-colors"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-brand-red-dark border border-brand-gold/10 overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-brand-gold font-serif text-base leading-tight pr-4">{item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-brand-gold/40 hover:text-brand-gold transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">{item.category}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-brand-gold/20">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-brand-gold/10 text-brand-gold"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs text-brand-gold font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-brand-gold/10 text-brand-gold"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="text-white font-bold">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 bg-brand-red-dark border-t border-brand-gold/20 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/60 text-xs uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-brand-gold text-lg font-serif">
                      <span>Total</span>
                      <span className="font-bold">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className={cn(
                      "w-full bg-brand-gold text-white py-4 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[2px] font-bold hover:bg-white hover:text-brand-red transition-all duration-300 shadow-xl",
                      checkoutLoading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {checkoutLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard size={16} />
                        Finalizar Compra
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-center text-brand-gold/40 uppercase tracking-widest">Pagamento Seguro via Stripe</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {isSuccessMenuVisible && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-red/80 backdrop-blur-md"
              onClick={() => setIsSuccessMenuVisible(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-brand-red border border-brand-gold/30 p-12 text-center max-w-sm shadow-2xl"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <h3 className="text-3xl font-serif text-brand-gold mb-4 uppercase tracking-widest leading-tight">Pedido Recebido!</h3>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-8">
                Parabéns pela sua escolha! Você receberá os detalhes da sua compra no e-mail cadastrado em breve.
              </p>
              <button 
                onClick={() => setIsSuccessMenuVisible(false)}
                className="w-full btn-gold py-4"
              >
                Continuar Navegando
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
}
