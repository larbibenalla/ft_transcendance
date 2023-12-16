import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  userId: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
    setUserLoggedOut: (state) => {
      state.accessToken = "";
      state.userId = 0;
    },
  },
});

export const { setUserLoggedIn, setUserLoggedOut } = authSlice.actions;
export default authSlice.reducer;
