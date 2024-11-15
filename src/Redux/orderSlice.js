import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null, // For storing the current order details
    completedOrder: null, // For storing completed order details
    pendingOrders: [], // Track all pending orders if needed
  },
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setCompletedOrder: (state, action) => {
      state.completedOrder = action.payload;
    },
    addPendingOrder: (state, action) => {
      state.pendingOrders.push(action.payload);
    },
    removePendingOrder: (state, action) => {
      state.pendingOrders = state.pendingOrders.filter(
        (order) => order._id !== action.payload._id
      );
    },
  },
});

export const {
  setCurrentOrder,
  setCompletedOrder,
  addPendingOrder,
  removePendingOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
