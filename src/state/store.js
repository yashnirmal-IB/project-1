import { configureStore } from "@reduxjs/toolkit";
import { loggedUserSlice } from "./slice/loggedUser";
import { customersSlice } from "./slice/customers";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { themeSlice } from "./slice/theme";

const persistConfig = {
  key: "root",
  storage,
};

const combinedReducer = combineReducers({
  loggedUser: loggedUserSlice.reducer,
  customers: customersSlice.reducer,
  theme: themeSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
