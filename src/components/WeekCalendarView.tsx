import React, { useState, useMemo } from 'react';
import type { CulturalEvent } from '../types/event';
import { 
  format, addDays, isSameDay, isToday, isBefore, startOfDay 
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, RotateCcw, Eye, Info, X
} from 'lucide-react';

interface WeekCalendarViewProps {
  events: CulturalEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: CulturalEvent) => void;
  regionName: string;
}

export const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({
  events,
  selectedDate,
  onSelectDate,
  onSelectEvent,
  regionName
}) => {
  // 8일의 시작일 (디폴트: 오늘)
  const today = useMemo(() => startOfDay(new Date()), []);
  const [weekStart, setWeekStart] = useState<Date>(today);

  // 8일간의 날짜 배열 생성 (금일이 월요일이면 다음 주 월요일까지 총 8일)
  const weekDays = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  // 마우스 호버된 카테고리 팝업 상태: { dayKey, facility, dayIndex, events }
  const [hoveredPopup, setHoveredPopup] = useState<{
    dayKey: string;
    facility: string;
    dayIndex: number;
    events: CulturalEvent[];
  } | null>(null);

  // 과거로의 이동 방지 (오늘보다 이전 주는 비활성화)
  const canGoPrev = useMemo(() => {
    const prevWeekStart = addDays(weekStart, -8);
    return !isBefore(prevWeekStart, today);
  }, [weekStart, today]);

  const handlePrevWeek = () => {
    if (canGoPrev) {
      setWeekStart(prev => addDays(prev, -8));
      setHoveredPopup(null);
    }
  };

  const handleNextWeek = () => {
    setWeekStart(prev => addDays(prev, 8));
    setHoveredPopup(null);
  };

  const handleResetToday = () => {
    setWeekStart(today);
    onSelectDate(today);
    setHoveredPopup(null);
  };

  // 특정 날짜에 진행 중인 이벤트 가져오기
  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => {
      const inRange = dateStr >= e.startDate && dateStr <= e.endDate;
      const isDeadline = e.registrationDeadline === dateStr;
      return inRange || isDeadline;
    });
  };

  // 카테고리별 뱃지 스타일 헬퍼
  const getBadgeStyle = (facility: string, isHoliday?: boolean) => {
    if (isHoliday || facility.includes('휴무') || facility.includes('코스트코') || facility.includes('백화점')) {
      return {
        bg: 'bg-rose-50 hover:bg-rose-100/90 text-rose-800 border-rose-200/90',
        dot: 'bg-rose-500',
        label: '휴무일'
      };
    }
    if (facility.includes('미술관') || facility.includes('갤러리') || facility.includes('솔거') || facility.includes('클레이아크')) {
      return {
        bg: 'bg-purple-50 hover:bg-purple-100/90 text-purple-900 border-purple-200/90',
        dot: 'bg-purple-500',
        label: '미술관'
      };
    }
    if (facility.includes('박물관')) {
      return {
        bg: 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 border-emerald-200/90',
        dot: 'bg-emerald-500',
        label: '박물관'
      };
    }
    if (facility.includes('EXCO') || facility.includes('BEXCO') || facility.includes('CECO')) {
      return {
        bg: 'bg-sky-50 hover:bg-sky-100/90 text-sky-900 border-sky-200/90',
        dot: 'bg-sky-500',
        label: '컨벤션'
      };
    }
    if (facility.includes('오페라') || facility.includes('문화예술') || facility.includes('문화회관') || facility.includes('아트센터')) {
      return {
        bg: 'bg-amber-50 hover:bg-amber-100/90 text-amber-900 border-amber-200/90',
        dot: 'bg-amber-500',
        label: '공연장'
      };
    }
    return {
      bg: 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200',
      dot: 'bg-stone-400',
      label: '문화'
    };
  };

  const periodLabel = `${format(weekDays[0], 'yyyy.MM.dd(EEE)', { locale: ko })} ~ ${format(weekDays[7], 'yyyy.MM.dd(EEE)', { locale: ko })}`;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden select-none">
      {/* 1. 상단 컨트롤 바 (8일 네비게이션) - 높이 고정 */}
      <div className="px-4 py-2 bg-[#FAF9F6] border-b border-stone-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm md:text-base font-bold text-stone-900 flex items-center gap-1.5">
              <span>{regionName} 8일 주간 문화 캘린더</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 font-medium">
                총 8일간
              </span>
            </h2>
          </div>
          <span className="text-xs font-semibold text-stone-500 hidden sm:inline-block">
            {periodLabel}
          </span>
        </div>

        {/* 주간 네비게이션 버튼 그룹 */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevWeek}
            disabled={!canGoPrev}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
              canGoPrev
                ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 cursor-pointer shadow-2xs'
                : 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed'
            }`}
            title="이전 8일 (오늘 이전 이동 불가)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">이전 8일</span>
          </button>

          <button
            onClick={handleResetToday}
            className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            title="오늘 날짜로 이동"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>오늘</span>
          </button>

          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg border bg-white hover:bg-stone-100 text-stone-700 border-stone-200 text-xs font-medium flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            title="다음 8일"
          >
            <span className="hidden md:inline">다음 8일</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 8일 캘린더 본문 (수직 스크롤 절대 없음, Grid 8열 균등 배분) */}
      <div className="flex-1 grid grid-cols-8 divide-x divide-stone-200 min-h-0 bg-[#FBFBFA] relative">
        {weekDays.map((dayDate, dayIdx) => {
          const dayKey = format(dayDate, 'yyyy-MM-dd');
          const dayEvents = getEventsForDay(dayDate);
          const isCurrentToday = isToday(dayDate);
          const isSelected = isSameDay(dayDate, selectedDate);
          const dayOfWeekNum = dayDate.getDay();
          const isSunday = dayOfWeekNum === 0;
          const isSaturday = dayOfWeekNum === 6;

          // 시설/카테고리별로 이벤트 그룹화
          const facilityGroups = dayEvents.reduce((acc, ev) => {
            const fac = ev.facility;
            if (!acc[fac]) acc[fac] = [];
            acc[fac].push(ev);
            return acc;
          }, {} as Record<string, CulturalEvent[]>);

          const facilities = Object.keys(facilityGroups);

          return (
            <div
              key={dayKey}
              onClick={() => onSelectDate(dayDate)}
              className={`flex flex-col h-full min-h-0 transition-colors relative cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/40'
                  : isCurrentToday
                  ? 'bg-emerald-50/20'
                  : 'hover:bg-stone-100/50'
              }`}
            >
              {/* 컬럼 상단 헤더: 날짜 & 요일 */}
              <div className={`p-2 text-center border-b border-stone-200 shrink-0 ${
                isCurrentToday 
                  ? 'bg-emerald-100/40 text-emerald-950 font-bold' 
                  : isSelected 
                  ? 'bg-amber-100/40 text-amber-950 font-bold' 
                  : 'bg-white'
              }`}>
                {/* 요일 */}
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-xs font-semibold ${
                    isSunday ? 'text-rose-600' : isSaturday ? 'text-blue-600' : 'text-stone-600'
                  }`}>
                    {format(dayDate, 'E', { locale: ko })}요일
                  </span>
                  {isCurrentToday && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white leading-tight">
                      오늘
                    </span>
                  )}
                </div>

                {/* 날짜 */}
                <div className={`text-base md:text-lg font-bold mt-0.5 tracking-tight ${
                  isCurrentToday ? 'text-emerald-900' : isSunday ? 'text-rose-600' : 'text-stone-800'
                }`}>
                  {format(dayDate, 'M.d')}
                </div>
              </div>

              {/* 컬럼 내용: 카테고리/시설명 칩 목록 (마우스 호버 시 1.5배 대형 팝업 유도) */}
              <div className="flex-1 p-1.5 flex flex-col gap-1.5 overflow-hidden min-h-0">
                {facilities.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-2 opacity-50">
                    <span className="text-[11px] text-stone-400">일정 없음</span>
                  </div>
                ) : (
                  facilities.map(facility => {
                    const groupEvents = facilityGroups[facility];
                    const isHolidayGroup = groupEvents.some(e => e.isHoliday);
                    const style = getBadgeStyle(facility, isHolidayGroup);
                    const isHovered = hoveredPopup?.dayKey === dayKey && hoveredPopup?.facility === facility;

                    return (
                      <div
                        key={facility}
                        onMouseEnter={() => {
                          setHoveredPopup({
                            dayKey,
                            facility,
                            dayIndex: dayIdx,
                            events: groupEvents
                          });
                        }}
                        className={`group relative px-2 py-1.5 rounded-lg border transition-all text-left shadow-2xs ${style.bg} ${
                          isHovered ? 'ring-2 ring-stone-400/50 scale-[1.02]' : ''
                        }`}
                        onClick={e => {
                          e.stopPropagation();
                          if (groupEvents.length === 1) {
                            onSelectEvent(groupEvents[0]);
                          } else {
                            // 여러 개일 때는 팝업 유지
                            setHoveredPopup({
                              dayKey,
                              facility,
                              dayIndex: dayIdx,
                              events: groupEvents
                            });
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                            <span className="text-xs font-bold truncate tracking-tight">
                              {facility}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-white/90 text-stone-700 shadow-2xs shrink-0">
                            {groupEvents.length}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 하단 총 건수 인디케이터 */}
              <div className="p-1 border-t border-stone-200/60 bg-white/70 text-center shrink-0">
                <span className="text-[10px] text-stone-400 font-medium">
                  총 {dayEvents.length}건
                </span>
              </div>
            </div>
          );
        })}

        {/* 3. 카테고리 마우스 호버 시 뜨는 플로팅 팝업 
               요구사항 반영: 팝업 크기 대폭 확대(w-96 ~ w-[440px]), 내부 폰트 1.5배 확대(15~18px)
        */}
        {hoveredPopup && (
          <div
            onMouseLeave={() => setHoveredPopup(null)}
            style={{
              // 8일 중 좌측 4일은 오른쪽으로, 우측 4일은 왼쪽으로 팝업 배치하여 화면 밖 잘림 및 스크롤 원천 차단
              left: hoveredPopup.dayIndex < 5 
                ? `${((hoveredPopup.dayIndex + 1) / 8) * 100}%` 
                : undefined,
              right: hoveredPopup.dayIndex >= 5 
                ? `${((8 - hoveredPopup.dayIndex) / 8) * 100}%` 
                : undefined,
              top: '55px'
            }}
            className="absolute z-40 w-96 md:w-[440px] bg-white rounded-2xl shadow-2xl border-2 border-stone-300 p-4.5 animate-fadeIn text-stone-800"
          >
            {/* 팝업 헤더 (1.5배 확대: text-base~lg) */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h4 className="text-base md:text-lg font-extrabold text-stone-900 truncate tracking-tight">
                  {hoveredPopup.facility}
                </h4>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-lg border border-stone-200">
                  총 {hoveredPopup.events.length}개 행사
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                  클릭 시 상세
                </span>
                <button
                  onClick={() => setHoveredPopup(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title="닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 이벤트 리스트 (1.5배 확대: 제목 15~16px, 본문 13~14px) */}
            <div className="space-y-3 max-h-88 overflow-y-auto pr-1.5">
              {hoveredPopup.events.map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  onClick={e => {
                    e.stopPropagation();
                    onSelectEvent(ev);
                    setHoveredPopup(null);
                  }}
                  className="p-3.5 rounded-xl border border-stone-200 bg-[#FCFCFA] hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm md:text-base font-extrabold text-stone-900 group-hover:text-indigo-950 leading-snug line-clamp-2">
                      {ev.title}
                    </p>
                    {ev.isFree && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        무료
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs md:text-sm text-stone-600 mt-2.5 pt-2 border-t border-stone-200/70">
                    <span className="truncate max-w-[240px] font-medium">
                      {ev.price || '관람 정보 확인'}
                    </span>
                    <span className="text-xs md:text-sm text-indigo-600 font-bold group-hover:underline flex items-center gap-0.5 shrink-0">
                      상세보기 →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 안내 풋터 */}
            <div className="mt-3 pt-2.5 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
              <span>💡 행사를 클릭하면 상세 정보 팝업이 열립니다.</span>
              <button
                onClick={() => setHoveredPopup(null)}
                className="text-stone-600 hover:text-stone-900 font-bold cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. 하단 힌트 바 - 세로 공간 최소화 */}
      <div className="px-4 py-1.5 bg-[#FAF9F6] border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            카테고리 칩에 마우스를 올리면 1.5배 확대된 행사 목록 팝업이 열리며, 클릭 시 상세 정보를 확인합니다.
          </span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center gap-1 text-purple-700">● 미술관</span>
          <span className="flex items-center gap-1 text-emerald-700">● 박물관</span>
          <span className="flex items-center gap-1 text-sky-700">● 컨벤션</span>
          <span className="flex items-center gap-1 text-amber-700">● 공연장</span>
          <span className="flex items-center gap-1 text-rose-700">● 휴무일</span>
        </div>
      </div>
    </div>
  );
};
