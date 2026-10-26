import React from 'react';
import { Sparkles, RefreshCw, Layers } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b-2 border-stone-800 px-5 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 로고 영역 */}
        <div className="flex items-center gap-3.5">
          <div className="bg-[#2D2D2D] text-[#FFFDF8] px-3 py-1.5 rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_0px_#404040]">
            <span className="text-xl font-bold font-comic tracking-wide">🎭 POP</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold font-comic text-stone-900 tracking-normal">
                컬처팝 <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-300">대구·영남</span>
              </h1>
              <span className="text-xs font-semibold bg-[#E8F0FE] text-[#1A73E8] px-2.5 py-0.5 rounded-full border border-[#D2E3FC]">
                향후 3개월 캘린더
              </span>
            </div>
            <p className="text-xs font-medium text-stone-500 mt-0.5">
              미술관 · 박물관 · EXCO · 쇼핑몰 휴무일 문화생활 비서
            </p>
          </div>
        </div>

        {/* 필터 버튼들: 눈이 편안한 파스텔 & 뉴트럴 컬러, 14px 이상의 큼직한 가독성 */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => onFilterChange('ALL')}
            className={`comic-btn px-3.5 py-1.5 text-sm transition-all ${
              currentFilter === 'ALL'
                ? 'bg-stone-900 text-white font-bold'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Layers size={15} className="mr-1.5 opacity-80" />
            전체 ({totalCount})
          </button>
          
          <button
            onClick={() => onFilterChange('EXCO')}
            className={`comic-btn px-3.5 py-1.5 text-sm transition-all ${
              currentFilter === 'EXCO'
                ? 'bg-[#E3F2FD] text-[#0D47A1] font-bold border-[#1976D2] ring-1 ring-[#1976D2]'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            🎪 EXCO 엑스코
          </button>

          <button
            onClick={() => onFilterChange('ART')}
            className={`comic-btn px-3.5 py-1.5 text-sm transition-all ${
              currentFilter === 'ART'
                ? 'bg-[#FCE4EC] text-[#880E4F] font-bold border-[#C2185B] ring-1 ring-[#C2185B]'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            🎨 대구미술관
          </button>

          <button
            onClick={() => onFilterChange('MUSEUM')}
            className={`comic-btn px-3.5 py-1.5 text-sm transition-all ${
              currentFilter === 'MUSEUM'
                ? 'bg-[#FFF8E1] text-[#E65100] font-bold border-[#FB8C00] ring-1 ring-[#FB8C00]'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            👑 국립대구박물관
          </button>

          <button
            onClick={() => onFilterChange('SHOPPING')}
            className={`comic-btn px-3.5 py-1.5 text-sm transition-all ${
              currentFilter === 'SHOPPING'
                ? 'bg-[#FFEBEE] text-[#C62828] font-bold border-[#E53935] ring-1 ring-[#E53935]'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            🛒 백화점 & 마트 휴무
          </button>

          {/* 무료 전용 필터 토글 */}
          <button
            onClick={onToggleOnlyFree}
            className={`comic-btn px-3 py-1.5 text-sm flex items-center gap-1.5 transition-all ${
              onlyFree
                ? 'bg-[#E8F5E9] text-[#1B5E20] font-bold border-[#43A047] ring-1 ring-[#43A047]'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Sparkles size={15} className={onlyFree ? 'text-[#2E7D32] fill-[#2E7D32]' : 'text-stone-400'} />
            무료 관람만
          </button>

          {/* 새로고침 버튼 */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="실시간 최신 정보 조회"
            className="comic-btn px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 text-sm flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden lg:inline text-xs font-semibold">새로고침</span>
          </button>
        </div>
      </div>
    </header>
  );
};
