import React, { useState, useMemo, useEffect } from 'react';
import type { CulturalEvent } from '../types/event';
import { calculateDday } from '../services/eventService';
import { 
  format, addDays, isSameDay, isToday, isBefore, startOfDay 
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, RotateCcw, Info, X, MapPin, 
  Sparkles, Calendar as CalendarIcon, ArrowLeft, ExternalLink,
  Tag, AlertCircle, CheckCircle2
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
  regionName
}) => {
  // 오늘 날짜 (시간 00:00:00 기준)
  const today = useMemo(() => startOfDay(new Date()), []);

  // 오늘이 항상 맨 왼쪽에 표시됨 (기본 시작일 = 오늘)
  const [weekStart, setWeekStart] = useState<Date>(today);

  // 8일간의 날짜 배열 생성 (맨 왼쪽이 weekStart = 오늘, +7일간 총 8일)
  const weekDays = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  // 클릭으로 제어되는 행사 리스트 및 상세 모달 상태
  // selectedEventIndex: null이면 '리스트 뷰', number이면 해당 인덱스의 '상세 뷰'
  const [activeModal, setActiveModal] = useState<{
    dayKey: string;
    dayDate: Date;
    facility: string;
    events: CulturalEvent[];
    selectedEventIndex: number | null;
  } | null>(null);

  // ESC 키 이벤트로 뒤로가기 또는 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal?.selectedEventIndex !== null) {
          // 상세 뷰에서는 리스트 뷰로 뒤로가기
          setActiveModal(prev => prev ? { ...prev, selectedEventIndex: null } : null);
        } else {
          // 리스트 뷰에서는 모달 닫기
          setActiveModal(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  // 과거로의 이동 방지 (오늘보다 이전 주는 비활성화 - 오늘이 항상 최선두 기준)
  const canGoPrev = useMemo(() => {
    const prevWeekStart = addDays(weekStart, -8);
    return !isBefore(prevWeekStart, today);
  }, [weekStart, today]);

  const handlePrevWeek = () => {
    if (canGoPrev) {
      setWeekStart(prev => addDays(prev, -8));
      setActiveModal(null);
    }
  };

  const handleNextWeek = () => {
    setWeekStart(prev => addDays(prev, 8));
    setActiveModal(null);
  };

  const handleResetToday = () => {
    setWeekStart(today);
    onSelectDate(today);
    setActiveModal(null);
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
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 border-amber-300 font-extrabold shadow-2xs',
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

          // 지역축제는 '지역 축제'라는 이름으로 통합 묶음
          const facilityGroups = dayEvents.reduce((acc, ev) => {
            const isFest = ev.category === 'festival' || ev.facility === '지역 축제' || ev.facility.includes('축제');
            const fac = isFest ? '지역 축제' : ev.facility;
            if (!acc[fac]) acc[fac] = [];
            acc[fac].push(ev);
            return acc;
          }, {} as Record<string, CulturalEvent[]>);

          // 각 요일의 맨 상단에 미술관, 박물관 보다 먼저 '지역 축제'가 최상단에 표시되도록 정렬
          const facilities = Object.keys(facilityGroups).sort((a, b) => {
            const getPriority = (fac: string) => {
              if (fac === '지역 축제') return 0;
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
              {/* 컬럼 상단 헤더: 날짜 & 요일 */}
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

              {/* 컬럼 내용: 카테고리/시설명 칩 목록 (마우스 클릭 시 팝업 열림, 호버 방해 제거) */}
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
                    const isFest = facility === '지역 축제';

                    return (
                      <div
                        key={facility}
                        onClick={e => {
                          e.stopPropagation();
                          // 마우스 클릭 시에만 팝업 열기! (호버 방해 원천 제거)
                          setActiveModal({
                            dayKey,
                            dayDate,
                            facility,
                            events: groupEvents,
                            // 행사가 1개면 바로 상세로 열리되 상단에 [닫기] 제공, 2개 이상이면 목록으로 열림
                            selectedEventIndex: groupEvents.length === 1 ? 0 : null
                          });
                        }}
                        title={`클릭하여 ${facility} (${groupEvents.length}개 행사) 상세 보기`}
                        className={`group relative px-2 py-1.5 rounded-lg border transition-all text-left shadow-2xs cursor-pointer hover:scale-[1.02] hover:shadow-xs active:scale-95 ${style.bg} ${
                          isFest ? 'border-amber-300' : ''
                        }`}
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
      </div>

      {/* 3. [개선] 클릭으로 제어되는 통합 모달: 목록 뷰와 상세 뷰를 자유자재로 넘나드는 쾌적한 팝업 */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/45 backdrop-blur-xs animate-fadeIn select-text"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-stone-200/90 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-stone-800 animate-scaleIn"
            onClick={e => e.stopPropagation()}
          >
            {/* =================================================== */}
            {/* 상태 A: 행사 상세 뷰 (selectedEventIndex !== null) */}
            {/* =================================================== */}
            {activeModal.selectedEventIndex !== null ? (() => {
              const currentEvent = activeModal.events[activeModal.selectedEventIndex];
              const totalInGroup = activeModal.events.length;
              const hasMultiple = totalInGroup > 1;
              const ddayInfo = calculateDday(currentEvent.registrationDeadline || currentEvent.startDate);

              return (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* 상세 뷰 상단 네비게이션 바 */}
                  <div className="px-5 py-3.5 bg-[#FAF9F6] border-b border-stone-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                      {/* 목록으로 뒤로가기 버튼 */}
                      {hasMultiple && (
                        <button
                          onClick={() => setActiveModal(prev => prev ? { ...prev, selectedEventIndex: null } : null)}
                          className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-bold transition-all border border-stone-300 shadow-2xs flex items-center gap-1.5 cursor-pointer hover:border-amber-400"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
                          <span>목록으로</span>
                        </button>
                      )}

                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        {currentEvent.facility}
                      </span>

                      {currentEvent.isFree && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> 무료 관람
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        ddayInfo.isUrgent 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {ddayInfo.label}
                      </span>
                    </div>

                    {/* 우측: 이전/다음 넘기기 컨트롤 및 닫기 버튼 */}
                    <div className="flex items-center gap-2">
                      {hasMultiple && (
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-stone-200 shadow-2xs">
                          <button
                            onClick={() => {
                              if (activeModal.selectedEventIndex! > 0) {
                                setActiveModal(prev => prev ? { ...prev, selectedEventIndex: prev.selectedEventIndex! - 1 } : null);
                              }
                            }}
                            disabled={activeModal.selectedEventIndex === 0}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-0.5 transition-colors ${
                              activeModal.selectedEventIndex === 0
                                ? 'text-stone-300 cursor-not-allowed'
                                : 'text-stone-700 hover:bg-stone-100 cursor-pointer'
                            }`}
                            title="이전 행사"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline text-[11px]">이전</span>
                          </button>

                          <span className="text-xs font-bold px-2 text-stone-600">
                            {activeModal.selectedEventIndex! + 1} / {totalInGroup}
                          </span>

                          <button
                            onClick={() => {
                              if (activeModal.selectedEventIndex! < totalInGroup - 1) {
                                setActiveModal(prev => prev ? { ...prev, selectedEventIndex: prev.selectedEventIndex! + 1 } : null);
                              }
                            }}
                            disabled={activeModal.selectedEventIndex === totalInGroup - 1}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-0.5 transition-colors ${
                              activeModal.selectedEventIndex === totalInGroup - 1
                                ? 'text-stone-300 cursor-not-allowed'
                                : 'text-stone-700 hover:bg-stone-100 cursor-pointer'
                            }`}
                            title="다음 행사"
                          >
                            <span className="hidden sm:inline text-[11px]">다음</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* 닫기 버튼 */}
                      <button
                        onClick={() => setActiveModal(null)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-stone-300/80"
                        title="닫기 (ESC)"
                      >
                        <X className="w-4 h-4 text-stone-600" />
                        <span>닫기</span>
                      </button>
                    </div>
                  </div>

                  {/* 상세 뷰 본문 스크롤 영역 */}
                  <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-[#FCFCFA]">
                    {/* 제목 */}
                    <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 leading-snug">
                      {currentEvent.title}
                    </h2>

                    {/* 포스터 이미지 */}
                    {currentEvent.posterUrl && (
                      <div className="w-full h-56 md:h-64 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-2xs">
                        <img 
                          src={currentEvent.posterUrl} 
                          alt={currentEvent.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* 핵심 정보 그리드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs">
                      {/* 기간 */}
                      <div className="flex items-start gap-2.5 text-stone-700">
                        <CalendarIcon className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
                        <div>
                          <p className="text-xs text-stone-400 font-medium">행사 / 전시 기간</p>
                          <p className="text-sm font-bold text-stone-900 mt-0.5">
                            {currentEvent.startDate === currentEvent.endDate 
                              ? currentEvent.startDate 
                              : `${currentEvent.startDate} ~ ${currentEvent.endDate}`}
                          </p>
                          {currentEvent.registrationDeadline && (
                            <p className="text-xs font-bold text-amber-700 mt-1">
                              🚨 사전등록 마감: {currentEvent.registrationDeadline}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 장소 */}
                      <div className="flex items-start gap-2.5 text-stone-700">
                        <MapPin className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
                        <div>
                          <p className="text-xs text-stone-400 font-medium">장소 / 위치</p>
                          <p className="text-sm font-bold text-stone-900 mt-0.5">{currentEvent.location}</p>
                          <p className="text-xs text-stone-500 mt-0.5">{currentEvent.facility}</p>
                        </div>
                      </div>

                      {/* 관람료 */}
                      <div className="flex items-start gap-2.5 text-stone-700 md:col-span-2 pt-2 border-t border-stone-100">
                        <Tag className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
                        <div>
                          <p className="text-xs text-stone-400 font-medium">관람료 / 비용</p>
                          <p className="text-sm font-bold text-stone-900 mt-0.5">
                            {currentEvent.price || (currentEvent.isFree ? '무료 관람' : '현장 문의')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 상세 안내 */}
                    {currentEvent.description && (
                      <div>
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                          상세 안내
                        </h3>
                        <p className="text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
                          {currentEvent.description}
                        </p>
                      </div>
                    )}

                    {/* 방문 꿀팁 */}
                    {currentEvent.notice && (
                      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs md:text-sm flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div className="leading-relaxed font-medium">
                          <span className="font-extrabold mr-1">방문 Tip:</span>
                          {currentEvent.notice}
                        </div>
                      </div>
                    )}

                    {/* 태그 목록 */}
                    {currentEvent.tags && currentEvent.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {currentEvent.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200/70"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 상세 뷰 하단 액션 바 */}
                  <div className="px-6 py-3.5 border-t border-stone-200 bg-[#FAF9F6] flex items-center justify-between shrink-0">
                    <div>
                      {hasMultiple ? (
                        <button
                          onClick={() => setActiveModal(prev => prev ? { ...prev, selectedEventIndex: null } : null)}
                          className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>다른 행사 목록 보기 ({totalInGroup}개)</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>성인 문화생활 필터 적용</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {currentEvent.url && (
                        <a
                          href={currentEvent.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <span>공식 홈페이지 바로가기</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })() : (
              /* =================================================== */
              /* 상태 B: 행사 목록 뷰 (selectedEventIndex === null) */
              /* =================================================== */
              <div className="flex flex-col h-full overflow-hidden">
                {/* 팝업 헤더 */}
                <div className="px-5 py-3.5 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base md:text-lg font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                          <span>{activeModal.facility} 목록</span>
                          <span className="text-xs font-bold px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-lg border border-stone-200">
                            총 {activeModal.events.length}개 행사
                          </span>
                        </h3>
                      </div>
                      <p className="text-xs font-semibold text-stone-500 mt-0.5 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                        <span>{format(activeModal.dayDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })} 진행 일정</span>
                        <span className="text-stone-300">|</span>
                        <span className="text-amber-700 font-bold">💡 행사를 클릭하면 상세 정보(지도·포스터·팁)를 확인합니다</span>
                      </p>
                    </div>
                  </div>

                  {/* 닫기 버튼 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-stone-300/80 shadow-2xs"
                      title="닫기 (ESC)"
                    >
                      <X className="w-4 h-4 text-stone-600" />
                      <span>닫기</span>
                    </button>
                  </div>
                </div>

                {/* 본문: 화면 상하 전체 높이를 사용하는 다단 카드 그리드 */}
                <div className="flex-1 p-5 overflow-y-auto min-h-0 bg-[#FAF9F6]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeModal.events.map((ev, idx) => (
                      <div
                        key={ev.id || idx}
                        onClick={() => {
                          // 행사 카드 클릭 시: 상세 뷰로 스무스하게 전환!
                          setActiveModal(prev => prev ? { ...prev, selectedEventIndex: idx } : null);
                        }}
                        className="p-4.5 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 hover:ring-2 hover:ring-amber-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
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

                          {/* 행사명 */}
                          <h4 className="text-sm md:text-base font-extrabold text-stone-900 group-hover:text-amber-900 leading-snug line-clamp-2">
                            {ev.title}
                          </h4>

                          {/* 행사 일정 */}
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
                <div className="px-5 py-2.5 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-stone-400" />
                    행사 카드를 클릭하면 상세 소개, 공식 홈페이지 링크 및 세부 안내가 열립니다.
                  </span>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-stone-700 hover:text-stone-900 font-bold px-3 py-1 rounded-lg hover:bg-stone-100 cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. 하단 힌트 바 */}
      <div className="px-4 py-1.5 bg-[#FAF9F6] border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            카테고리 칩을 클릭하면 전체 행사 목록 및 세부 정보 팝업이 열립니다.
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
