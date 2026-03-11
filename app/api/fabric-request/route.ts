import { NextRequest, NextResponse } from 'next/server';

const MOCK = [
  { id: 1,  reqNo: 'RQA-2024-0001', reqDate: '2024-03-01', brand: 'SALOMON', season: '25SS', styleCode: 'S251010HJK01', fabricCode: 'F2024-001', fabricName: '울 혼방 원단', color: 'NVY', reqQty: 200, unit: 'm', status: '승인완료', drafter: '홍길동' },
  { id: 2,  reqNo: 'RQA-2024-0002', reqDate: '2024-03-03', brand: 'SALOMON', season: '25SS', styleCode: 'S252020HPT01', fabricCode: 'F2024-002', fabricName: '폴리 안감',   color: 'BLK', reqQty: 150, unit: 'm', status: '결재중',  drafter: '이철수' },
  { id: 3,  reqNo: 'RQA-2024-0003', reqDate: '2024-03-05', brand: 'SALOMON', season: '25SS', styleCode: 'S251010HJA01', fabricCode: 'F2024-003', fabricName: '코튼 원단',   color: 'WHT', reqQty: 300, unit: 'm', status: '임시저장', drafter: '박영희' },
  { id: 4,  reqNo: 'RQA-2024-0004', reqDate: '2024-03-07', brand: 'SALOMON', season: '25FW', styleCode: 'S252010HJA02', fabricCode: 'F2024-004', fabricName: '나일론 원단', color: 'RED', reqQty: 250, unit: 'm', status: '승인완료', drafter: '홍길동' },
  { id: 5,  reqNo: 'RQA-2024-0005', reqDate: '2024-03-10', brand: 'SALOMON', season: '25FW', styleCode: 'S251010HPT01', fabricCode: 'F2024-005', fabricName: '데님 원단',   color: 'IND', reqQty: 180, unit: 'm', status: '결재반려', drafter: '이철수' },
  { id: 6,  reqNo: 'RQA-2024-0006', reqDate: '2024-03-12', brand: 'SALOMON', season: '25FW', styleCode: 'S251010HPT02', fabricCode: 'F2024-006', fabricName: '린넨 원단',   color: 'BEG', reqQty: 120, unit: 'm', status: '승인완료', drafter: '박영희' },
  { id: 7,  reqNo: 'RQA-2024-0007', reqDate: '2024-03-14', brand: 'SALOMON', season: '25SS', styleCode: 'S251010HPH01', fabricCode: 'F2024-007', fabricName: '스판 원단',   color: 'GRY', reqQty: 90,  unit: 'm', status: '임시저장', drafter: '홍길동' },
  { id: 8,  reqNo: 'RQA-2024-0008', reqDate: '2024-03-15', brand: 'SALOMON', season: '25SS', styleCode: 'S252010HJK02', fabricCode: 'F2024-008', fabricName: '트위드 원단', color: 'CHK', reqQty: 200, unit: 'm', status: '결재중',  drafter: '이철수' },
];

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') ?? '';
  const reqNo  = req.nextUrl.searchParams.get('reqNo')  ?? '';
  let list = [...MOCK];
  if (status) list = list.filter(r => r.status === status);
  if (reqNo)  list = list.filter(r => r.reqNo.includes(reqNo));
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true, id: Date.now() });
}

export async function DELETE() {
  return NextResponse.json({ ok: true });
}
