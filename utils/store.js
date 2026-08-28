import { configureStore } from "@reduxjs/toolkit";
import Cartslice from "./cartslice";
import Ordersslice from "./orderslice";

const loadCartFromStorage = () => {
   try {
      const raw = localStorage.getItem("cart");
      const items = raw ? JSON.parse(raw) : [];
      return { items: Array.isArray(items) ? items : [] };
   } catch (e) {
      return { items: [] };
   }
};

const loadOrdersFromStorage = () => {
   try {
      const raw = localStorage.getItem("beyuumi_orders");
      const orders = raw ? JSON.parse(raw) : [];
      return { orders: Array.isArray(orders) ? orders : [] };
   } catch (e) {
      return { orders: [] };
   }
};

const preloadedState =
   typeof window !== "undefined"
      ? { cart: loadCartFromStorage(), orders: loadOrdersFromStorage() }
      : undefined;

const Store = configureStore({
   reducer: {
      cart: Cartslice,
      orders: Ordersslice,
   },
   preloadedState,
});

// Persist cart + orders changes to localStorage
let previous = Store.getState();
Store.subscribe(() => {
   const current = Store.getState();
   if (current === previous) return;
   try {
      if (current.cart !== previous.cart) {
         localStorage.setItem("cart", JSON.stringify(current.cart.items || []));
      }
      if (current.orders !== previous.orders) {
         localStorage.setItem(
            "beyuumi_orders",
            JSON.stringify(current.orders.orders || [])
         );
      }
   } catch (e) {}
   previous = current;
});

export default Store;
