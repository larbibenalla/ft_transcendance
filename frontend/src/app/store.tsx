import { configureStore } from "@reduxjs/toolkit";
import authReducer from "src/features/auth/authSlice";
import conversationsReducer from "src/features/conversations/conversationsSlice";
import userReducer from "src/features/users/usersSlice";
import gameReducer from "src/features/game/gameSlice";
import { apiSlice } from "src/app/api/apiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    conversations: conversationsReducer,
    user: userReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
