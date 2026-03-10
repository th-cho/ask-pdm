import { NextRequest, NextResponse } from 'next/server';

const ITEMS = [
  { itemCode: 'GB', itemName: '정장바지' },
  { itemCode: 'GK', itemName: '정장스커트' },
  { itemCode: 'JD', itemName: '데님다운류' },
  { itemCode: 'JF', itemName: '데님FUR류' },
  { itemCode: 'KD', itemName: '다운사파리' },
  { itemCode: 'MJ', itemName: '자켓/점퍼' },
  { itemCode: 'OA', itemName: '원피스' },
  { itemCode: 'QB', itemName: '수영복' },
];

const WASH_METHODS = [
  { no: '001', category: '분류1', categoryName: '면, 화학섬유(물세탁)', desc: '티셔츠, 니트', useYn: true },
  { no: '002', category: '분류2', categoryName: '남방,접자,반바지,이지자밖', desc: '남방,블라우스,이지자밖', useYn: true },
  { no: '003', category: '분류3', categoryName: '면, 화학섬유(물세탁)', desc: '44', useYn: true },
  { no: '004', category: '분류4', categoryName: '면, 화학섬유(물세탁)', desc: '트레스-서츠', useYn: false },
  { no: '005', category: '분류5', categoryName: '모, 실기(인드라이크리닝)', desc: '남방, 바지, 점퍼, 사파리, 이지자밖', useYn: true },
  { no: '006', category: '분류6', categoryName: '모, 실기(인드라이크리닝)', desc: '점퍼', useYn: true },
  { no: '007', category: '분류7', categoryName: '모, 실기(인드라이크리닝)', desc: '니트, 니트', useYn: false },
  { no: '008', category: '분류8', categoryName: '모 서울(물세탁)', desc: '남방, 바지, 점퍼, 사파리, 이지자밖', useYn: true },
];

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  if (type === 'items') return NextResponse.json(ITEMS);
  return NextResponse.json(WASH_METHODS);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
