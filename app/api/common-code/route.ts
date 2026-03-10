import { NextRequest, NextResponse } from 'next/server';

const MASTER = [
  { groupCode: 'SY001', groupName: '직급구분' },
  { groupCode: 'SY002', groupName: '근태유형' },
  { groupCode: 'SY003', groupName: '휴가구분' },
  { groupCode: 'SY004', groupName: '매장지역' },
  { groupCode: 'SY005', groupName: '공휴일구분' },
];

let DETAIL_MAP: Record<string, { code: string; name: string; useYn: boolean }[]> = {
  SY001: [
    { code: '10', name: '점포관리자', useYn: true },
    { code: '20', name: '매니저',     useYn: true },
    { code: '30', name: '캡틴',       useYn: true },
    { code: '40', name: '크루',       useYn: true },
  ],
  SY002: [
    { code: '10', name: '정근',     useYn: true },
    { code: '20', name: '연장',     useYn: true },
    { code: '30', name: '심야',     useYn: true },
    { code: '40', name: '휴일근무', useYn: true },
  ],
  SY003: [
    { code: '10', name: '연차',   useYn: true },
    { code: '20', name: '반차',   useYn: true },
    { code: '30', name: '반반차', useYn: true },
  ],
  SY004: [
    { code: '10', name: '서울', useYn: true },
    { code: '20', name: '부산', useYn: true },
  ],
  SY005: [
    { code: '10', name: '법정공휴일', useYn: true },
    { code: '20', name: '대체공휴일', useYn: true },
  ],
};

// GET /api/common-code?type=master&q=
//     /api/common-code?groupCode=SY001
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type      = searchParams.get('type') ?? '';
  const q         = searchParams.get('q') ?? '';
  const groupCode = searchParams.get('groupCode') ?? '';

  if (groupCode) {
    return NextResponse.json(DETAIL_MAP[groupCode] ?? []);
  }

  let master = MASTER;
  if (q) master = master.filter(m => m.groupCode.includes(q) || m.groupName.includes(q));
  return NextResponse.json(master);
}

// POST /api/common-code  body: { groupCode, items }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { groupCode, items } = body;
  if (!groupCode || !Array.isArray(items)) {
    return NextResponse.json({ error: '필수 파라미터가 없습니다.' }, { status: 400 });
  }
  DETAIL_MAP[groupCode] = items;
  return NextResponse.json({ success: true });
}
