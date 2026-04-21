export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
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
