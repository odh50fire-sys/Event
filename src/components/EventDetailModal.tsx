import React, { useEffect } from 'react';
import type { CulturalEvent } from '../types/event';
import { calculateDday } from '../services/eventService';
import { 
  X, Calendar, MapPin, Tag, ExternalLink, 
  Sparkles, AlertCircle, CheckCircle2 
} from 'lucide-react';

interface EventDetailModalProps {
  event: CulturalEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const ddayInfo = calculateDday(event.registrationDeadline || event.startDate);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-stone-800"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAFAF8]">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              event.isHoliday
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              {event.facility}
            </span>
            {event.isFree && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 무료관람
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              ddayInfo.isUrgent 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-stone-100 text-stone-700'
            }`}>
              {ddayInfo.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="닫기 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 (모달 내부만 스크롤 가능, 전체 페이지 스크롤 방지) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* 제목 */}
          <h2 className="text-xl md:text-2xl font-bold text-stone-900 leading-snug">
            {event.title}
          </h2>

          {/* 포스터 이미지 (있을 경우) */}
          {event.posterUrl && (
            <div className="w-full h-52 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80">
              <img 
                src={event.posterUrl} 
                alt={event.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* 핵심 정보 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#FBFBFA] p-4 rounded-xl border border-stone-200/60">
            <div className="flex items-start gap-2.5 text-stone-700">
              <Calendar className="w-4 h-4 text-stone-400 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-stone-400 font-medium">행사 / 전시 기간</p>
                <p className="text-sm font-semibold text-stone-800">
                  {event.startDate} ~ {event.endDate}
                </p>
                {event.registrationDeadline && (
                  <p className="text-xs font-medium text-amber-700 mt-0.5">
                    🚨 사전등록 마감: {event.registrationDeadline}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-stone-700">
              <MapPin className="w-4 h-4 text-stone-400 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-stone-400 font-medium">장소 / 위치</p>
                <p className="text-sm font-semibold text-stone-800">{event.location}</p>
                <p className="text-xs text-stone-500 mt-0.5">{event.facility}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-stone-700 md:col-span-2">
              <Tag className="w-4 h-4 text-stone-400 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-stone-400 font-medium">관람료 / 비용</p>
                <p className="text-sm font-bold text-stone-800">
                  {event.price || (event.isFree ? '무료 관람' : '현장 문의')}
                </p>
              </div>
            </div>
          </div>

          {/* 상세 소개글 */}
          {event.description && (
            <div>
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                상세 안내
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed bg-white p-3.5 rounded-xl border border-stone-100">
                {event.description}
              </p>
            </div>
          )}

          {/* 꿀팁 & 방문 팁 알림 */}
          {event.notice && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs md:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="leading-relaxed font-medium">
                <span className="font-bold mr-1">방문 Tip:</span>
                {event.notice}
              </div>
            </div>
          )}

          {/* 태그 목록 */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {event.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 하단 액션 바 */}
        <div className="px-6 py-3.5 border-t border-stone-100 bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            키즈/어린이 제외 성인 문화 필터 적용됨
          </div>

          <div className="flex items-center gap-2">
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>공식 홈페이지 바로가기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
