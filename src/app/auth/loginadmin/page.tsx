'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { login } from '@/app/lib/store/authSlice';
import { AppDispatch } from '@/app/lib/store/store';
import { getApiBaseUrl } from '../../../../function/common';

const BoxedLoginRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const randomString = searchParams.get('random_string');

  const doLogin = async () => {
    if (!randomString) return;

    try {
      const url_api = getApiBaseUrl();
      const response = await fetch(url_api + '/api/v1/auth/login_by_input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ random_string: randomString }),
      });

      const data = await response.json();

      if (!response.ok || data?.code !== 200) {
        throw new Error(data.message || 'Login failed');
      }

      dispatch(login({ user: data.data.user, token: data.data.access_token }));
      localStorage.setItem('token', JSON.stringify({ token: data.data.access_token, user: data.data.user }));
      Cookies.set('token', JSON.stringify({ token: data.data.access_token }));

      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    doLogin(); // Tự động login khi vừa vào trang
  }, [randomString]);

  return null; // Không render UI
};

export default BoxedLoginRegister;
