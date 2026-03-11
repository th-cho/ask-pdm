import { NextRequest, NextResponse } from 'next/server';

let MOCK_MENU = [
  { order: 1,  group: '기초 관리',   level: '1단계', name: '기초 관리',            programId: '-',       sortOrder: 10,   useYn: true },
  { order: 2,  group: '기초 관리',   level: '2단계', name: '매장관리',             programId: 'BS10010', sortOrder: 1010, useYn: true },
  { order: 3,  group: '기초 관리',   level: '2단계', name: '공휴일관리',           programId: 'BS10020', sortOrder: 1020, useYn: true },
  { order: 4,  group: '기초 관리',   level: '2단계', name: '근무설정',     programId: 'BS10030', sortOrder: 1030, useYn: true },
  { order: 6,  group: '근태 관리',   level: '1단계', name: '근태 관리',            programId: '-',       sortOrder: 20,   useYn: true },
  { order: 9,  group: '근태 관리',   level: '2단계', name: '근태확정',             programId: 'AT10030', sortOrder: 2030, useYn: true },
  { order: 10, group: '현황 관리',   level: '1단계', name: '현황 관리',            programId: '-',       sortOrder: 30,   useYn: true },
  { order: 11, group: '현황 관리',   level: '2단계', name: '근태 현황 조회',       programId: 'ST10010', sortOrder: 3010, useYn: true },
  { order: 12, group: '시스템 관리', level: '1단계', name: '시스템 관리',          programId: '-',       sortOrder: 40,   useYn: true },
  { order: 13, group: '시스템 관리', level: '2단계', name: '회사정보관리',         programId: 'SY10010', sortOrder: 4010, useYn: true },
  { order: 14, group: '시스템 관리', level: '2단계', name: '공통코드관리',         programId: 'SY10020', sortOrder: 4020, useYn: true },
  { order: 15, group: '시스템 관리', level: '2단계', name: '프로그램정보',         programId: 'SY10030', sortOrder: 4030, useYn: true },
  { order: 16, group: '시스템 관리', level: '2단계', name: '메뉴관리',             programId: 'SY10040', sortOrder: 4040, useYn: true },
  { order: 17, group: '시스템 관리', level: '2단계', name: '사용자관리',           programId: 'SY10050', sortOrder: 4050, useYn: true },
  { order: 18, group: '시스템 관리', level: '2단계', name: '권한관리',             programId: 'SY10060', sortOrder: 4060, useYn: true },
];

const GROUP_MAP: Record<string, string> = {
  SY: '시스템 관리', BS: '기초 관리', AT: '근태 관리', ST: '현황 관리',
};

// GET /api/menu?group=SY&name=
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const group = searchParams.get('group') ?? '';
  const name  = searchParams.get('name') ?? '';

  let result = MOCK_MENU;
  if (group) result = result.filter(r => r.group === (GROUP_MAP[group] ?? group));
  if (name)  result = result.filter(r => r.name.includes(name));

  return NextResponse.json(result);
}

// POST /api/menu  body: rows[]
export async function POST(request: NextRequest) {
  const rows = await request.json();
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: '저장할 데이터가 없습니다.' }, { status: 400 });
  }
  MOCK_MENU = rows;
  return NextResponse.json({ success: true });
}
