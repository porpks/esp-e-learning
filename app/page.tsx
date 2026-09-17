'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import CourseCard from '@/components/CourseCard';

export default function DashboardPage() {
  const mandatoryCourses = [
    {
      id: 1,
      title: 'ปฐมนิเทศพนักงานใหม่',
      description: 'เรียนรู้วัฒนธรรมองค์กรและสวัสดิการเบื้องต้นสำหรับพนักงานใหม่',
      category: 'HR & Culture',
      progress: 100,
      actionText: 'ทบทวนเนื้อหา',
      badgeColor: 'bg-rose-100 text-rose-700',
      headerBgColor: 'bg-rose-200',
    },
    {
      id: 2,
      title: 'การใช้งานระบบ ERP เบื้องต้น',
      description: 'คู่มือการเบิกจ่ายและจัดการทรัพยากรภายในสายการผลิตของบริษัท',
      category: 'Operations',
      progress: 0,
      actionText: 'เริ่มเรียน',
      badgeColor: 'bg-purple-100 text-purple-700',
      headerBgColor: 'bg-purple-200',
    },
    {
      id: 3,
      title: 'ความปลอดภัยทางไซเบอร์ 101 (PDPA)',
      description: 'ข้อควรระวังและการจัดการข้อมูลส่วนบุคคลตามกฎหมาย PDPA',
      category: 'IT Security',
      progress: 45,
      actionText: 'เรียนต่อให้จบ',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      headerBgColor: 'bg-emerald-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        <HeroCarousel />
        {/* <AnnouncementBanner message='แจ้งเตือน: คอร์สบังคับ "PDPA ฉบับอัปเดต 2026" จะครบกำหนดในอีก 3 วัน!' buttonText="เรียนทันที"/> */}

        {/* <section className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Mandatory</h3>
            <p className="text-xs text-slate-500">คอร์สบังคับ จาก HR, Confidential, IT</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandatoryCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section> */}

        {/* <section className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Continue Learning</h3>
            <p className="text-xs text-slate-500">คอร์สดำเนินการเรียนต่อ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </section> */}

        {/* <section className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Recommended</h3>
            <p className="text-xs text-slate-500">คอร์สอื่นๆ ที่น่าสนใจ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </section> */}
      </main>
    </div>
  );
}