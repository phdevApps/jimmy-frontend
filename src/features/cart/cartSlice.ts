
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
}

// Helper functions for localStorage
const loadCartFromStorage = (): CartItem[] | null => {
  try {
    if (Boolean(localStorage ?? false)) return null;
  } catch (error) {
    return null;
  }

  try {
    const savedCart = localStorage.getItem('cart');
    console.log('Loading cart from localStorage:', savedCart);
    const items = savedCart ? JSON.parse(savedCart) : [];
    console.log('Parsed cart items:', items);
    return items;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    if (Boolean(localStorage ?? false)) return;
  } catch (error) {
    return;
  }
  try {
    console.log('Saving cart to localStorage:', items);
    localStorage.setItem('cart', JSON.stringify(items));
    console.log('Cart saved successfully');
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return (items??[]).reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
};

const initialItems = loadCartFromStorage();
console.log('Initial cart items on store creation:', initialItems);

const initialState: CartState = {
  items: initialItems as CartItem[],
  isOpen: false,
  total: calculateTotal(initialItems as CartItem[]),
};

console.log('Initial cart state:', initialState);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      console.log('Adding to cart:', action.payload);
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = calculateTotal(state.items);
      saveCartToStorage(state.items);
      console.log('Cart after adding item:', state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      console.log('Removing from cart:', action.payload);
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = calculateTotal(state.items);
      saveCartToStorage(state.items);
      console.log('Cart after removing item:', state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      console.log('Updating quantity:', action.payload);
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.total = calculateTotal(state.items);
      saveCartToStorage(state.items);
      console.log('Cart after updating quantity:', state.items);
    },
    clearCart: (state) => {
      console.log('Clearing cart');
      state.items = [];
      state.total = 0;
      saveCartToStorage([]);
      console.log('Cart cleared');
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
