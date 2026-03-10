import { NextRequest, NextResponse } from 'next/server';

const MOCK_STYLES = [
  { id: 1,  styleCode: 'VOBAL451111', styleName: 'VOBAL451111', brand: 'VOLCOM', season: '24SS' },
  { id: 2,  styleCode: 'VVBEB452241', styleName: 'VVBEB452241', brand: 'VOLCOM', season: '24SS' },
  { id: 3,  styleCode: 'VOBBC451151', styleName: 'VOBBC451151', brand: 'VOLCOM', season: '24SS' },
  { id: 4,  styleCode: 'VOBBC452216', styleName: 'VOBBC452216', brand: 'VOLCOM', season: '24FW' },
  { id: 5,  styleCode: 'VOBBL451111', styleName: 'VOBBL451111', brand: 'VOLCOM', season: '24FW' },
  { id: 6,  styleCode: 'VOBBL451151', styleName: 'VOBBL451151', brand: 'VOLCOM', season: '24FW' },
  { id: 7,  styleCode: 'VOBJN452131', styleName: 'VOBJN452131', brand: 'VOLCOM', season: '24SS' },
  { id: 8,  styleCode: 'VOBJN452141', styleName: 'VOBJN452141', brand: 'VOLCOM', season: '24SS' },
];

export async function GET(req: NextRequest) {
  const style = req.nextUrl.searchParams.get('style') ?? '';
  let list = [...MOCK_STYLES];
  if (style) list = list.filter(r => r.styleCode.includes(style));
  return NextResponse.json(list);
}
