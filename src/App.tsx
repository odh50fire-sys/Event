import { useState, useMemo } from 'react';
import type { CulturalEvent, FacilityFilter } from './types/event';
import { getInitialEvents, isKidRelated } from './services/eventService';
import { Navbar } from './components/Navbar';
import { DdayBanner } from './components/DdayBanner';
import { CalendarView } from './components/CalendarView';
import { EventDetailCard } from './components/EventDetailCard';
import { format } from 'date-fns';

export function App() {
  const [events, setEvents] = useState<CulturalEvent[]>(() => getInitialEvents());
  const [currentFilter, setCurrentFilter] = useState<FacilityFilter>('ALL');
  const [onlyFree, setOnlyFree] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CulturalEvent | null>(() => {
    const init = getInitialEvents();
    return init.length > 0 ? init[0] : null;
  });
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 실시간 동기화 핸들러
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshed = getInitialEvents(new Date());
      setEvents(refreshed);
      setIsRefreshing(false);
    }, 600);
  };

  // 필터링 적용된 이벤트 목록 (키즈 관련 항목 전면 배제)
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // 0. 키즈/어린이/베이비 관련 항목 원천 배제
      if (isKidRelated(e)) return false;

      // 1. 시설/카테고리 필터
      if (currentFilter === 'EXCO' && !e.facility.includes('EXCO')) return false;
      if (currentFilter === 'ART' && !e.facility.includes('미술관')) return false;
      if (currentFilter === 'MUSEUM' && !e.facility.includes('박물관')) return false;
      if (currentFilter === 'SHOPPING' && !e.isHoliday) return false;

      // 2. 무료 관람 필터
      if (onlyFree && !e.isFree) return false;

      return true;
    });
  }, [events, currentFilter, onlyFree]);

  // 선택된 날짜에 열리는 이벤트 목록
  const dayEvents = useMemo(() => {
    const dayStr = format(selectedDate, 'yyyy-MM-dd');
    return filteredEvents.filter(e => {
      const inRange = dayStr >= e.startDate && dayStr <= e.endDate;
      const isDeadline = e.registrationDeadline === dayStr;
      return inRange || isDeadline;
    });
  }, [filteredEvents, selectedDate]);

  // 날짜 변경 시 해당 날짜의 첫 번째 이벤트 자동 포커스
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    const dayStr = format(date, 'yyyy-MM-dd');
    const matches = filteredEvents.filter(e => {
      const inRange = dayStr >= e.startDate && dayStr <= e.endDate;
      const isDeadline = e.registrationDeadline === dayStr;
      return inRange || isDeadline;
    });
    if (matches.length > 0) {
      setSelectedEvent(matches[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col selection:bg-[#FFE500] selection:text-black">
      {/* 1. 상단 네비게이션 & 필터 */}
      <Navbar
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        onlyFree={onlyFree}
        onToggleOnlyFree={() => setOnlyFree(!onlyFree)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalCount={filteredEvents.length}
      />

      {/* 2. D-day & 사전예약 레이더 상단 배너 */}
      <DdayBanner
        events={filteredEvents}
        onSelectEvent={e => {
          setSelectedEvent(e);
          const [y, m, d] = (e.registrationDeadline || e.startDate).split('-').map(Number);
          setSelectedDate(new Date(y, m - 1, d));
        }}
      />

      {/* 3. 본문: 3개월 롤링 캘린더 + 우측 이벤트 상세 카드 */}
      <main className="max-w-7xl mx-auto w-full p-3 md:p-6 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측 2열: 캘린더 뷰 */}
        <div className="lg:col-span-2">
          <CalendarView
            events={filteredEvents}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        </div>

        {/* 우측 1열: 선택된 이벤트 상세 카드 */}
        <div className="lg:col-span-1">
          <EventDetailCard
            event={selectedEvent}
            dayEvents={dayEvents}
            selectedDate={selectedDate}
            onSelectEvent={setSelectedEvent}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
