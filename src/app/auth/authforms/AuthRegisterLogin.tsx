'use client';

import { Button, Label, TextInput } from 'flowbite-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '@/app/lib/store/authSlice';
import { AppDispatch } from '@/app/lib/store/store';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getApiBaseUrl } from '../../../../function/common';

const AuthRegisterLogin = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let url_api = getApiBaseUrl();
      const response = await fetch(url_api + '/api/v1/auth/login_by_input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data?.code !== 200) {
        throw new Error(data.message || 'Registration failed');
      }

      // Lưu vào Redux
      dispatch(login({ user: data.data.user, token: data.data.access_token }));
      // Lưu vào localStorage để duy trì đăng nhập
      localStorage.setItem('token', JSON.stringify({ token: data.data.access_token, user: data.data.user }));

      Cookies.set('token', JSON.stringify({ token: data.data.access_token }));

      // Chuyển hướng sau khi đăng ký thành công
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="mb-4">
        <div className="mb-2 block">
          <Label htmlFor="email" value="Email Address" />
        </div>
        <TextInput
          id="email"
          type="email"
          sizing="md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <div className="mb-2 block">
          <Label htmlFor="password" value="Password" />
        </div>
        <TextInput
          id="password"
          type="password"
          sizing="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <Button type="submit" color={'primary'} className="w-full" disabled={loading}>
        {loading ? 'Login...' : 'Login'}
      </Button>
      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default AuthRegisterLogin;
