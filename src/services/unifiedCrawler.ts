import type { CulturalEvent } from '../types/event';
import { parseDaeguArtMuseumHtml } from './damCrawler';

/**
 * BEXCO 공식 웹사이트 HTML 파서
 */
export function parseBexcoHtml(html: string): CulturalEvent[] {
  const events: CulturalEvent[] = [];
  const eventBlocks = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];

  eventBlocks.forEach((b, idx) => {
    const block = b[1];
    const titleMatch = block.match(/alt="([^"]+)"/) || block.match(/<a[^>]+class="event_title"[^>]*>([\s\S]*?)<\/a>/i);
    const dateMatch = block.match(/(\d{4}[.-]\d{2}[.-]\d{2})\s*~\s*(\d{4}[.-]\d{2}[.-]\d{2})/);
    const placeMatch = block.match(/(제\d전시장[^\n<]*|컨벤션홀[^\n<]*|오디토리움[^\n<]*)/);
    const imgMatch = block.match(/<img[^>]+src="([^">]+)"/);
    const linkMatch = block.match(/href="([^">]*EventScheduleMgr\/view\.do[^">]*)"/);

    if (titleMatch && dateMatch) {
      const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      const startDate = dateMatch[1].replace(/\./g, '-');
      const endDate = dateMatch[2].replace(/\./g, '-');
      const place = placeMatch ? placeMatch[1].replace(/&amp;/g, '&').trim() : 'BEXCO 전시장';
      const posterUrl = imgMatch ? `https://www.bexco.co.kr${imgMatch[1]}` : undefined;
      const url = linkMatch ? `https://www.bexco.co.kr${linkMatch[1]}` : 'https://www.bexco.co.kr';

      events.push({
        id: `bexco-live-${idx + 1}`,
        title: title.startsWith('202') ? title : `[BEXCO] ${title}`,
        category: title.includes('페스티벌') || title.includes('음악회') ? 'performance' : 'fair',
        facility: 'BEXCO (벡스코)',
        region: 'busan',
        location: `부산 해운대구 APEC로 55 (${place})`,
        startDate,
        endDate,
        posterUrl,
        price: '현장 문의 / 사전등록 시 무료 또는 할인',
        isFree: title.includes('잡') || title.includes('설명회'),
        url,
        description: `부산 BEXCO ${place}에서 개최되는 공식 행사입니다.`,
        tags: ['BEXCO', '부산전시', place],
        notice: '💡 입장 전 공식 홈페이지에서 사전등록 및 세부 입장 절차를 확인하세요.'
      });
    }
  });

  return events;
}

/**
 * 실시간 전 권역 크롤링 함수 (Electron IPC 활용)
 */
export async function fetchLiveRegionalEvents(): Promise<{
  damEvents?: CulturalEvent[];
  bexcoEvents?: CulturalEvent[];
}> {
  const result: { damEvents?: CulturalEvent[]; bexcoEvents?: CulturalEvent[] } = {};

  if (typeof window === 'undefined' || !(window as any).electronAPI?.fetchUrl) {
    return result;
  }

  const fetchUrl = (window as any).electronAPI.fetchUrl;

  // 1. 대구미술관 실시간 크롤링
  try {
    const damRes = await fetchUrl('https://daeguartmuseum.or.kr/index.do?menu_id=00000729');
    if (damRes && damRes.status === 200 && damRes.data) {
      const damList = parseDaeguArtMuseumHtml(damRes.data);
      if (damList.length > 0) result.damEvents = damList;
    }
  } catch (err) {
    console.warn('대구미술관 크롤링 실패:', err);
  }

  // 2. BEXCO 실시간 크롤링
  try {
    const bexcoRes = await fetchUrl('https://www.bexco.co.kr/kor/CMS/EventScheduleMgr/list.do?mCode=MN045');
    if (bexcoRes && bexcoRes.status === 200 && bexcoRes.data) {
      const bexcoList = parseBexcoHtml(bexcoRes.data);
      if (bexcoList.length > 0) result.bexcoEvents = bexcoList;
    }
  } catch (err) {
    console.warn('BEXCO 크롤링 실패:', err);
  }

  return result;
}
