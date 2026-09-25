import React from 'react';
import Link from 'next/link';

export interface CourseType {
  id: number;
  path: string;
  title: string;
  description: string;
  hours: string;
  category: string;
  image: string;
}

export default function CourseCard({ course }: { course: CourseType }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
      <Link href={`/courses/${course.path}/`}>
        {/* ปกคอร์ส */}
        <div className="h-40 bg-slate-200 relative overflow-hidden">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/60 text-white backdrop-blur-sm">
            {course.category}
          </span>
        </div>

        {/* รายละเอียด */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{course.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
          <p className="text-[11px] text-slate-400 pt-1">ชั่วโมงเรียน {course.hours}</p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <Link href={`/courses/${course.path}/learn`}>
          <button className="w-full py-2 bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer">
            เริ่มเรียนเลย
          </button>
        </Link>
      </div>
    </div>
  );
}