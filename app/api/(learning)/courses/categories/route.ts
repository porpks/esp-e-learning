import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const uniqueCategoriesRaw = await prisma.course.groupBy({
      by: ['category'],
      where: { 
        category: { 
          notIn: ['Japanese Hub', 'Language', 'ภาษาญี่ปุ่น'] 
        } 
      }
    });
    
    const allCategories = uniqueCategoriesRaw
      .map((c) => c.category)
      .filter((c): c is string => c !== null && c !== '');

    return NextResponse.json({ categories: allCategories }, { status: 200 });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่ (Internal Server Error)' },
      { status: 500 }
    );
  }
}