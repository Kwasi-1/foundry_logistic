export interface IDecoded {
  user_info: {
    user_id: string;
    name: string;
    email: string;
  };
}

export interface IUserInfo {
  id?: string;
  name?: string;
  email?: string;
  permissions?: string[];
  roles?: string[];
}
