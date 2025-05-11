import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../api/api";

const handleError = (error, thunkAPI) => {
  const message = error.response?.data?.message || "Something went wrong";
  return thunkAPI.rejectWithValue(message);
};

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData, thunkAPI) => {
    try {
      const { data } = await instance.post("/transactions", transactionData);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ type, id, data }, thunkAPI) => {
    try {
      const { data: updatedTransaction } = await instance.patch(
        `/transactions/${type}/${id}`,
        data
      );
      return updatedTransaction;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async ({ type, date }, thunkAPI) => {
    try {
      const params = date ? { date } : {};

      const { data } = await instance.get(`/transactions/${type}`, { params });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//
//TransactionHistoryPage
//
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async ({ _id }, thunkAPI) => {
    try {
      await instance.delete(`/transactions/${_id}`);
      return _id;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);
