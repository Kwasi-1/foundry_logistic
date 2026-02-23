import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export type IOrganization = Partial<{
  createdAt: string;
  updatedAt: string;
  name: string;
  id: string;
  branch: string;
  code: string;
  companyAbbr: string;
}>;

export type IUserInfo = Partial<{
  channel: string;
  name: string;
  id: string;
  email: string;
  permissions: Array<string>;
  roles: Array<string>;
}>;

export type IToken = Partial<{
  access: string;
  refresh: string;
  expiresIn: number;
}>;

const initialState = {
  isAuthenticated: false,
  isSubscribed: true,
  organization: {} as IOrganization,
  userInfo: {} as IUserInfo,
  token: {
    access: "",
    refresh: "",
    expiresIn: 3600,
  } as IToken,
  permissions: null as string[] | null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onUpdateAuthSlice: (
      state,
      { payload }: PayloadAction<Partial<typeof initialState>>,
    ) => ({ ...state, ...payload }),
    onSetPermissions: (state, { payload }: PayloadAction<string[]>) => ({
      ...state,
      permissions: payload,
    }),

    onLogout: () => {
      return initialState;
    },
  },
});

export const { onUpdateAuthSlice, onSetPermissions, onLogout } =
  AuthSlice.actions;
export default AuthSlice;
