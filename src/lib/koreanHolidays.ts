// 대한민국 공휴일 정보를 Nager.Date API에서 연도별로 fetch하는 함수
export const MANUAL_KR_HOLIDAYS = [
  { date: '2025-06-03', name: '대통령 선거일' },
  // 필요시 추가
];

export async function fetchKoreanHolidays(year: number): Promise<{ date: string; name: string }[]> {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/KR`);
  if (!res.ok) throw new Error('공휴일 API 오류');
  const data = await res.json();
  // Nager.Date API의 localName을 name으로 변환
  const apiHolidays = data.map((h: any) => ({ date: h.date, name: h.localName }));
  // 수동 공휴일 병합 (해당 연도만)
  const manual = MANUAL_KR_HOLIDAYS.filter(h => h.date.startsWith(`${year}-`));
  return [...apiHolidays, ...manual];
}

