import { NextRequest, NextResponse } from 'next/server';

const STYLE_LIST = [
  { id: 1, styleCode: 'VOBAL451111', styleName: 'VOBAL451111' },
  { id: 2, styleCode: 'VVBEB452241', styleName: 'VVBEB452241' },
  { id: 3, styleCode: 'VOBBC451151', styleName: 'VOBBC451151' },
  { id: 4, styleCode: 'VOBBC452216', styleName: 'VOBBC452216' },
  { id: 5, styleCode: 'VOBBL451111', styleName: 'VOBBL451111' },
  { id: 6, styleCode: 'VOBBL451151', styleName: 'VOBBL451151' },
  { id: 7, styleCode: 'VOBBL451211', styleName: 'VOBBL451211' },
  { id: 8, styleCode: 'VOBBL4512SS', styleName: 'VOBBL4512SS' },
  { id: 9, styleCode: 'VOBJN452131', styleName: 'VOBJN452131' },
  { id: 10, styleCode: 'VOBJN452141', styleName: 'VOBJN452141' },
  { id: 11, styleCode: 'VOBJN452151', styleName: 'VOBJN452151' },
  { id: 12, styleCode: 'VOBKD451121', styleName: 'VOBKD451121' },
  { id: 13, styleCode: 'VOBN452121',  styleName: 'VOBN452121' },
  { id: 14, styleCode: 'VOBN4S2121',  styleName: 'VOBN4S2121' },
];

const WORK_ORDER_DETAIL: Record<string, any> = {
  'VOBBC452216': {
    styleCode: 'VOBBC452216',
    styleName: 'VOBBC452216',
    approvalDate: '',
    approvalNote: '',
    designImages: [{ name: 'VOBBC4S112102_9833222.jpg', size: '2.53 MB' }],
    washMethods: [],
    sewingNotes: '2023.07.28 에인수정\n1. 봉제지시서에 의거 봉제할 것\n4. 실금장 통: 봉제, 가종후 상부로 박음질 뒤집어 맞음 함.',
    sizes: ['085', '090', '095', '100', '105', '110', '95M', '95L', '10L'],
  },
};

export async function GET(req: NextRequest) {
  const styleCode = req.nextUrl.searchParams.get('styleCode') ?? '';
  if (styleCode) {
    return NextResponse.json(WORK_ORDER_DETAIL[styleCode] ?? { styleCode, styleName: styleCode });
  }
  return NextResponse.json(STYLE_LIST);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
