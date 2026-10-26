import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import type { CulturalEvent, Region } from '../types/event';

function getNthDayOfMonth(year: number, monthIndex: number, dayOfWeek: number, nth: number): Date | null {
  const start = startOfMonth(new Date(year, monthIndex, 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  
  const matches = days.filter(d => getDay(d) === dayOfWeek);
  return matches[nth - 1] || null;
}

/**
 * 대구/부산/경북/경남 주요 쇼핑몰/백화점 휴무일 자동 계산
 */
export function generateFacilityHolidays(region: Region = 'daegu', baseDate: Date = new Date()): CulturalEvent[] {
  const holidays: CulturalEvent[] = [];
  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();
  const todayStr = format(baseDate, 'yyyy-MM-dd');

  for (let offset = 0; offset < 3; offset++) {
    const targetMonthDate = addMonths(new Date(currentYear, currentMonth, 1), offset);
    const y = targetMonthDate.getFullYear();
    const m = targetMonthDate.getMonth();
    const monthNum = m + 1;

    // 대구 지역
    if (region === 'daegu') {
      const secondMonday = getNthDayOfMonth(y, m, 1, 2);
      const thirdMonday = getNthDayOfMonth(y, m, 1, 3);
      const fourthMonday = getNthDayOfMonth(y, m, 1, 4);

      if (secondMonday) {
        const dateStr = format(secondMonday, 'yyyy-MM-dd');
        if (dateStr >= todayStr) {
          holidays.push({
            id: `costco-holiday-${dateStr}-2`,
            title: `🛒 코스트코 대구/혁신점 2째주 의무휴무`,
            category: 'holiday',
            facility: '코스트코 (대구/혁신)',
            region: 'daegu',
            location: '대구 북구 검단로 / 동구 첨단로',
            startDate: dateStr,
            endDate: dateStr,
            isHoliday: true,
            holidayType: 'store_holiday',
            description: '대구시 대형마트 의무휴업일 조례에 따라 매월 2째주 월요일은 정기 휴무입니다.',
            tags: ['코스트코', '대형마트휴무', '대구시조례'],
            notice: '인근 식자재마트를 이용하시거나 사전 장보기를 권장합니다.',
            url: 'https://www.costco.co.kr/'
          });
          holidays.push({
            id: `lotte-holiday-${dateStr}`,
            title: `🏬 롯데백화점 대구점 정기 휴점일`,
            category: 'holiday',
            facility: '롯데백화점 대구점',
            region: 'daegu',
            location: '대구 북구 태평로 161 (대구역)',
            startDate: dateStr,
            endDate: dateStr,
            isHoliday: true,
            holidayType: 'store_holiday',
            description: `${monthNum}월 롯데백화점 대구점 정기 휴점일입니다.`,
            tags: ['롯데대구', '백화점휴무', '대구역'],
            notice: '대구역 열차 이용 및 역사 통로는 정상 개방됩니다.',
            url: 'https://www.lotteshopping.com/'
          });
        }
      }

      if (thirdMonday) {
        const dateStr = format(thirdMonday, 'yyyy-MM-dd');
        if (dateStr >= todayStr) {
          holidays.push({
            id: `hyundai-holiday-${dateStr}`,
            title: `🏬 더현대 대구 정기 휴점일`,
            category: 'holiday',
            facility: '더현대 대구',
            region: 'daegu',
            location: '대구 중구 달구벌대로 2077',
            startDate: dateStr,
            endDate: dateStr,
            isHoliday: true,
            holidayType: 'store_holiday',
            description: `${monthNum}월 더현대 대구 정기 휴점일입니다.`,
            tags: ['더현대대구', '백화점휴무', '정기휴점'],
            notice: '지하 식품관 및 식당가도 휴점합니다.',
            url: 'https://www.ehyundai.com/'
          });
        }
      }

      if (fourthMonday) {
        const dateStr = format(fourthMonday, 'yyyy-MM-dd');
        if (dateStr >= todayStr) {
          holidays.push({
            id: `costco-holiday-${dateStr}-4`,
            title: `🛒 코스트코 대구/혁신점 4째주 의무휴무`,
            category: 'holiday',
            facility: '코스트코 (대구/혁신)',
            region: 'daegu',
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
          holidays.push({
            id: `shinsegae-holiday-${dateStr}`,
            title: `🏬 신세계백화점 대구점 정기 휴점일`,
            category: 'holiday',
            facility: '신세계백화점 대구점',
            region: 'daegu',
            location: '대구 동구 동부로 149 (동대구역)',
            startDate: dateStr,
            endDate: dateStr,
            isHoliday: true,
            holidayType: 'store_holiday',
            description: `${monthNum}월 신세계백화점 대구점 정기 휴점일입니다.`,
            tags: ['신세계대구', '백화점휴무', '동대구역'],
            notice: '동대구 복합환승센터 철도/버스는 정상 운영됩니다.',
            url: 'https://www.shinsegae.com/'
          });
        }
      }
    }

    // 부산 지역
    if (region === 'busan') {
      const secondSunday = getNthDayOfMonth(y, m, 0, 2);
      const fourthSunday = getNthDayOfMonth(y, m, 0, 4);
      const thirdMonday = getNthDayOfMonth(y, m, 1, 3);

      if (secondSunday) {
        const dateStr = format(secondSunday, 'yyyy-MM-dd');
        if (dateStr >= todayStr) {
          holidays.push({
            id: `busan-costco-holiday-${dateStr}-2`,
            title: `🛒 코스트코 부산점(수영구) 정기휴무`,
            category: 'holiday',
            facility: '코스트코 (부산점)',
            region: 'busan',
            location: '부산 수영구 구락로 137',
            startDate: dateStr,
            endDate: dateStr,
            isHoliday: true,
            holidayType: 'store_holiday',
            description: '부산지역 대형마트 의무휴업일(둘째 일요일) 정기 휴무입니다.',
            tags: ['코스트코부산', '대형마트휴무'],
            notice: '주말 방문 시 휴무일을 확인하세요.',
            url: 'https://www.costco.co.kr/'
          });
        }
      }

      if (fourthSunday) {
        const dateStr = format(fourthSunday, 'yyyy-MM-dd');
        if (dateStr >= todayStr) {
          holidays.push({
            id: `busan-costco-holiday-${dateStr}-4`,
            title: `🛒 코스트코 부산점(수영구) 정기휴무`,
            category: 'holiday',
            facility: '코스트코 (부산점)',
            region: 'busan',
            location: '부산 수영구 구락로 137',
            startDate: dateStr,
            endDate: dateStr,
            isHoliday: true,
            holidayType: 'store_holiday',
            description: '부산지역 대형마트 의무휴업일(넷째 일요일) 정기 휴무입니다.',
            tags: ['코스트코부산', '대형마트휴무'],
            notice: '주말 방문 시 휴무일을 확인하세요.',
            url: 'https://www.costco.co.kr/'
          });
        }
      }

      if (thirdMonday) {
        const dateStr = format(thirdMonday, 'yyyy-MM-dd');
        if (dateStr >= todayStr) {
          holidays.push({
            id: `centum-holiday-${dateStr}`,
            title: `🏬 신세계 센텀시티점 정기 휴점일`,
            category: 'holiday',
            facility: '신세계백화점 센텀시티점',
            region: 'busan',
            location: '부산 해운대구 센텀남대로 35',
            startDate: dateStr,
            endDate: dateStr,
            isHoliday: true,
            holidayType: 'store_holiday',
            description: `${monthNum}월 신세계 센텀시티 백화점 정기 휴점일입니다. (몰/스파랜드 별도 운영)`,
            tags: ['신세계센텀', '백화점휴무', '해운대'],
            notice: '센텀시티몰 식당가나 영화관 일부는 정상 운영될 수 있습니다.',
            url: 'https://www.shinsegae.com/'
          });
        }
      }
    }
  }

  return holidays;
}
