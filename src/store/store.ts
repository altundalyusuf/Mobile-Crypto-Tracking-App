import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { coinsApi } from "../api/coinsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [coinsApi.reducerPath]: coinsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coinsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
