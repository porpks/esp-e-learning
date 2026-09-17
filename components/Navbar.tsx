'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

interface UserSession {
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
}

export default function Navbar() {

  const roleBase = "Learner";

  const pathname = usePathname();
  const router = useRouter();
    
  const [user, setUser] = useState<UserSession | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>(roleBase);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            const displayRole = data.user.isAdmin ? 'Administrator' : 
              data.user.role === 'MANAGER' ? 'Manager' : 
              data.user.role === 'LEADER' ? 'Leader' : roleBase;
            setCurrentRole(displayRole);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error);
      }
    };

    if (!user && pathname !== '/login') {
      fetchUser();
    }
  }, [pathname, user]);

  const navItems = [
    { name: 'Main', path: '/' },
    { name: 'Course', path: '/courses' },
    { name: 'Japanese Hub', path: '/japanese' },
    { name: 'Knowledge Base', path: '/knowledge-base' },
    { name: 'Q/A', path: '/faqs' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
    
  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-[#0B2545] text-white sticky top-0 z-50 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. ESP Logo */}
          <Link href="/" className="shrink-0 px-3 py-1.5 rounded-lg flex items-center justify-center shadow-sm hover:opacity-95 transition-opacity h-12 min-w-[80px]">
            <div className="relative" style={{ width: '90px', height: '60px' }}>
              <Image 
                src="https://zbnmgcfgnxgxvwxgiyci.supabase.co/storage/v1/object/public/ESP_E-learning_resource/icons/ESP%20Logo.png" 
                alt="ESP Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* 2. Main Navigation Links (🌟 ปรับปรุง Animation เส้นใต้ลื่นไหล 🌟) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-bold text-sm tracking-wide h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative group flex flex-col items-center justify-center h-full px-2 py-2 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {/* กล่องข้อความ */}
                  <span className="text-center leading-tight">
                    {item.name.includes(' ') ? (
                      <>
                        {item.name.split(' ')[0]}
                        <br />
                        {item.name.split(' ').slice(1).join(' ')}
                      </>
                    ) : (
                      item.name
                    )}
                  </span>
                  
                  {/* เส้นใต้อนิเมชั่น (Animated Underline) */}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-[3px] rounded-t-md transition-transform duration-300 ease-out origin-center ${
                      isActive 
                        ? 'bg-white scale-x-100' 
                        : 'bg-slate-400 scale-x-0 group-hover:scale-x-100 opacity-70 group-hover:opacity-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* 3. Right Side: Notification & User Profile */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-300 hover:text-white transition-colors group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0B2545]"></span>
            </button>

            {/* User Info Label (Dynamic) */}
            <div className="hidden sm:block text-right leading-tight">
              <div className="font-bold text-sm text-white">
                {user ? `${user.username}` : 'Loading...'}
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {user ? `${user.department || 'ESP'}${user.team ? `${["CAD", "NX"].includes(user.department ?? '') ? "-" + user.team : ''}` : ''} (${currentRole})` : 'Loading...'}
              </div>
            </div>

            {/* Avatar Circle & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsRolesOpen(false);
                }}
                className="w-11 h-11 rounded-full bg-slate-500 border-2 border-white shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none flex items-center justify-center font-bold text-white shadow-inner overflow-hidden"
              >
                {user?.profileImage ?
                (<img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />) : 
                (<span>{user?.username ? user.username.charAt(0).toUpperCase() : ''}</span>)
                }
              </button>

              {/* === Main Profile Dropdown === */}
              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-3 w-52 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => {
                    setIsProfileOpen(false);
                    setIsRolesOpen(false);
                  }}
                >
                  <div className="px-4 py-2 border-b border-slate-100 font-bold text-sm text-slate-900 line-clamp-1">
                    {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                  </div>

                  {/* Sub-menu: Roles */}
                  <div className="relative">
                    <button
                      onClick={() => setIsRolesOpen(!isRolesOpen)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-between font-medium transition-colors"
                    >
                      <span>Roles view</span>
                      <span className={`text-xs text-slate-400 transition-transform duration-200 ${isRolesOpen ? 'rotate-90' : ''}`}>►</span>
                    </button>

                    {isRolesOpen && (
                        <div className="absolute left-full top-0 ml-1 w-44 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-left-2 duration-200">
                        {([
                            ...(user?.isAdmin ? ['Administrator'] : []),
                            ...(user?.role === 'MANAGER' ? ['Manager', roleBase] : []),
                            ...(user?.role === 'LEADER' ? ['Leader', roleBase] : []),
                            ...(user?.role === 'USER' ? [roleBase] : []),
                        ]).map((role) => (
                            <button
                            key={role}
                            onClick={() => {
                                setCurrentRole(role);
                                setIsRolesOpen(false);
                                setIsProfileOpen(false);
                            }}
                            className={`w-full text-left px-4 py-1.5 text-sm font-medium transition-colors ${
                                currentRole === role
                                ? 'bg-blue-50 text-[#0092DF] font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                            >
                            {role}
                            </button>
                        ))}
                        </div>
                    )}
                  </div>

                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                  >
                    My Profiles
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                  >
                    Logs out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}