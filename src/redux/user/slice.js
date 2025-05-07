import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./operations";

const initialState = {
  name: "",
  email: "",
  currency: "",
  avatarUrl: null,
  totalIncomes: 0,
  totalExpenses: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(
      fetchCurrentUser.fulfilled,
      (
        state,
        { payload: { name, email, currency, avatarUrl, transactionsTotal } }
      ) => {
        state.name = name;
        state.email = email;
        state.currency = currency;
        state.avatarUrl = avatarUrl;
        state.totalIncomes = transactionsTotal.incomes;
        state.totalExpenses = transactionsTotal.expenses;
      }
    );
  },
  selectors: {
    selectUser: (state) => state,
  },
});

export const userReducer = userSlice.reducer;
export const { selectUser } = userSlice.selectors;
