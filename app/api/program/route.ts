import { NextRequest, NextResponse } from 'next/server';

let MOCK_PROGRAMS = [
  { no: 1,  group: '기초관리',   id: 'BS10010', name: '매장관리',            type: '화면', url: '/shop',                        useYn: true, status: '정상' },
  { no: 11, group: '시스템관리', id: 'SY10010', name: '회사정보관리',        type: '화면', url: '/company',                      useYn: true, status: '정상' },
  { no: 12, group: '시스템관리', id: 'SY10020', name: '공통코드관리',        type: '화면', url: '/common-code',                  useYn: true, status: '정상' },
  { no: 13, group: '시스템관리', id: 'SY10030', name: '프로그램정보',        type: '화면', url: '/program',                      useYn: true, status: '정상' },
  { no: 14, group: '시스템관리', id: 'SY10040', name: '메뉴관리',            type: '화면', url: '/menu',                         useYn: true, status: '정상' },
  { no: 15, group: '시스템관리', id: 'SY10050', name: '사용자관리',          type: '화면', url: '/user',                         useYn: true, status: '정상' },
  { no: 16, group: '시스템관리', id: 'SY10060', name: '권한관리',            type: '화면', url: '/permission',                   useYn: true, status: '정상' },
];

// GET /api/program?group=SY&type=S&q=
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const group = searchParams.get('group') ?? '';
  const type  = searchParams.get('type') ?? '';
  const q     = searchParams.get('q') ?? '';

  const GROUP_MAP: Record<string, string> = { SY: '시스템관리', BS: '기초관리', AT: '근태관리', ST: '현황관리' };
  const TYPE_MAP: Record<string, string>  = { S: '화면', A: 'API' };

  let result = MOCK_PROGRAMS;
  if (group) result = result.filter(r => r.group === (GROUP_MAP[group] ?? group));
  if (type)  result = result.filter(r => r.type === (TYPE_MAP[type] ?? type));
  if (q)     result = result.filter(r => r.id.includes(q) || r.name.includes(q));

  return NextResponse.json(result);
}

// POST /api/program  body: rows[]
export async function POST(request: NextRequest) {
  const rows = await request.json();
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: '저장할 데이터가 없습니다.' }, { status: 400 });
  }
  MOCK_PROGRAMS = rows;
  return NextResponse.json({ success: true });
}
