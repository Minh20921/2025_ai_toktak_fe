'use client';

import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/lib/store/store';
import { login } from '@/app/lib/store/authSlice';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getApiBaseUrl } from '../../../../function/common';

const AuthLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let url_api = getApiBaseUrl();
      const response = await fetch(url_api + '/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Lưu vào Redux
      dispatch(login({ token: data.data.access_token, refreshToken: data.data.refresh_token }));
      // Chuyển hướng sau khi đăng nhập thành công
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <div className="mb-2 block">
          <Label htmlFor="username" value="Username" />
        </div>
        <TextInput
          id="username"
          type="text"
          sizing="md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
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
      <div className="flex justify-between my-5">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="opacity-90 font-normal cursor-pointer">
            Remember this Device
          </Label>
        </div>
        <Link href={'/'} className="text-primary text-sm font-medium">
          Forgot Password?
        </Link>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <Button type="submit" color={'primary'} className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default AuthLogin;
