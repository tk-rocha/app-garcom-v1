import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  enviado?: boolean; // Para rastrear se o item foi enviado para a cozinha
}

interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  inputType: 'percentage' | 'value'; // Para lembrar se foi inserido como % ou R$
  inputValue: string; // Para lembrar o valor original digitado
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
  getTotalItems: (cartId?: string) => number;
  getProductQuantity: (productId: number, cartId?: string) => number;
  addToCart: (productId: number, productData: { name: string; price: number; image: string }, cartId?: string) => void;
  removeFromCart: (productId: number, cartId?: string) => void;
  removeItemCompletely: (productId: number, cartId?: string) => void;
  getSubtotal: (cartId?: string) => number;
  getDiscountAmount: (cartId?: string) => number;
  getTaxAmount: (cartId?: string) => number;
  getTotal: (cartId?: string) => number;
  setDiscount: (discount: Discount | null, cartId?: string) => void;
  setTax: (tax: Tax | null, cartId?: string) => void;
  applyDiscount: (amount: number, inputType: 'percentage' | 'value', inputValue: string, cartId?: string) => void;
  getDiscountType: (cartId?: string) => 'percentage' | 'value';
  getDiscountValue: (cartId?: string) => string;
  applyTax: (amount: number, cartId?: string) => void;
  clearCart: (cartId?: string) => void;
  getCartItems: (cartId?: string) => CartItem[];
  markItemsAsEnviado: (cartId?: string) => void;
  getItensEnviados: (cartId?: string) => CartItem[];
  getItensNaoEnviados: (cartId?: string) => CartItem[];
  hasItensEnviados: (cartId?: string) => boolean;
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
  // Load data from localStorage on initialization
  const loadFromStorage = () => {
    try {
      const savedCarts = localStorage.getItem('restaurant-carts');
      const savedDiscounts = localStorage.getItem('restaurant-discounts');
      const savedTaxes = localStorage.getItem('restaurant-taxes');
      
      return {
        carts: savedCarts ? JSON.parse(savedCarts) : { balcao: [] },
        discounts: savedDiscounts ? JSON.parse(savedDiscounts) : { balcao: null },
        taxes: savedTaxes ? JSON.parse(savedTaxes) : { balcao: null }
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return {
        carts: { balcao: [] },
        discounts: { balcao: null },
        taxes: { balcao: null }
      };
    }
  };

  // Multi-cart system: key is cartId (e.g., 'balcao', 'mesa-1', 'mesa-2')
  const [carts, setCarts] = useState<Record<string, CartItem[]>>(loadFromStorage().carts);
  const [discounts, setDiscounts] = useState<Record<string, Discount | null>>(loadFromStorage().discounts);
  const [taxes, setTaxes] = useState<Record<string, Tax | null>>(loadFromStorage().taxes);

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem('restaurant-carts', JSON.stringify(carts));
  }, [carts]);

  React.useEffect(() => {
    localStorage.setItem('restaurant-discounts', JSON.stringify(discounts));
  }, [discounts]);

  React.useEffect(() => {
    localStorage.setItem('restaurant-taxes', JSON.stringify(taxes));
  }, [taxes]);

  // Get current cart, discount, and tax (for backward compatibility)
  const cart = carts.balcao || [];
  const discount = discounts.balcao;
  const tax = taxes.balcao;

  const getCartItems = (cartId: string = 'balcao'): CartItem[] => {
    return carts[cartId] || [];
  };

  const getTotalItems = (cartId: string = 'balcao') => {
    const currentCart = carts[cartId] || [];
    return currentCart.reduce((total, item) => total + item.quantity, 0);
  };

  const getProductQuantity = (productId: number, cartId: string = 'balcao') => {
    const currentCart = carts[cartId] || [];
    const item = currentCart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (productId: number, productData: { name: string; price: number; image: string }, cartId: string = 'balcao') => {
    setCarts(prev => {
      const currentCart = prev[cartId] || [];
      const existingItem = currentCart.find(item => item.productId === productId);
      
      if (existingItem) {
        const updatedCart = currentCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...prev, [cartId]: updatedCart };
      } else {
        const newItem = { 
          productId, 
          quantity: 1,
          name: productData.name,
          price: productData.price,
          image: productData.image,
          enviado: false
        };
        return { ...prev, [cartId]: [...currentCart, newItem] };
      }
    });
  };

  const removeFromCart = (productId: number, cartId: string = 'balcao') => {
    setCarts(prev => {
      const currentCart = prev[cartId] || [];
      const existingItem = currentCart.find(item => item.productId === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        const updatedCart = currentCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        return { ...prev, [cartId]: updatedCart };
      } else {
        const updatedCart = currentCart.filter(item => item.productId !== productId);
        return { ...prev, [cartId]: updatedCart };
      }
    });
  };

  const removeItemCompletely = (productId: number, cartId: string = 'balcao') => {
    setCarts(prev => {
      const currentCart = prev[cartId] || [];
      const updatedCart = currentCart.filter(item => item.productId !== productId);
      return { ...prev, [cartId]: updatedCart };
    });
  };

  const getSubtotal = (cartId: string = 'balcao') => {
    const currentCart = carts[cartId] || [];
    return currentCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = (cartId: string = 'balcao') => {
    const currentDiscount = discounts[cartId];
    if (!currentDiscount) return 0;
    const subtotal = getSubtotal(cartId);
    
    if (currentDiscount.type === 'percentage') {
      return (subtotal * currentDiscount.value) / 100;
    } else {
      return Math.min(currentDiscount.value, subtotal);
    }
  };

  const getTaxAmount = (cartId: string = 'balcao') => {
    const currentTax = taxes[cartId];
    if (!currentTax) return 0;
    const subtotal = getSubtotal(cartId);
    
    if (currentTax.type === 'percentage') {
      return (subtotal * currentTax.value) / 100;
    } else {
      return currentTax.value;
    }
  };

  const getTotal = (cartId: string = 'balcao') => {
    const subtotal = getSubtotal(cartId);
    const discountAmount = getDiscountAmount(cartId);
    const taxAmount = getTaxAmount(cartId);
    return Math.max(0, subtotal + taxAmount - discountAmount);
  };

  const setDiscount = (newDiscount: Discount | null, cartId: string = 'balcao') => {
    setDiscounts(prev => ({ ...prev, [cartId]: newDiscount }));
  };

  const setTax = (newTax: Tax | null, cartId: string = 'balcao') => {
    setTaxes(prev => ({ ...prev, [cartId]: newTax }));
  };

  const applyDiscount = (amount: number, inputType: 'percentage' | 'value', inputValue: string, cartId: string = 'balcao') => {
    if (amount <= 0) {
      setDiscount(null, cartId);
    } else {
      const discountType = inputType === 'percentage' ? 'percentage' : 'fixed';
      setDiscount({ 
        type: discountType, 
        value: amount,
        inputType,
        inputValue
      }, cartId);
    }
  };

  const getDiscountType = (cartId: string = 'balcao'): 'percentage' | 'value' => {
    return discounts[cartId]?.inputType || 'percentage';
  };

  const getDiscountValue = (cartId: string = 'balcao'): string => {
    return discounts[cartId]?.inputValue || '';
  };

  const applyTax = (amount: number, cartId: string = 'balcao') => {
    setTax(amount > 0 ? { id: 'manual', name: 'Taxa Manual', type: 'fixed', value: amount } : null, cartId);
  };

  const clearCart = (cartId: string = 'balcao') => {
    setCarts(prev => ({ ...prev, [cartId]: [] }));
    setDiscount(null, cartId);
    setTax(null, cartId);
    
    // Also clear any saved data for this mesa or comanda
    if (cartId.startsWith('mesa-')) {
      const mesaId = cartId.replace('mesa-', '');
      localStorage.removeItem(`mesa-${mesaId}-pessoas`);
      localStorage.removeItem(`mesa-${mesaId}-reviewed`);
    } else if (cartId.startsWith('comanda-')) {
      const comandaId = cartId.replace('comanda-', '');
      localStorage.removeItem(`comanda-${comandaId}-pessoas`);
      localStorage.removeItem(`comanda-${comandaId}-reviewed`);
    }
  };

  const markItemsAsEnviado = (cartId: string = 'balcao') => {
    setCarts(prev => {
      const currentCart = prev[cartId] || [];
      const updatedCart = currentCart.map(item => ({
        ...item,
        enviado: true
      }));
      return { ...prev, [cartId]: updatedCart };
    });
  };

  const getItensEnviados = (cartId: string = 'balcao'): CartItem[] => {
    const currentCart = carts[cartId] || [];
    return currentCart.filter(item => item.enviado);
  };

  const getItensNaoEnviados = (cartId: string = 'balcao'): CartItem[] => {
    const currentCart = carts[cartId] || [];
    return currentCart.filter(item => !item.enviado);
  };

  const hasItensEnviados = (cartId: string = 'balcao'): boolean => {
    const currentCart = carts[cartId] || [];
    const result = currentCart.some(item => item.enviado === true);
    console.log('🔍 hasItensEnviados check:', { cartId, currentCart, result });
    return result;
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
    getDiscountType,
    getDiscountValue,
    applyTax,
    clearCart,
    getCartItems,
    markItemsAsEnviado,
    getItensEnviados,
    getItensNaoEnviados,
    hasItensEnviados,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};