import type { CulturalEvent, Region } from '../types/event';
import { generateFacilityHolidays } from '../utils/holidayCalculator';
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
 * 전 지역 (대구, 부산, 경북, 경남) 문화예술 전시/행사/공연/휴무일 데이터셋
 */
export function getAllEvents(baseDate: Date = new Date()): CulturalEvent[] {
  const todayStr = format(baseDate, 'yyyy-MM-dd');

  // 1. 대구 (Daegu)
  const daeguHolidays = generateFacilityHolidays('daegu', baseDate);
  const daeguEvents: CulturalEvent[] = [
    {
      id: 'exco-2026-fair-wine',
      title: '🍷 2026 대구 인터내셔널 와인&주류 페어',
      category: 'fair',
      facility: 'EXCO (엑스코)',
      region: 'daegu',
      location: '대구 북구 엑스코로 10 (서관 1, 2홀)',
      startDate: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
      price: '현장 15,000원 / 사전등록 시 7,500원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 1), 'yyyy-MM-dd'),
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
      id: 'dam-light-wave',
      title: '🖼️ 현대미술 특별기획전: 《빛과 형태의 파동》',
      category: 'exhibition',
      facility: '대구미술관',
      region: 'daegu',
      location: '대구 수성구 미술관로 40 (1, 2전시실)',
      startDate: format(addDays(baseDate, -10), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 40), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop',
      price: '성인 1,000원 (매월 마지막 수요일 문화가있는날 무료)',
      isFree: false,
      url: 'https://artmuseum.daegu.go.kr',
      description: '빛과 그림자, 공간의 공명을 탐구하는 국내외 현대미술 작가 6인의 대규모 설치 및 미디어아트전.',
      tags: ['대구미술관', '현대미술', '미디어아트', '포토존'],
      notice: '매주 월요일 정기 휴관입니다.'
    },
    {
      id: 'dam-modern-heritage',
      title: '🎨 소장품 기획전: 《대구 근대회화의 맥(脈)》',
      category: 'exhibition',
      facility: '대구미술관',
      region: 'daegu',
      location: '대구 수성구 미술관로 40 (3전시실)',
      startDate: format(addDays(baseDate, -20), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 2), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=600&auto=format&fit=crop',
      price: '성인 1,000원',
      isFree: false,
      url: 'https://artmuseum.daegu.go.kr',
      description: '이인성, 이쾌대 등 한국 근대 서양화단을 이끈 대구 출신 거장들의 원작을 집중 조명하는 상설 기획전.',
      tags: ['대구미술관', '근대미술', '이인성', '명작'],
      notice: '야외 조각공원 산책로와 함께 관람하기 좋습니다.'
    },
    {
      id: 'dnm-gold-costume',
      title: '👑 특별전: 《황금빛 영남, 가야와 신라의 복식 문화》',
      category: 'exhibition',
      facility: '국립대구박물관',
      region: 'daegu',
      location: '대구 수성구 청호로 321 (기획전시실)',
      startDate: format(addDays(baseDate, -5), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 50), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://daegu.museum.go.kr',
      description: '국립대구박물관의 복식문화 특성화 테마전. 고대 왕실의 금제 장신구와 비단 직물 복원품 150여 점 공개.',
      tags: ['국립대구박물관', '상시무료', '황금유물', '고대역사'],
      notice: '상시 무료 입장이며, 매주 월요일 정기 휴관입니다.'
    },
    {
      id: 'dnm-concert-forest',
      title: '🎶 주말 박물관 숲속 작은 음악회 (퓨전국악&클래식)',
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
      description: '주말 오후 고즈넉한 박물관 정원에서 펼쳐지는 퓨전 국악 및 현악 4중주 어쿠스틱 콘서트.',
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

  // 2. 부산 (Busan)
  const busanHolidays = generateFacilityHolidays('busan', baseDate);
  const busanEvents: CulturalEvent[] = [
    {
      id: 'bexco-art-fair',
      title: '🎨 2026 BIAF 부산국제아트페어',
      category: 'fair',
      facility: 'BEXCO (벡스코)',
      region: 'busan',
      location: '부산 해운대구 APEC로 55 (제1전시장 2, 3홀)',
      startDate: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 7), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&auto=format&fit=crop',
      price: '12,000원 / 사전등록 시 6,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 2), 'yyyy-MM-dd'),
      url: 'https://www.bexco.co.kr',
      description: '아시아 및 유럽 20여 개국 3,000여 점의 미술 작품이 집결하는 직거래형 국제 미술박람회.',
      tags: ['BEXCO', '부산아트페어', '미술전시', '해운대'],
      notice: '작가가 직접 부스에 상주하여 작품에 대한 이야기를 직접 들을 수 있습니다.'
    },
    {
      id: 'bexco-food-beverage',
      title: '🍷 2026 부산 커피&디저트 & 와인 페어',
      category: 'fair',
      facility: 'BEXCO (벡스코)',
      region: 'busan',
      location: '부산 해운대구 APEC로 55 (제2전시장)',
      startDate: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 9), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop',
      price: '무료 (사전등록 시)',
      isFree: true,
      registrationDeadline: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
      url: 'https://www.bexco.co.kr',
      description: '부산/경남 바리스타 챔피언십과 오가닉 베이커리, 내추럴 와인 시음회가 열리는 미식 축제.',
      tags: ['BEXCO', '부산커피페어', '와인시음', '무료사전등록'],
      notice: '사전등록 마감 전 모바일 등록을 완료해야 무료 입장이 가능합니다.'
    },
    {
      id: 'bma-ocean-horizon',
      title: '🌊 부산시립미술관 리노베이션 특별전: 《바다 너머의 지평》',
      category: 'exhibition',
      facility: '부산시립미술관',
      region: 'busan',
      location: '부산 해운대구 APEC로 58',
      startDate: format(addDays(baseDate, -15), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 45), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://art.busan.go.kr',
      description: '해양 수도 부산의 역사적 정체성과 현대 미디어 테크놀로지가 결합된 초대형 융복합 기획전시.',
      tags: ['부산시립미술관', '해운대', '무료전시', '이우환공간연계'],
      notice: '별관 <이우환 공간>도 함께 무료 관람하실 수 있습니다. (매주 월요일 휴관)'
    },
    {
      id: 'moca-nature-tech',
      title: '🌿 부산현대미술관: 《자연과 기계의 공존 미디어전》',
      category: 'exhibition',
      facility: '부산현대미술관 (을숙도)',
      region: 'busan',
      location: '부산 사하구 낙동남로 1191 (을숙도)',
      startDate: format(addDays(baseDate, -5), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 2), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://www.busan.go.kr/moca',
      description: '철새도래지 을숙도의 생태적 환경을 모티브로 사운드아트와 키네틱 인스톨레이션을 선보이는 대표전.',
      tags: ['부산현대미술관', '을숙도', '생태미디어아트', '무료관람'],
      notice: '야외 패트릭 블랑의 수직정원(벽면녹화)을 배경으로 사진 촬영을 추천합니다.'
    },
    {
      id: 'bnm-maritime-history',
      title: '⚓ 국립부산박물관: 《동아시아 해양 실크로드와 가야의 보물》',
      category: 'exhibition',
      facility: '국립부산박물관',
      region: 'busan',
      location: '부산 남구 유엔평화로 63',
      startDate: format(addDays(baseDate, -20), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 60), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://museum.busan.go.kr',
      description: '고대 동북아 무역의 허브였던 부산만의 해양 역사와 발굴 유물들을 집중 조명하는 상설 특별전.',
      tags: ['국립부산박물관', '유엔기념공원인근', '무료관람', '해양역사'],
      notice: '인근 유엔기념공원 산책 코스와 함께 방문하기 좋습니다.'
    },
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

  // 3. 경북 (Gyeongbuk)
  const gyeongbukEvents: CulturalEvent[] = [
    {
      id: 'gnm-gyeongju-gold',
      title: '👑 국립경주박물관: 《천년의 빛, 신라 금관과 황금보검 특별조명전》',
      category: 'exhibition',
      facility: '국립경주박물관',
      region: 'gyeongbuk',
      location: '경북 경주시 일정로 186 (특별전시관)',
      startDate: format(addDays(baseDate, -15), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 2), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop',
      price: '무료 관람',
      isFree: true,
      url: 'https://gyeongju.museum.go.kr',
      description: '신라 능묘에서 출토된 국보급 순금 유물들과 금관총 보검을 고해상도 디지털 미디어와 함께 감상하는 명품전.',
      tags: ['국립경주박물관', '신라금관', '국보', '경주무료관람'],
      notice: '성덕대왕신종(에밀레종) 타종 음향 힐링 체험이 매 정시 진행됩니다.'
    },
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
    },
    {
      id: 'gumi-spring-classic',
      title: '🎼 구미문화예술회관: 《가을밤의 명품 클래식 실내악 축제》',
      category: 'performance',
      facility: '구미문화예술회관',
      region: 'gyeongbuk',
      location: '경북 구미시 송정대로 89',
      startDate: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
      endDate: format(addDays(baseDate, 4), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop',
      price: '전석 20,000원',
      isFree: false,
      registrationDeadline: format(addDays(baseDate, 3), 'yyyy-MM-dd'),
      url: 'https://www.gumi.go.kr/arts',
      description: '국내 최정상급 첼리스트와 바이올리니스트가 선사하는 슈베르트 피아노 5중주 송어 전악장 연주.',
      tags: ['구미문화예술회관', '실내악', '슈베르트', '클래식'],
      notice: '공연 인터미션 시 로비에서 연주자 사인회가 진행됩니다.'
    }
  ];

  // 4. 경남 (Gyeongnam)
  const gyeongnamEvents: CulturalEvent[] = [
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
    {
      id: 'gam-gyeongnam-horizon',
      title: '🖼️ 경남도립미술관: 《경남 근현대미술의 궤적: 바다와 공장》',
      category: 'exhibition',
      facility: '경남도립미술관 (창원)',
      region: 'gyeongnam',
      location: '경남 창원시 의창구 용지로 296',
      startDate: format(addDays(baseDate, -15), 'yyyy-MM-dd'),
      endDate: format(addMonths(baseDate, 2), 'yyyy-MM-dd'),
      posterUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop',
      price: '성인 1,000원',
      isFree: false,
      url: 'https://www.gyeongnam.go.kr/gam',
      description: '산업화의 전초기지였던 창원·마산의 풍경과 남해안의 서정을 담아낸 경남 대표 작가군 기획전.',
      tags: ['경남도립미술관', '창원', '근현대미술', '기획전'],
      notice: '도립미술관 정원 산책로와 도청 연못이 단풍 명소입니다.'
    },
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
