import { NextRequest, NextResponse } from 'next/server';

const STYLE_LIST = [
  { id: 1, styleCode: 'MACFF451421', styleName: 'MACFF451421' },
  { id: 2, styleCode: 'MACFF451431', styleName: 'MACFF451431' },
  { id: 3, styleCode: 'MACFF451441', styleName: 'MACFF451441' },
  { id: 4, styleCode: 'MACFF451451', styleName: 'MACFF451451' },
  { id: 5, styleCode: 'MACFF451111', styleName: 'MACFF451111' },
  { id: 6, styleCode: 'MACTL451121', styleName: 'MACTL451121' },
  { id: 7, styleCode: 'MACTL451221', styleName: 'MACTL451221' },
  { id: 8, styleCode: 'MACTL451251', styleName: 'MACTL451251' },
  { id: 9, styleCode: 'MACTL451361', styleName: 'MACTL451361' },
  { id: 10, styleCode: 'MAEFF451411', styleName: 'MAEFF451411' },
  { id: 11, styleCode: 'MAEFF7416',   styleName: 'MAEFF7416' },
  { id: 12, styleCode: 'MANGL452431', styleName: 'MANGL452431' },
  { id: 13, styleCode: 'MANE851111', styleName: 'MANE851111' },
  { id: 14, styleCode: 'MANFF452111', styleName: 'MANFF452111' },
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
