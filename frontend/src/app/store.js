// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

import authReducer from "../features/authSlice";
import notificationsReducer from "../features/notificationsSlice";

import { combineReducers } from "redux";

// Combine all reducers first
const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationsReducer,
});

// Configure redux-persist for specific slices
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // ✅ persist only the auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Export persistor for use in React root
export const persistor = persistStore(store);
