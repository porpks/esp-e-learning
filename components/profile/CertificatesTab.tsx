'use client';

import React, { useState } from 'react';

export default function CertificatesTab() {
  const [certificates] = useState<{ courseCerts: any[]; customCerts: any[] }>({
    courseCerts: [],
    customCerts: [],
  });

  return (
    <div className="bg-esp-white border border-esp-lightblue shadow-sm rounded-b-2xl rounded-tr-2xl p-8 space-y-8 min-h-[600px]">
      
      <button className="text-esp-primary underline text-d4 font-bold hover:opacity-80 transition-opacity cursor-pointer">
        Upload Certificates
      </button>
      
      <section>
        <h2 className="text-d2 font-bold text-esp-text mb-4">Certificate ที่ได้รับจากคอร์สเรียน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certificates.courseCerts.length > 0 ? (
            certificates.courseCerts.map((cert: any, i: number) => (
              <div key={i} className="p-4 bg-esp-softblue border border-esp-lightblue text-esp-text rounded-2xl shadow-sm">
                {cert.name}
              </div>
            ))
          ) : (
            <div className="col-span-4 text-d4 text-esp-mutedblue font-medium">ไม่มี Certificate จากคอร์สเรียน</div>
          )}
        </div>
      </section>
      
      <section>
        <h2 className="text-d2 font-bold text-esp-text mb-4">Certificate ที่อัปโหลดเพิ่ม</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certificates.customCerts.length > 0 ? (
            certificates.customCerts.map((cert: any, i: number) => (
              <div key={i} className="p-4 bg-esp-softblue border border-esp-lightblue text-esp-text rounded-2xl shadow-sm">
                {cert.name}
              </div>
            ))
          ) : (
            <div className="col-span-4 text-d4 text-esp-mutedblue font-medium">ไม่มี Certificate ที่อัปโหลดเพิ่ม</div>
          )}
        </div>
      </section>
    </div>
  );
}