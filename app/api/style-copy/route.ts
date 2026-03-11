import { NextRequest, NextResponse } from 'next/server';

const MOCK_STYLES = [
  { id: 1, styleCode: 'W251020TJK01', styleName: 'W251020TJK01', repStyleCode: 'W251020TJK01', designerNo: '2107194', designerName: '박준연' },
  { id: 2, styleCode: 'W251020TJK02', styleName: 'W251020TJK02', repStyleCode: 'W251020TJK02', designerNo: '2107194', designerName: '박준연' },
  { id: 3, styleCode: 'W252020TJK01', styleName: 'W252020TJK01', repStyleCode: 'W252020TJK01', designerNo: '2107014', designerName: '박주연' },
  { id: 4, styleCode: 'W253020TJK01', styleName: 'W253020TJK01', repStyleCode: 'W253020TJK01', designerNo: '2107014', designerName: '박주연' },
  { id: 5, styleCode: 'W251020TJK03', styleName: 'W251020TJK03', repStyleCode: 'W251020TJK03', designerNo: '1801021', designerName: '이소희' },
  { id: 6, styleCode: 'W251010TJK03', styleName: 'W251010TJK03', repStyleCode: 'W251010TJK03', designerNo: '1801021', designerName: '이소희' },
  { id: 7, styleCode: 'W251020TJK04', styleName: 'W251020TJK04', repStyleCode: 'W251020TJK04', designerNo: '2107014', designerName: '박주연' },
  { id: 8, styleCode: 'W251010TJK01', styleName: 'W251010TJK01', repStyleCode: 'W251010TJK01', designerNo: '2107014', designerName: '박주연' },
  { id: 9, styleCode: 'W251020TPT01', styleName: 'W251020TPT01', repStyleCode: 'W251020TPT01', designerNo: '2197164', designerName: '박준연' },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STYLES);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
