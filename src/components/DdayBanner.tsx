import React from 'react';
import type { CulturalEvent } from '../types/event';
import { calculateDday } from '../services/eventService';
import { Clock } from 'lucide-react';

interface DdayBannerProps {
  events: CulturalEvent[];
  onSelectEvent: (event: CulturalEvent) => void;
}

export const DdayBanner: React.FC<DdayBannerProps> = ({ events, onSelectEvent }) => {
  // D-day 순 정렬 (임박한 이벤트 우선)
  const urgentEvents = events
    .map(event => ({
      event,
      dday: calculateDday(event.registrationDeadline || event.startDate)
    }))
    .filter(item => item.dday.daysDiff >= 0 && item.dday.daysDiff <= 14)
    .sort((a, b) => a.dday.daysDiff - b.dday.daysDiff)
    .slice(0, 6);

  if (urgentEvents.length === 0) return null;

  return (
    <div className="shrink-0 bg-[#F5F2EB] border-b border-stone-200/90 px-4 py-2.5 flex items-center justify-between gap-3 text-sm overflow-hidden select-none">
      {/* 타이틀 영역 (1.5배 확대: text-sm~base, icon w-5 h-5) */}
      <div className="flex items-center gap-2.5 shrink-0 font-extrabold text-stone-900">
        <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
        <span className="hidden sm:inline text-sm md:text-base tracking-tight">임박 D-DAY</span>
      </div>

      {/* 이벤트 버튼 카드 목록 (1.5배 확대: px-3.5 py-1.5, 폰트 text-sm/base) */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 flex-1">
        {urgentEvents.map(({ event, dday }) => (
          <button
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 hover:text-stone-950 border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-left"
          >
            <span className={`px-2 py-0.5 rounded-md text-xs font-black shrink-0 ${
              dday.isUrgent
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-amber-100 text-amber-900 border border-amber-200'
            }`}>
              {dday.label}
            </span>
            <span className="text-xs md:text-sm font-bold text-stone-800 max-w-[180px] lg:max-w-[220px] truncate">
              {event.title.replace(/^[^\s]+\s/, '')}
            </span>
            <span className="text-xs text-stone-500 font-medium shrink-0">
              ({event.facility})
            </span>
          </button>
        ))}
      </div>

      <div className="hidden xl:flex items-center gap-1 text-xs text-stone-500 shrink-0 font-medium">
        <span>* 클릭 시 상세 팝업</span>
      </div>
    </div>
  );
};
