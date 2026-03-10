import { NextRequest, NextResponse } from 'next/server';

let MOCK_USERS = [
  { no: 1, id: 'S19080901', name: '박지홍', store: '광복점',   type: '정규직', maternity: false, status: '재직', typeCode: 'REGULAR', maternityStart: '', maternityEnd: '' },
  { no: 2, id: 'P24082201', name: '김예지', store: '강남본점', type: '단시간', maternity: true,  status: '재직', typeCode: 'SHORT',   maternityStart: '2025-12-01', maternityEnd: '2026-08-31' },
  { no: 3, id: 'P25012503', name: '이초단', store: '광복점',   type: '초단시간', maternity: false, status: '재직', typeCode: 'ULTRA', maternityStart: '', maternityEnd: '' },
  { no: 4, id: 'S21043002', name: '최근태', store: '광복점',   type: '정규직', maternity: false, status: '재직', typeCode: 'REGULAR', maternityStart: '', maternityEnd: '' },
  { no: 5, id: 'S22091501', name: '이하늘', store: '광복점',   type: '정규직', maternity: false, status: '재직', typeCode: 'REGULAR', maternityStart: '', maternityEnd: '' },
];

// GET /api/user?workType=REGULAR&q=
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const workType = searchParams.get('workType') ?? '';
  const q        = searchParams.get('q') ?? '';

  let result = MOCK_USERS;
  if (workType) result = result.filter(u => u.typeCode === workType);
  if (q)        result = result.filter(u => u.id.includes(q) || u.name.includes(q));

  return NextResponse.json(result);
}

// POST /api/user  body: new user
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.id || !body.name) {
    return NextResponse.json({ error: '사용자명과 사번을 입력하세요.' }, { status: 400 });
  }
  if (MOCK_USERS.find(u => u.id === body.id)) {
    return NextResponse.json({ error: '이미 존재하는 사번입니다.' }, { status: 400 });
  }
  const typeLabel: Record<string, string> = { REGULAR: '정규직', SHORT: '단시간', ULTRA: '초단시간' };
  const newUser = {
    no: MOCK_USERS.length + 1,
    id: body.id,
    name: body.name,
    store: body.store ?? '광복점',
    type: typeLabel[body.typeCode] ?? '정규직',
    maternity: body.maternity ?? false,
    status: '재직',
    typeCode: body.typeCode ?? 'REGULAR',
    maternityStart: body.maternityStart ?? '',
    maternityEnd:   body.maternityEnd   ?? '',
  };
  MOCK_USERS.push(newUser);
  return NextResponse.json({ success: true, user: newUser });
}

// PATCH /api/user  body: updated user
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: '사번이 없습니다.' }, { status: 400 });
  }
  const typeLabel: Record<string, string> = { REGULAR: '정규직', SHORT: '단시간', ULTRA: '초단시간' };
  const idx = MOCK_USERS.findIndex(u => u.id === body.id);
  if (idx < 0) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }
  MOCK_USERS[idx] = {
    ...MOCK_USERS[idx],
    name: body.name ?? MOCK_USERS[idx].name,
    typeCode: body.typeCode ?? MOCK_USERS[idx].typeCode,
    type: typeLabel[body.typeCode] ?? MOCK_USERS[idx].type,
    maternity: body.maternity ?? MOCK_USERS[idx].maternity,
    maternityStart: body.maternityStart ?? '',
    maternityEnd:   body.maternityEnd   ?? '',
  };
  return NextResponse.json({ success: true, user: MOCK_USERS[idx] });
}
