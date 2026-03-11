import { NextRequest, NextResponse } from 'next/server';

const MOCK_STYLES = [
  { id: 1, styleCode: 'S252010HJK05', styleName: 'S252010HJK05', repStyleCode: 'S252010HJK05', designerName: '박준연' },
  { id: 2, styleCode: 'W251010TJK03', styleName: 'W251010TJK03', repStyleCode: 'W251010TJK03', designerName: '이소희' },
  { id: 3, styleCode: 'W251020TJK05', styleName: 'W251020TJK05', repStyleCode: 'W251020TJK05', designerName: '김민정' },
  { id: 4, styleCode: 'S251010HPT01', styleName: 'S251010HPT01', repStyleCode: 'S251010HPT01', designerName: '박지연' },
  { id: 5, styleCode: 'S251010HVE01', styleName: 'S251010HVE01', repStyleCode: 'S251010HVE01', designerName: '박주연' },
  { id: 6, styleCode: 'W252020TJK01', styleName: 'W252020TJK01', repStyleCode: 'W252020TJK01', designerName: '강우영' },
  { id: 7, styleCode: 'W251020TJK06', styleName: 'W251020TJK06', repStyleCode: 'W251020TJK06', designerName: '정승하' },
  { id: 8, styleCode: 'W252020TJK02', styleName: 'W252020TJK02', repStyleCode: 'W252020TJK02', designerName: '박지연' },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STYLES);
}
