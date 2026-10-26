import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import type { CulturalEvent } from '../types/event';

function getNthDayOfMonth(year: number, monthIndex: number, dayOfWeek: number, nth: number): Date | null {
  const start = startOfMonth(new Date(year, monthIndex, 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  
  const matches = days.filter(d => getDay(d) === dayOfWeek);
  return matches[nth - 1] || null;
}

export function generateDaeguFacilityHolidays(baseDate: Date = new Date()): CulturalEvent[] {
  const holidays: CulturalEvent[] = [];
  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();

  for (let offset = 0; offset < 3; offset++) {
    const targetMonthDate = addMonths(new Date(currentYear, currentMonth, 1), offset);
    const y = targetMonthDate.getFullYear();
    const m = targetMonthDate.getMonth();
    const monthNum = m + 1;

    // 코스트코 대구점 & 대구혁신점 (대구시 조례: 매월 둘째, 넷째 주 월요일)
    const secondMonday = getNthDayOfMonth(y, m, 1, 2);
    const fourthMonday = getNthDayOfMonth(y, m, 1, 4);

    if (secondMonday) {
      const dateStr = format(secondMonday, 'yyyy-MM-dd');
      holidays.push({
        id: `costco-holiday-${dateStr}-2`,
        title: `🛒 코스트코 대구/혁신점 2째주 의무휴무`,
        category: 'holiday',
        facility: '코스트코 (대구점/혁신점)',
        location: '대구 북구 검단로 / 동구 첨단로',
        startDate: dateStr,
        endDate: dateStr,
        isHoliday: true,
        holidayType: 'store_holiday',
        description: '대구시 대형마트 의무휴업일 조례에 따라 매월 2째주 월요일은 정기 휴무입니다.',
        tags: ['코스트코', '대형마트휴무', '대구시조례'],
        notice: '인근 식자재마트나 편의시설을 이용하시거나 전날 쇼핑을 권장합니다.',
        url: 'https://www.costco.co.kr/'
      });
    }

    if (fourthMonday) {
      const dateStr = format(fourthMonday, 'yyyy-MM-dd');
      holidays.push({
        id: `costco-holiday-${dateStr}-4`,
        title: `🛒 코스트코 대구/혁신점 4째주 의무휴무`,
        category: 'holiday',
        facility: '코스트코 (대구점/혁신점)',
        location: '대구 북구 검단로 / 동구 첨단로',
        startDate: dateStr,
        endDate: dateStr,
        isHoliday: true,
        holidayType: 'store_holiday',
        description: '대구시 대형마트 의무휴업일 조례에 따라 매월 4째주 월요일은 정기 휴무입니다.',
        tags: ['코스트코', '대형마트휴무', '대구시조례'],
        notice: '방문 전 영업시간 및 휴무일을 꼭 확인하세요.',
        url: 'https://www.costco.co.kr/'
      });
    }

    // 더현대 대구 (셋째 월요일 정기휴점)
    const thirdMonday = getNthDayOfMonth(y, m, 1, 3);
    if (thirdMonday) {
      const dateStr = format(thirdMonday, 'yyyy-MM-dd');
      holidays.push({
        id: `hyundai-holiday-${dateStr}`,
        title: `🏬 더현대 대구 정기 휴점일`,
        category: 'holiday',
        facility: '더현대 대구',
        location: '대구 중구 달구벌대로 2077',
        startDate: dateStr,
        endDate: dateStr,
        isHoliday: true,
        holidayType: 'store_holiday',
        description: `${monthNum}월 더현대 대구 정기 휴점일입니다. (지하 식품관 및 식당가도 휴점)`,
        tags: ['더현대대구', '백화점휴무', '정기휴점'],
        notice: '문화센터 및 CGV 등 일부 연계 시설의 운영 여부는 사전 확인이 필요합니다.',
        url: 'https://www.ehyundai.com/newPortal/DP/DP000000_V.do?branchCd=B00140000'
      });
    }

    // 신세계백화점 대구점 (넷째 월요일 휴점)
    if (fourthMonday) {
      const dateStr = format(fourthMonday, 'yyyy-MM-dd');
      holidays.push({
        id: `shinsegae-holiday-${dateStr}`,
        title: `🏬 신세계백화점 대구점 정기 휴점일`,
        category: 'holiday',
        facility: '신세계백화점 대구점',
        location: '대구 동구 동부로 149 (동대구역)',
        startDate: dateStr,
        endDate: dateStr,
        isHoliday: true,
        holidayType: 'store_holiday',
        description: `${monthNum}월 신세계백화점 대구점 정기 휴점일입니다.`,
        tags: ['신세계대구', '백화점휴무', '동대구역'],
        notice: '동대구 복합환승센터 철도/버스는 정상 운영됩니다.',
        url: 'https://www.shinsegae.com/store/main.do?storeCd=SC00060'
      });
    }

    // 롯데백화점 대구점 (둘째 월요일 휴점)
    if (secondMonday) {
      const dateStr = format(secondMonday, 'yyyy-MM-dd');
      holidays.push({
        id: `lotte-holiday-${dateStr}`,
        title: `🏬 롯데백화점 대구점 정기 휴점일`,
        category: 'holiday',
        facility: '롯데백화점 대구점',
        location: '대구 북구 태평로 161 (대구역)',
        startDate: dateStr,
        endDate: dateStr,
        isHoliday: true,
        holidayType: 'store_holiday',
        description: `${monthNum}월 롯데백화점 대구점 정기 휴점일입니다.`,
        tags: ['롯데대구', '백화점휴무', '대구역'],
        notice: '대구역 열차 이용 및 역사 통로는 정상 개방됩니다.',
        url: 'https://www.lotteshopping.com/branch/main?siteCd=0006'
      });
    }
  }

  return holidays;
}
