import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import thunk from "redux-thunk";
import { variables } from "@/utils/env";
import AuthSlice from "@/store/features/auth.slice";
import UserSlice from "@/store/features/user.slice";
import globalSlice from "@/store/features/global.slice";

const persistConfig = {
  key: `foundry-books-${variables().ENVIRONMENT}-v1.0.1.2`,
  storage,
  whitelist: ["auth", "global", "user"],
  blacklist: [],
};

const combinedReducers = combineReducers({
  auth: AuthSlice.reducer,
  user: UserSlice.reducer,
  global: globalSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [],
});

export const persistedStore = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;


