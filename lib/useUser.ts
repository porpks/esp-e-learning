'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface UserSession {
  id: number;
  empId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isAdmin: boolean;
  department?: string;
  team?: string;
  profileImage?: string;
  japaneseLevel?: string;
}

let globalUserCache: UserSession | null = null;
let listeners: Array<(user: UserSession | null) => void> = [];

const notifyListeners = (user: UserSession | null) => {
  globalUserCache = user;
  listeners.forEach((listener) => listener(user));
};

export const fetchUser = async (): Promise<UserSession | null> => {
  try {
    // 1. ดึง Token จาก Cookie
    const token = Cookies.get('esp_token');
    
    // 2. แนบ Token ไปใน Header Authorization
    const res = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        notifyListeners(data.user);
        return data.user;
      }
    } else {
      notifyListeners(null);
    }
  } catch (error) {
    console.error('Failed to fetch user session:', error);
    notifyListeners(null);
  }
  return null;
};

export function useUser() {
  const [user, setUser] = useState<UserSession | null>(globalUserCache);
  const [loading, setLoading] = useState<boolean>(!globalUserCache);

  useEffect(() => {
    const handleChange = (newUser: UserSession | null) => {
      setUser(newUser);
      setLoading(false);
    };

    listeners.push(handleChange);

    if (!globalUserCache) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      listeners = listeners.filter((l) => l !== handleChange);
    };
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
    setLoading(false);
  };

  return { user, loading, refreshUser, setUser: notifyListeners };
}