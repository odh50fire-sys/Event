import React, { useState } from 'react';
import type { CulturalEvent } from '../types/event';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  events: CulturalEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  selectedEvent: CulturalEvent | null;
  onSelectEvent: (event: CulturalEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  selectedDate,
  onSelectDate,
  selectedEvent,
  onSelectEvent,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.filter(e => {
      const inRange = dayStr >= e.startDate && dayStr <= e.endDate;
      const isDeadline = e.registrationDeadline === dayStr;
      return inRange || isDeadline;
    });
  };

  const handlePrevMonth = () => setCurrentMonthDate(subMonths(currentMonthDate, 1));
  const handleNextMonth = () => setCurrentMonthDate(addMonths(currentMonthDate, 1));
  const handleToday = () => {
    const now = new Date();
    setCurrentMonthDate(now);
    onSelectDate(now);
  };

  return (
    <div className="comic-box p-4 md:p-6 bg-white">
      {/* 캘린더 상단 네비게이션 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b-3 border-black">
        <div className="flex items-center gap-3">
          <div className="bg-[#00E5FF] text-black p-2 rounded-lg border-2 border-black -rotate-3 shadow-[2px_2px_0_0_#000]">
            <CalendarIcon size={20} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-comic tracking-tight text-black">
            {format(currentMonthDate, 'yyyy년 M월', { locale: ko })}
          </h2>
          <button
            onClick={handleToday}
            className="comic-btn px-2.5 py-1 text-xs bg-[#FFEA00] text-black hover:bg-yellow-300"
          >
            오늘로 이동
          </button>
        </div>

        {/* 3개월 간편 탭 버튼 */}
        <div className="flex items-center gap-1.5">
          {[-1, 0, 1].map(offset => {
            const mDate = addMonths(new Date(), offset);
            const isCurrent = isSameMonth(currentMonthDate, mDate);
            return (
              <button
                key={offset}
                onClick={() => setCurrentMonthDate(mDate)}
                className={`comic-btn px-2.5 py-1 text-xs ${
                  isCurrent ? 'bg-black text-white font-bold' : 'bg-zinc-100 text-zinc-800'
                }`}
              >
                {format(mDate, 'M월')}
              </button>
            );
          })}

          <div className="flex items-center gap-1 ml-2 pl-2 border-l-2 border-black">
            <button
              onClick={handlePrevMonth}
              title="이전 달"
              className="comic-btn p-1.5 bg-white hover:bg-zinc-100 text-black"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              title="다음 달"
              className="comic-btn p-1.5 bg-white hover:bg-zinc-100 text-black"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {weekDayLabels.map((label, idx) => {
          const colorClass =
            idx === 0
              ? 'bg-[#FF5252] text-white'
              : idx === 6
              ? 'bg-[#448AFF] text-white'
              : 'bg-zinc-100 text-black';
          return (
            <div
              key={label}
              className={`py-1.5 text-center font-comic font-black text-xs md:text-sm border-2 border-black rounded shadow-[2px_2px_0_0_#000] ${colorClass}`}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* 캘린더 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {calendarDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonthDate);
          const isTodayDate = isToday(day);
          const dayEvents = getEventsForDay(day);
          const dayNumber = format(day, 'd');
          const dayOfWeek = day.getDay();
          const hasStoreHoliday = dayEvents.some(e => e.isHoliday);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`min-h-[90px] md:min-h-[115px] p-1.5 md:p-2 border-2 border-black rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FFF9C4] ring-3 ring-black shadow-[4px_4px_0_0_#000] -translate-y-0.5 z-10'
                  : isTodayDate
                  ? 'bg-[#FFFDE7] border-black shadow-[2px_2px_0_0_#000]'
                  : isCurrentMonth
                  ? hasStoreHoliday
                    ? 'bg-[#FFF5F5] hover:bg-[#FFEBEB]'
                    : 'bg-white hover:bg-zinc-50'
                  : 'bg-zinc-100/70 opacity-40 hover:opacity-80'
              }`}
            >
              {/* 날짜 상단 헤더 */}
              <div className="flex items-center justify-between">
                <span
                  className={`font-comic font-black text-xs md:text-sm inline-block px-1 rounded ${
                    dayOfWeek === 0
                      ? 'text-[#D32F2F]'
                      : dayOfWeek === 6
                      ? 'text-[#1976D2]'
                      : 'text-black'
                  } ${isTodayDate ? 'bg-[#FF3D00] text-white px-1.5 shadow-[1px_1px_0_0_#000]' : ''}`}
                >
                  {dayNumber}
                  {isTodayDate && <span className="ml-1 text-[9px] font-bold">오늘</span>}
                </span>

                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-mono font-bold bg-black text-white px-1 rounded">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* 날짜 내부 이벤트 스티커들 */}
              <div className="flex flex-col gap-1 my-1 overflow-hidden">
                {dayEvents.slice(0, 3).map(event => {
                  const isHoliday = event.isHoliday;
                  const isSelectedEvent = selectedEvent?.id === event.id;
                  
                  let tagBg = 'bg-zinc-200 text-black';
                  if (isHoliday) {
                    tagBg = 'bg-[#FF5252] text-white font-bold animate-pulse';
                  } else if (event.facility.includes('EXCO')) {
                    tagBg = 'bg-[#00E5FF] text-black';
                  } else if (event.facility.includes('미술관')) {
                    tagBg = 'bg-[#FF66CC] text-black';
                  } else if (event.facility.includes('박물관')) {
                    tagBg = 'bg-[#FFB300] text-black';
                  }

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(day);
                        onSelectEvent(event);
                      }}
                      title={event.title}
                      className={`text-[10px] md:text-[11px] font-bold px-1 py-0.5 rounded truncate border border-black transition-transform hover:scale-102 ${tagBg} ${
                        isSelectedEvent ? 'ring-2 ring-black font-extrabold' : ''
                      }`}
                    >
                      {event.title}
                    </div>
                  );
                })}

                {dayEvents.length > 3 && (
                  <span className="text-[9px] font-bold text-zinc-500 pl-0.5">
                    +{dayEvents.length - 3}개 더보기...
                  </span>
                )}
              </div>

              {/* 하단 혜택 뱃지 */}
              <div className="flex items-center gap-1">
                {dayEvents.some(e => e.isFree) && (
                  <span className="text-[9px] font-extrabold bg-[#00E676] text-black px-1 rounded border border-black">
                    무료
                  </span>
                )}
                {dayEvents.some(e => e.registrationDeadline === format(day, 'yyyy-MM-dd')) && (
                  <span className="text-[9px] font-extrabold bg-[#FF1744] text-white px-1 rounded border border-black">
                    사전등록마감!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
