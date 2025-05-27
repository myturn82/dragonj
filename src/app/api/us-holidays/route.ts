import { NextRequest, NextResponse } from 'next/server';

// 2024년, 2025년 NYSE 휴장일 (예시)
const MANUAL_US_HOLIDAYS: Record<string, { date: string; name: string }[]> = {
  '2024': [
    { date: '2024-01-01', name: "New Year's Day" },
    { date: '2024-01-15', name: 'Martin Luther King, Jr. Day' },
    { date: '2024-02-19', name: "Washington's Birthday" },
    { date: '2024-03-29', name: 'Good Friday' },
    { date: '2024-05-27', name: 'Memorial Day' },
    { date: '2024-06-19', name: 'Juneteenth National Independence Day' },
    { date: '2024-07-04', name: 'Independence Day' },
    { date: '2024-09-02', name: 'Labor Day' },
    { date: '2024-11-28', name: 'Thanksgiving Day' },
    { date: '2024-12-25', name: 'Christmas Day' },
  ],
  '2025': [
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-01-20', name: 'Martin Luther King, Jr. Day' },
    { date: '2025-02-17', name: "Washington's Birthday" },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-05-26', name: 'Memorial Day' },
    { date: '2025-06-19', name: 'Juneteenth National Independence Day' },
    { date: '2025-07-04', name: 'Independence Day' },
    { date: '2025-09-01', name: 'Labor Day' },
    { date: '2025-11-27', name: 'Thanksgiving Day' },
    { date: '2025-12-25', name: 'Christmas Day' },
  ]
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  if (!year) {
    return NextResponse.json({ error: 'year required' }, { status: 400 });
  }
  const holidays = MANUAL_US_HOLIDAYS[year] || [];
  const data = holidays.map(h => ({
    date: h.date + 'T00:00:00.000Z',
    open: false,
    name: h.name
  }));
  return NextResponse.json(data);
} 