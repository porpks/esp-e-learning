import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CourseCard, { CourseType } from '@/components/CourseCard';
import { SearchInput, SortSelect, SidebarFilter, FadeTransition, Pagination } from '@/components/CourseInteractive'; 

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string | string[];
    sort?: string;
    tab?: string;
    min?: string;
    max?: string;
    page?: string; // 🌟 เพิ่ม page
  }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  
  const searchQuery = resolvedParams.q || '';
  const activeTab = resolvedParams.tab || 'all';
  const sortBy = resolvedParams.sort || 'newest';
  const minDur = parseInt(resolvedParams.min || '0', 10);
  const maxDur = parseInt(resolvedParams.max || '100', 10);
  
  // 🌟 ดึงค่าหน้าปัจจุบัน (เริ่มต้นที่ 1)
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const ITEMS_PER_PAGE = 15;
  
  let selectedCategories: string[] = [];
  if (resolvedParams.category) {
    selectedCategories = Array.isArray(resolvedParams.category) 
      ? resolvedParams.category 
      : [resolvedParams.category];
  }

  // ดึงข้อมูล Category
  const uniqueCategoriesRaw = await prisma.course.groupBy({
    by: ['category'],
    where: { category: { notIn: ['Japanese Hub', 'Language', 'ภาษาญี่ปุ่น'] } }
  });
  
  const allCategories = uniqueCategoriesRaw
    .map((c) => c.category)
    .filter((c): c is string => c !== null && c !== '');

  // ดึงข้อมูล Course
  const coursesData = await prisma.course.findMany({
    where: { category: { notIn: ['Japanese Hub', 'Language', 'ภาษาญี่ปุ่น'] } },
    include: { lessons: { include: { subLessons: true } } },
    orderBy: sortBy === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' },
  });

  const formattedCourses: CourseType[] = coursesData.map((course) => {
    let totalSeconds = 0;
    course.lessons.forEach((lesson) => {
      lesson.subLessons.forEach((sub) => totalSeconds += sub.durationSec);
    });
    const hours = Math.max(1, Math.round(totalSeconds / 3600));

    return {
      id: course.id,
      path: course.path,
      title: course.title,
      description: course.description || 'ไม่มีคำอธิบาย',
      hours: `${hours} ชม.`,
      category: course.category || 'General',
      image: course.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
    };
  });

  // กรองข้อมูลทั้งหมดก่อน
  const filteredCourses = formattedCourses.filter((course) => {
    const hoursInt = parseInt(course.hours, 10);
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);
    const matchesDuration = hoursInt >= minDur && hoursInt <= maxDur;
    
    return matchesSearch && matchesCategory && matchesDuration;
  });

  // 🌟 คำนวณหาจำนวนหน้าทั้งหมด และตัด Array คอร์สให้เหลือแค่ 15 คอร์สของหน้านั้นๆ
  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // 🌟 Key สำหรับ Animation ให้เฟดใหม่เมื่อเปลี่ยนหน้าด้วย
  const animationKey = `${searchQuery}-${selectedCategories.join('-')}-${minDur}-${maxDur}-${sortBy}-${currentPage}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black tracking-wider text-[#0B2545]">ESP COURSES</h1>
          <div className="max-w-2xl mx-auto">
            <SearchInput defaultValue={searchQuery} />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link href={`/courses?tab=all${searchQuery ? `&q=${searchQuery}` : ''}`} className={`px-8 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all ${activeTab === 'all' ? 'bg-[#0B2545] text-white' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'}`}>
            คอร์สเรียนทั้งหมด
          </Link>
          <Link href={`/courses?tab=path${searchQuery ? `&q=${searchQuery}` : ''}`} className={`px-8 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all ${activeTab === 'path' ? 'bg-[#0B2545] text-white' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'}`}>
            Learning Path
          </Link>
        </div>

        {activeTab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
            <SidebarFilter 
              allCategories={allCategories} 
              initialSelected={selectedCategories} 
              initialMin={minDur.toString()} 
              initialMax={maxDur.toString()} 
            />

            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-slate-900">
                  {selectedCategories.length === 0 ? 'คอร์สเรียนทั้งหมด' : `ค้นหา: ${selectedCategories.join(', ')}`}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-500">เรียงตาม:</span>
                  <SortSelect defaultValue={sortBy} />
                </div>
              </div>

              <FadeTransition trackKey={animationKey}>
                {paginatedCourses.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    ไม่พบคอร์สเรียนที่ตรงกับการค้นหา
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {/* 🌟 แสดงผลคอร์สที่ตัดแบ่งมาแล้ว 15 คอร์ส */}
                      {paginatedCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>

                    {/* 🌟 แสดง Component เปลี่ยนหน้าด้านล่างสุด */}
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                  </div>
                )}
              </FadeTransition>

            </div>
          </div>
        )}

        {activeTab === 'path' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Learning Path</h2>
            <p className="text-slate-500 max-w-md">อยู่ในระหว่างการพัฒนา นะจ๊ะ</p>
          </div>
        )}

      </main>
    </div>
  );
}