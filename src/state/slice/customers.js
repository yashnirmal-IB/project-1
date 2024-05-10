import { createSlice } from "@reduxjs/toolkit";

export const customersSlice = createSlice({
  name: "customers",
  initialState: {
    value: [],
  },
  reducers: {
    addNewCustomer: (state, action) => {
      state.value = [action.payload, ...state.value];
    },
    setCustomers: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addNewCustomer, setCustomers } = customersSlice.actions;

export default customersSlice.reducer;
