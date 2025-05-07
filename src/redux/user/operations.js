import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../api/api";

export const fetchCurrentUser = createAsyncThunk(
  "user/current",
  async (_, thunkAPI) => {
    try {
      const { data } = await instance.get("/users/current");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
