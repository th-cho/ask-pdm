import { NextRequest, NextResponse } from 'next/server';

const STYLE_LIST = [
  { id: 1,  styleCode: 'S251010HJK01', styleName: 'S251010HJK01' },
  { id: 2,  styleCode: 'S252020HPT01', styleName: 'S252020HPT01' },
  { id: 3,  styleCode: 'S251010HJA01', styleName: 'S251010HJA01' },
  { id: 4,  styleCode: 'S252010HJA02', styleName: 'S252010HJA02' },
  { id: 5,  styleCode: 'S251010HPT01', styleName: 'S251010HPT01' },
  { id: 6,  styleCode: 'S251010HPT02', styleName: 'S251010HPT02' },
  { id: 7,  styleCode: 'S251010HPH01', styleName: 'S251010HPH01' },
  { id: 8,  styleCode: 'S252010HPH02', styleName: 'S252010HPH02' },
  { id: 9,  styleCode: 'S252010HJK02', styleName: 'S252010HJK02' },
  { id: 10, styleCode: 'S252010HJK03', styleName: 'S252010HJK03' },
  { id: 11, styleCode: 'S252010HJK04', styleName: 'S252010HJK04' },
  { id: 12, styleCode: 'S251010HPT03', styleName: 'S251010HPT03' },
  { id: 13, styleCode: 'S252010HVE01', styleName: 'S252010HVE01' },
  { id: 14, styleCode: 'S25S010HVE01', styleName: 'S25S010HVE01' },
];

const WORK_ORDER_DETAIL: Record<string, any> = {
  'S252010HJA02': {
    styleCode: 'S252010HJA02',
    styleName: 'S252010HJA02',
    approvalDate: '',
    approvalNote: '',
    designImages: [{ name: 'S252010HJA02_9833222.jpg', size: '2.53 MB' }],
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
