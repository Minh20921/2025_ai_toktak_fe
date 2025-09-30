import { createContext, useContext } from 'react';
import { MemberTokenFormModel } from '../model/member/signIn';

export enum UserTypes {
  MEMBER = 0,
  BUSINESS = 1,
  ADMIN = 99,
}

type AuthContextType = {
  loginData: MemberTokenFormModel | any | null;
  refreshData?: any;
  permissions?: Array<string>;
};

export const AuthContext = createContext<AuthContextType>({
  loginData: null,
});

export const useRefreshUserData = () => {
  const { refreshData } = useContext(AuthContext);
  return () => {
    if (refreshData) refreshData();
  };
};

export const useCurrentUser = (): MemberTokenFormModel => {
  const { loginData } = useContext(AuthContext);
  return loginData as MemberTokenFormModel;
};

export const useIsLoggedIn = () => {
  const { loginData } = useContext(AuthContext);
  return !!loginData;
};

export const useIsAdmin = () => {
  const currentUser = useCurrentUser();
  return currentUser?.type === UserTypes.ADMIN;
};

export const useIsVerified = () => {
  const { loginData } = useContext(AuthContext);
  return loginData?.is_auth_nice || loginData?.is_verify_email;
};
