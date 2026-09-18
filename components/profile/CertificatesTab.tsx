'use client';

import React, { useState } from 'react';

export default function CertificatesTab() {
  const [certificates] = useState<{ courseCerts: any[]; customCerts: any[] }>({
    courseCerts: [],
    customCerts: [],
  });

  return (
    <div className="bg-yellow-100/60 rounded-b-2xl rounded-tr-2xl p-8 space-y-8 min-h-[600px]">
      <button className="text-blue-600 underline font-mono text-sm hover:text-blue-800">
        Upload Certificates
      </button>
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 font-mono">Certificate ที่ได้รับจากคอร์สเรียน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certificates.courseCerts.length > 0 ? (
            certificates.courseCerts.map((cert: any, i: number) => (
              <div key={i} className="p-4 bg-white rounded-2xl shadow-sm">{cert.name}</div>
            ))
          ) : (
            <div className="col-span-4 text-sm text-slate-400 font-mono">ไม่มี Certificate จากคอร์สเรียน</div>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 font-mono">Certificate ที่อัปโหลดเพิ่ม</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certificates.customCerts.length > 0 ? (
            certificates.customCerts.map((cert: any, i: number) => (
              <div key={i} className="p-4 bg-white rounded-2xl shadow-sm">{cert.name}</div>
            ))
          ) : (
            <div className="col-span-4 text-sm text-slate-400 font-mono">ไม่มี Certificate ที่อัปโหลดเพิ่ม</div>
          )}
        </div>
      </section>
    </div>
  );
}