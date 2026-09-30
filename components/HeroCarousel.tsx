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
      <div className="w-full h-64 md:h-80 bg-esp-softblue rounded-2xl animate-pulse flex items-center justify-center text-esp-mutedblue font-bold">
        Loading...
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
      {/* สไลด์เนื้อหา */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {announcements.map((item) => (
          <div
            key={item.id}
            className="w-full h-full flex-shrink-0 relative bg-esp-nav text-esp-white flex items-center"
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
              <div className="absolute inset-0 bg-gradient-to-r from-esp-text via-esp-nav to-esp-primary opacity-90" />
            )}

            {/* ข้อความประกาศ */}
            <div className="relative z-10 max-w-3xl px-8 sm:px-12 py-6">
              {item.category && (
                <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-esp-lightblue bg-esp-primary/80 rounded-full border border-esp-lightblue/40">
                  {item.category}
                </span>
              )}
              <h2 className="text-h4 sm:text-h3 font-bold line-clamp-2 drop-shadow-md text-esp-white">
                {item.title}
              </h2>
              {item.description && (
                <p className="mt-3 text-d4 sm:text-d3 text-esp-softblue line-clamp-2 font-medium">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มเลื่อนซ้าย */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-esp-text/50 hover:bg-esp-text/90 text-esp-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 focus:outline-none backdrop-blur-sm"
        aria-label="Previous Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ปุ่มเลื่อนขวา */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-esp-text/50 hover:bg-esp-text/90 text-esp-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 focus:outline-none backdrop-blur-sm"
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
                ? 'w-8 bg-esp-white'
                : 'w-2.5 bg-esp-white/50 hover:bg-esp-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}