import type { CulturalEvent } from '../types/event';

/**
 * 대구미술관 공식 웹사이트 HTML을 분석하여 5대 진행 중 전시를 추출하는 파서
 */
export function parseDaeguArtMuseumHtml(html: string): CulturalEvent[] {
  const events: CulturalEvent[] = [];
  const regex = /<span class="item_tit">([\s\S]*?)<\/span>/gi;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(html)) !== null) {
    const titleRaw = m[1].replace(/<[^>]+>/g, '').trim();
    if (!titleRaw) continue;

    // 주변 블록 추출
    const start = Math.max(0, m.index - 700);
    const end = Math.min(html.length, m.index + 500);
    const block = html.substring(start, end);

    // 기간 추출 (YYYY-MM-DD~YYYY-MM-DD)
    const dateMatch = block.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
    const startDate = dateMatch ? dateMatch[1] : '2026-10-01';
    const endDate = dateMatch ? dateMatch[2] : '2027-02-28';

    // 장소 추출
    const placeMatch = block.match(/<em class="info_tit">장소<\/em><span>([\s\S]*?)<\/span>/i);
    const placeRaw = placeMatch ? placeMatch[1].replace(/<[^>]+>/g, '').trim() : '대구미술관';

    // 전시 ID 추출 (fnView('EHI_...'))
    const idMatch = block.match(/fnView\('([^']+)'\)/i);
    const ehiId = idMatch ? idMatch[1] : `dam-exhibit-${events.length + 1}`;

    // 이미지 추출
    const imgMatch = block.match(/<img[^>]+src=['"]([^'"]*getImage\.do[^'"]*)['"]/i);
    const posterUrl = imgMatch 
      ? `https://daeguartmuseum.or.kr${imgMatch[1]}`
      : 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop';

    // 상세 URL
    const url = idMatch 
      ? `https://daeguartmuseum.or.kr/index.do?menu_id=00000729&menu_link=/front/ehi/ehiViewFront.do&ehi_id=${idMatch[1]}`
      : 'https://daeguartmuseum.or.kr/index.do?menu_id=00000729';

    // 전시별 특화 설명 및 태그 보강
    let description = `대구미술관 ${placeRaw}에서 진행되는 공식 기획/소장품 전시입니다.`;
    let tags = ['대구미술관', placeRaw, '진행중전시'];

    if (titleRaw.includes('스테판 티데')) {
      description = '프랑스 현대미술 거장 스테판 티데(Stéphane Thidet)의 대규모 공간 설치 특별전. 물, 빛, 소리를 매개로 일상의 시공간을 시적으로 전복시키는 어미홀 맞춤형 대작전.';
      tags = ['대구미술관', '어미홀', '해외거장전', '설치미술', '스테판티데'];
    } else if (titleRaw.includes('고야')) {
      description = '스페인 낭만주의 거장 프란시스코 고야의 대표 판화 연작(로스 카프리초스, 전쟁의 참화 등) 150여 점을 통해 인간의 이성과 광기를 탐구하는 특별전.';
      tags = ['대구미술관', '6전시실', '프란시스코고야', '스페인거장', '판화걸작'];
    } else if (titleRaw.includes('고양이도 임금을')) {
      description = '"A cat may look at a king"이라는 영국 속담에서 출발하여, 누구나 예술 앞에 평등하다는 철학을 바탕으로 현대 시각예술가들의 공감과 소통을 다룬 전시.';
      tags = ['대구미술관', '교육동', '동시대미술', '현대미술'];
    } else if (titleRaw.includes('근대 회화')) {
      description = '일제강점기부터 해방 전후까지 한국 근대 서양화단의 중심지였던 대구의 예술적 유산을 이인성, 이쾌대, 서동진 등 거장들의 명작 원작으로 만나는 상설전.';
      tags = ['대구미술관', '근대미술', '이인성', '이쾌대', '상설전시'];
    } else if (titleRaw.includes('전시일정')) {
      description = '2026년 대구미술관의 연간 전시 라인업 및 기획 방향, 참여 작가 아카이브를 한눈에 조망할 수 있는 전시 프로젝트.';
      tags = ['대구미술관', '연간프로젝트', '아카이브'];
    }

    events.push({
      id: `dam-${ehiId}`,
      title: titleRaw.startsWith('《') ? titleRaw : `《${titleRaw}》`,
      category: 'exhibition',
      facility: '대구미술관',
      region: 'daegu',
      location: `대구 수성구 미술관로 40 (${placeRaw})`,
      startDate,
      endDate,
      posterUrl,
      price: '성인 1,000원 (매월 마지막 수요일 문화가있는날 무료)',
      isFree: titleRaw.includes('전시일정'),
      url,
      description,
      tags,
      notice: '💡 매주 월요일은 정기 휴관일입니다. 매월 마지막 수요일 문화가 있는 날에는 무료 관람이 가능합니다.'
    });
  }

  return events;
}

