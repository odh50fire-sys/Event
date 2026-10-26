import React from 'react';
import type { CulturalEvent } from '../types/event';
import { calculateDday } from '../services/eventService';
import { Flame, AlertTriangle, CalendarDays, Ticket } from 'lucide-react';

interface DdayBannerProps {
  events: CulturalEvent[];
  onSelectEvent: (event: CulturalEvent) => void;
}

export const DdayBanner: React.FC<DdayBannerProps> = ({ events, onSelectEvent }) => {
  const today = new Date();

  const ddayItems = events
    .map(event => {
      const targetDate = event.registrationDeadline || event.startDate;
      const dday = calculateDday(targetDate, today);
      const isRegistration = !!event.registrationDeadline;
      return { event, dday, isRegistration, targetDate };
    })
    .filter(item => item.dday.daysDiff >= 0 && item.dday.daysDiff <= 21)
    .sort((a, b) => a.dday.daysDiff - b.dday.daysDiff)
    .slice(0, 8);

  if (ddayItems.length === 0) return null;

  return (
    <section className="bg-[#FFE57F] border-b-4 border-black px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-[#FF3D00] text-white p-1 rounded border-2 border-black -rotate-2">
            <Flame size={16} className="fill-white" />
          </div>
          <span className="font-comic text-sm md:text-base font-black text-black tracking-wide">
            💥 놓치지 마세요! 다가오는 D-DAY & 사전예약 레이더
          </span>
          <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold">
            실시간 집계
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {ddayItems.map(({ event, dday, isRegistration, targetDate }) => {
            const isStoreHoliday = event.isHoliday;
            const cardBg = isStoreHoliday
              ? 'bg-[#FFEBEE] border-[#D32F2F]'
              : isRegistration
              ? 'bg-[#E1F5FE] border-[#0288D1]'
              : 'bg-white border-black';

            const badgeBg = isStoreHoliday
              ? 'bg-[#D32F2F] text-white'
              : dday.isUrgent
              ? 'bg-[#FF1744] text-white animate-bounce'
              : 'bg-[#FFEA00] text-black';

            return (
              <div
                key={`${event.id}-${targetDate}`}
                onClick={() => onSelectEvent(event)}
                className={`comic-box-sm min-w-[240px] md:min-w-[270px] max-w-[280px] p-3 cursor-pointer shrink-0 transition-transform hover:-translate-y-1 ${cardBg}`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-xs font-black font-comic px-2 py-0.5 rounded border border-black shadow-[1px_1px_0_0_#000] ${badgeBg}`}>
                    {dday.label}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-600 truncate">
                    {event.facility}
                  </span>
                </div>

                <h3 className="font-black text-xs md:text-sm line-clamp-1 text-black font-comic mb-1">
                  {event.title}
                </h3>

                <div className="text-[11px] text-zinc-700 flex items-center justify-between mt-2 pt-1.5 border-t border-black/20">
                  <span className="flex items-center gap-1 font-bold text-zinc-600">
                    {isRegistration ? (
                      <>
                        <Ticket size={12} className="text-[#0288D1]" />
                        사전등록 마감
                      </>
                    ) : isStoreHoliday ? (
                      <>
                        <AlertTriangle size={12} className="text-[#D32F2F]" />
                        정기 휴무일
                      </>
                    ) : (
                      <>
                        <CalendarDays size={12} className="text-zinc-600" />
                        개막 시작
                      </>
                    )}
                  </span>
                  <span className="font-extrabold text-black font-mono">
                    {targetDate.slice(5)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
