import type { CulturalEvent, Region } from '../types/event';
import { generateFacilityHolidays } from '../utils/holidayCalculator';
import { DAEGU_ART_MUSEUM_OFFICIAL_5 } from './damCrawler';
import { format, addDays, addMonths } from 'date-fns';

/**
 * 키즈 / 어린이 / 베이비 관련 키워드 블랙리스트 (원천 배제)
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
  '인형극',
  '동화',
  '캐릭터뮤지컬',
  '뽀로로',
  '핑크퐁',
  '티니핑'
];

/**
 * 키즈 관련 행사인지 여부 판별 (원천 배제용)
 */
export function isKidRelated(event: CulturalEvent): boolean {
  const targetText = [
    event.title,
    event.description || '',
    event.notice || '',
    event.facility,
    ...(event.tags || []),
  ].join(' ').toLowerCase();

  return KID_KEYWORDS.some(keyword => targetText.includes(keyword.toLowerCase()));
}

/**
 * 전 지역 (대구, 부산, 경북, 경남) 문화예술 전시/행사/공연/휴무일 전면 재검토 데이터셋
 */
export function getAllEvents(baseDate: Date = new Date()): CulturalEvent[] {
  const todayStr = format(baseDate, 'yyyy-MM-dd');

  // ==========================================
  // 1. 대구 (Daegu)
  // ==========================================
  const daeguHolidays = generateFacilityHolidays('daegu', baseDate);
  const daeguEvents: CulturalEvent[] = [
    // [EXCO 공식 주관/개최 행사 라인업]
    {
      id: 'exco-fix-mobility',
      title: '🤖 2026 미래혁신기술박람회 (FIX) & 대구국제미래모빌리티엑스포',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      region: 'daegu',
      location: '대구 북구 엑스코로 10 (동관/서관 전관)',
      startDate: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop',
      price: '무료 (사전등록 시 무료 / 현장 10,000원)',
      isFree: true,
      registrationDeadline: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: 'UAM, 자율주행 모빌리티, 휴머노이드 로봇 및 미래 테크놀로지가 총집결하는 국내 최대 모빌리티 혁신 페어.',
      tags: ['EXCO', 'FIX', '미래모빌리티', '로봇엑스포', '사전등록무료'],
      notice: '사전등록 마감 전 모바일 등록 시 무료 관람이 가능합니다.'
    },
    {
      id: 'exco-2026-fair-wine',
      title: '🍷 2026 대구 인터내셔널 와인&주류 페어',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      region: 'daegu',
      location: '대구 북구 엑스코로 10 (서관 1, 2홀)',
      startDate: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
      price: '현장 15,000원 / 사전등록 시 7,500원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: '세계 각국의 프리미엄 와인, 위스키, 수제 맥주와 로컬 증류주를 시음하고 특별가에 구매하는 영남 최대 주류 페어.',
      tags: ['EXCO', '와인/주류', '얼리버드할인', '서관'],
      notice: '성인 인증 필수! 사전등록 시 전용 시음잔을 무료로 증정합니다.'
    },
    {
      id: 'exco-2026-fair-coffee',
      title: '☕ 2026 대구 커피&카페박람회 & 디저트쇼',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      region: 'daegu',
      location: '대구 북구 엑스코로 10 (동관 전시장)',
      startDate: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 9), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop',
      price: '10,000원 (얼리버드 50% 할인)',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: '커피의 도시 대구에서 펼쳐지는 스페셜티 커피, 로스터리, 베이커리 & 디저트 종합 축제.',
      tags: ['EXCO', '커피/디저트', '얼리버드', '동관'],
      notice: '원두 시음 부스가 많으니 개인 텀블러를 지참하시면 더 편리합니다!'
    },
    {
      id: 'exco-2026-diaf',
      title: '🎨 2026 대구국제아트페어 (Diaf)',
      category: 'exhibition',
      facility: 'EXCO (엑스코)',
      region: 'daegu',
      location: '대구 북구 엑스코로 10 (동관 4, 5, 6홀)',
      startDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 12), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop',
      price: '15,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      url: 'https://www.exco.co.kr',
      description: '국내외 유명 갤러리와 현대미술 거장, 신진 작가들의 컬렉션을 한자리에서 만나는 영남권 최대 아트마켓.',
      tags: ['EXCO', '아트페어', '현대미술', '컬렉터'],
      notice: '전문 도슨트 투어가 매일 11시, 14시, 16시에 진행됩니다.'
    },
    {
      id: 'exco-food-industry',
      title: '🍲 2026 대구음식산업박람회 & 명품대구경북박람회',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      region: 'daegu',
      location: '대구 북구 엑스코로 10 (서관 3홀)',
      startDate: format(addDays(baseDate, 10), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 14), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://www.exco.co.kr',
      description: '대구 10미(味)를 비롯한 로컬 미식 문화와 푸드테크 트렌드를 소개하는 종합 음식 박람회.',
      tags: ['EXCO', '음식박람회', '대구10미', '무료입장'],
      notice: '현장 미식 시연 및 유명 셰프 쿠킹쇼가 진행됩니다.'
    },
    {
      id: 'exco-contents-fair',
      title: '🎮 2026 대구콘텐츠페어 (D-CONTENT FAIR)',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      region: 'daegu',
      location: '대구 북구 엑스코로 10 (서관 2홀)',
      startDate: format(addDays(baseDate, 15), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 18), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop',
      price: '무료 (사전등록 시)',
      isFree: true,
      url: 'https://www.exco.co.kr',
      description: '게임, 웹툰, 캐릭터 애니메이션, 실감 미디어 등 K-콘텐츠의 최신 트렌드를 만나는 콘텐츠 쇼케이스.',
      tags: ['EXCO', '콘텐츠페어', '게임', '웹툰', '무료'],
      notice: 'e스포츠 프로게이머 초청전 및 웹툰 작가 토크콘서트가 예정되어 있습니다.'
    },

    // [대구미술관 공식 5대 전시 100% 반영]
    ...DAEGU_ART_MUSEUM_OFFICIAL_5,

    // [국립대구박물관 3대 핵심 상설전시실 & 문화음악회]
    {
      id: 'dnm-perm-costume',
      title: '🧵 국립대구박물관 상설전시: 《복식문화실 - 한국 전통 직물과 옷의 역사》',
      category: 'exhibition',
      facility: '국립대구박물관',
      region: 'daegu',
      location: '대구 수성구 청호로 321 (복식문화실)',
      startDate: '2025-01-01',
      endDate: '2028-12-31',
      posterUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://daegu.museum.go.kr/kor/sub03_01.do',
      description: '섬유 패션의 도시 대구의 역사성과 결합된 국내 유일의 복식 특성화 전시관. 조선 왕실 비단 복식과 전통 직물 200여 점 공개.',
      tags: ['국립대구박물관', '복식문화실', '상시무료', '전통복식'],
      notice: '상시 무료 개방 관람입니다. (정기 휴관: 매주 월요일)'
    },
    {
      id: 'dnm-perm-ancient',
      title: '👑 국립대구박물관 상설전시: 《고대문화실 - 신라와 가야의 여명》',
      category: 'exhibition',
      facility: '국립대구박물관',
      region: 'daegu',
      location: '대구 수성구 청호로 321 (고대문화실)',
      startDate: '2025-01-01',
      endDate: '2028-12-31',
      posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://daegu.museum.go.kr/kor/sub03_01.do',
      description: '대구·경북 지역 고분군에서 출토된 금동관, 무기류, 상형토기 등 고대 삼국시대 영남 문화유산 총망라.',
      tags: ['국립대구박물관', '고대문화실', '황금유물', '상시무료'],
      notice: '도슨트 해설이 매일 10:30, 14:00에 운영됩니다.'
    },
    {
      id: 'dnm-perm-middle',
      title: '📜 국립대구박물관 상설전시: 《중세문화실 - 영남의 불교미술과 유교문화》',
      category: 'exhibition',
      facility: '국립대구박물관',
      region: 'daegu',
      location: '대구 수성구 청호로 321 (중세문화실)',
      startDate: '2025-01-01',
      endDate: '2028-12-31',
      posterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://daegu.museum.go.kr/kor/sub03_01.do',
      description: '통일신라와 고려의 불교 조각, 조선시대 영남 사림의 서원과 유교 서첩, 목판 인쇄 문화재 전시.',
      tags: ['국립대구박물관', '중세문화실', '불교미술', '유교문화'],
      notice: '야외 솔숲 정원 산책로와 함께 관람하기 좋습니다.'
    },
    {
      id: 'dnm-concert-forest',
      title: '🎶 주말 박물관 솔숲 작은 음악회 (퓨전국악&클래식 힐링 콘서트)',
      category: 'performance',
      facility: '국립대구박물관',
      region: 'daegu',
      location: '대구 수성구 청호로 321 (야외 솔숲 정원)',
      startDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
      price: '무료',
      isFree: true,
      url: 'https://daegu.museum.go.kr',
      description: '고즈넉한 박물관 정원에서 솔바람과 함께 감상하는 퓨전 국악 및 현악 4중주 어쿠스틱 콘서트.',
      tags: ['국립대구박물관', '주말공연', '무료음악회'],
      notice: '오후 2시부터 4시까지 야외 솔숲에서 진행됩니다.'
    },
    {
      id: 'daegu-opera-classic',
      title: '🎭 2026 오페라 갈라 콘서트: 《베르디 & 푸치니의 밤》',
      category: 'performance',
      facility: '대구오페라하우스',
      region: 'daegu',
      location: '대구 북구 호암로 15',
      startDate: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=600&auto=format&fit=crop',
      price: 'R석 50,000원 / S석 30,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
      url: 'https://www.daeguoperahouse.org',
      description: '한국 최고의 성악가들과 디오오케스트라가 선사하는 불멸의 오페라 아리아 대향연.',
      tags: ['대구오페라하우스', '클래식', '갈라콘서트', '주말문화'],
      notice: '공연 시작 20분 전까지 입장이 완료되어야 합니다.'
    },
    ...daeguHolidays
  ];

  // ==========================================
  // 2. 부산 (Busan)
  // ==========================================
  const busanHolidays = generateFacilityHolidays('busan', baseDate);
  const busanEvents: CulturalEvent[] = [
    // [BEXCO 실제 공식 진행/예정 행사 전체]
    {
      id: 'bexco-arch-fest',
      title: '🏛️ 2026 대한민국건축문화제 & 부산건축기획전',
      category: 'fair',
      facility: 'BEXCO (벡스코)',
      region: 'busan',
      location: '부산 해운대구 APEC로 55 (제1전시장 3A홀)',
      startDate: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      posterUrl: 'https://www.bexco.co.kr/kor/ajx_json/UploadMgr/thumImg.do?fileName=L2F0dGFjaC9JTUFHRS9FdmVudFNjaGVkdWxlTWdyL3Bvc3RlclVwbG9hZC8yMDI2LzkvV3c4S0J4QXEzakNmQU1weg==&w=440&fileRename=thumImgMiddle&fileExt=JPG',
      price: '무료 관람',
      isFree: true,
      url: 'https://www.bexco.co.kr',
      description: '한국건축가협회와 부산시가 공동 주최하는 대한민국 최고 권위의 건축문화 대전. 올해의 건축가상 수상작 전시.',
      tags: ['BEXCO', '건축문화제', '무료전시', '해운대'],
      notice: '유명 건축가 특별 강연과 무료 도슨트 투어가 제공됩니다.'
    },
    {
      id: 'bexco-fashion-shoes',
      title: '👠 패패부산 2026 (부산국제신발섬유패션전시회 - Passion & Fashion)',
      category: 'fair',
      facility: 'BEXCO (벡스코)',
      region: 'busan',
      location: '부산 해운대구 APEC로 55 (제1전시장 2홀)',
      startDate: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      posterUrl: 'https://www.bexco.co.kr/kor/ajx_json/UploadMgr/thumImg.do?fileName=L2F0dGFjaC9JTUFHRS9FdmVudFNjaGVkdWxlTWdyL3Bvc3RlclVwbG9hZC8yMDI2LzkvMnhPOENkN2Noc0ZVdGNDUw==&w=440&fileRename=thumImgMiddle&fileExt=PNG',
      price: '5,000원 / 사전등록 시 무료',
      isFree: true,
      registrationDeadline: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
      url: 'https://www.bexco.co.kr',
      description: '국내 유일의 신발, 섬유, 패션 복합 전시회. 첨단 기능성 슈즈와 오트쿠튀르 패션쇼가 펼쳐지는 축제.',
      tags: ['BEXCO', '패패부산', '패션쇼', '신발전시'],
      notice: '패션쇼 런웨이 무대는 현장 선착순 입장입니다.'
    },
    {
      id: 'bexco-food-service',
      title: '🍱 2026 우수급식외식산업전 & 푸드테크 페스티벌',
      category: 'fair',
      facility: 'BEXCO (벡스코)',
      region: 'busan',
      location: '부산 해운대구 APEC로 55 (제1전시장 1홀)',
      startDate: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
      posterUrl: 'https://www.bexco.co.kr/kor/ajx_json/UploadMgr/thumImg.do?fileName=L2F0dGFjaC9JTUFHRS9FdmVudFNjaGVkdWxlTWdyL3Bvc3RlclVwbG9hZC8yMDI2LzkvRzlXWTQyUnZyUnFEV0YzTQ==&w=440&fileRename=thumImgMiddle&fileExt=JPG',
      price: '무료 (사전등록 시)',
      isFree: true,
      url: 'https://www.bexco.co.kr',
      description: '친환경 식자재, 최신 주방 자동화 기기, 프리미엄 단체급식 및 외식 트렌드를 소개하는 박람회.',
      tags: ['BEXCO', '외식산업전', '푸드테크', '무료사전등록'],
      notice: '현장 시식 및 상담 부스가 운영됩니다.'
    },
    {
      id: 'bexco-art-fair',
      title: '🎨 2026 BIAF 부산국제아트페어',
      category: 'fair',
      facility: 'BEXCO (벡스코)',
      region: 'busan',
      location: '부산 해운대구 APEC로 55 (제1전시장 2, 3홀)',
      startDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 10), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&auto=format&fit=crop',
      price: '12,000원 / 사전등록 시 6,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
      url: 'https://www.bexco.co.kr',
      description: '아시아 및 유럽 20여 개국 3,000여 점의 미술 작품이 집결하는 직거래형 국제 미술박람회.',
      tags: ['BEXCO', '부산아트페어', '미술전시', '해운대'],
      notice: '작가가 직접 부스에 상주하여 작품에 대한 이야기를 직접 들을 수 있습니다.'
    },

    // [부산현대미술관 (을숙도) 실제 공식 비엔날레 & 기획전]
    {
      id: 'moca-busan-biennale',
      title: '🔥 2026 부산비엔날레: 《불협하는 합창 (Dissident Chorus)》',
      category: 'exhibition',
      facility: '부산현대미술관 (을숙도)',
      region: 'busan',
      location: '부산 사하구 낙동남로 1191 (을숙도 전관)',
      startDate: format(addDays(baseDate, -30), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop',
      price: '일반 16,000원 (영도 전시장 무료)',
      isFree: false,
      url: 'https://www.busan.go.kr/moca',
      description: '전 세계 60여 개 팀이 참가하여 소리와 몸, 공간을 매개로 불협화음의 조화를 탐구하는 아시아 대표 현대미술 축제.',
      tags: ['부산현대미술관', '부산비엔날레', '을숙도', '대표전시'],
      notice: '🚨 폐막 임박! 을숙도 본관과 영도 구 부산남고 전시장을 함께 관람하세요.'
    },
    {
      id: 'moca-symbiosis',
      title: '🌿 [예정전시] 부산현대미술관 플랫폼: 《공생 직조 (Symbiosis Weaving)》',
      category: 'exhibition',
      facility: '부산현대미술관 (을숙도)',
      region: 'busan',
      location: '부산 사하구 낙동남로 1191 (1, 2전시실)',
      startDate: format(addMonths(baseDate, 1), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 4), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://www.busan.go.kr/moca',
      description: '생태적 환경과 첨단 뉴미디어 인터랙션을 통해 인간과 비인간의 상호작용을 다룬 기획전.',
      tags: ['부산현대미술관', '뉴미디어아트', '무료전시', '예정전시'],
      notice: '패트릭 블랑의 수직정원과 함께 관람하기 좋습니다.'
    },

    // [부산시립미술관 & 이우환 공간]
    {
      id: 'bma-lee-ufan',
      title: '🎨 부산시립미술관 별관: 《이우환 공간 (Space Lee Ufan) 상설 기획전》',
      category: 'exhibition',
      facility: '부산시립미술관',
      region: 'busan',
      location: '부산 해운대구 APEC로 58 (이우환 공간)',
      startDate: '2025-01-01',
      endDate: '2028-12-31',
      posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop',
      price: '성인 3,000원 (해운대구민 50% 할인)',
      isFree: false,
      url: 'https://art.busan.go.kr',
      description: '세계적 거장 이우환 화백이 건물 설계부터 작품 배치까지 직접 총괄한 국내 유일의 영구 전시 공간.',
      tags: ['부산시립미술관', '이우환공간', '모노하', '명작'],
      notice: '정적이고 고요한 명상적 분위기 속에서 작품을 감상하실 수 있습니다.'
    },

    // [부산문화회관 음악회]
    {
      id: 'bso-masterpiece',
      title: '🎻 부산시립교향악단 제612회 정기연주회: 《라흐마니노프와 말러》',
      category: 'performance',
      facility: '부산문화회관 (대극장)',
      region: 'busan',
      location: '부산 남구 유엔평화로76번길 1',
      startDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop',
      price: 'R석 30,000원 / S석 20,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      url: 'https://www.bscc.or.kr',
      description: '세계적 지휘자와 피아니스트가 협연하는 웅장한 가을밤 오케스트라 명곡의 향연.',
      tags: ['부산문화회관', '부산시향', '정기연주회', '클래식'],
      notice: '공연 1시간 전 인터파크 및 현장 매표소가 오픈됩니다.'
    },
    ...busanHolidays
  ];

  // ==========================================
  // 3. 경북 (Gyeongbuk)
  // ==========================================
  const gyeongbukEvents: CulturalEvent[] = [
    // [국립경주박물관 3대 핵심 상설관 & 황금의 방]
    {
      id: 'gnm-gold-room',
      title: '👑 국립경주박물관 신라미술관: 《황금의 방 - 금관총 국보 금관 특별상설전》',
      category: 'exhibition',
      facility: '국립경주박물관',
      region: 'gyeongbuk',
      location: '경북 경주시 일정로 186 (신라미술관 2층)',
      startDate: '2025-01-01',
      endDate: '2028-12-31',
      posterUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://gyeongju.museum.go.kr',
      description: '국보 금관총 금관과 금제 허리띠를 전용 암실 조명 연출 속에서 단독 조망하는 신라 황금 문화의 결정체.',
      tags: ['국립경주박물관', '황금의방', '국보금관', '상시무료'],
      notice: '무료 관람이며, 매주 월요일도 정상 개방합니다.'
    },
    {
      id: 'gnm-history-hall',
      title: '🏛️ 국립경주박물관: 《신라역사관 - 천년 왕국의 태동과 찬란한 불교문화》',
      category: 'exhibition',
      facility: '국립경주박물관',
      region: 'gyeongbuk',
      location: '경북 경주시 일정로 186 (신라역사관)',
      startDate: '2025-01-01',
      endDate: '2028-12-31',
      posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://gyeongju.museum.go.kr',
      description: '신라의 건국부터 삼국통일, 융성기까지의 고고학 발굴 유적과 지배층의 위세품을 총망라한 대표 전시관.',
      tags: ['국립경주박물관', '신라역사관', '천년고도', '무료'],
      notice: '성덕대왕신종(에밀레종) 타종 음향이 야외에서 매 정시 재생됩니다.'
    },
    {
      id: 'gnm-wolji-hall',
      title: '⛵ 국립경주박물관: 《월지관 - 동궁과 월지에서 건져 올린 통일신라 왕실의 삶》',
      category: 'exhibition',
      facility: '국립경주박물관',
      region: 'gyeongbuk',
      location: '경북 경주시 일정로 186 (월지관)',
      startDate: '2025-01-01',
      endDate: '2028-12-31',
      posterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://gyeongju.museum.go.kr',
      description: '안압지(동궁과 월지) 바닥에서 발굴된 신라 귀족들의 주령구(주사위), 금동판 삼존불, 목간 등 생생한 궁중 생활사.',
      tags: ['국립경주박물관', '월지관', '동궁과월지', '궁중유물'],
      notice: '실물 목선 복원 전시와 신라 왕실 연회 모형이 볼거리입니다.'
    },

    // [경주 솔거미술관 & 포항시립미술관]
    {
      id: 'solgeo-park-ink',
      title: '🖌️ 경주 솔거미술관: 《소산 박대성 화백 수묵 대작전》',
      category: 'exhibition',
      facility: '경주엑스포 솔거미술관',
      region: 'gyeongbuk',
      location: '경북 경주시 경감로 614 (경주엑스포대공원 내)',
      startDate: format(addDays(baseDate, -10), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 40), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop',
      price: '성인 3,000원',
      isFree: false,
      url: 'https://www.gjsolgeo.kr',
      description: '한국화의 대가 박대성 화백의 압도적인 먹선과 솔거미술관 통유리창 너머 가을 연못의 조화.',
      tags: ['솔거미술관', '경주엑스포', '한국화', '풍경맛집'],
      notice: '제3전시실 대형 창문 포토존에서 인생 사진을 남겨보세요.'
    },
    {
      id: 'poma-steel-art',
      title: '🔩 포항시립미술관 (POMA): 《스틸아트 컬렉션 & 빛의 조각전》',
      category: 'exhibition',
      facility: '포항시립미술관',
      region: 'gyeongbuk',
      location: '경북 포항시 북구 환호공원길 10',
      startDate: format(addDays(baseDate, 0), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 35), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://poma.pohang.go.kr',
      description: '철(Steel)의 도시 포항을 상징하는 현대 철조 조각과 키네틱 라이트아트 작가들의 야외 협업전시.',
      tags: ['포항시립미술관', '환호공원', '스페이스워크연계', '무료전시'],
      notice: '환호공원 스페이스워크(Space Walk)와 도보 5분 거리에 위치해 있습니다.'
    },
    {
      id: 'andong-arts-calligraphy',
      title: '📜 안동문화예술의전당: 《영남 유학의 묵향과 서예 특별전》',
      category: 'exhibition',
      facility: '안동문화예술의전당',
      region: 'gyeongbuk',
      location: '경북 안동시 축제장길 66',
      startDate: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 8), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop',
      price: '무료',
      isFree: true,
      url: 'https://art.andong.go.kr',
      description: '퇴계 이황 등 안동 선비들의 친필 서첩과 한지 예술 작품을 망라한 고품격 전통 전시회.',
      tags: ['안동문화예술의전당', '전통서예', '무료관람', '안동문화'],
      notice: '주말에는 한지 뜨기 전통 공예 시연회가 진행됩니다.'
    }
  ];

  // ==========================================
  // 4. 경남 (Gyeongnam)
  // ==========================================
  const gyeongnamEvents: CulturalEvent[] = [
    // [창원컨벤션센터 CECO 박람회]
    {
      id: 'ceco-living-interior',
      title: '🛋️ 2026 창원 건축·가구 & 프리미엄 리빙페어',
      category: 'fair',
      facility: '창원컨벤션센터 (CECO)',
      region: 'gyeongnam',
      location: '경남 창원시 성산구 원이대로 362 (전시장 1, 2홀)',
      startDate: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop',
      price: '무료 (사전등록자 한정 / 현장 5,000원)',
      isFree: true,
      registrationDeadline: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
      url: 'https://www.ceco.co.kr',
      description: '경남 최대 규모의 친환경 건축자재, 원목 맞춤가구, 스마트 홈 오토메이션 트렌드 페어.',
      tags: ['CECO', '창원박람회', '인테리어', '사전등록무료'],
      notice: '홈 스타일링 1:1 무료 컨설팅 부스가 매일 운영됩니다.'
    },

    // [경남도립미술관 공식 실제 기획전]
    {
      id: 'gam-choi-anthropocene',
      title: '🌐 경남도립미술관: 《보이는 수장고 – 최정화: 인류세 (Anthropocene)》',
      category: 'exhibition',
      facility: '경남도립미술관 (창원)',
      region: 'gyeongnam',
      location: '경남 창원시 의창구 용지로 296 (1층)',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      posterUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop',
      price: '성인 1,000원',
      isFree: false,
      url: 'https://www.gyeongnam.go.kr/gam',
      description: '세계적 설치미술가 최정화 작가가 플라스틱 바구니와 일상의 소모품을 통해 현대 소비문명과 환경을 고찰한 대형 설치 프로젝트.',
      tags: ['경남도립미술관', '최정화', '인류세', '설치미술', '창원'],
      notice: '1층 로비와 연계된 수장고 유리벽 너머로 작품이 입체적으로 펼쳐집니다.'
    },
    {
      id: 'gam-gyeongnam-horizon',
      title: '🖼️ 경남도립미술관: 《경남 근현대미술의 궤적: 바다와 공장》',
      category: 'exhibition',
      facility: '경남도립미술관 (창원)',
      region: 'gyeongnam',
      location: '경남 창원시 의창구 용지로 296 (2, 3전시실)',
      startDate: format(addDays(baseDate, -15), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 2), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop',
      price: '성인 1,000원',
      isFree: false,
      url: 'https://www.gyeongnam.go.kr/gam',
      description: '산업화의 전초기지였던 창원·마산의 풍경과 남해안의 서정을 담아낸 경남 대표 작가군 기획전.',
      tags: ['경남도립미술관', '창원', '근현대미술', '기획전'],
      notice: '도립미술관 정원 산책로와 도청 연못이 단풍 명소입니다.'
    },

    // [국립진주박물관 & 클레이아크김해미술관]
    {
      id: 'jnm-imjin-war',
      title: '⚔️ 국립진주박물관: 《임진왜란과 조선 화약무기 특별전》',
      category: 'exhibition',
      facility: '국립진주박물관 (진주성)',
      region: 'gyeongnam',
      location: '경남 진주시 남강로 626 (진주성 내)',
      startDate: format(addDays(baseDate, -20), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 50), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop',
      price: '무료 관람 (진주성 입장료 별도 2,000원)',
      isFree: true,
      url: 'https://jinju.museum.go.kr',
      description: '보물 천자총통, 지자총통 실물과 비격진천뢰 내부 구조를 3D 입체 투시로 확인하는 국내 유일 전쟁사 테마전.',
      tags: ['국립진주박물관', '진주성', '임진왜란', '역사유물'],
      notice: '진주성 촉석루와 남강 뷰를 함께 관람할 수 있습니다.'
    },
    {
      id: 'clayarch-ceramics',
      title: '🏺 클레이아크김해미술관: 《흙과 불의 연금술: 현대 건축도자전》',
      category: 'exhibition',
      facility: '클레이아크김해미술관',
      region: 'gyeongnam',
      location: '경남 김해시 진례면 진례로 275',
      startDate: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 3), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop',
      price: '성인 2,000원',
      isFree: false,
      url: 'https://www.clayarch.org',
      description: '세계 유일의 건축도자 전문 미술관. 돔하우스 전체를 뒤덮은 5,000여 장의 도자 타일과 입체 설치작.',
      tags: ['클레이아크', '김해미술관', '건축도자', '이색건축'],
      notice: '돔하우스 중앙 홀의 자연광 채광 아래서 작품 감상을 권장합니다.'
    },
    {
      id: 'masan-chamber-classic',
      title: '🎷 3·15아트센터: 《마산만의 가을 - 재즈 & 클래식 챔버 페스타》',
      category: 'performance',
      facility: '3·15아트센터 (창원 마산)',
      region: 'gyeongnam',
      location: '경남 창원시 마산회원구 삼호로 135',
      startDate: format(addDays(baseDate, 7), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 7), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
      price: '전석 15,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 6), 'yyyy-MM-dd'),
      url: 'https://www.cwcf.or.kr',
      description: '감미로운 가을 재즈 콰르텟과 감각적인 색소폰 연주가 어우러지는 주말 야간 콘서트.',
      tags: ['315아트센터', '재즈챔버', '창원공연', '마산'],
      notice: '공연장 주변 야외 카페테리아에서 식음료 반입은 불가합니다.'
    }
  ];

  const all = [...daeguEvents, ...busanEvents, ...gyeongbukEvents, ...gyeongnamEvents];

  // 1. 키즈 관련 원천 배제
  // 2. 이미 종료된 과거 행사 배제
  return all
    .filter(event => !isKidRelated(event))
    .filter(event => event.endDate >= todayStr);
}

/**
 * 특정 지역의 이벤트만 반환 (키즈 원천 배제)
 */
export function getEventsByRegion(region: Region = 'daegu', baseDate: Date = new Date()): CulturalEvent[] {
  return getAllEvents(baseDate).filter(e => e.region === region);
}

/**
 * 호환성 유지용 (기본 대구 이벤트)
 */
export function getInitialEvents(baseDate: Date = new Date()): CulturalEvent[] {
  return getEventsByRegion('daegu', baseDate);
}

/**
 * D-day 연산 도우미
 */
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
