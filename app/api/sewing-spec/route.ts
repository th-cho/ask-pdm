import { NextRequest, NextResponse } from 'next/server';

const STYLE_LIST = [
  { id: 1,  styleCode: 'A251010SFJ02', styleName: 'A251010SFJ02' },
  { id: 2,  styleCode: 'A251010SFJ03', styleName: 'A251010SFJ03' },
  { id: 3,  styleCode: 'A251010SFJ04', styleName: 'A251010SFJ04' },
  { id: 4,  styleCode: 'A251010SFJ05', styleName: 'A251010SFJ05' },
  { id: 5,  styleCode: 'A251010SFJ06', styleName: 'A251010SFJ06' },
  { id: 6,  styleCode: 'A251010STL01', styleName: 'A251010STL01' },
  { id: 7,  styleCode: 'A251010STL02', styleName: 'A251010STL02' },
  { id: 8,  styleCode: 'A251010STL03', styleName: 'A251010STL03' },
  { id: 9,  styleCode: 'A251010STL04', styleName: 'A251010STL04' },
  { id: 10, styleCode: 'A251010SFP01', styleName: 'A251010SFP01' },
  { id: 11, styleCode: 'A251010SFP02', styleName: 'A251010SFP02' },
  { id: 12, styleCode: 'A252010SJK01', styleName: 'A252010SJK01' },
  { id: 13, styleCode: 'A251010SHT01', styleName: 'A251010SHT01' },
  { id: 14, styleCode: 'A252010SFJ07', styleName: 'A252010SFJ07' },
];

const SEWING_SECTIONS = [
  { id: 1, category: '부분봉제(SIZE SPEC)', no: 1 },
  { id: 2, category: '부분봉제1', no: 2 },
  { id: 3, category: '부분봉제2', no: 3 },
  { id: 4, category: '부분봉제3', no: 4 },
  { id: 5, category: '부분봉제4', no: 5 },
  { id: 6, category: '부분봉제5', no: 6 },
];

export async function GET(req: NextRequest) {
  const styleCode = req.nextUrl.searchParams.get('styleCode') ?? '';
  if (styleCode) return NextResponse.json(SEWING_SECTIONS);
  return NextResponse.json(STYLE_LIST);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
