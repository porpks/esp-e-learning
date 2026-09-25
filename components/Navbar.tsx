'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/useUser'; 

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'เมื่อสักครู่';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} วันที่แล้ว`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} เดือนที่แล้ว`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ปีที่แล้ว`;
}

export default function Navbar() {
  const roleBase = "Learner";

  const pathname = usePathname();
  const router = useRouter();
    
  const { user, setUser } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>(roleBase);

  // 🌟 Ref สำหรับคลิกนอกกรอบ
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // 🌟 ข้อมูลจำลอง Notifications
  const [notifications] = useState([
    { 
      id: 1, 
      title: 'คอร์สบังคับใกล้หมดอายุ!', 
      detail: 'PDPA Compliance 2026 ต้องเรียนให้จบภายใน 3 วัน', 
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      isUnread: true, 
      link: '/courses' 
    },
    { 
      id: 2, 
      title: 'ประกาศข่าวใหม่', 
      detail: 'เปิดตัวคอร์สเรียน CAD & NX Standard ใหม่ล่าสุด', 
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      isUnread: true, 
      link: '/knowledge-base' 
    },
  ]);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  useEffect(() => {
    if (user) {
      const displayRole = user.role === 'MANAGER' ? 'Manager' : 
        user.role === 'LEADER' ? 'Leader' : roleBase;
      setCurrentRole(displayRole);
    }
  }, [user]);

  // 🌟 ดักจับการคลิกนอกกรอบ Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsRolesOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: 'Main', path: '/' },
    { name: 'Course', path: '/courses' },
    { name: 'Japanese Hub', path: '/japanese' },
    { name: 'Knowledge Base', path: '/knowledge-base' },
    { name: 'Q/A', path: '/faqs' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null); 
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const pathAvoid = ['/login', '/admin'];
  if (pathAvoid.some(path => pathname.includes(path))) {
    return null;
  }

  return (
    <nav className="bg-[#0B2545] text-white sticky top-0 z-50 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. ESP Logo */}
          <Link href="/" className="shrink-0 px-3 py-1.5 rounded-lg flex items-center justify-center shadow-sm hover:opacity-95 transition-opacity h-12 min-w-20">
            <div className="relative" style={{ width: '90px', height: '60px' }}>
              <Image 
                src="http://192.168.1.146:9000/elearning-assets/ESP%20Logo.png" 
                alt="ESP Logo" 
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* 2. Main Navigation Links (Desktop) */}
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
                  
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.75 rounded-t-md transition-transform duration-300 ease-out origin-center ${
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
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* 🔔 Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-300 hover:text-white transition-colors group cursor-pointer focus:outline-none"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0B2545] animate-pulse"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">การแจ้งเตือน</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                      ใหม่ {unreadCount}
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => setIsNotifOpen(false)}
                        className="block px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="text-xs font-bold text-slate-900">{n.title}</div>
                        <div className="text-xs text-slate-600 line-clamp-2 mt-0.5">{n.detail}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-medium">
                          {formatRelativeTime(n.createdAt)}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Info Label */}
            <div className="hidden sm:block text-right leading-tight">
              <div className="font-bold text-sm text-white">
                {user ? `${user.username}` : 'Loading...'}
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {user ? `${user.department || 'ESP'}${user.team ? `${["CAD", "NX"].includes(user.department ?? '') ? "-" + user.team : ''}` : ''} (${currentRole})` : 'Loading...'}
              </div>
            </div>

            {/* 👤 Profile Avatar Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsRolesOpen(false);
                }}
                className="w-11 h-11 rounded-full bg-slate-500 border-2 border-white shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none flex items-center justify-center font-bold text-white shadow-inner overflow-hidden"
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover cursor-pointer" />
                ) : (
                  <span>{user?.username ? user.username.charAt(0).toUpperCase() : ''}</span>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Team Dashboard ด้านบนสุด */}
                  {(currentRole === 'Manager' || currentRole === 'Leader') && (
                    <>
                      <Link
                        href="/team-dashboard"
                        className="block px-4 py-2 text-sm text-[#0092DF] hover:bg-blue-50 font-bold transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Team Dashboard
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                    </>
                  )}

                  {/* Sub-menu: Roles */}
                  <div className="relative">
                    <button
                      onMouseEnter={() => setIsRolesOpen(true)}
                      onMouseLeave={() => setIsRolesOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-between font-medium transition-colors"
                    >
                      <span>Roles</span>
                      <span className="text-xs text-slate-400">►</span>
                    </button>

                    {isRolesOpen && (
                      <div 
                        className="absolute left-full top-0 ml-1 w-44 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-left-2 duration-200"
                        onMouseEnter={() => setIsRolesOpen(true)}
                        onMouseLeave={() => setIsRolesOpen(false)}
                      >
                        {user?.isAdmin && (
                          <Link href="/admin" onClick={() => { setIsRolesOpen(false); setIsProfileOpen(false); }}>
                            <div className="w-full text-left px-4 py-1.5 text-sm font-medium transition-colors border-b border-slate-200 hover:bg-slate-50 text-slate-800">
                              Administrator
                            </div>
                          </Link>
                        )}
                        {[
                          ...(user?.role === 'MANAGER' ? ['Manager', roleBase] : []),
                          ...(user?.role === 'LEADER' ? ['Leader', roleBase] : []),
                          ...(user?.role === 'USER' ? [roleBase] : []),
                        ].map((role) => (
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

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Profile
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* 🍔 Hamburger Button สำหรับ Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

          </div>
        </div>
      </div>

      {/* 📱 Mobile Side Drawer Menu (สไลด์จากขอบขวา/ความกว้างครึ่งจอ/ซ้อนทับแบบไม่ดันเพจ) */}
      {isMobileMenuOpen && (
        <>
          {/* 1. Backdrop สีดำโปร่งแสง (คลิกเพื่อปิด Drawer) */}
          <div 
            className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* 2. Side Drawer Panel ชิดขวา */}
          <div className="fixed top-0 right-0 h-screen w-1/2 bg-[#081B33] text-white z-50 shadow-2xl p-5 flex flex-col justify-between md:hidden animate-in slide-in-from-right duration-300 border-l border-slate-700/50">
            <div>
              {/* Header ใน Drawer: หัวข้อ & ปุ่มปิด (X) */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
                <span className="font-bold text-xs uppercase tracking-wider text-[#0092DF]">
                  Navigation
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg focus:outline-none transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* รายการเมนูหลัก */}
              <div className="space-y-1.5 font-medium text-sm">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#0092DF] text-white font-bold shadow-md' 
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer ใน Drawer แสดงข้อมูลผู้ใช้แบบย่อ */}
            {user && (
              <div className="pt-4 border-t border-slate-700/60 text-xs">
                <div className="font-bold text-white truncate">{user.username}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Role: <span className="text-[#0092DF] font-semibold">{currentRole}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
}