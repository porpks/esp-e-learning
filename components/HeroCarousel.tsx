'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Announcement {
  id: number;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  linkUrl?: string;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}

export default function HeroCarousel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // ดึงข้อมูลประกาศ 5 อันล่าสุดจาก API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements');
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const nextSlide = useCallback(() => {
    if (announcements.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
  }, [announcements.length]);

  const prevSlide = () => {
    if (announcements.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? announcements.length - 1 : prevIndex - 1
    );
  };

  // เลื่อนอัตโนมัติทุกๆ 5 วินาที (หยุดชั่วคราวเมื่อเอาเมาส์ชี้)
  useEffect(() => {
    if (isHovered || announcements.length === 0) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide, isHovered, announcements.length]);

  if (loading) {
    return (
      <div className="w-full h-64 md:h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse flex items-center justify-center text-slate-400">
        กำลังโหลดประกาศ...
      </div>
    );
  }

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* สไลด์เนื้้อหา */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {announcements.map((item) => (
          <div
            key={item.id}
            className="w-full h-full flex-shrink-0 relative bg-slate-900 text-white flex items-center"
          >
            {/* พื้นหลังรูปภาพ (ถ้ามี) */}
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover opacity-40"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545] via-slate-800 to-indigo-950 opacity-90" />
            )}

            {/* ข้อความประกาศ */}
            <div className="relative z-10 max-w-3xl px-8 sm:px-12 py-6">
              {item.category && (
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-blue-300 bg-blue-900/60 rounded-full border border-blue-400/30">
                  {item.category}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold line-clamp-2 drop-shadow-sm">
                {item.title}
              </h2>
              {item.description && (
                <p className="mt-2 text-sm sm:text-base text-slate-200 line-clamp-2">
                  {item.description}
                </p>
              )}
              {/* {item.linkUrl && (
                <Link
                  href={item.linkUrl}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  อ่านเพิ่มเติม <span>→</span>
                </Link>
              )} */}
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มเลื่อนซ้าย */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 focus:outline-none"
        aria-label="Previous Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ปุ่มเลื่อนขวา */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 focus:outline-none"
        aria-label="Next Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* จุดบอกตำแหน่งสไลด์ (Pagination Dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'w-8 bg-white'
                : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}