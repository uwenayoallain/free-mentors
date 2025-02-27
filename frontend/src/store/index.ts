import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mentorsReducer from "./mentorsSlice";
import sessionsReducer from "./sessionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mentors: mentorsReducer,
    sessions: sessionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
