import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversationsId: "",
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setCurrentConversationId: (state, action) => {
      state.conversationsId = action.payload;
    },
  },
});

export const { setCurrentConversationId } = conversationsSlice.actions;

export default conversationsSlice.reducer;
