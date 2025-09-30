import { REFRESH_TOKEN, TOKEN_LOGIN } from '@/utils/constant';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
export interface User {
  avatar: string;
  email: string;
  id: number;
  name: string;
  status: number;
  username: string;
  company_name: string;
  contact: string;
  created_at: string;
  level: number;
  level_info: string;
  is_auth_nice: number;
  phone: string;
  updated_at: string;
  last_activated: string;
  subscription: string;
  subscription_name: string;
  batch_remain: number;
  batch_total: number;
  total_link_active: number;
  latest_coupon: any;
  subscription_expired: any;
  coupons: any[];
  subscription_name_display: {
    subscription_name: string;
    subscription_name_lable: string;
  };
  user_histories: any[];
  referral_code: string;
  can_download: number;
  is_payment: number;
}

export interface AuthState {
  user: User | undefined;
  token: string | undefined;
  refreshToken: string | undefined;
}
const initialState: AuthState = {
  user: undefined,
  token: undefined,
  refreshToken: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user?: User; token?: string; refreshToken?: string }>) => {
      state.user = action.payload?.user;
      if (action.payload?.token) {
        state.token = action.payload?.token;
        localStorage.setItem(TOKEN_LOGIN, action.payload?.token);
        Cookies.set(TOKEN_LOGIN, action.payload?.token, { expires: 30 });
      }
      if (action.payload?.refreshToken) {
        state.refreshToken = action.payload?.refreshToken;
        localStorage.setItem(REFRESH_TOKEN, action.payload?.refreshToken);
        Cookies.set(REFRESH_TOKEN, action.payload?.refreshToken, { expires: 30 });
      }
    },
    register: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload?.refreshToken) {
        state.refreshToken = action.payload?.refreshToken;
        localStorage.setItem(REFRESH_TOKEN, action.payload?.refreshToken);
        Cookies.set(REFRESH_TOKEN, action.payload?.refreshToken, { expires: 30 });
      }
    },
    refreshToken: (state, action: PayloadAction<{ token: string; refreshToken?: string }>) => {
      state.token = action.payload.token;
      localStorage.setItem(TOKEN_LOGIN, action.payload.token);
      Cookies.set(TOKEN_LOGIN, action.payload.token, { expires: 30 });

      if (action.payload?.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem(REFRESH_TOKEN, action.payload.refreshToken);
        Cookies.set(REFRESH_TOKEN, action.payload.refreshToken, { expires: 30 });
      }
    },
    logout: (state) => {
      state.user = undefined;
      state.token = undefined;
      state.refreshToken = undefined;
      localStorage.removeItem(TOKEN_LOGIN);
      localStorage.removeItem(REFRESH_TOKEN);
      Cookies.remove(TOKEN_LOGIN);
      Cookies.remove(REFRESH_TOKEN);
      localStorage.removeItem('batchId');
      localStorage.removeItem('action');
      localStorage.removeItem('tooltip_profile');
      localStorage.removeItem('user_level');
    },
  },
});

export const { login, logout, register, refreshToken } = authSlice.actions;
export default authSlice.reducer;
