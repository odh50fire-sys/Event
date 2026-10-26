import React from 'react';
import type { CulturalEvent } from '../types/event';
import { calculateDday } from '../services/eventService';
import { Sparkles, AlertTriangle, CalendarDays, Ticket } from 'lucide-react';

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
    <section className="bg-[#F3EFE6] border-b border-stone-300 px-5 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="bg-[#E65100] text-white p-1 rounded-md shadow-sm">
            <Sparkles size={15} />
          </div>
          <span className="text-sm md:text-base font-bold text-stone-900 tracking-normal">
            다가오는 주요 일정 & D-DAY 레이더
          </span>
          <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-medium">
            3주 이내 ({ddayItems.length})
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {ddayItems.map(({ event, dday, isRegistration, targetDate }) => {
            const isStoreHoliday = event.isHoliday;
            
            // 눈이 편안한 카드 배경 & 테두리
            const cardBg = isStoreHoliday
              ? 'bg-[#FFF5F5] border-[#EF9A9A]'
              : isRegistration
              ? 'bg-[#F0F7FF] border-[#90CAF9]'
              : 'bg-white border-stone-300';

            // D-day 뱃지 컬러 (가독성 높은 폰트, 자극 없는 색상)
            const badgeClass = isStoreHoliday
              ? 'bg-[#D32F2F] text-white font-bold'
              : dday.isUrgent
              ? 'bg-[#E65100] text-white font-bold'
              : 'bg-stone-800 text-white font-semibold';

            return (
              <div
                key={`${event.id}-${targetDate}`}
                onClick={() => onSelectEvent(event)}
                className={`comic-box-sm min-w-[260px] md:min-w-[290px] max-w-[310px] p-3.5 cursor-pointer shrink-0 transition-transform hover:-translate-y-1 ${cardBg}`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-md shadow-xs ${badgeClass}`}>
                    {dday.label}
                  </span>
                  <span className="text-xs font-semibold text-stone-600 truncate">
                    {event.facility}
                  </span>
                </div>

                {/* 14~15px의 큼직하고 시원한 제목 */}
                <h3 className="font-bold text-sm md:text-[15px] line-clamp-1 text-stone-900 mb-1.5 leading-snug">
                  {event.title}
                </h3>

                <div className="text-xs text-stone-600 flex items-center justify-between mt-2 pt-2 border-t border-stone-200">
                  <span className="flex items-center gap-1.5 font-medium text-stone-600">
                    {isRegistration ? (
                      <>
                        <Ticket size={13} className="text-[#1976D2]" />
                        사전등록 마감
                      </>
                    ) : isStoreHoliday ? (
                      <>
                        <AlertTriangle size={13} className="text-[#D32F2F]" />
                        정기 휴무
                      </>
                    ) : (
                      <>
                        <CalendarDays size={13} className="text-stone-500" />
                        개막 시작
                      </>
                    )}
                  </span>
                  <span className="font-bold text-stone-800 font-mono text-xs">
                    {targetDate}
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
