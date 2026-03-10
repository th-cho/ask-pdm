import { NextRequest, NextResponse } from 'next/server';

const MOCK_STYLES = [
  { id: 1, styleCode: 'VVBKD451161', styleName: 'VVBKD451161', repStyleCode: 'VVBKD451161', designerNo: '2107194', designerName: '박준연' },
  { id: 2, styleCode: 'VVBKD451171', styleName: 'VVBKD451171', repStyleCode: 'VVBKD451171', designerNo: '2107194', designerName: '박준연' },
  { id: 3, styleCode: 'VVBMJ452381', styleName: 'VVBMJ452381', repStyleCode: 'VVBMJ452381', designerNo: '2107014', designerName: '박주연' },
  { id: 4, styleCode: 'VVBMJ453291', styleName: 'VVBMJ453291', repStyleCode: 'VVBMJ453291', designerNo: '2107014', designerName: '박주연' },
  { id: 5, styleCode: 'VVCAL451341', styleName: 'VVCAL451341', repStyleCode: 'VVCAL451341', designerNo: '1801021', designerName: '이소희' },
  { id: 6, styleCode: 'VVCAL451371', styleName: 'VVCAL451371', repStyleCode: 'VVCAL451371', designerNo: '1801021', designerName: '이소희' },
  { id: 7, styleCode: 'VVCBL451151', styleName: 'VVCBL451151', repStyleCode: 'VVCBL451151', designerNo: '2107014', designerName: '박주연' },
  { id: 8, styleCode: 'VVCCL451371', styleName: 'VVCCL451371', repStyleCode: 'VVCCL451371', designerNo: '2107014', designerName: '박주연' },
  { id: 9, styleCode: 'VVCMP451281', styleName: 'VVCMP451281', repStyleCode: 'VVCMP451281', designerNo: '2197164', designerName: '박준연' },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STYLES);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
