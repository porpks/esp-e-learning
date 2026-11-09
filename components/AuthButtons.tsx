'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/useUser';
import Cookies from 'js-cookie';

interface AuthButtonProps {
  className?: string;
  onClick?: () => void;
}

export function LogoutButton({ className, onClick }: AuthButtonProps) {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      Cookies.remove('esp_token');
      
      setUser(null);
      if (onClick) onClick();
      
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"}
    >
      Logout
    </button>
  );
}

export function LoginButton({ className }: AuthButtonProps) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push('/login')}
      className={className || "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors"}
    >
      Login
    </button>
  );
}