import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    addNotification(state, action) {
      state.unshift(action.payload);
    },
    setNotifications(state, action) {
      return action.payload;
    },
    clearNotifications() {
      return [];
    },
  },
});

export const { addNotification, setNotifications, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
