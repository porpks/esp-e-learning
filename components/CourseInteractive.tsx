'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

// 1. ช่องค้นหา (Reset กลับไปหน้า 1 เสมอเมื่อค้นหา)
export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (term: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) params.set('q', term);
      else params.delete('q');
      
      params.delete('page'); // 🌟 ค้นหาใหม่ต้องเริ่มหน้า 1
      router.push(`${pathname}?${params.toString()}`);
    }, 500);
  };

  return (
    <input
      type="text"
      defaultValue={defaultValue}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="What you want to study today?"
      className="w-full px-6 py-3 rounded-full bg-cyan-50/80 border border-cyan-200 text-slate-800 text-sm outline-none shadow-sm placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 transition-shadow"
    />
  );
}

// 2. Dropdown จัดเรียง
export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', val);
    params.delete('page'); // 🌟 เปลี่ยนการจัดเรียงต้องเริ่มหน้า 1
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => handleSort(e.target.value)}
      className="text-sm border-slate-200 rounded-lg focus:ring-[#0092DF] focus:border-[#0092DF] py-1.5 px-3 cursor-pointer outline-none shadow-sm"
    >
      <option value="newest">ใหม่ล่าสุด</option>
      <option value="oldest">เก่าที่สุด</option>
    </select>
  );
}

// 3. Sidebar Filter
export function SidebarFilter({
  allCategories,
  initialSelected,
  initialMin,
  initialMax
}: {
  allCategories: string[],
  initialSelected: string[],
  initialMin: string,
  initialMax: string
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  useEffect(() => {
    setSelected(initialSelected);
    setMin(initialMin);
    setMax(initialMax);
  }, [initialSelected, initialMin, initialMax]);

  const handleCheck = (cat: string, isChecked: boolean) => {
    if (cat === 'All') {
      setSelected([]); 
    } else {
      if (isChecked) setSelected([...selected, cat]);
      else setSelected(selected.filter(c => c !== cat));
    }
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.delete('category');
    selected.forEach(c => params.append('category', c));
    
    if (min !== '0') params.set('min', min.toString()); else params.delete('min');
    if (max !== '100') params.set('max', max.toString()); else params.delete('max');
    
    params.delete('page'); // 🌟 กรองข้อมูลใหม่ต้องเริ่มหน้า 1
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearAll = () => {
    setSelected([]);
    setMin('0');
    setMax('100');
    router.push(`${pathname}?tab=${searchParams.get('tab') || 'all'}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">ตัวกรอง</h3>
        <button onClick={handleClearAll} className="text-xs text-rose-500 hover:text-rose-700 font-semibold underline cursor-pointer">
          Clear All
        </button>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">หมวดหมู่</h4>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
            <input
              type="checkbox"
              checked={selected.length === 0}
              onChange={() => handleCheck('All', true)}
              className="w-4 h-4 rounded border-slate-300 text-[#0092DF] focus:ring-[#0092DF]"
            />
            <span className={selected.length === 0 ? "font-bold text-[#0092DF]" : ""}>ทั้งหมด (All)</span>
          </label>
          {allCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(cat)}
                onChange={(e) => handleCheck(cat, e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0092DF] focus:ring-[#0092DF]"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 my-4"></div>

      <div>
        <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">ระยะเวลาเรียน (ชม.)</h4>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <input
              type="number" value={min} onChange={(e) => setMin(e.target.value)}
              style={{ MozAppearance: 'textfield' }} 
              className="w-12 px-1 py-1.5 text-center text-sm font-semibold text-[#0092DF] bg-cyan-50 border border-cyan-100 rounded-lg outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-slate-400 text-xs font-bold">-</span>
            <input
              type="number" value={max} onChange={(e) => setMax(e.target.value)}
              style={{ MozAppearance: 'textfield' }}
              className="w-12 px-1 py-1.5 text-center text-sm font-semibold text-[#0092DF] bg-cyan-50 border border-cyan-100 rounded-lg outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div className="relative h-1.5 bg-slate-200 rounded-full mt-1 mb-2">
            <div className="absolute h-full bg-[#0092DF] rounded-full" style={{ left: `${(Number(min) / 100) * 100}%`, right: `${100 - (Number(max) / 100) * 100}%` }}></div>
            <input type="range" min="0" max="100" value={min} onChange={(e) => setMin(Math.min(Number(e.target.value), Number(max) - 1).toString())} className="absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0092DF] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm" />
            <input type="range" min="0" max="100" value={max} onChange={(e) => setMax(Math.max(Number(e.target.value), Number(min) + 1).toString())} className="absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0092DF] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm" />
          </div>
        </div>
      </div>

      <button onClick={handleApply} className="w-full py-2.5 bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-sm rounded-xl shadow transition-colors mt-2">
        Apply
      </button>
    </div>
  );
}

// 4. Fade Animation
export function FadeTransition({ children, trackKey }: { children: React.ReactNode, trackKey: string }) {
  const [isFading, setIsFading] = useState(false);
  const [displayContent, setDisplayContent] = useState(children);

  useEffect(() => {
    setIsFading(true);
    const timer = setTimeout(() => {
      setDisplayContent(children);
      setIsFading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [trackKey, children]);

  return (
    <div className={`transition-all duration-300 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      {displayContent}
    </div>
  );
}

// 🌟 5. ระบบปุ่มเปลี่ยนหน้า (Pagination Component)
export function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null; // ไม่แสดงถ้ามีแค่หน้าเดียว

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors font-semibold text-sm"
      >
        ก่อนหน้า
      </button>
      
      <div className="flex gap-1">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold transition-colors text-sm ${
              currentPage === page 
                ? 'bg-[#0092DF] text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors font-semibold text-sm"
      >
        ถัดไป
      </button>
    </div>
  );
}