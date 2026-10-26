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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE500', '#FF3366', '#00E5FF', '#00E676', '#18181b'],
      });
    }
    setStampedEvents(nextStamps);
    localStorage.setItem('culture_stamps', JSON.stringify(nextStamps));
  };

  const handleShare = () => {
    if (!event) return;
    const shareText = `[컬처팝 대구] ${event.title}\n📍 ${event.facility} (${event.location})\n🗓️ 기간: ${event.startDate} ~ ${event.endDate}\n${event.url || ''}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStamped = event ? stampedEvents.includes(event.id) : false;
  const ddayInfo = event ? calculateDday(event.startDate) : null;
  const regDdayInfo = event?.registrationDeadline ? calculateDday(event.registrationDeadline) : null;

  return (
    <aside className="comic-box p-4 md:p-6 bg-white flex flex-col justify-between">
      <div>
        {/* 상단: 선택된 날짜 안내 */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
          <div>
            <span className="text-xs font-bold text-zinc-500">선택된 날짜</span>
            <h3 className="text-lg md:text-xl font-comic font-black text-black">
              {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
            </h3>
          </div>
          <span className="text-xs bg-black text-white px-2.5 py-1 rounded font-bold">
            이벤트 {dayEvents.length}개
          </span>
        </div>

        {/* 해당 날짜의 이벤트 목록 칩 */}
        {dayEvents.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dayEvents.map(e => {
              const isActive = event?.id === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => onSelectEvent(e)}
                  className={`comic-btn px-2.5 py-1 text-xs truncate max-w-[200px] ${
                    isActive
                      ? 'bg-black text-white'
                      : e.isHoliday
                      ? 'bg-[#FFEBEE] text-[#D32F2F]'
                      : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  {e.isHoliday ? '🚨 ' : ''}
                  {e.title}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center border-2 border-dashed border-zinc-300 rounded-lg my-6">
            <p className="text-sm font-bold text-zinc-400 font-comic">
              이 날짜에는 등록된 일정이 없습니다.
            </p>
            <p className="text-xs text-zinc-400 mt-1">다른 날짜를 클릭해 보세요!</p>
          </div>
        )}

        {/* 선택된 이벤트 카드 상세 */}
        {event && (
          <div className="border-3 border-black rounded-xl p-4 bg-[#FFFDE7] shadow-[4px_4px_0_0_#000] relative overflow-hidden">
            {isStamped && (
              <div className="absolute top-2 right-2 rotate-12 border-4 border-[#D50000] text-[#D50000] font-comic font-black text-sm px-3 py-1 rounded-lg uppercase tracking-wider bg-white/90 shadow-md">
                ★ 다녀왔어요! ★
              </div>
            )}

            {/* D-day 뱃지들 */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {ddayInfo && !event.isHoliday && (
                <span className="text-xs font-black font-comic bg-[#FF1744] text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0_0_#000]">
                  {ddayInfo.label}
                </span>
              )}

              {regDdayInfo && (
                <span className="text-xs font-black font-comic bg-[#00E5FF] text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0_0_#000]">
                  사전등록 {regDdayInfo.label}
                </span>
              )}

              {event.isHoliday && (
                <span className="text-xs font-black font-comic bg-[#D32F2F] text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0_0_#000] animate-pulse">
                  🚨 휴무일 주의!
                </span>
              )}

              <span className="text-xs font-bold bg-white text-black px-2 py-0.5 rounded border border-black">
                {event.facility}
              </span>
            </div>

            {/* 제목 */}
            <h4 className="text-base md:text-lg font-black font-comic text-black mb-3">
              {event.title}
            </h4>

            {/* 포스터 이미지 */}
            {event.posterUrl && !event.isHoliday && (
              <div className="mb-3 rounded-lg overflow-hidden border-2 border-black max-h-[160px] shadow-[2px_2px_0_0_#000]">
                <img
                  src={event.posterUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 상세 정보 리스트 */}
            <div className="space-y-2 text-xs md:text-sm text-zinc-800 font-medium bg-white p-3 rounded-lg border-2 border-black mb-3">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#FF3D00] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-black">장소:</strong> {event.location}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#0288D1] shrink-0" />
                <span>
                  <strong className="text-black">기간:</strong> {event.startDate} ~ {event.endDate}
                </span>
              </div>

              {event.price && (
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-[#00C853] shrink-0" />
                  <span>
                    <strong className="text-black">관람료:</strong> {event.price}
                  </span>
                </div>
              )}
            </div>

            {/* 꿀팁 / 주의사항 */}
            {event.notice && (
              <div className="p-2.5 bg-[#FFF9C4] border-2 border-black rounded-lg text-xs font-bold text-zinc-900 mb-3 flex items-start gap-2">
                {event.isHoliday ? (
                  <AlertTriangle size={16} className="text-[#D32F2F] shrink-0 mt-0.5" />
                ) : (
                  <Lightbulb size={16} className="text-[#F57F17] shrink-0 mt-0.5" />
                )}
                <span>{event.notice}</span>
              </div>
            )}

            {/* 설명 */}
            {event.description && (
              <p className="text-xs text-zinc-600 line-clamp-3 mb-3 leading-relaxed">
                {event.description}
              </p>
            )}

            {/* 태그 목록 */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {event.tags.map(t => (
                  <span
                    key={t}
                    className="text-[10px] bg-white border border-black px-1.5 py-0.5 rounded font-bold text-zinc-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* 인터랙션 버튼 모음 */}
            <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-black">
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-btn px-3 py-1.5 text-xs bg-[#00E5FF] text-black flex items-center gap-1 hover:bg-[#00B0FF]"
                >
                  <ExternalLink size={14} />
                  공식 홈페이지
                </a>
              )}

              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(event.facility + ' ' + event.location)}`}
                target="_blank"
                rel="noreferrer"
                className="comic-btn px-3 py-1.5 text-xs bg-white text-black flex items-center gap-1 hover:bg-zinc-100"
              >
                <MapPin size={14} />
                길찾기
              </a>

              {!event.isHoliday && (
                <button
                  onClick={() => handleStamp(event.id)}
                  className={`comic-btn px-3 py-1.5 text-xs flex items-center gap-1 ${
                    isStamped
                      ? 'bg-[#FF3366] text-white font-extrabold'
                      : 'bg-[#FFEA00] text-black hover:bg-yellow-300'
                  }`}
                >
                  <Award size={14} />
                  {isStamped ? '스탬프 완료!' : '다녀왔어요! 도장'}
                </button>
              )}

              <button
                onClick={handleShare}
                className="comic-btn px-2.5 py-1.5 text-xs bg-white text-black hover:bg-zinc-100 ml-auto"
                title="일정 복사하기"
              >
                <Share2 size={14} />
                {copied ? '복사됨!' : '공유'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t-2 border-black text-center text-xs font-bold text-zinc-500">
        대구·영남 문화생활 캘린더 © 2026 컬처팝
      </div>
    </aside>
  );
};
