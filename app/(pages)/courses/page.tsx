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
    page?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  
  const searchQuery = resolvedParams.q || '';
  const activeTab = resolvedParams.tab || 'all';
  const sortBy = resolvedParams.sort || 'newest';
  const minDur = resolvedParams.min || '0';
  const maxDur = resolvedParams.max || '100';
  
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const ITEMS_PER_PAGE = 15;
  
  let selectedCategories: string[] = [];
  if (resolvedParams.category) {
    selectedCategories = Array.isArray(resolvedParams.category) 
      ? resolvedParams.category 
      : [resolvedParams.category];
  }

  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append('q', searchQuery);
  if (sortBy) queryParams.append('sort', sortBy);
  queryParams.append('min', minDur);
  queryParams.append('max', maxDur);
  selectedCategories.forEach(cat => queryParams.append('category', cat));

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/courses?${queryParams.toString()}`, {
    cache: 'no-store', // บังคับให้ดึงข้อมูลใหม่เสมอ
    // headers: { Authorization: `Bearer ${token}` } // 💡 หากเปิดระบบเช็ค Token ที่ API แล้ว ให้แนบ Header ตรงนี้
  });
  
  const data = await res.json();
  const filteredCourses: CourseType[] = data.course || [];

  const catRes = await fetch(`${baseUrl}/api/courses/categories`, {
    cache: 'no-store',
  });
  const catData = await catRes.json();
  const allCategories = catData.categories || [];

  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const animationKey = `${searchQuery}-${selectedCategories.join('-')}-${minDur}-${maxDur}-${sortBy}-${currentPage}`;

  return (
    <div className="min-h-screen bg-esp-bg text-esp-text pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-h3 md:text-h1 font-bold tracking-wider text-esp-text">ESP COURSES</h1>
          <div className="max-w-2xl mx-auto">
            <SearchInput defaultValue={searchQuery} />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link 
            href={`/courses?tab=all${searchQuery ? `&q=${searchQuery}` : ''}`} 
            className={`px-8 py-2.5 rounded-full text-d4 font-bold shadow-sm transition-all ${
              activeTab === 'all' 
                ? 'bg-esp-text text-esp-white' 
                : 'bg-esp-white text-esp-mutedblue hover:text-esp-text border border-esp-lightblue'
            }`}
          >
            คอร์สเรียนทั้งหมด
          </Link>
          <Link 
            href={`/courses?tab=path${searchQuery ? `&q=${searchQuery}` : ''}`} 
            className={`px-8 py-2.5 rounded-full text-d4 font-bold shadow-sm transition-all ${
              activeTab === 'path' 
                ? 'bg-esp-text text-esp-white' 
                : 'bg-esp-white text-esp-mutedblue hover:text-esp-text border border-esp-lightblue'
            }`}
          >
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
                <h2 className="text-h4 md:text-d1 font-bold text-esp-text">
                  {selectedCategories.length === 0 ? 'คอร์สเรียนทั้งหมด' : `ค้นหา: ${selectedCategories.join(', ')}`}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-d4 font-bold text-esp-mutedblue">เรียงตาม:</span>
                  <SortSelect defaultValue={sortBy} />
                </div>
              </div>

              <FadeTransition trackKey={animationKey}>
                {paginatedCourses.length === 0 ? (
                  <div className="text-center py-20 text-esp-mutedblue text-d3 font-medium">
                    ไม่พบคอร์สเรียนที่ตรงกับการค้นหา
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {paginatedCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                  </div>
                )}
              </FadeTransition>

            </div>
          </div>
        )}

        {activeTab === 'path' && (
          <div className="bg-esp-white p-8 rounded-2xl border border-esp-lightblue shadow-sm min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-esp-softblue text-esp-primary rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-h4 font-bold text-esp-text">Learning Path</h2>
            <p className="text-esp-mutedblue max-w-md text-d3">อยู่ในระหว่างการพัฒนา นะจ๊ะ</p>
          </div>
        )}

      </main>
    </div>
  );
}