import { createSlice } from "@reduxjs/toolkit";

// interface UserState {
//   onlineUsers: number;
// }

const initialState = {
  onlineUsers: 0,
};

const onlineUsers = createSlice({
  name: "user",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsers.actions;

export default onlineUsers.reducer;
