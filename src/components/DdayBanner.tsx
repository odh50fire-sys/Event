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
    <div className="shrink-0 bg-[#F5F2EB] border-b border-stone-200/80 px-4 py-1.5 flex items-center justify-between gap-3 text-xs overflow-hidden select-none">
      <div className="flex items-center gap-2 shrink-0 font-bold text-stone-800">
        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span className="hidden sm:inline">임박 D-DAY</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1">
        {urgentEvents.map(({ event, dday }) => (
          <button
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-2xs transition-colors cursor-pointer text-left"
          >
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              dday.isUrgent
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {dday.label}
            </span>
            <span className="text-[11px] font-semibold text-stone-800 max-w-[130px] truncate">
              {event.title.replace(/^[^\s]+\s/, '')}
            </span>
            <span className="text-[10px] text-stone-400">
              ({event.facility})
            </span>
          </button>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-1 text-[11px] text-stone-400 shrink-0">
        <span>* 클릭 시 상세 팝업</span>
      </div>
    </div>
  );
};
