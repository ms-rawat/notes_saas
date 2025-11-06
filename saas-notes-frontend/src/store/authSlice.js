// store/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiUrl } from "../StandardConst";

// 🔹 Async thunk to check if user is authenticated (using cookie)
export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await fetch(`${ApiUrl}/auth/me`, {
    credentials: "include", // send cookies to backend
  });
  if (!res.ok) throw new Error("Not authenticated");
  return await res.json();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
    },
    loginSuccess(state, action) {
      state.user = action.payload.userDetails;
      state.status = "succeeded";
    },
  },
  // 🔹 Handle async fetchUser lifecycle
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.userDetails || action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.status = "failed";
      });
  },
});

// 🔹 Selectors
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectIsAuthenticated = (state) => !!state.auth.user;

// 🔹 Actions + Reducer
export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
