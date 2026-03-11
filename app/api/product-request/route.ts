import { NextRequest, NextResponse } from 'next/server';

const MOCK = [
  { id: 1,  reqNo: 'RQB-2024-0001', reqDate: '2024-03-01', brand: 'SALOMON', season: '25SS', styleCode: 'S251010HJK01', styleName: 'V TEAM 5 PACK 반바지',    colorCode: 'NVY', reqQty: 500, status: '승인완료', drafter: '홍길동' },
  { id: 2,  reqNo: 'RQB-2024-0002', reqDate: '2024-03-03', brand: 'SALOMON', season: '25SS', styleCode: 'S252020HPT01', styleName: 'FRICKIN 모던 스트레치 쇼츠', colorCode: 'BLK', reqQty: 300, status: '결재중',  drafter: '이철수' },
  { id: 3,  reqNo: 'RQB-2024-0003', reqDate: '2024-03-05', brand: 'SALOMON', season: '25SS', styleCode: 'S251010HJA01', styleName: '스탠 스트레치 팬츠',        colorCode: 'GRY', reqQty: 200, status: '임시저장', drafter: '박영희' },
  { id: 4,  reqNo: 'RQB-2024-0004', reqDate: '2024-03-07', brand: 'SALOMON', season: '25FW', styleCode: 'S252010HJA02', styleName: '스키 고어텍스 자켓',        colorCode: 'RED', reqQty: 150, status: '승인완료', drafter: '홍길동' },
  { id: 5,  reqNo: 'RQB-2024-0005', reqDate: '2024-03-10', brand: 'SALOMON', season: '25FW', styleCode: 'S251010HPT01', styleName: '플리스 집업 자켓',          colorCode: 'BLU', reqQty: 400, status: '결재반려', drafter: '이철수' },
  { id: 6,  reqNo: 'RQB-2024-0006', reqDate: '2024-03-12', brand: 'SALOMON', season: '25FW', styleCode: 'S251010HPT02', styleName: '보드 팬츠',                colorCode: 'GRN', reqQty: 350, status: '승인완료', drafter: '박영희' },
];

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') ?? '';
  let list = [...MOCK];
  if (status) list = list.filter(r => r.status === status);
  return NextResponse.json(list);
}

export async function POST() { return NextResponse.json({ ok: true }); }
export async function DELETE() { return NextResponse.json({ ok: true }); }
