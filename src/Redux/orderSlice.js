import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null, // For storing the current order details
    completedOrder: null, // For storing completed order details
  },
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setCompletedOrder: (state, action) => {
      state.completedOrder = action.payload;
    },
  },
});

export const { setCurrentOrder, setCompletedOrder } = orderSlice.actions;
export default orderSlice.reducer;
