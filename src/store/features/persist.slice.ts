import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  roles: [],
};

const persistSlice = createSlice({
  name: "persist",
  initialState,
  reducers: {
    onUpdatePersistSlice: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { onUpdatePersistSlice } = persistSlice.actions;
export default persistSlice;
