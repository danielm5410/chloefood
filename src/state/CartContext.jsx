import React, { createContext, useContext, useMemo, useState } from 'react';
import { foods } from '../data/foods.js';

const CART_KEY = 'chloeFeastCart';
const ORDER_KEY = 'chloeFeastOrders';
const CartContext = createContext(null);

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getOrders = () => readJson(ORDER_KEY, []);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readJson(CART_KEY, []));

  const persist = (next) => {
    setCart(next);
    writeJson(CART_KEY, next);
  };

  const addItem = (food) => {
    const existing = cart.find((item) => item.id === food.id);
    const next = existing
      ? cart.map((item) => (item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item))
      : [...cart, { id: food.id, quantity: 1 }];
    persist(next);
  };

  const setQuantity = (id, quantity) => {
    const next = cart
      .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
      .filter((item) => item.quantity > 0);
    persist(next);
  };

  const removeItem = (id) => persist(cart.filter((item) => item.id !== id));
  const clearCart = () => persist([]);

  const items = cart
    .map((item) => ({ ...foods.find((food) => food.id === item.id), quantity: item.quantity }))
    .filter((item) => item.id);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08875;
  const delivery = subtotal > 0 ? 3.99 : 0;
  const total = subtotal + tax + delivery;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const saveOrder = (details = {}) => {
    const order = {
      id: `CF-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      items,
      subtotal,
      tax,
      delivery,
      total,
      eta: `${25 + Math.floor(Math.random() * 16)} min`,
      payment: details.payment,
      address: details.address,
    };
    const orders = [order, ...getOrders()];
    writeJson(ORDER_KEY, orders);
    clearCart();
    return order;
  };

  const value = useMemo(
    () => ({ items, addItem, setQuantity, removeItem, clearCart, saveOrder, subtotal, tax, delivery, total, count }),
    [items, subtotal, tax, delivery, total, count],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

