'use client';

import React from 'react';

export interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
  statusText?: string;
  actionText: string;
  badgeColor?: string;
  headerBgColor?: string;
  onAction?: () => void;
}

export default function CourseCard({
  title,
  description,
  category,
  progress,
  actionText,
  badgeColor = 'bg-slate-200 text-slate-700',
  headerBgColor = 'bg-slate-300',
  onAction,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col justify-between transition-all hover:shadow-md">
      <div>
        {/* ปกคอร์สส่วนบน */}
        <div className={`h-36 ${headerBgColor} p-3 relative flex justify-end`}>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {category}
          </span>
        </div>

        {/* เนื้อหาคอร์ส */}
        <div className="p-4 space-y-2">
          <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{title}</h4>
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Progress & Action Button */}
      <div className="p-4 pt-0 space-y-3">
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>ความคืบหน้า</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <button
          onClick={onAction}
          className="w-full py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}