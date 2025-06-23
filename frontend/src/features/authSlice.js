import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const user = token ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
  user,
  token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // localStorage.setItem("token", action.payload.token);
      // localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
