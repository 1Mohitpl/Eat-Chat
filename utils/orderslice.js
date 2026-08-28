import { createSlice } from "@reduxjs/toolkit";

const ORDERS_KEY = "beyuumi_orders";
const MAX_ORDERS = 25;

// ponytail: demo-compressed timings so tracking is visible in dev; switch
// afterSec values to real minutes once a backend drives status
export const ORDER_STAGES = [
  { key: "placed", label: "Order placed", afterSec: 0 },
  { key: "confirmed", label: "Order confirmed", afterSec: 10 },
  { key: "preparing", label: "Preparing your food", afterSec: 30 },
  { key: "on_the_way", label: "Out for delivery", afterSec: 75 },
  { key: "delivered", label: "Delivered", afterSec: 150 },
];

const loadOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const initialState = { orders: loadOrders() };

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder: {
      reducer(state, action) {
        state.orders.unshift(action.payload);
        if (state.orders.length > MAX_ORDERS) state.orders.pop();
      },
      // single place that stamps placedAt — status is always derived from
      // this timestamp downstream, never stored or mutated
      prepare({ id, placedAt, items, totals, name, phone, address, paymentMethod }) {
        return {
          payload: {
            id,
            placedAt: placedAt || Date.now(),
            items,
            totals,
            name,
            phone,
            address,
            paymentMethod,
          },
        };
      },
    },
    setOrders(state, action) {
      // hydrate from the server — replaces the local cache with the
      // logged-in user's orders from the database
      state.orders = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const getOrderStage = (order, now = Date.now()) => {
  const elapsedSec = Math.max(0, (now - new Date(order.placedAt).getTime()) / 1000);
  let index = 0;
  for (let i = 1; i < ORDER_STAGES.length; i++) {
    if (elapsedSec >= ORDER_STAGES[i].afterSec) index = i;
  }
  return { ...ORDER_STAGES[index], index, elapsedSec };
};

export const isDelivered = (order) => getOrderStage(order).key === "delivered";

export const { placeOrder, setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
