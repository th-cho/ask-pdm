import { NextRequest, NextResponse } from 'next/server';

const MOCK_STYLES = [
  { id: 1,  styleCode: 'S251010HJK01', brand: 'SALOMON', season: '25SS' },
  { id: 2,  styleCode: 'S252020HPT01', brand: 'SALOMON', season: '25SS' },
  { id: 3,  styleCode: 'S251010HJA01', brand: 'SALOMON', season: '25SS' },
  { id: 4,  styleCode: 'S252010HJA02', brand: 'SALOMON', season: '25FW' },
  { id: 5,  styleCode: 'S251010HPT01', brand: 'SALOMON', season: '25FW' },
  { id: 6,  styleCode: 'S252010HJK02', brand: 'SALOMON', season: '25SS' },
];

export async function GET(req: NextRequest) {
  const style = req.nextUrl.searchParams.get('style') ?? '';
  let list = [...MOCK_STYLES];
  if (style) list = list.filter(r => r.styleCode.includes(style));
  return NextResponse.json(list);
}
