export interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  description?: string;
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subtitle?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  full_name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  cep?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  role?: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_id: string;
  total: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface Banner {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  imageOnly: boolean;
  order?: number;
}
