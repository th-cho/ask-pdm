import { NextRequest, NextResponse } from 'next/server';

const MOCK_STYLES = [
  { id: 1, styleCode: 'VORGA452181', styleName: 'VORGA452181', repStyleCode: 'VORGA452181', designerName: '박준연' },
  { id: 2, styleCode: 'VVCAL451371', styleName: 'VVCAL451371', repStyleCode: 'VVCAL451371', designerName: '이소희' },
  { id: 3, styleCode: 'VVCDL451271', styleName: 'VVCDL451271', repStyleCode: 'VVCDL451271', designerName: '김민정' },
  { id: 4, styleCode: 'VOBBL451111', styleName: 'VOBBL451111', repStyleCode: 'VOBBL451111', designerName: '박지연' },
  { id: 5, styleCode: 'VOBN451241',  styleName: 'VOBN451241',  repStyleCode: 'VOBN451241',  designerName: '박주연' },
  { id: 6, styleCode: 'VVBMJ452381', styleName: 'VVBMJ452381', repStyleCode: 'VVBMJ452381', designerName: '강우영' },
  { id: 7, styleCode: 'VVCEB451231', styleName: 'VVCEB451231', repStyleCode: 'VVCEB451231', designerName: '정승하' },
  { id: 8, styleCode: 'VVCAL452231', styleName: 'VVCAL452231', repStyleCode: 'VVCAL452231', designerName: '박지연' },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STYLES);
}
