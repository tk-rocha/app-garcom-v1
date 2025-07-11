import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

interface Tax {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}

interface CartContextType {
  cart: CartItem[];
  discount: Discount | null;
  tax: Tax | null;
  getTotalItems: () => number;
  getProductQuantity: (productId: number) => number;
  addToCart: (productId: number, productData: { name: string; price: number; image: string }) => void;
  removeFromCart: (productId: number) => void;
  removeItemCompletely: (productId: number) => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  setDiscount: (discount: Discount | null) => void;
  setTax: (tax: Tax | null) => void;
  applyDiscount: (amount: number) => void;
  applyTax: (amount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscountState] = useState<Discount | null>(null);
  const [tax, setTaxState] = useState<Tax | null>(null);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getProductQuantity = (productId: number) => {
    const item = cart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (productId: number, productData: { name: string; price: number; image: string }) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { 
          productId, 
          quantity: 1,
          name: productData.name,
          price: productData.price,
          image: productData.image
        }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter(item => item.productId !== productId);
      }
    });
  };

  const removeItemCompletely = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!discount) return 0;
    const subtotal = getSubtotal();
    
    if (discount.type === 'percentage') {
      return (subtotal * discount.value) / 100;
    } else {
      return Math.min(discount.value, subtotal);
    }
  };

  const getTaxAmount = () => {
    if (!tax) return 0;
    const subtotal = getSubtotal();
    
    if (tax.type === 'percentage') {
      return (subtotal * tax.value) / 100;
    } else {
      return tax.value;
    }
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const taxAmount = getTaxAmount();
    return Math.max(0, subtotal + taxAmount - discountAmount);
  };

  const setDiscount = (newDiscount: Discount | null) => {
    setDiscountState(newDiscount);
  };

  const setTax = (newTax: Tax | null) => {
    setTaxState(newTax);
  };

  const applyDiscount = (amount: number) => {
    setDiscountState(amount > 0 ? { type: 'fixed', value: amount } : null);
  };

  const applyTax = (amount: number) => {
    setTaxState(amount > 0 ? { id: 'manual', name: 'Taxa Manual', type: 'fixed', value: amount } : null);
  };

  const value = {
    cart,
    discount,
    tax,
    getTotalItems,
    getProductQuantity,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    getSubtotal,
    getDiscountAmount,
    getTaxAmount,
    getTotal,
    setDiscount,
    setTax,
    applyDiscount,
    applyTax,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};