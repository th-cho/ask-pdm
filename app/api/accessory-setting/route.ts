import { NextRequest, NextResponse } from 'next/server';

const ITEMS = [
  { itemCode: 'GB', itemName: '정장바지' },
  { itemCode: 'GK', itemName: '정장스커트' },
  { itemCode: 'JD', itemName: '데님다운류' },
  { itemCode: 'JF', itemName: '데님FUR류' },
  { itemCode: 'JN', itemName: '가죽냠빠' },
  { itemCode: 'JP', itemName: '데님패딩류' },
  { itemCode: 'KA', itemName: '사파리' },
  { itemCode: 'KD', itemName: '다운사파리' },
  { itemCode: 'MJ', itemName: '자켓/점퍼' },
  { itemCode: 'MP', itemName: '바지' },
  { itemCode: 'MS', itemName: '스커트' },
  { itemCode: 'NL', itemName: '남방 긴팔' },
  { itemCode: 'NS', itemName: '남방 반팔' },
  { itemCode: 'OA', itemName: '원피스' },
];

const SEASONS = [
  { seasonCode: 'P', seasonName: '초봄', matCount: 0 },
  { seasonCode: 'S', seasonName: '봄', matCount: 3 },
  { seasonCode: 'V', seasonName: '초여름', matCount: 0 },
  { seasonCode: 'M', seasonName: '여름', matCount: 2 },
  { seasonCode: 'T', seasonName: '초가을', matCount: 0 },
  { seasonCode: 'F', seasonName: '가을', matCount: 5 },
  { seasonCode: 'C', seasonName: '초겨울', matCount: 0 },
  { seasonCode: 'W', seasonName: '겨울', matCount: 4 },
  { seasonCode: 'Y', seasonName: 'SS사계절', matCount: 0 },
  { seasonCode: 'Z', seasonName: 'FW사계절', matCount: 0 },
  { seasonCode: 'X', seasonName: '사계절', matCount: 0 },
];

const ACCESSORY_DETAIL = [
  { id: 1, matType: '01', matTypeName: '지퍼', matName: '비스론 지퍼', color: 'BLK', colorName: '블랙', spec: '5호 20cm', unitPrice: 350, unit: 'EA', reqQty: 1 },
  { id: 2, matType: '02', matTypeName: '단추', matName: '폴리 단추', color: 'BLK', colorName: '블랙', spec: '18L', unitPrice: 120, unit: 'EA', reqQty: 5 },
  { id: 3, matType: '03', matTypeName: '심지', matName: '접착심지', color: 'WHT', colorName: '화이트', spec: 'W80×0.08T', unitPrice: 1200, unit: 'M', reqQty: 0.5 },
];

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  if (type === 'items') return NextResponse.json(ITEMS);
  if (type === 'seasons') return NextResponse.json(SEASONS);
  return NextResponse.json(ACCESSORY_DETAIL);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
