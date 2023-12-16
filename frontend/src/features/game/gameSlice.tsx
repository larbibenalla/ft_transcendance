import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchmakingLoading: false,
  gameStarted: false,
  gameData: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setMatchmakingLoading: (state, action) => {
      state.matchmakingLoading = action.payload;
    },
    setGameStarted: (state, action) => {
      state.gameStarted = action.payload;
    },
    setGameData: (state, action) => {
      state.gameData = action.payload;
    },
    setGameEnded: (state) => {
      state.matchmakingLoading = false;
      state.gameStarted = false;
      state.gameData = null;
    },
  },
});

export const { setMatchmakingLoading, setGameStarted, setGameData, setGameEnded } = gameSlice.actions;

export default gameSlice.reducer;
