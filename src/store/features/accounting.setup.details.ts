import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  current_company: null,
  name: null,
  company_list: [],
};

const accountingSetupSlice = createSlice({
  name: "accountingSetup",
  initialState,
  reducers: {
    onUpdateOrgDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    onResetOrgDetails: () => initialState,
  },
});

export const { onUpdateOrgDetails, onResetOrgDetails } = accountingSetupSlice.actions;
export default accountingSetupSlice;
