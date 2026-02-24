import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type CompanyProfile = Partial<{
  _id: string;
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo_url: string;
    nature_of_business: string;
  };
  extra: {
    bank_details: {
      currency: string;
      account_number: string;
      bank_name: string;
      branch_name: string;
    };
  };
  erp: {
    base_url: string;
  };
}>;

const initialState = {
  _id: "",
  company: {
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logo_url: "",
    nature_of_business: "",
  },
  extra: {
    bank_details: {
      currency: "",
      account_number: "",
      bank_name: "",
      branch_name: "",
    },
  },
  erp: { base_url: "" },
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onUpdateUserSlice: (
      state,
      { payload }: PayloadAction<Partial<CompanyProfile>>,
    ) => ({ ...state, ...payload }),
    onReset: () => {
      return initialState;
    },
  },
});

export const { onUpdateUserSlice, onReset } = UserSlice.actions;
export default UserSlice;
