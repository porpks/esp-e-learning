'use client';

import React, { useState } from 'react';

export default function CoursesTab() {
  const [myCourses] = useState<{ completed: any[]; inProgress: any[] }>({
    completed: [],
    inProgress: [],
  });

  return (
    <div className="bg-esp-white border border-esp-lightblue shadow-sm rounded-b-2xl rounded-tr-2xl p-8 space-y-8 min-h-[600px]">
      <section>
        <h2 className="text-d2 font-bold text-esp-text mb-4">คอร์สที่เรียนจบแล้ว</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {myCourses.completed.length > 0 ? (
            myCourses.completed.map((course: any, i: number) => (
              <div key={i} className="p-4 bg-esp-softblue border border-esp-lightblue text-esp-text rounded-2xl shadow-sm">
                {course.title}
              </div>
            ))
          ) : (
            <div className="col-span-4 text-d4 text-esp-mutedblue font-medium">ยังไม่มีคอร์สที่เรียนจบ</div>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-d2 font-bold text-esp-text mb-4">คอร์สที่กำลังเรียนอยู่</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {myCourses.inProgress.length > 0 ? (
            myCourses.inProgress.map((course: any, i: number) => (
              <div key={i} className="p-4 bg-esp-softblue border border-esp-lightblue text-esp-text rounded-2xl shadow-sm">
                {course.title}
              </div>
            ))
          ) : (
            <div className="col-span-4 text-d4 text-esp-mutedblue font-medium">ยังไม่มีคอร์สที่กำลังเรียน</div>
          )}
        </div>
      </section>
    </div>
  );
}