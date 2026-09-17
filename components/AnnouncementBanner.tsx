'use client';

import React from 'react';

interface AnnouncementBannerProps {
  message: string;
  buttonText: string;
  onAction?: () => void;
}

export default function AnnouncementBanner({ message, buttonText, onAction }: AnnouncementBannerProps) {
  return (
    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2 text-rose-700 text-sm font-medium">
        <span>🔔</span>
        <span>{message}</span>
      </div>
      <button
        onClick={onAction}
        className="shrink-0 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}