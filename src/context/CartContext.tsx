import { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // 1. Sync guest cart from localStorage on mount
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart && !auth.currentUser) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      // 2. Persist guest cart to localStorage
      localStorage.setItem('guestCart', JSON.stringify(items));
      return;
    }

    // Sync guest cart to Firestore when user logs in
    const syncCart = async () => {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        try {
          const guestItems = JSON.parse(savedCart);
          const path = `carts/${auth.currentUser?.uid}/items`;
          for (const item of guestItems) {
            await addDoc(collection(db, path), { ...item, addedAt: new Date().toISOString() });
          }
          localStorage.removeItem('guestCart');
        } catch (e) {
          console.error("Cart sync error:", e);
        }
      }
    };
    syncCart();

    const path = `carts/${auth.currentUser.uid}/items`;
    const q = query(collection(db, path));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addItem = async (product: any, quantity: number) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity
    };

    if (!auth.currentUser) {
      setItems(prev => {
        const existing = prev.find(item => item.productId === product.id);
        if (existing) {
          return prev.map(item => item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
          );
        }
        return [...prev, newItem];
      });
      return;
    }

    const path = `carts/${auth.currentUser.uid}/items`;
    const existing = items.find(item => item.productId === product.id);
    try {
      if (existing) {
        await updateDoc(doc(db, path, existing.id), {
          quantity: existing.quantity + quantity
        });
      } else {
        await addDoc(collection(db, path), {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
          addedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!auth.currentUser) {
      setItems(prev => prev.filter(i => i.id !== itemId));
      return;
    }
    const path = `carts/${auth.currentUser.uid}/items`;
    await deleteDoc(doc(db, path, itemId));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    if (!auth.currentUser) {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
      return;
    }
    const path = `carts/${auth.currentUser.uid}/items`;
    await updateDoc(doc(db, path, itemId), { quantity });
  };

  const clearCart = async () => {
    if (!auth.currentUser) {
      setItems([]);
      localStorage.removeItem('guestCart');
      return;
    }
    for (const item of items) {
      await removeItem(item.id);
    }
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
