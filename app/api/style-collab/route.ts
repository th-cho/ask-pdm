import { NextRequest, NextResponse } from 'next/server';

const MOCK_COLLAB = [
  { id: 1, ordered: 'N', regDate: '2024-05-10', vendor: '(주)패션하우스', styleCode: 'VVBEB4S2161', styleName: 'VVBEB 스타일', color: 'BLK', tagPrice: 89000, settlePrice: 42000, spec: 'FREE', specPlanQty: 200, colorPlanQty: 200, specZone: 'OL' },
  { id: 2, ordered: 'Y', regDate: '2024-05-15', vendor: '(주)텍스타일', styleCode: 'VVCOA4S2221', styleName: 'VVCOA 스타일', color: 'NVY', tagPrice: 125000, settlePrice: 58000, spec: 'S', specPlanQty: 150, colorPlanQty: 300, specZone: 'OL' },
  { id: 3, ordered: 'N', regDate: '2024-06-01', vendor: '(주)어패럴', styleCode: 'VVCCL451371', styleName: 'VVCCL 스타일', color: 'RED', tagPrice: 75000, settlePrice: 35000, spec: 'M', specPlanQty: 100, colorPlanQty: 250, specZone: 'WM' },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_COLLAB);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
