import { NextRequest, NextResponse } from 'next/server';

const MOCK_DATA = [
  { id: 1, matType: '01', matTypeName: '지퍼', matName: '비스론 지퍼', color: 'BLK', colorName: '블랙', spec: '5호 20cm', unitPrice: 350, unit: 'EA', reqQty: 1, regDate: '2024-01-10', modDate: '2024-03-15' },
  { id: 2, matType: '01', matTypeName: '지퍼', matName: '비스론 지퍼', color: 'NVY', colorName: '네이비', spec: '5호 25cm', unitPrice: 380, unit: 'EA', reqQty: 1, regDate: '2024-01-10', modDate: '2024-03-15' },
  { id: 3, matType: '02', matTypeName: '단추', matName: '폴리 단추', color: 'BLK', colorName: '블랙', spec: '18L', unitPrice: 120, unit: 'EA', reqQty: 5, regDate: '2024-02-01', modDate: '2024-02-20' },
  { id: 4, matType: '02', matTypeName: '단추', matName: '금속 단추', color: 'GLD', colorName: '골드', spec: '20L', unitPrice: 250, unit: 'EA', reqQty: 4, regDate: '2024-02-05', modDate: '2024-02-20' },
  { id: 5, matType: '03', matTypeName: '심지', matName: '접착심지', color: 'WHT', colorName: '화이트', spec: 'W80×0.08T', unitPrice: 1200, unit: 'M', reqQty: 0.5, regDate: '2024-03-01', modDate: '2024-03-10' },
  { id: 6, matType: '04', matTypeName: '테이프', matName: '신축 테이프', color: 'BLK', colorName: '블랙', spec: '2cm', unitPrice: 80, unit: 'M', reqQty: 1.2, regDate: '2024-03-05', modDate: '2024-04-01' },
  { id: 7, matType: '05', matTypeName: '라벨', matName: '우븐라벨 SIZE', color: 'BLK', colorName: '블랙', spec: '2×4cm', unitPrice: 50, unit: 'EA', reqQty: 1, regDate: '2024-01-15', modDate: '2024-01-15' },
  { id: 8, matType: '05', matTypeName: '라벨', matName: '케어라벨', color: 'WHT', colorName: '화이트', spec: '4×6cm', unitPrice: 45, unit: 'EA', reqQty: 1, regDate: '2024-01-15', modDate: '2024-01-15' },
];

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const list = q ? MOCK_DATA.filter(d => d.matName.includes(q) || d.matTypeName.includes(q)) : MOCK_DATA;
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
