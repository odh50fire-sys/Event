import type { CulturalEvent } from '../types/event';
import { generateDaeguFacilityHolidays } from '../utils/holidayCalculator';
import { format, addDays, addMonths, startOfMonth } from 'date-fns';

/**
 * 키즈 / 어린이 / 베이비 관련 키워드 블랙리스트
 */
const KID_KEYWORDS = [
  '키즈',
  'kids',
  '베이비',
  'baby',
  '어린이',
  '유아',
  '아동',
  '육아',
  '영유아',
  '초등',
  '유치원',
  '돌잔치',
  '임신',
  '출산',
  '아이와',
  '아이들',
  '맘앤',
  '모유',
];

/**
 * 키즈 관련 행사인지 여부 판별 (원천 배제용)
 */
export function isKidRelated(event: CulturalEvent): boolean {
  const targetText = [
    event.title,
    event.description || '',
    event.notice || '',
    ...(event.tags || []),
  ].join(' ').toLowerCase();

  return KID_KEYWORDS.some(keyword => targetText.includes(keyword.toLowerCase()));
}

/**
 * 대구 3대 문화시설(EXCO, 대구미술관, 국립대구박물관)의 3개월 롤링 전시/행사 데이터셋
 * (키즈 관련 항목 전면 제외)
 */
