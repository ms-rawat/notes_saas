// store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Check if user is authenticated (backend reads JWT from cookie)
export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await fetch("http://localhost:4000/api/me", {
    credentials: "include", // send cookies
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
