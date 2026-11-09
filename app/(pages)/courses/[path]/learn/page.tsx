import React from 'react';
import { notFound } from 'next/navigation';
import LearnRoomClient from './LearnRoomClient';

export const dynamic = 'force-dynamic';

export default async function LearnRoomServerPage({ params }: { params: Promise<{ path: string }> }) {
  
  const resolvedParams = await params;
  const currentPath = resolvedParams.path;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/courses/${currentPath}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const course = data.course;

  if (!course) {
    notFound();
  }

  const formattedLessons = course.lessons.map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    subLessons: lesson.subLessons.map((sub: any) => {
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