export function getInitialEvents(baseDate: Date = new Date()): CulturalEvent[] {
  // 1. 쇼핑몰/백화점 휴무일 가져오기
  const holidayEvents = generateDaeguFacilityHolidays(baseDate);

  // 2. EXCO (엑스코) 박람회 / 페어 / 컨벤션 데이터 (성인/라이프스타일/문화예술 중심)
  const excoEvents: CulturalEvent[] = [
    {
      id: 'exco-2026-fair-wine',
      title: '🍷 2026 대구 인터내셔널 와인&주류 페어 (Wine & Spirits Daegu)',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      location: '대구 북구 엑스코로 10 (서관 1, 2홀)',
      startDate: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 7), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
      price: '현장 15,000원 / 사전등록 시 50% 할인 (7,500원)',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: '세계 각국의 프리미엄 와인, 위스키, 수제 맥주와 로컬 증류주를 시음하고 특별가에 구매하는 영남 최대 주류 페어.',
      tags: ['EXCO', '와인/주류', '얼리버드할인', '서관', '미식/라이프'],
      notice: '🚨 성인 인증 필수! 사전등록 마감 시 현장 할인 혜택이 종료되니 미리 등록하세요. (전용 시음잔 증정)'
    },
    {
      id: 'exco-2026-fair-2',
      title: '☕ 2026 대구 커피&카페박람회 & 디저트쇼',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      location: '대구 북구 엑스코로 10 (동관 전시장)',
      startDate: format(addDays(baseDate, 12), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 15), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop',
      price: '10,000원 (얼리버드 50% 할인)',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 10), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: '커피의 도시 대구에서 펼쳐지는 스페셜티 커피, 로스터리, 베이커리 & 디저트 종합 축제.',
      tags: ['EXCO', '커피/디저트', '얼리버드', '동관', '주말데이트'],
      notice: '원두 시음 부스가 많으니 개인 텀블러를 지참하시면 더 편리합니다!'
    },
    {
      id: 'exco-2026-fair-3',
      title: '🎨 2026 대구아트페어 (Diaf - Daegu International Art Fair)',
      category: 'exhibition',
      facility: 'EXCO (엑스코)',
      location: '대구 북구 엑스코로 10 (동관 4, 5, 6홀)',
      startDate: format(addDays(baseDate, 22), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 26), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop',
      price: '15,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 18), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: '국내외 유명 갤러리와 현대미술 거장, 신진 작가들의 컬렉션을 한자리에서 만나는 영남권 최대 아트마켓.',
      tags: ['EXCO', '아트페어', '현대미술', '컬렉터', '특별전'],
      notice: '도슨트 투어 프로그램이 매일 11시, 14시, 16시에 진행됩니다.'
    },
    {
      id: 'exco-2026-fair-living',
      title: '🛋️ 2026 대구 건축·인테리어 & 프리미엄 리빙디자인페어',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      location: '대구 북구 엑스코로 10 (서관 3홀)',
      startDate: format(addMonths(baseDate, 1), 'yyyy-MM-dd'),
      endDate: format(addDays(addMonths(baseDate, 1), 3), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop',
      price: '무료 (사전등록 시 무료 / 현장 10,000원)',
      isFree: true,
      registrationDeadline: format(addDays(addMonths(baseDate, 1), -3), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: '친환경 건축자재, 맞춤형 가구, 명품 주방 및 조명, 감성 홈스타일링 트렌드를 제시하는 프리미엄 리빙쇼.',
      tags: ['EXCO', '인테리어', '홈리빙', '가구', '사전등록무료'],
      notice: '인테리어 1:1 무료 상담 부스가 운영됩니다.'
    },
    {
      id: 'exco-2026-fair-5',
      title: '🤖 2026 대구 미래모빌리티 & 로봇 엑스포 (FIX)',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      location: '대구 북구 엑스코로 10 (동관/서관 전관)',
      startDate: format(addMonths(baseDate, 2), 'yyyy-MM-dd'),
      endDate: format(addDays(addMonths(baseDate, 2), 4), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop',
      price: '무료 (사전등록 필수)',
      isFree: true,
      registrationDeadline: format(addDays(addMonths(baseDate, 2), -1), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: 'UAM, 자율주행, 휴머노이드 로봇, 첨단 미래 기술의 향연.',
      tags: ['EXCO', '모빌리티', '로봇', '무료관람', '테크'],
      notice: '시승 체험 및 전시 부스는 사전 예약제입니다.'
    }
  ];

  // 3. 대구미술관 (Daegu Art Museum) 전시 데이터
  const museumArtEvents: CulturalEvent[] = [
    {
      id: 'dam-exhibit-1',
      title: '🖼️ 현대미술 특별기획전: 《빛과 형태의 파동》',
      category: 'exhibition',
      facility: '대구미술관',
      location: '대구 수성구 미술관로 40 (1, 2전시실)',
      startDate: format(addDays(baseDate, -15), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 45), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop',
      price: '성인 1,000원 (매월 마지막주 수요일 무료)',
      isFree: false,
      url: 'https://artmuseum.daegu.go.kr',
      description: '빛과 그림자, 공간의 공명을 탐구하는 국내외 현대미술 작가 6인의 대규모 설치 및 미디어아트전.',
      tags: ['대구미술관', '현대미술', '미디어아트', '문화가있는날무료', '포토스팟'],
      notice: '💡 매월 마지막 수요일 \'문화가 있는 날\'에는 모든 관람객 무료 입장입니다! (정기 휴관: 매주 월요일)'
    },
    {
      id: 'dam-exhibit-2',
      title: '🎨 소장품 하이라이트전: 《대구 근대회화의 맥(脈)》',
      category: 'exhibition',
      facility: '대구미술관',
      location: '대구 수성구 미술관로 40 (3전시실)',
      startDate: format(addDays(baseDate, -30), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 2), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=600&auto=format&fit=crop',
      price: '성인 1,000원',
      isFree: false,
      url: 'https://artmuseum.daegu.go.kr',
      description: '이인성, 이쾌대 등 한국 근대 서양화단을 이끈 대구 출신 거장들의 원작을 집중 조명하는 상설 기획전.',
      tags: ['대구미술관', '근대미술', '이인성', '명작', '추천전시'],
      notice: '미술관 내 북카페와 야외 조각공원이 산책하기 좋습니다.'
    },
    {
      id: 'dam-exhibit-3',
      title: '🌟 [예정전시] 차세대 청년작가전: 《Next Code 2026》',
      category: 'exhibition',
      facility: '대구미술관',
      location: '대구 수성구 미술관로 40 (4, 5전시실)',
      startDate: format(addDays(baseDate, 18), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 3), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&auto=format&fit=crop',
      price: '성인 1,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 17), 'yyyy-MM-dd'),
      url: 'https://artmuseum.daegu.go.kr',
      description: '대구/경북을 기반으로 독창적인 세계관을 펼치는 청년 작가들의 실험적 회화와 조각전.',
      tags: ['대구미술관', '청년작가', '개막임박', '신진작가', '기획전'],
      notice: '개막 당일 작가와의 대화(아티스트 토크)가 예정되어 있습니다.'
    }
  ];

  // 4. 국립대구박물관 (Daegu National Museum)
  const nationalMuseumEvents: CulturalEvent[] = [
    {
      id: 'dnm-exhibit-1',
      title: '👑 특별전: 《황금빛 영남, 가야와 신라의 복식 문화》',
      category: 'exhibition',
      facility: '국립대구박물관',
      location: '대구 수성구 청호로 321 (기획전시실)',
      startDate: format(addDays(baseDate, -5), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 55), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://daegu.museum.go.kr',
      description: '국립대구박물관의 복식문화 특성화 테마전. 고대 왕실의 금제 장신구와 비단 직물 복원품 150여 점 공개.',
      tags: ['국립대구박물관', '상시무료', '황금유물', '수성구', '고대역사'],
      notice: '무료 관람이며, 매주 월요일 정기 휴관입니다.'
    },
    {
      id: 'dnm-culture-2',
      title: '🎶 주말 박물관 숲속 작은 음악회 (클래식 & 퓨전국악 힐링 콘서트)',
      category: 'performance',
      facility: '국립대구박물관',
      location: '대구 수성구 청호로 321 (야외 솔숲 정원)',
      startDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
      price: '무료',
      isFree: true,
      url: 'https://daegu.museum.go.kr',
      description: '주말 오후 고즈넉한 박물관 정원에서 펼쳐지는 퓨전 국악 및 현악 4중주 어쿠스틱 콘서트.',
      tags: ['국립대구박물관', '주말공연', '무료행사', '힐링음악회', '솔숲정원'],
      notice: '오후 2시부터 4시까지 야외 마당에서 진행됩니다. 우천 시 지하 대강당으로 변경.'
    },
    {
      id: 'dnm-exhibit-3',
      title: '🧵 상설전시: 《실과 바늘로 엮은 역사 - 한국 전통직물관》',
      category: 'exhibition',
      facility: '국립대구박물관',
      location: '대구 수성구 청호로 321 (직물문화실)',
      startDate: format(startOfMonth(baseDate), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 6), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://daegu.museum.go.kr',
      description: '섬유 패션의 도시 대구의 역사성과 결합된 국립대구박물관의 대표 상설 전시관.',
      tags: ['국립대구박물관', '상설전시', '무료', '직물역사'],
      notice: '상시 무료 개방 관람입니다.'
    }
  ];

  const allEvents = [...excoEvents, ...museumArtEvents, ...nationalMuseumEvents, ...holidayEvents];

  // 키즈 관련 항목 원천 필터링 (완전 제외)
  return allEvents.filter(event => !isKidRelated(event));
}

export function calculateDday(targetDateStr: string, baseDate: Date = new Date()): { label: string; daysDiff: number; isUrgent: boolean } {
  const [y, m, d] = targetDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const current = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

  const diffTime = target.getTime() - current.getTime();
  const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    return { label: 'D-DAY!', daysDiff: 0, isUrgent: true };
  } else if (daysDiff > 0) {
    return { label: `D-${daysDiff}`, daysDiff, isUrgent: daysDiff <= 3 };
  } else {
    return { label: `D+${Math.abs(daysDiff)}`, daysDiff, isUrgent: false };
  }
}
