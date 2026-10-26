export type EventCategory = 'exhibition' | 'festival' | 'fair' | 'performance' | 'holiday';

export interface CulturalEvent {
  id: string;
  title: string;
  category: EventCategory;
  facility: string; // '대구미술관', '국립대구박물관', 'EXCO', '코스트코 대구점', '더현대 대구' 등
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  posterUrl?: string;
  price?: string; // '무료', '10,000원' 등
  isFree?: boolean;
  isHoliday?: boolean; // 휴무/휴관일 플래그
  holidayType?: 'store_holiday' | 'museum_closed'; // 백화점/마트 휴무 vs 미술관/박물관 정기휴관
  registrationDeadline?: string; // 사전등록/얼리버드 마감일 (YYYY-MM-DD)
  url?: string;
  description?: string;
  tags?: string[];
  notice?: string; // 꿀팁/안내 메모
}

export type FacilityFilter = 'ALL' | 'EXCO' | 'MUSEUM' | 'ART' | 'SHOPPING';
