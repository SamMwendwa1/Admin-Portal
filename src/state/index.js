import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "643b142ac8407c8a7b51da79",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;