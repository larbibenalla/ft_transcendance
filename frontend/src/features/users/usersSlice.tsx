import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  currentUser: object | null;
  onlineUsers: number;
}

const initialState = {
  currentUser: null,
  onlineUsers: 0,
  statusInGame: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state: UserState, action) => {
      state.currentUser = action.payload;
    },
    removeUser: (state) => {
      state.currentUser = null;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setStatusInGame: (state, action) => {
      state.statusInGame = action.payload;
    },
  },
});

export const { setCurrentUser, removeUser, setOnlineUsers, setStatusInGame } = userSlice.actions;

export default userSlice.reducer;
