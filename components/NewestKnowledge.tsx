'use client';

import React from 'react';
import Link from 'next/link';

// 🌟 ข้อมูลจำลอง (Mock Data) ที่เราจะเปลี่ยนไปดึงจาก API หลังบ้านในอนาคต
const mockNewContents = [
  {
    id: '1',
    topic: 'คู่มือความปลอดภัยในโรงงาน (Safety Standard 2026)',
    updatedAt: '2026-08-15T08:00:00Z',
    content_status: 3,
    approve_status: 1,
    category: { category_type: 'general', category_name: 'Operations' },
    subcategory: { subcategory_name: 'Safety' },
    subcategoryId: 1,
  },
  {
    id: '2',
    topic: 'อัปเดตระบบ ERP ภายในองค์กร',
    updatedAt: '2026-08-16T14:30:00Z',
    content_status: 3,
    approve_status: 1,
    category: { category_type: 'general', category_name: 'IT & System' },
    subcategory: null,
    subcategoryId: null,
  },
  {
    id: '3',
    topic: 'แบบฟอร์มการขอเบิกงบประมาณ (สำหรับแผนก HR)',
    updatedAt: '2026-08-17T09:15:00Z',
    content_status: 3,
    approve_status: 1,
    category: { category_type: 'general', category_name: 'HR & Culture' },
    subcategory: { subcategory_name: 'Document' },
    subcategoryId: 2,
  }
];

export default function NewestKnowledgeWidget() {
  // ตัวแปรสำหรับเช็กประเภทหมวดหมู่ (เทียบเท่าตัวแปร chk ในโค้ดเก่า)
  const chk = 'general';

  return (
    // 🌟 เปลี่ยนพื้นหลังรูป blue.png เป็น Gradient หรูๆ สไตล์ Enterprise และรองรับ Dark Mode
    <div className="py-12 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* กล่อง Widget */}
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-[30px] border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2">
            ✨ Newest Knowledges
          </h3>
          
          <ul className="space-y-4">
            {/* ใช้ .filter() คัดกรองข้อมูล และ .slice(0, 5) จำกัด 5 อันดับแรก เหมือนโค้ด *ngIf และ slice ใน Angular */}
            {mockNewContents
              .filter(
                (item) => 
                  item.content_status === 3 && 
                  item.approve_status === 1 && 
                  item.category.category_type === chk
              )
              .slice(0, 5)
              .map((newContent) => (
                <li 
                  key={newContent.id} 
                  className="group bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-blue-200 dark:hover:border-slate-600 cursor-pointer shadow-sm hover:shadow-md"
                >
                  {/* ลิงก์ไปยังหน้ารายละเอียด */}
                  <Link href={`/newcontent/${newContent.id}`} className="flex items-start gap-4">
                    
                    {/* รูปภาพ Thumbnail */}
                    <div className="shrink-0 w-16 h-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">📘</div> 
                    </div>
                    
                    {/* ข้อมูลเนื้อหา */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                        <h5 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                          {newContent.topic}
                        </h5>
                        <span className="shrink-0 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                          🕒 {newContent.updatedAt.slice(0, 10)}
                        </span>
                      </div>
                      
                      {/* หมวดหมู่หลัก และหมวดหมู่ย่อย (ใช้เครื่องหมาย » แทน >>> เพื่อความสวยงาม) */}
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                        {newContent.subcategoryId !== null ? (
                          <span>{newContent.category.category_name} &raquo; {newContent.subcategory?.subcategory_name}</span>
                        ) : (
                          <span>{newContent.category.category_name}</span>
                        )}
                      </div>
                    </div>
                    
                  </Link>
                </li>
              ))}
          </ul>
          
        </div>
      </div>
    </div>
  );
}