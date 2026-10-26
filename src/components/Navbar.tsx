import React from 'react';
import { Sparkles, RefreshCw, MapPin } from 'lucide-react';
import type { FacilityFilter, Region } from '../types/event';

interface NavbarProps {
  currentRegion: Region;
  onRegionChange: (region: Region) => void;
  currentFilter: FacilityFilter;
  onFilterChange: (filter: FacilityFilter) => void;
  onlyFree: boolean;
  onToggleOnlyFree: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalCount: number;
}

const REGIONS: { id: Region; label: string; sub: string }[] = [
  { id: 'daegu', label: '대구', sub: 'EXCO·미술관' },
  { id: 'busan', label: '부산', sub: 'BEXCO·시립미술관' },
  { id: 'gyeongbuk', label: '경북', sub: '경주·포항·안동' },
  { id: 'gyeongnam', label: '경남', sub: 'CECO·진주·김해' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRegion,
  onRegionChange,
  currentFilter,
  onFilterChange,
  onlyFree,
  onToggleOnlyFree,
  onRefresh,
  isRefreshing,
  totalCount,
}) => {
  return (
    <header className="shrink-0 bg-white border-b border-stone-200/90 px-4 py-2.5 shadow-2xs select-none">
      <div className="w-full flex items-center justify-between gap-3">
        {/* 1. 로고 & 서비스 타이틀 */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-stone-900 text-white px-2.5 py-1 rounded-xl shadow-2xs">
            <span className="text-base font-bold font-comic tracking-wide">🎭 POP</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-stone-900 tracking-tight">
                컬처팝 8Days
              </h1>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                8일 주간 뷰
              </span>
            </div>
            <p className="text-[11px] font-medium text-stone-500 hidden sm:block">
              오늘부터 다음 주 같은 요일까지 한눈에 확인하는 문화 캘린더
            </p>
          </div>
        </div>

        {/* 2. 핵심 요구사항: 지역 선택 탭 ([대구] [부산] [경북] [경남]) - 디폴트: 대구 */}
        <div className="flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200 shrink-0">
          {REGIONS.map(reg => {
            const isSelected = currentRegion === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => onRegionChange(reg.id)}
                className={`relative px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <MapPin className={`w-3 h-3 ${isSelected ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{reg.label}</span>
                {isSelected && (
                  <span className="hidden md:inline text-[10px] text-stone-300 font-normal">
                    ({reg.sub})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. 우측 컨트롤 (무료 필터 & 새로고침) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 카테고리 필터 간이 선택 */}
          <select
            value={currentFilter}
            onChange={e => onFilterChange(e.target.value as FacilityFilter)}
            className="px-2.5 py-1.5 bg-stone-50 hover:bg-white text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 cursor-pointer outline-none focus:ring-1 focus:ring-stone-400"
          >
            <option value="ALL">전체 시설 ({totalCount}건)</option>
            <option value="EXCO">컨벤션 (EXCO/BEXCO/CECO)</option>
            <option value="ART">미술관/갤러리</option>
            <option value="MUSEUM">국립·시립 박물관</option>
            <option value="PERFORMANCE">공연장/오페라/아트센터</option>
            <option value="SHOPPING">백화점 & 마트 휴무일</option>
          </select>

          {/* 무료 전용 토글 */}
          <button
            onClick={onToggleOnlyFree}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
              onlyFree
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title="무료 관람 행사만 보기"
          >
            <Sparkles className={`w-3.5 h-3.5 ${onlyFree ? 'text-emerald-600' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">무료만</span>
          </button>

          {/* 실시간 동기화 새로고침 */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 bg-white hover:bg-stone-50 text-stone-600 rounded-lg border border-stone-200 text-xs transition-colors cursor-pointer"
            title="실시간 최신 정보 조회"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-stone-800' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
