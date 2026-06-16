import { configureStore } from "@reduxjs/toolkit";
import Cartslice from "./cartslice";

const loadCartFromStorage = () => {
   try {
      const raw = localStorage.getItem("cart");
      const items = raw ? JSON.parse(raw) : [];
      return { cart: { items } };
   } catch (e) {
      return { cart: { items: [] } };
   }
};

const preloadedState = typeof window !== "undefined" ? loadCartFromStorage() : undefined;

const Store = configureStore({
   reducer: {
      cart: Cartslice,
   },
   preloadedState,
});

// Persist cart changes to localStorage
let previous = Store.getState().cart;
Store.subscribe(() => {
   const current = Store.getState().cart;
   if (current !== previous) {
      try {
         localStorage.setItem("cart", JSON.stringify(current.items || []));
      } catch (e) {}
      previous = current;
   }
});

export default Store;