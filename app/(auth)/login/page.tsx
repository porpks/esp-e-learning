'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/useUser';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { setUser } = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ล็อกอินผ่าน -> นำผู้ใช้ไปยัง Callback URL ที่ตั้งไว้
        setUser(data.user);
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(data.error || 'การล็อกอินล้มเหลว');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-center">Enterprise Learning Hub</h1>
      
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-2">Username (ไม่ต้องใส่ @domain)</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
}

// 2. หน้าหลักสำหรับ Export นำเอา Suspense มาห่อ LoginForm ไว้
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <Suspense fallback={<div className="text-slate-400">กำลังโหลด...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}