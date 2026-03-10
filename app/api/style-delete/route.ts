import { NextRequest, NextResponse } from 'next/server';

const MOCK_STYLES = [
  { id: 1, styleCode: 'VOBNS4S2121', styleName: 'VOBNS4S2121', repStyleCode: 'VOBNS4S2121', brandZone: 'OL' },
  { id: 2, styleCode: 'VVBEB4S2161', styleName: 'VVBEB4S2161', repStyleCode: 'VVBEB4S2161', brandZone: 'OL' },
  { id: 3, styleCode: 'VVBMJ4S3291', styleName: 'VVBMJ4S3291', repStyleCode: 'VVBMJ4S3291', brandZone: 'OL' },
  { id: 4, styleCode: 'VVCOA4S2221', styleName: 'VVCOA4S2221', repStyleCode: 'VVCOA4S2221', brandZone: 'OL' },
  { id: 5, styleCode: 'VVCCL451371', styleName: 'VVCCL451371', repStyleCode: 'VVCCL451371', brandZone: 'OL' },
  { id: 6, styleCode: 'VVCCL451381', styleName: 'VVCCL451381', repStyleCode: 'VVCCL451381', brandZone: 'OL' },
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
