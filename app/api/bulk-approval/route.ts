import { NextRequest, NextResponse } from 'next/server';

const MOCK = [
  { id: 1,  reqNo: 'RQA-2024-0001', bizType: '원단구매의뢰', reqDate: '2024-03-01', drafter: '홍길동', zone: 'WM', brand: 'VOLCOM', styleCode: 'VOBAL451111', title: '24SS 원단구매의뢰', step: '2차승인',  status: '결재중', approver: '김부장' },
  { id: 2,  reqNo: 'RQA-2024-0002', bizType: '원단구매의뢰', reqDate: '2024-03-03', drafter: '이철수', zone: 'WM', brand: 'VOLCOM', styleCode: 'VVBEB452241', title: '24SS 원단구매의뢰', step: '1차승인',  status: '결재중', approver: '이과장' },
  { id: 3,  reqNo: 'RQB-2024-0001', bizType: '상품사입의뢰', reqDate: '2024-03-05', drafter: '박영희', zone: 'OL', brand: 'VOLCOM', styleCode: 'VOBBC451151', title: '24SS 상품사입의뢰', step: '최종승인', status: '결재중', approver: '박상무' },
  { id: 4,  reqNo: 'RQB-2024-0002', bizType: '상품사입의뢰', reqDate: '2024-03-07', drafter: '홍길동', zone: 'OL', brand: 'VOLCOM', styleCode: 'VOBBC452216', title: '24FW 상품사입의뢰', step: '1차승인',  status: '결재중', approver: '김부장' },
  { id: 5,  reqNo: 'RQA-2024-0003', bizType: '원단구매의뢰', reqDate: '2024-03-10', drafter: '이철수', zone: 'WM', brand: 'ARC',    styleCode: 'ARCFF451111', title: '24FW 원단구매의뢰', step: '2차승인',  status: '결재중', approver: '이과장' },
  { id: 6,  reqNo: 'RQB-2024-0003', bizType: '상품사입의뢰', reqDate: '2024-03-12', drafter: '박영희', zone: 'AC', brand: 'ARC',    styleCode: 'ARCBL451211', title: '24SS 상품사입의뢰', step: '최종승인', status: '결재중', approver: '박상무' },
  { id: 7,  reqNo: 'RQA-2024-0004', bizType: '원단구매의뢰', reqDate: '2024-03-14', drafter: '홍길동', zone: 'WM', brand: 'VOLCOM', styleCode: 'VOBBL451251', title: '24SS 원단구매의뢰', step: '1차승인',  status: '결재중', approver: '김부장' },
  { id: 8,  reqNo: 'RQB-2024-0004', bizType: '상품사입의뢰', reqDate: '2024-03-15', drafter: '이철수', zone: 'OL', brand: 'VOLCOM', styleCode: 'VOBBL452131', title: '24FW 상품사입의뢰', step: '2차승인',  status: '결재중', approver: '이과장' },
];

export async function GET(req: NextRequest) {
  const bizType = req.nextUrl.searchParams.get('bizType') ?? '';
  const drafter = req.nextUrl.searchParams.get('drafter') ?? '';
  let list = [...MOCK];
  if (bizType) list = list.filter(r => r.bizType === bizType);
  if (drafter) list = list.filter(r => r.drafter.includes(drafter));
  return NextResponse.json(list);
}

export async function POST() { return NextResponse.json({ ok: true }); }
