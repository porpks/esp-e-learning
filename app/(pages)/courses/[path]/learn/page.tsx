import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import LearnRoomClient from './LearnRoomClient';

export const dynamic = 'force-dynamic';

export default async function LearnRoomServerPage({ params }: { params: Promise<{ path: string }> }) {
  
  const resolvedParams = await params;
  const currentPath = resolvedParams.path;

  const course = await prisma.course.findUnique({
    where: { path: currentPath }, 
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: {
          subLessons: {
            orderBy: { order: 'asc' },
            include: {
              documents: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const formattedLessons = course.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    subLessons: lesson.subLessons.map((sub) => {
      const isDocument = sub.documents && sub.documents.length > 0;
      
      return {
        id: sub.id,
        title: sub.title,
        type: (isDocument ? 'document' : 'video') as 'document' | 'video',
        url: isDocument ? sub.documents[0].fileUrl : (sub.videoUrl || ''),
        durationMins: Math.max(1, Math.round(sub.durationSec / 60)),
      };
    }),
  }));

  return (
    <LearnRoomClient 
      courseTitle={course.title} 
      coursePath={course.path} 
      lessons={formattedLessons} 
    />
  );
}