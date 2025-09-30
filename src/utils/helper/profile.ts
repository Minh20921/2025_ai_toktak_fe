import { User } from '@/app/lib/store/authSlice';

export const getUserName = (user: User | undefined) => {
  return user?.name || user?.username || user?.email;
};
