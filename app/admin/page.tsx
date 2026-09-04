'use client';

import React, { useState } from 'react';

// ข้อมูลจำลองพนักงาน (Mock Data)
const initialUsers = [
  { id: 1, empId: 'emp_10492', name: 'พัชรพล K.', department: 'IT / System Admin', role: 'Admin' },
  { id: 2, empId: 'emp_10501', name: 'สมชาย ใจดี', department: 'HR & Training', role: 'Instructor' },
  { id: 3, empId: 'emp_10622', name: 'สมศรี รักงาน', department: 'Marketing', role: 'User' },
  { id: 4, empId: 'emp_10705', name: 'มานะ อดทน', department: 'Operations', role: 'User' },
];

export default function AdminPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันจำลองการเปลี่ยนสิทธิ์
  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    // ในระบบจริง ตรงนี้จะมีการยิง API ไปอัปเดต Database
  };

  // กรองข้อมูลตามคำค้นหา
  const filteredUsers = users.filter(user => 
    user.name.includes(searchTerm) || user.empId.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      {/* แถบนำทางด้านบน (Navbar) สำหรับ Admin */}
      <nav className="bg-slate-950 border-b border-red-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-600/20">
                A
              </div>
              <span className="font-bold tracking-wide text-lg text-white">ADMIN CONSOLE</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-slate-400 hover:text-white transition-colors">
                กลับสู่หน้าผู้ใช้ปกติ
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* เนื้อหาหลัก */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* หัวข้อและระบบค้นหา */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">ระบบจัดการผู้ใช้งาน (User Management)</h1>
            <p className="text-slate-400 mt-2">กำหนดสิทธิ์การเข้าถึงและการสร้างเนื้อหาของพนักงาน</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรือ รหัสพนักงาน..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
            <div className="absolute right-3 top-2.5 text-slate-500">
              🔍
            </div>
          </div>
        </header>

        {/* ตารางจัดการผู้ใช้งาน */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-medium">รหัสพนักงาน</th>
                  <th className="px-6 py-4 font-medium">ชื่อ-นามสกุล</th>
                  <th className="px-6 py-4 font-medium">แผนก</th>
                  <th className="px-6 py-4 font-medium">ระดับสิทธิ์ปัจจุบัน</th>
                  <th className="px-6 py-4 font-medium text-right">ปรับเปลี่ยนสิทธิ์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-300">{user.empId}</td>
                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                    <td className="px-6 py-4 text-slate-400">{user.department}</td>
                    <td className="px-6 py-4">
                      {/* ป้ายกำกับสิทธิ์แบบสี */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        user.role === 'Admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        user.role === 'Instructor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {user.role === 'Admin' ? 'ผู้ดูแลระบบ (Admin)' : 
                         user.role === 'Instructor' ? 'ผู้สร้างเนื้อหา (Instructor)' : 
                         'ผู้เรียน (User)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* เมนู Dropdown เลือกสิทธิ์ */}
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-slate-900 border border-slate-600 text-white text-xs rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2"
                      >
                        <option value="User">User (เรียนได้อย่างเดียว)</option>
                        <option value="Instructor">Instructor (สร้างคอร์สได้)</option>
                        <option value="Admin">Admin (จัดการระบบได้)</option>
                      </select>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      ไม่พบข้อมูลพนักงานที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}