import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import type { FacilityFilter } from '../types/event';

interface NavbarProps {
  currentFilter: FacilityFilter;
  onFilterChange: (filter: FacilityFilter) => void;
  onlyFree: boolean;
  onToggleOnlyFree: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentFilter,
  onFilterChange,
  onlyFree,
  onToggleOnlyFree,
  onRefresh,
  isRefreshing,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFF500] border-b-4 border-black px-4 py-3 shadow-[0_4px_0_0_#000]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* 로고 영역 */}
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2 rounded-lg -rotate-3 border-2 border-white shadow-[2px_2px_0_0_#000]">
            <span className="text-2xl font-black font-comic tracking-wider">🎭 POP!</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black font-comic tracking-tight text-black drop-shadow-[1px_1px_0_#fff]">
                컬처팝 <span className="text-sm bg-black text-white px-2 py-0.5 rounded-full">대구·영남</span>
              </h1>
              <span className="hidden sm:inline-block text-xs font-bold bg-[#FF3366] text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0_0_#000]">
                3개월 롤링 캘린더
              </span>
            </div>
            <p className="text-xs font-bold text-zinc-800">
              미술관 · 박물관 · EXCO · 쇼핑몰 휴무일 올인원 문화 비서
            </p>
          </div>
        </div>

        {/* 필터 버튼들 */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => onFilterChange('ALL')}
            className={`comic-btn px-3 py-1.5 text-xs md:text-sm ${
              currentFilter === 'ALL'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            전체 ({totalCount})
          </button>
          <button
            onClick={() => onFilterChange('EXCO')}
            className={`comic-btn px-3 py-1.5 text-xs md:text-sm ${
              currentFilter === 'EXCO'
                ? 'bg-[#00E5FF] text-black font-extrabold'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            🎪 EXCO 엑스코
          </button>
          <button
            onClick={() => onFilterChange('ART')}
            className={`comic-btn px-3 py-1.5 text-xs md:text-sm ${
              currentFilter === 'ART'
                ? 'bg-[#FF66CC] text-black font-extrabold'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            🎨 대구미술관
          </button>
          <button
            onClick={() => onFilterChange('MUSEUM')}
            className={`comic-btn px-3 py-1.5 text-xs md:text-sm ${
              currentFilter === 'MUSEUM'
                ? 'bg-[#FFB300] text-black font-extrabold'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            👑 국립대구박물관
          </button>
          <button
            onClick={() => onFilterChange('SHOPPING')}
            className={`comic-btn px-3 py-1.5 text-xs md:text-sm ${
              currentFilter === 'SHOPPING'
                ? 'bg-[#FF3366] text-white font-extrabold'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            🛒 백화점 & 코스트코 휴무
          </button>

          {/* 무료 전용 토글 */}
          <button
            onClick={onToggleOnlyFree}
            className={`comic-btn px-3 py-1.5 text-xs md:text-sm flex items-center gap-1 ${
              onlyFree
                ? 'bg-[#00E676] text-black font-extrabold ring-2 ring-black'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            <Sparkles size={14} className={onlyFree ? 'text-black fill-black' : 'text-zinc-500'} />
            무료 관람만
          </button>

          {/* 새로고침 버튼 */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="실시간 최신 정보 조회"
            className="comic-btn px-2.5 py-1.5 bg-white text-black hover:bg-zinc-100 text-xs flex items-center gap-1"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden lg:inline">실시간 동기화</span>
          </button>
        </div>
      </div>
    </header>
  );
};
