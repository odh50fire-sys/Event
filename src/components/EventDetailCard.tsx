import React, { useState } from 'react';
import type { CulturalEvent } from '../types/event';
import { calculateDday } from '../services/eventService';
import {
  MapPin,
  Calendar,
  Ticket,
  ExternalLink,
  Award,
  Share2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface EventDetailCardProps {
  event: CulturalEvent | null;
  dayEvents: CulturalEvent[];
  selectedDate: Date;
  onSelectEvent: (event: CulturalEvent) => void;
}

export const EventDetailCard: React.FC<EventDetailCardProps> = ({
  event,
  dayEvents,
  selectedDate,
  onSelectEvent,
}) => {
  const [stampedEvents, setStampedEvents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('culture_stamps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [copied, setCopied] = useState(false);

  const handleStamp = (eventId: string) => {
    let nextStamps: string[];
    if (stampedEvents.includes(eventId)) {
      nextStamps = stampedEvents.filter(id => id !== eventId);
    } else {
      nextStamps = [...stampedEvents, eventId];
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1976D2', '#E65100', '#2E7D32', '#F06292', '#5D4037'],
      });
    }
    setStampedEvents(nextStamps);
    localStorage.setItem('culture_stamps', JSON.stringify(nextStamps));
  };

  const handleShare = () => {
    if (!event) return;
    const shareText = `[컬처팝] ${event.title}\n📍 ${event.facility} (${event.location})\n🗓️ 기간: ${event.startDate} ~ ${event.endDate}\n${event.url || ''}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStamped = event ? stampedEvents.includes(event.id) : false;
  const ddayInfo = event ? calculateDday(event.startDate) : null;
  const regDdayInfo = event?.registrationDeadline ? calculateDday(event.registrationDeadline) : null;

  return (
    <aside className="comic-box p-5 md:p-6 bg-white border border-stone-300 shadow-sm flex flex-col justify-between">
      <div>
        {/* 상단: 선택된 날짜 안내 */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">선택된 일자</span>
            <h3 className="text-xl md:text-2xl font-bold text-stone-900 mt-0.5">
              {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
            </h3>
          </div>
          <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200">
            총 {dayEvents.length}개 일정
          </span>
        </div>

        {/* 해당 날짜의 이벤트 목록 칩들 */}
        {dayEvents.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {dayEvents.map(e => {
              const isActive = event?.id === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => onSelectEvent(e)}
                  className={`comic-btn px-3 py-1.5 text-xs md:text-sm truncate max-w-[220px] transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white font-bold shadow-sm'
                      : e.isHoliday
                      ? 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-300'
                  }`}
                >
                  {e.isHoliday ? '🚨 ' : ''}
                  {e.title}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl my-6 bg-stone-50/50">
            <p className="text-sm font-semibold text-stone-500">
              이 날짜에는 등록된 일정이 없습니다.
            </p>
            <p className="text-xs text-stone-400 mt-1">캘린더에서 다른 날짜를 선택해 보세요.</p>
          </div>
        )}

        {/* 선택된 이벤트 상세 카드: 눈이 편안한 소프트 카드 & 큼직한 폰트 */}
        {event && (
          <div className="border border-stone-300 rounded-2xl p-5 bg-[#FAF9F6] shadow-sm relative overflow-hidden">
            {/* 스탬프 도장 */}
            {isStamped && (
              <div className="absolute top-3 right-3 rotate-12 border-2 border-[#C62828] text-[#C62828] font-comic font-bold text-xs px-3 py-1 rounded-lg uppercase tracking-wider bg-white/95 shadow-sm">
                ★ 다녀왔어요! ★
              </div>
            )}

            {/* D-day 뱃지 모음 */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {ddayInfo && !event.isHoliday && (
                <span className="text-xs font-bold bg-[#E65100] text-white px-2.5 py-0.5 rounded-md shadow-xs">
                  {ddayInfo.label}
                </span>
              )}

              {regDdayInfo && (
                <span className="text-xs font-bold bg-[#1976D2] text-white px-2.5 py-0.5 rounded-md shadow-xs">
                  사전등록 {regDdayInfo.label}
                </span>
              )}

              {event.isHoliday && (
                <span className="text-xs font-bold bg-[#D32F2F] text-white px-2.5 py-0.5 rounded-md shadow-xs">
                  🚨 휴무일 안내
                </span>
              )}

              <span className="text-xs font-semibold bg-white text-stone-700 px-2.5 py-0.5 rounded-md border border-stone-300">
                {event.facility}
              </span>
            </div>

            {/* 제목: 18~20px의 시원하고 또렷한 폰트 */}
            <h4 className="text-lg md:text-xl font-bold text-stone-900 mb-3.5 leading-snug">
              {event.title}
            </h4>

            {/* 포스터 이미지 */}
            {event.posterUrl && !event.isHoliday && (
              <div className="mb-3.5 rounded-xl overflow-hidden border border-stone-300 max-h-[180px] shadow-xs">
                <img
                  src={event.posterUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 상세 정보 리스트: 14~15px 글씨로 편안하게 확대 */}
            <div className="space-y-2.5 text-sm md:text-[15px] text-stone-700 font-medium bg-white p-4 rounded-xl border border-stone-200 mb-3.5 shadow-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={17} className="text-[#E65100] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-900 font-semibold">장소:</strong> {event.location}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar size={17} className="text-[#1976D2] shrink-0" />
                <span>
                  <strong className="text-stone-900 font-semibold">기간:</strong> {event.startDate} ~ {event.endDate}
                </span>
              </div>

              {event.price && (
                <div className="flex items-center gap-2.5">
                  <Ticket size={17} className="text-[#2E7D32] shrink-0" />
                  <span>
                    <strong className="text-stone-900 font-semibold">관람료:</strong> {event.price}
                  </span>
                </div>
              )}
            </div>

            {/* 꿀팁 / 주의사항 */}
            {event.notice && (
              <div className="p-3 bg-[#FFF8E1] border border-[#FFE082] rounded-xl text-xs md:text-sm font-semibold text-stone-800 mb-3.5 flex items-start gap-2.5">
                {event.isHoliday ? (
                  <AlertTriangle size={17} className="text-[#D32F2F] shrink-0 mt-0.5" />
                ) : (
                  <Lightbulb size={17} className="text-[#F57F17] shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{event.notice}</span>
              </div>
            )}

            {/* 설명 */}
            {event.description && (
              <p className="text-xs md:text-sm text-stone-600 line-clamp-3 mb-3.5 leading-relaxed">
                {event.description}
              </p>
            )}

            {/* 태그 목록 */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {event.tags.map(t => (
                  <span
                    key={t}
                    className="text-xs bg-white border border-stone-300 px-2 py-0.5 rounded-md font-medium text-stone-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* 인터랙션 버튼 모음: 여유 있는 크기 */}
            <div className="flex flex-wrap gap-2.5 pt-3 border-t border-stone-200">
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-btn px-3.5 py-2 text-xs md:text-sm bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9] hover:bg-[#BBDEFB] flex items-center gap-1.5"
                >
                  <ExternalLink size={15} />
                  홈페이지
                </a>
              )}

              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(event.facility + ' ' + event.location)}`}
                target="_blank"
                rel="noreferrer"
                className="comic-btn px-3.5 py-2 text-xs md:text-sm bg-white text-stone-800 border-stone-300 hover:bg-stone-100 flex items-center gap-1.5"
              >
                <MapPin size={15} />
                길찾기
              </a>

              {!event.isHoliday && (
                <button
                  onClick={() => handleStamp(event.id)}
                  className={`comic-btn px-3.5 py-2 text-xs md:text-sm flex items-center gap-1.5 transition-all ${
                    isStamped
                      ? 'bg-[#E8F5E9] text-[#1B5E20] border-[#81C784] font-bold'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  <Award size={15} />
                  {isStamped ? '스탬프 완료' : '다녀왔어요!'}
                </button>
              )}

              <button
                onClick={handleShare}
                className="comic-btn px-3 py-2 text-xs md:text-sm bg-white text-stone-700 border-stone-300 hover:bg-stone-100 ml-auto"
                title="일정 공유 복사"
              >
                <Share2 size={15} />
                {copied ? '복사됨' : '공유'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3.5 border-t border-stone-200 text-center text-xs font-medium text-stone-400">
        대구·영남 문화생활 캘린더 © 2026 컬처팝
      </div>
    </aside>
  );
};
