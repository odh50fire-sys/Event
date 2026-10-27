import React, { useState, useMemo } from 'react';
import type { CulturalEvent } from '../types/event';
import { 
  format, addDays, isSameDay, isToday, isBefore, startOfDay 
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, RotateCcw, Info, X, MapPin, Sparkles, Calendar as CalendarIcon
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
  // 오늘 날짜 (시간 00:00:00 기준)
  const today = useMemo(() => startOfDay(new Date()), []);

  // [요구사항 1] 오늘이 항상 맨 왼쪽에 표시됨 (기본 시작일 = 오늘)
  const [weekStart, setWeekStart] = useState<Date>(today);

  // 8일간의 날짜 배열 생성 (맨 왼쪽이 weekStart = 오늘, +7일간 총 8일)
  const weekDays = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  // 마우스 호버된 카테고리 팝업 상태: { dayKey, dayDate, facility, events }
  const [hoveredPopup, setHoveredPopup] = useState<{
    dayKey: string;
    dayDate: Date;
    facility: string;
    events: CulturalEvent[];
  } | null>(null);

  // 과거로의 이동 방지 (오늘보다 이전 주는 비활성화 - 오늘이 항상 최선두 기준)
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

  // 카테고리별 뱃지 스타일 헬퍼 (맨 상단 '지역 축제' 포함)
  const getBadgeStyle = (facility: string, isHoliday?: boolean) => {
    if (facility === '지역 축제') {
      return {
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 border-amber-300/90 font-extrabold shadow-2xs',
        dot: 'bg-amber-500 animate-pulse',
        label: '지역 축제',
        icon: '🎪'
      };
    }
    if (isHoliday || facility.includes('휴무') || facility.includes('코스트코') || facility.includes('백화점')) {
      return {
        bg: 'bg-rose-50 hover:bg-rose-100/90 text-rose-800 border-rose-200/90',
        dot: 'bg-rose-500',
        label: '휴무일',
        icon: '🏷️'
      };
    }
    if (facility.includes('미술관') || facility.includes('갤러리') || facility.includes('솔거') || facility.includes('클레이아크')) {
      return {
        bg: 'bg-purple-50 hover:bg-purple-100/90 text-purple-900 border-purple-200/90',
        dot: 'bg-purple-500',
        label: '미술관',
        icon: '🎨'
      };
    }
    if (facility.includes('박물관')) {
      return {
        bg: 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 border-emerald-200/90',
        dot: 'bg-emerald-500',
        label: '박물관',
        icon: '🏛️'
      };
    }
    if (facility.includes('EXCO') || facility.includes('BEXCO') || facility.includes('CECO')) {
      return {
        bg: 'bg-sky-50 hover:bg-sky-100/90 text-sky-900 border-sky-200/90',
        dot: 'bg-sky-500',
        label: '컨벤션',
        icon: '🏢'
      };
    }
    if (facility.includes('오페라') || facility.includes('공연') || facility.includes('문화예술') || facility.includes('문화회관') || facility.includes('아트센터')) {
      return {
        bg: 'bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 border-amber-200',
        dot: 'bg-amber-500',
        label: '공연장',
        icon: '🎭'
      };
    }
    return {
      bg: 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200',
      dot: 'bg-stone-400',
      label: '문화',
      icon: '📍'
    };
  };

  const periodLabel = `${format(weekDays[0], 'yyyy.MM.dd(EEE)', { locale: ko })} ~ ${format(weekDays[7], 'yyyy.MM.dd(EEE)', { locale: ko })}`;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden select-none relative">
      {/* 1. 상단 컨트롤 바 (8일 네비게이션) */}
      <div className="px-4 py-2 bg-[#FAF9F6] border-b border-stone-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm md:text-base font-bold text-stone-900 flex items-center gap-1.5">
              <span>{regionName} 8일 주간 문화 캘린더</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 font-medium">
                오늘부터 8일간
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
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            title="오늘 날짜(맨 왼쪽)로 이동"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span>오늘 기준</span>
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

      {/* 2. 8일 캘린더 본문 (수직 스크롤 0%, Grid 8열 균등 배분, 맨 왼쪽이 항상 오늘) */}
      <div className="flex-1 grid grid-cols-8 divide-x divide-stone-200 min-h-0 bg-[#FBFBFA] relative">
        {weekDays.map((dayDate) => {
          const dayKey = format(dayDate, 'yyyy-MM-dd');
          const dayEvents = getEventsForDay(dayDate);
          const isCurrentToday = isToday(dayDate);
          const isSelected = isSameDay(dayDate, selectedDate);
          const dayOfWeekNum = dayDate.getDay();
          const isSunday = dayOfWeekNum === 0;
          const isSaturday = dayOfWeekNum === 6;

          // [요구사항 3] 지역축제는 항목이 많을 수 있으니 '지역 축제'라는 이름으로 통합 묶음
          const facilityGroups = dayEvents.reduce((acc, ev) => {
            const isFest = ev.category === 'festival' || ev.facility === '지역 축제' || ev.facility.includes('축제');
            const fac = isFest ? '지역 축제' : ev.facility;
            if (!acc[fac]) acc[fac] = [];
            acc[fac].push(ev);
            return acc;
          }, {} as Record<string, CulturalEvent[]>);

          // [요구사항 4] 각 요일의 맨 상단에 미술관, 박물관 보다 먼저 '지역 축제'가 최상단에 표시되도록 정렬
          const facilities = Object.keys(facilityGroups).sort((a, b) => {
            const getPriority = (fac: string) => {
              if (fac === '지역 축제') return 0; // 최우선 1위
              if (fac.includes('미술관') || fac.includes('갤러리') || fac.includes('솔거') || fac.includes('클레이아크')) return 1;
              if (fac.includes('박물관')) return 2;
              if (fac.includes('EXCO') || fac.includes('BEXCO') || fac.includes('CECO')) return 3;
              if (fac.includes('오페라') || fac.includes('공연') || fac.includes('문화예술') || fac.includes('문화회관') || fac.includes('아트센터')) return 4;
              if (fac.includes('휴무') || fac.includes('백화점') || fac.includes('코스트코')) return 5;
              return 6;
            };
            return getPriority(a) - getPriority(b);
          });

          return (
            <div
              key={dayKey}
              onClick={() => onSelectDate(dayDate)}
              className={`flex flex-col h-full min-h-0 transition-colors relative cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/40'
                  : isCurrentToday
                  ? 'bg-emerald-50/25 ring-1 ring-inset ring-emerald-400/40'
                  : 'hover:bg-stone-100/50'
              }`}
            >
              {/* 컬럼 상단 헤더: 날짜 & 요일 (맨 왼쪽 컬럼은 '오늘' 강조) */}
              <div className={`p-2 text-center border-b border-stone-200 shrink-0 ${
                isCurrentToday 
                  ? 'bg-gradient-to-b from-emerald-100/60 to-emerald-50/30 text-emerald-950 font-bold' 
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
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white leading-tight shadow-2xs">
                      오늘
                    </span>
                  )}
                </div>

                {/* 날짜 */}
                <div className={`text-base md:text-lg font-bold mt-0.5 tracking-tight ${
                  isCurrentToday ? 'text-emerald-900 font-extrabold' : isSunday ? 'text-rose-600' : 'text-stone-800'
                }`}>
                  {format(dayDate, 'M.d')}
                </div>
              </div>

              {/* 컬럼 내용: 카테고리/시설명 칩 목록 (맨 상단에 '지역 축제' 위치) */}
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
                    const isFest = facility === '지역 축제';

                    return (
                      <div
                        key={facility}
                        onMouseEnter={() => {
                          setHoveredPopup({
                            dayKey,
                            dayDate,
                            facility,
                            events: groupEvents
                          });
                        }}
                        className={`group relative px-2 py-1.5 rounded-lg border transition-all text-left shadow-2xs cursor-pointer ${style.bg} ${
                          isHovered ? 'ring-2 ring-stone-400/60 scale-[1.02]' : ''
                        } ${isFest ? 'border-amber-300' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (groupEvents.length === 1) {
                            onSelectEvent(groupEvents[0]);
                          } else {
                            // 대형 팝업 열기
                            setHoveredPopup({
                              dayKey,
                              dayDate,
                              facility,
                              events: groupEvents
                            });
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {style.icon ? (
                              <span className="text-xs leading-none shrink-0">{style.icon}</span>
                            ) : (
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                            )}
                            <span className={`text-xs font-bold truncate tracking-tight ${
                              isFest ? 'text-amber-950 font-extrabold' : ''
                            }`}>
                              {facility}
                            </span>
                          </div>
                          <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs shrink-0 ${
                            isFest 
                              ? 'bg-amber-200/90 text-amber-950 font-extrabold' 
                              : 'bg-white/90 text-stone-700'
                          }`}>
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

        {/* 3. [요구사항 2] 행사 리스트 팝업: 화면 상하 및 좌우를 최대한 활용한 와이드 풀 패널 뷰 (스크롤 원천 최소화) */}
        {hoveredPopup && (
          <div
            onMouseLeave={() => setHoveredPopup(null)}
            className="absolute inset-2 md:inset-3 z-50 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-stone-300 flex flex-col overflow-hidden animate-fadeIn text-stone-800"
          >
            {/* 팝업 헤더 (상단 꽉 차는 와이드 헤더) */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                      <span>{hoveredPopup.facility} 목록</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-lg border border-stone-200">
                        총 {hoveredPopup.events.length}개 행사
                      </span>
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-stone-500 mt-0.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                    <span>{format(hoveredPopup.dayDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })} 진행 일정</span>
                    <span className="text-stone-300">|</span>
                    <span className="text-indigo-600 font-bold">💡 행사를 클릭하면 상세 정보(지도·홈페이지·팁)가 열립니다</span>
                  </p>
                </div>
              </div>

              {/* 닫기 버튼 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHoveredPopup(null)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-stone-300/80"
                  title="닫기"
                >
                  <X className="w-4 h-4 text-stone-600" />
                  <span>닫기 (ESC)</span>
                </button>
              </div>
            </div>

            {/* 본문: 화면 상하 전체 높이를 사용하는 2~3열 다단 카드 그리드 (스크롤 원천 최소화) */}
            <div className="flex-1 p-4 overflow-y-auto min-h-0 bg-[#FAF9F6]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {hoveredPopup.events.map((ev, idx) => (
                  <div
                    key={ev.id || idx}
                    onClick={e => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                      setHoveredPopup(null);
                    }}
                    className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-400 hover:ring-2 hover:ring-amber-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* 태그 & 무료 뱃지 */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                          {ev.facility}
                        </span>
                        {ev.isFree ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                            무료 관람
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                            {ev.price?.includes('무료') ? '사전등록 무료' : '관람 정보'}
                          </span>
                        )}
                      </div>

                      {/* 행사명 (1.5배 큼직한 타이틀) */}
                      <h4 className="text-sm md:text-base font-extrabold text-stone-900 group-hover:text-amber-900 leading-snug line-clamp-2">
                        {ev.title}
                      </h4>

                      {/* 행사 일정 (행사 이름 바로 밑에 일정 표시) */}
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-amber-50/60 px-2.5 py-1 rounded-lg border border-amber-200/80">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="font-bold text-stone-800">
                          일정: {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} ~ ${ev.endDate}`}
                        </span>
                      </div>

                      {/* 장소 & 설명 */}
                      <div className="mt-2.5 space-y-1.5 text-xs text-stone-600">
                        <p className="flex items-center gap-1 font-medium truncate text-stone-500">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </p>
                        {ev.description && (
                          <p className="text-[12px] text-stone-600 line-clamp-2 leading-relaxed">
                            {ev.description}
                          </p>
                        )}
                        {ev.notice && (
                          <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded-md border border-amber-200/60 line-clamp-1">
                            💡 {ev.notice}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 카드 하단 액션 */}
                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-500 truncate max-w-[180px]">
                        {ev.price || '관람 정보 확인'}
                      </span>
                      <span className="font-bold text-amber-700 group-hover:underline flex items-center gap-0.5 shrink-0">
                        상세보기 →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 풋터 바 */}
            <div className="px-5 py-2 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                원하시는 행사를 클릭하시면 세부 일정, 예매/사전등록 안내 및 위치 지도를 확인하실 수 있습니다.
              </span>
              <button
                onClick={() => setHoveredPopup(null)}
                className="text-stone-700 hover:text-stone-900 font-bold px-2 py-0.5 rounded hover:bg-stone-100 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. 하단 힌트 바 */}
      <div className="px-4 py-1.5 bg-[#FAF9F6] border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            오늘(맨 왼쪽)부터 다음 주 같은 요일까지 총 8일간의 일정을 표시하며, 각 요일 최상단에 지역 축제가 안내됩니다.
          </span>
        </div>
        <div className="flex items-center gap-2.5 font-medium">
          <span className="flex items-center gap-1 text-amber-800 font-bold">🎪 지역 축제</span>
          <span className="flex items-center gap-1 text-purple-700">🎨 미술관</span>
          <span className="flex items-center gap-1 text-emerald-700">🏛️ 박물관</span>
          <span className="flex items-center gap-1 text-sky-700">🏢 컨벤션</span>
          <span className="flex items-center gap-1 text-amber-700">🎭 공연장</span>
          <span className="flex items-center gap-1 text-rose-700">🏷️ 휴무일</span>
        </div>
      </div>
    </div>
  );
};
