import { NextRequest, NextResponse } from 'next/server';

// ── Mock 회사 정보 ─────────────────────────────────────────────────────────────
let COMPANY: Record<string, any> = {
  code:     'ASK',
  name:     '아머스포츠 코리아(주)',
  ceo_name: '홍길동',
  biz_no:   '123-45-67890',
  address:  '서울특별시 강남구 테헤란로 123, 빌딩 5층',
  phone:    '02-1234-5678',
  fax:      '02-1234-5679',
};

// ── GET /api/company?name=아머 ────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name');

  if (name && !COMPANY.name.includes(name)) {
    return NextResponse.json(null);
  }

  return NextResponse.json(COMPANY);
}

// ── POST /api/company (저장) ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { companyName, ceoName, bizNo, address, phone, fax } = await request.json();

  COMPANY = {
    ...COMPANY,
    name:     companyName ?? COMPANY.name,
    ceo_name: ceoName     ?? COMPANY.ceo_name,
    biz_no:   bizNo       ?? COMPANY.biz_no,
    address:  address     ?? COMPANY.address,
    phone:    phone       ?? COMPANY.phone,
    fax:      fax         ?? COMPANY.fax,
  };

  return NextResponse.json({ success: true });
}
