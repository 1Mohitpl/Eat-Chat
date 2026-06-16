
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartslice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const id = newItem.id || newItem.name;
      const existing = state.items.find(
        (i) => i.info.id === id || i.info.name === newItem.name
      );
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        state.items.push({
          info: {
            id,
            imageId: newItem.imageId || "",
            name: newItem.name || "Unknown Food",
            price: Number(newItem.price) || 0,
            ratings: newItem.ratings || {},
          },
          quantity: 1,
        });
      }
    },

    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(
        (i) => i.info.id !== id && i.info.name !== id
      );
    },

    incrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(
        (i) => i.info.id === id || i.info.name === id
      );
      if (item) item.quantity = (item.quantity || 1) + 1;
    },

    decrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(
        (i) => i.info.id === id || i.info.name === id
      );
      if (item) {
        item.quantity = (item.quantity || 1) - 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i !== item);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    setCart: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setCart,
} = cartslice.actions;

export default cartslice.reducer;