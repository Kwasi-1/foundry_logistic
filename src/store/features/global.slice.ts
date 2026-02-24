import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  module: string;
}

const initialState: GlobalState = {
  module: "accounting", // Default module
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setModule: (state, action: PayloadAction<string>) => {
      state.module = action.payload;
    },
  },
});

export const { setModule } = globalSlice.actions;
export default globalSlice;
