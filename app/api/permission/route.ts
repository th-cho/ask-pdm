import { NextRequest, NextResponse } from 'next/server';

type PermRow = { id: string; name: string; access: boolean; read: boolean; write: boolean; delete: boolean; print: boolean };

let MOCK_PERMISSIONS: Record<string, PermRow[]> = {
  시스템관리자: [
    { id: 'SY10010', name: '회사정보관리',      access: true,  read: true,  write: true,  delete: true,  print: true },
    { id: 'AT10010', name: '근태입력(정규직)',   access: true,  read: true,  write: true,  delete: true,  print: true },
    { id: 'AT10020', name: '근태입력(파트)',     access: true,  read: true,  write: true,  delete: true,  print: true },
    { id: 'ST10010', name: '근태현황조회',       access: true,  read: true,  write: true,  delete: true,  print: true },
  ],
  매장관리자: [
    { id: 'SY10010', name: '회사정보관리',      access: false, read: true,  write: false, delete: false, print: false },
    { id: 'AT10010', name: '근태입력(정규직)',   access: true,  read: true,  write: true,  delete: false, print: true },
    { id: 'AT10020', name: '근태입력(파트)',     access: true,  read: true,  write: true,  delete: false, print: true },
    { id: 'ST10010', name: '근태현황조회',       access: true,  read: true,  write: false, delete: false, print: true },
  ],
  일반사용자: [
    { id: 'SY10010', name: '회사정보관리',      access: false, read: false, write: false, delete: false, print: false },
    { id: 'AT10010', name: '근태입력(정규직)',   access: true,  read: true,  write: false, delete: false, print: false },
    { id: 'AT10020', name: '근태입력(파트)',     access: true,  read: true,  write: false, delete: false, print: false },
    { id: 'ST10010', name: '근태현황조회',       access: true,  read: true,  write: false, delete: false, print: true },
  ],
};

// GET /api/permission?group=시스템관리자
export async function GET(request: NextRequest) {
  const group = request.nextUrl.searchParams.get('group') ?? '시스템관리자';
  const rows = MOCK_PERMISSIONS[group] ?? [];
  return NextResponse.json(rows);
}

// POST /api/permission  body: { group, rows }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { group, rows } = body;
  if (!group || !Array.isArray(rows)) {
    return NextResponse.json({ error: '필수 파라미터가 없습니다.' }, { status: 400 });
  }
  MOCK_PERMISSIONS[group] = rows;
  return NextResponse.json({ success: true });
}
