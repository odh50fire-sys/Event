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
  isBefore,
  startOfDay,
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
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const maxMonthLimit = addMonths(currentMonthStart, 2); // 현재월 포함 3개월 (0, 1, 2)

  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDayLabels = [
    { label: '일', color: 'text-rose-600 bg-rose-50/70' },
    { label: '월', color: 'text-stone-700 bg-stone-50' },
    { label: '화', color: 'text-stone-700 bg-stone-50' },
    { label: '수', color: 'text-stone-700 bg-stone-50' },
    { label: '목', color: 'text-stone-700 bg-stone-50' },
    { label: '금', color: 'text-stone-700 bg-stone-50' },
    { label: '토', color: 'text-sky-600 bg-sky-50/70' },
  ];

  const isPrevDisabled = isSameMonth(currentMonthDate, currentMonthStart) || isBefore(currentMonthDate, currentMonthStart);
  const isNextDisabled = isSameMonth(currentMonthDate, maxMonthLimit) || isBefore(maxMonthLimit, currentMonthDate);

  const handlePrevMonth = () => {
    if (!isPrevDisabled) {
      setCurrentMonthDate(subMonths(currentMonthDate, 1));
    }
  };

  const handleNextMonth = () => {
    if (!isNextDisabled) {
      setCurrentMonthDate(addMonths(currentMonthDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentMonthDate(now);
    onSelectDate(now);
  };

  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.filter(e => {
      const inRange = dayStr >= e.startDate && dayStr <= e.endDate;
      const isDeadline = e.registrationDeadline === dayStr;
      return inRange || isDeadline;
    });
  };

  return (
    <div className="comic-box p-5 md:p-6 bg-white shadow-sm border border-stone-300">
      {/* 캘린더 상단 네비게이션 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="bg-[#E8F0FE] text-[#1A73E8] p-2.5 rounded-xl border border-[#D2E3FC]">
            <CalendarIcon size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
                {format(currentMonthDate, 'yyyy년 M월', { locale: ko })}
              </h2>
              <span className="text-xs font-semibold bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full border border-stone-300">
                향후 3개월 뷰
              </span>
            </div>
          </div>
          <button
            onClick={handleToday}
            className="comic-btn px-3 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 ml-1"
          >
            오늘로 이동
          </button>
        </div>

        {/* 3개월 간편 탭 버튼 (10월, 11월, 12월) */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map(offset => {
            const mDate = addMonths(now, offset);
            const isCurrent = isSameMonth(currentMonthDate, mDate);
            return (
              <button
                key={offset}
                onClick={() => setCurrentMonthDate(mDate)}
                className={`comic-btn px-3.5 py-1.5 text-sm transition-all ${
                  isCurrent
                    ? 'bg-stone-900 text-white font-bold shadow-sm'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-300'
                }`}
              >
                {format(mDate, 'M월')}
                {offset === 0 && <span className="ml-1 text-[11px] text-amber-400">★</span>}
              </button>
            );
          })}

          {/* 이전/다음 달 버튼 */}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-stone-300">
            <button
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              title={isPrevDisabled ? '과거 월은 조회할 수 없습니다' : '이전 달'}
              className={`comic-btn p-2 text-stone-800 ${
                isPrevDisabled
                  ? 'opacity-25 cursor-not-allowed bg-stone-100 border-stone-200'
                  : 'bg-white hover:bg-stone-100 border-stone-300'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              disabled={isNextDisabled}
              title={isNextDisabled ? '최대 3개월까지만 조회 가능합니다' : '다음 달'}
              className={`comic-btn p-2 text-stone-800 ${
                isNextDisabled
                  ? 'opacity-25 cursor-not-allowed bg-stone-100 border-stone-200'
                  : 'bg-white hover:bg-stone-100 border-stone-300'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 요일 헤더: 부드럽고 가독성 높은 색상 */}
      <div className="grid grid-cols-7 gap-2 mb-2.5">
        {weekDayLabels.map(({ label, color }) => (
          <div
            key={label}
            className={`py-2 text-center font-bold text-sm md:text-base border border-stone-200 rounded-lg ${color}`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 캘린더 날짜 그리드: 넉넉한 셀 높이와 큼직한 폰트 */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonthDate);
          const isTodayDate = isToday(day);
          const isPastDay = isBefore(day, startOfDay(now));
          const dayEvents = getEventsForDay(day);
          const dayNumber = format(day, 'd');
          const dayOfWeek = day.getDay();
          const hasStoreHoliday = dayEvents.some(e => e.isHoliday);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`min-h-[110px] md:min-h-[130px] p-2 md:p-2.5 rounded-xl cursor-pointer transition-all flex flex-col justify-between border ${
                isSelected
                  ? 'bg-[#F0F7FF] border-[#1976D2] ring-2 ring-[#1976D2] shadow-md z-10'
                  : isTodayDate
                  ? 'bg-[#FFFDE7] border-amber-400 shadow-sm'
                  : isCurrentMonth
                  ? isPastDay
                    ? 'bg-stone-50/60 border-stone-200 text-stone-400 opacity-50 hover:opacity-90'
                    : hasStoreHoliday
                    ? 'bg-[#FFF8F8] border-rose-200 hover:border-rose-300'
                    : 'bg-white border-stone-200 hover:border-stone-400'
                  : 'bg-stone-100/40 border-stone-100 opacity-20 hover:opacity-50'
              }`}
            >
              {/* 날짜 상단: 16px~18px의 큼직하고 또렷한 숫자 */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm md:text-base font-bold inline-block px-1 rounded ${
                    isPastDay
                      ? 'text-stone-400'
                      : dayOfWeek === 0
                      ? 'text-rose-600'
                      : dayOfWeek === 6
                      ? 'text-sky-600'
                      : 'text-stone-800'
                  } ${isTodayDate ? 'bg-[#1A73E8] text-white px-2 py-0.5 rounded-md font-extrabold text-xs' : ''}`}
                >
                  {dayNumber}
                  {isTodayDate && <span className="ml-1 text-[11px] font-normal">오늘</span>}
                </span>

                {dayEvents.length > 0 && !isPastDay && (
                  <span className="text-xs font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded border border-stone-200">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* 날짜 내부 이벤트 스티커들: 13px의 편안하고 또렷한 가독성 */}
              <div className="flex flex-col gap-1.5 my-1.5 overflow-hidden">
                {dayEvents.slice(0, 3).map(event => {
                  const isHoliday = event.isHoliday;
                  const isSelectedEvent = selectedEvent?.id === event.id;
                  
                  // 눈이 편안한 파스텔 배경 & 부드러운 텍스트
                  let tagClass = 'bg-stone-100 text-stone-800 border-stone-200';
                  if (isPastDay) {
                    tagClass = 'bg-stone-100 text-stone-400 border-stone-200 line-through';
                  } else if (isHoliday) {
                    tagClass = 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2] font-semibold';
                  } else if (event.facility.includes('EXCO')) {
                    tagClass = 'bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB] font-medium';
                  } else if (event.facility.includes('미술관')) {
                    tagClass = 'bg-[#FCE4EC] text-[#880E4F] border-[#F8BBD0] font-medium';
                  } else if (event.facility.includes('박물관')) {
                    tagClass = 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2] font-medium';
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
                      className={`text-xs md:text-[13px] px-2 py-1 rounded-md truncate border transition-all ${tagClass} ${
                        isSelectedEvent ? 'ring-2 ring-stone-800 font-bold' : ''
                      }`}
                    >
                      {event.title}
                    </div>
                  );
                })}

                {dayEvents.length > 3 && !isPastDay && (
                  <span className="text-[11px] font-medium text-stone-500 pl-1">
                    +{dayEvents.length - 3}개 더보기
                  </span>
                )}
              </div>

              {/* 하단 혜택 뱃지 */}
              <div className="flex items-center gap-1.5">
                {!isPastDay && dayEvents.some(e => e.isFree) && (
                  <span className="text-[11px] font-semibold bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded border border-[#C8E6C9]">
                    무료
                  </span>
                )}
                {!isPastDay && dayEvents.some(e => e.registrationDeadline === format(day, 'yyyy-MM-dd')) && (
                  <span className="text-[11px] font-semibold bg-[#FFF3E0] text-[#E65100] px-1.5 py-0.5 rounded border border-[#FFE0B2]">
                    사전등록 마감
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
