import { NextRequest, NextResponse } from 'next/server';

const MOCK_STYLES = [
  { id: 1, styleCode: 'S25S010HJK03', styleName: 'S25S010HJK03', repStyleCode: 'S25S010HJK03', brandZone: 'OL' },
  { id: 2, styleCode: 'W25S020TJK01', styleName: 'W25S020TJK01', repStyleCode: 'W25S020TJK01', brandZone: 'OL' },
  { id: 3, styleCode: 'W25S020TJK02', styleName: 'W25S020TJK02', repStyleCode: 'W25S020TJK02', brandZone: 'OL' },
  { id: 4, styleCode: 'W25S020TJA01', styleName: 'W25S020TJA01', repStyleCode: 'W25S020TJA01', brandZone: 'OL' },
  { id: 5, styleCode: 'W251010TJK01', styleName: 'W251010TJK01', repStyleCode: 'W251010TJK01', brandZone: 'OL' },
  { id: 6, styleCode: 'W251010TJK02', styleName: 'W251010TJK02', repStyleCode: 'W251010TJK02', brandZone: 'OL' },
];

export async function GET(req: NextRequest) {
  const style = req.nextUrl.searchParams.get('style') ?? '';
  const repStyle = req.nextUrl.searchParams.get('repStyle') ?? '';
  let list = MOCK_STYLES;
  if (style) list = list.filter(r => r.styleCode.includes(style));
  if (repStyle) list = list.filter(r => r.repStyleCode.includes(repStyle));
  return NextResponse.json(list);
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