/**
 * 대구미술관 5대 공식 전시 최신 기본 데이터 (오프라인/초기 로딩용)
 */
export const DAEGU_ART_MUSEUM_OFFICIAL_5: CulturalEvent[] = [
  {
    id: 'dam-EHI_00000340',
    title: '《스테판 티데: 시간의 어긋남》',
    category: 'exhibition',
    facility: '대구미술관',
    region: 'daegu',
    location: '대구 수성구 미술관로 40 (어미홀)',
    startDate: '2026-10-20',
    endDate: '2027-02-14',
    posterUrl: 'https://daeguartmuseum.or.kr/icms/file/getImage.do?atchFileId=FILE_000000000038285UIHUEI&fileSn=0',
    price: '성인 1,000원 (문화가 있는 날 무료)',
    isFree: false,
    url: 'https://daeguartmuseum.or.kr/index.do?menu_id=00000729&menu_link=/front/ehi/ehiViewFront.do&ehi_id=EHI_00000340',
    description: '프랑스 현대미술 거장 스테판 티데(Stéphane Thidet)의 대규모 공간 설치 특별전. 물, 빛, 소리를 매개로 일상의 시공간을 시적으로 전복시키는 어미홀 맞춤형 대작전.',
    tags: ['대구미술관', '어미홀', '해외거장전', '설치미술', '스테판티데'],
    notice: '💡 매주 월요일은 정기 휴관일입니다. 거대한 수공간 설치작품의 울림을 감상해보세요.'
  },
  {
    id: 'dam-EHI_00000336',
    title: '《고야의 판화: 나는 그것을 보았다.》',
    category: 'exhibition',
    facility: '대구미술관',
    region: 'daegu',
    location: '대구 수성구 미술관로 40 (6전시실)',
    startDate: '2026-09-15',
    endDate: '2027-02-14',
    posterUrl: 'https://daeguartmuseum.or.kr/icms/file/getImage.do?atchFileId=FILE_000000000038219PKBFPX&fileSn=0',
    price: '성인 1,000원',
    isFree: false,
    url: 'https://daeguartmuseum.or.kr/index.do?menu_id=00000729&menu_link=/front/ehi/ehiViewFront.do&ehi_id=EHI_00000336',
    description: '스페인 낭만주의 거장 프란시스코 고야의 대표 판화 연작(로스 카프리초스, 전쟁의 참화 등) 150여 점을 통해 인간의 이성과 광기를 탐구하는 특별전.',
    tags: ['대구미술관', '6전시실', '프란시스코고야', '스페인거장', '판화걸작'],
    notice: '💡 고야의 희귀 오리지널 에칭 판화 작품 원본이 전시 중입니다.'
  },
  {
    id: 'dam-EHI_00000333',
    title: '《고양이도 임금을 볼 수 있다》',
    category: 'exhibition',
    facility: '대구미술관',
    region: 'daegu',
    location: '대구 수성구 미술관로 40 (교육동)',
    startDate: '2026-05-01',
    endDate: '2026-11-29',
    posterUrl: 'https://daeguartmuseum.or.kr/icms/file/getImage.do?atchFileId=FILE_000000000037803VBJKOB&fileSn=0',
    price: '성인 1,000원',
    isFree: false,
    url: 'https://daeguartmuseum.or.kr/index.do?menu_id=00000729&menu_link=/front/ehi/ehiViewFront.do&ehi_id=EHI_00000333',
    description: '"A cat may look at a king"이라는 영국 속담에서 출발하여, 누구나 예술 앞에 평등하다는 철학을 바탕으로 현대 시각예술가들의 공감과 소통을 다룬 기획전.',
    tags: ['대구미술관', '교육동', '동시대미술', '현대미술'],
    notice: '💡 누구나 쉽고 직관적으로 현대미술의 문턱을 넘을 수 있도록 구성된 전시입니다.'
  },
  {
    id: 'dam-EHI_00000331',
    title: '《2026 대구미술관 전시일정 및 아카이브 프로젝트》',
    category: 'exhibition',
    facility: '대구미술관',
    region: 'daegu',
    location: '대구 수성구 미술관로 40 (대구미술관)',
    startDate: '2026-03-17',
    endDate: '2026-12-31',
    posterUrl: 'https://daeguartmuseum.or.kr/icms/file/getImage.do?atchFileId=FILE_000000000037560TRGXEE&fileSn=0',
    price: '무료 관람',
    isFree: true,
    url: 'https://daeguartmuseum.or.kr/index.do?menu_id=00000729&menu_link=/front/ehi/ehiViewFront.do&ehi_id=EHI_00000331',
    description: '2026년 대구미술관의 연간 전시 라인업 및 기획 방향, 참여 작가 아카이브를 한눈에 조망할 수 있는 전시 프로젝트.',
    tags: ['대구미술관', '연간프로젝트', '아카이브', '무료'],
    notice: '💡 미술관 1층 로비 및 라운지에서 상시 안내 자료를 제공합니다.'
  },
  {
    id: 'dam-EHI_00000301',
    title: '《대구 근대 회화의 흐름》',
    category: 'exhibition',
    facility: '대구미술관',
    region: 'daegu',
    location: '대구 수성구 미술관로 40 (4, 5전시실)',
    startDate: '2025-01-14',
    endDate: '2028-02-29',
    posterUrl: 'https://daeguartmuseum.or.kr/icms/file/getImage.do?atchFileId=FILE_000000000035800FUBPDZ&fileSn=0',
    price: '성인 1,000원',
    isFree: false,
    url: 'https://daeguartmuseum.or.kr/index.do?menu_id=00000729&menu_link=/front/ehi/ehiViewFront.do&ehi_id=EHI_00000301',
    description: '일제강점기부터 해방 전후까지 한국 근대 서양화단의 중심지였던 대구의 예술적 유산을 이인성, 이쾌대, 서동진 등 거장들의 명작 원작으로 만나는 상설전.',
    tags: ['대구미술관', '4·5전시실', '근대미술', '이인성', '이쾌대', '상설전시'],
    notice: '💡 대구가 낳은 한국 근대미술 거장들의 진품 회화를 상시 감상할 수 있습니다.'
  }
];

/**
 * 실시간 크롤링 시도 함수
 */
export async function fetchLiveDaeguArtMuseumEvents(): Promise<CulturalEvent[] | null> {
  const targetUrl = 'https://daeguartmuseum.or.kr/index.do?menu_id=00000729';

  try {
    // 1. Electron IPC 사용 가능 시
    if (typeof window !== 'undefined' && (window as any).electronAPI?.fetchUrl) {
      const res = await (window as any).electronAPI.fetchUrl(targetUrl);
      if (res && res.status === 200 && res.data) {
        const parsed = parseDaeguArtMuseumHtml(res.data);
        if (parsed.length > 0) return parsed;
      }
    }

    // 2. 브라우저 fetch 시도
    const res = await fetch(targetUrl, { mode: 'cors' });
    if (res.ok) {
      const html = await res.text();
      const parsed = parseDaeguArtMuseumHtml(html);
      if (parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('대구미술관 실시간 웹 크롤링 중단, 공식 최신 데이터셋으로 폴백:', err);
  }

  return null;
}
