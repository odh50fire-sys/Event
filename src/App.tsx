import { useState, useMemo, useEffect, useCallback } from 'react';
import { startOfDay } from 'date-fns';
import type { CulturalEvent, FacilityFilter, RegionFilter } from './types/event';
import { getAllEvents, isKidRelated } from './services/eventService';
import { fetchLiveRegionalEvents } from './services/unifiedCrawler';
import { Navbar } from './components/Navbar';
import { DdayBanner } from './components/DdayBanner';
import { WeekCalendarView } from './components/WeekCalendarView';
import { EventDetailModal } from './components/EventDetailModal';

const REGION_NAMES: Record<RegionFilter, string> = {
  all: '영남권 전체',
  daegu: '대구',
  busan: '부산',
  gyeongbuk: '경북',
  gyeongnam: '경남',
};

export function App() {
  const [allEvents, setAllEvents] = useState<CulturalEvent[]>(() => getAllEvents());
  // 디폴트: 전체 ('all')
  const [currentRegion, setCurrentRegion] = useState<RegionFilter>('all');
  const [currentFilter, setCurrentFilter] = useState<FacilityFilter>('ALL');
  const [onlyFree, setOnlyFree] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));
  const [weekStart, setWeekStart] = useState<Date>(() => startOfDay(new Date()));
  const [modalEvent, setModalEvent] = useState<CulturalEvent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 전 권역 실시간 크롤링 및 동기화 함수
  const syncLiveEvents = useCallback(async () => {
    try {
      const live = await fetchLiveRegionalEvents();
      setAllEvents(prev => {
        let updated = [...prev];

        // 1. 대구미술관 실시간 동기화
        if (live.damEvents && live.damEvents.length > 0) {
          updated = updated.filter(e => e.facility !== '대구미술관');
          updated = [...updated, ...live.damEvents];
        }

        // 2. BEXCO 실시간 동기화
        if (live.bexcoEvents && live.bexcoEvents.length > 0) {
          updated = updated.filter(e => e.facility !== 'BEXCO (벡스코)');
          updated = [...updated, ...live.bexcoEvents];
        }

        // 3. 실시간 축제 동기화
        if (live.festivalEvents && live.festivalEvents.length > 0) {
          const liveIds = new Set(live.festivalEvents.map(f => f.id));
          updated = updated.filter(e => !liveIds.has(e.id));
          updated = [...updated, ...live.festivalEvents];
        }

        return updated;
      });
    } catch (err) {
      console.warn('전 권역 실시간 동기화 오류:', err);
    }
  }, []);

  // 앱 시작 시 백그라운드 1회 실시간 웹 크롤링 동기화
  useEffect(() => {
    syncLiveEvents();
  }, [syncLiveEvents]);

  // 실시간 새로고침 버튼 핸들러 (새로고침 시 항상 오늘이 8일 캘린더의 가장 왼쪽에 배치되도록 초기화)
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const today = startOfDay(new Date());
    setWeekStart(today);
    setSelectedDate(today);
    const refreshed = getAllEvents(today);
    setAllEvents(refreshed);
    await syncLiveEvents();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // 선택된 지역 및 필터 적용된 이벤트 목록 (키즈 관련 항목 전면 배제)
  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      // 0. 키즈/어린이/육아/유아/베이비 관련 항목 원천 배제
      if (isKidRelated(e)) return false;

      // 1. 지역 필터 (디폴트: 'all' -> 전체 권역 표시, 또는 개별 지역)
      if (currentRegion !== 'all' && e.region !== currentRegion) {
        return false;
      }

      // 2. 시설/카테고리 필터
      if (currentFilter === 'FESTIVAL' && e.category !== 'festival' && e.facility !== '지역 축제' && !e.facility.includes('축제')) {
        return false;
      }
      if (currentFilter === 'EXCO' && !e.facility.includes('EXCO') && !e.facility.includes('BEXCO') && !e.facility.includes('CECO')) {
        return false;
      }
      if (currentFilter === 'ART' && !e.facility.includes('미술관') && !e.facility.includes('갤러리') && !e.facility.includes('솔거') && !e.facility.includes('클레이아크')) {
        return false;
      }
      if (currentFilter === 'MUSEUM' && !e.facility.includes('박물관')) {
        return false;
      }
      if (currentFilter === 'PERFORMANCE' && !e.facility.includes('공연') && !e.facility.includes('오페라') && !e.facility.includes('문화예술') && !e.facility.includes('문화회관') && !e.facility.includes('아트센터')) {
        return false;
      }
      if (currentFilter === 'SHOPPING' && !e.isHoliday) {
        return false;
      }

      // 3. 무료 관람 필터
      if (onlyFree && !e.isFree) {
        return false;
      }

      return true;
    });
  }, [allEvents, currentRegion, currentFilter, onlyFree]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F8F7F4] select-none">
      {/* 1. 상단 네비게이션 & 지역 선택 탭 (디폴트: 전체) */}
      <Navbar
        currentRegion={currentRegion}
        onRegionChange={setCurrentRegion}
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        onlyFree={onlyFree}
        onToggleOnlyFree={() => setOnlyFree(!onlyFree)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalCount={filteredEvents.length}
      />

      {/* 2. 임박 D-Day 1.5배 확대 배너 */}
      <DdayBanner
        events={filteredEvents}
        onSelectEvent={setModalEvent}
      />

      {/* 3. 8일 주간 캘린더 본문 (상하 스크롤 0%, flex-1 min-h-0) */}
      <main className="flex-1 w-full p-2 md:p-3 overflow-hidden min-h-0 flex flex-col">
        <WeekCalendarView
          events={filteredEvents}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onSelectEvent={setModalEvent}
          regionName={REGION_NAMES[currentRegion]}
          weekStart={weekStart}
          onWeekStartChange={setWeekStart}
        />
      </main>

      {/* 4. 이벤트 상세 내용 모달 */}
      <EventDetailModal
        event={modalEvent}
        onClose={() => setModalEvent(null)}
      />
    </div>
  );
}

export default App;
