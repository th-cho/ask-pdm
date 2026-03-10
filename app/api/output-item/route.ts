import { NextRequest, NextResponse } from 'next/server';

const PROGRAMS = [
  { moduleId: 'CM', moduleClassId: 'CMA', moduleClassName: '템플릿관리', programId: 'CMA010', programName: '아이템별세탁방법' },
  { moduleId: 'CM', moduleClassId: 'CMA', moduleClassName: '템플릿관리', programId: 'CMA020', programName: '완성부자재기초정보' },
  { moduleId: 'CM', moduleClassId: 'CMA', moduleClassName: '템플릿관리', programId: 'CMA030', programName: '복종별완성부자재설정' },
  { moduleId: 'CM', moduleClassId: 'CMB', moduleClassName: '스타일관리', programId: 'CMB010', programName: '스타일삭제' },
  { moduleId: 'CM', moduleClassId: 'CMB', moduleClassName: '스타일관리', programId: 'CMB020', programName: '스타일관리(콜라보)' },
  { moduleId: 'CM', moduleClassId: 'CMB', moduleClassName: '스타일관리', programId: 'CMB060', programName: '문서일괄출력' },
  { moduleId: 'DC', moduleClassId: 'DCA', moduleClassName: '작업지시서', programId: 'DCA010', programName: '작업지시서' },
  { moduleId: 'DC', moduleClassId: 'DCB', moduleClassName: '봉제사양서', programId: 'DCB010', programName: '봉제사양서' },
  { moduleId: 'RQ', moduleClassId: 'RQA', moduleClassName: '의뢰관리',  programId: 'RQA020', programName: '상품사입의뢰' },
  { moduleId: 'SY', moduleClassId: 'SYB', moduleClassName: '시스템관리', programId: 'SYB050', programName: '엑셀양식관리' },
  { moduleId: 'SY', moduleClassId: 'SYB', moduleClassName: '시스템관리', programId: 'SYB060', programName: '출력물등록' },
  { moduleId: 'SY', moduleClassId: 'SYC', moduleClassName: '시스템관리', programId: 'SYC020', programName: '메뉴관리' },
];

const MOCK_OUTPUT = [
  { id: 1, programId: 'DCA010', programName: '작업지시서', outputId: 'DCO001', outputName: '작업지시서_기본',       outputPath: '/reports/dca/work_order.jasper',     sortOrder: 1 },
  { id: 2, programId: 'DCA010', programName: '작업지시서', outputId: 'DCO002', outputName: '작업지시서_SIZE_SPEC',  outputPath: '/reports/dca/work_order_size.jasper', sortOrder: 2 },
  { id: 3, programId: 'RQA020', programName: '상품사입의뢰', outputId: 'RQO001', outputName: '상품사입의뢰서',     outputPath: '/reports/rqa/purchase_req.jasper',   sortOrder: 1 },
  { id: 4, programId: 'DCB010', programName: '봉제사양서', outputId: 'DCB001', outputName: '봉제사양서',           outputPath: '/reports/dcb/sewing_spec.jasper',    sortOrder: 1 },
];

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  if (type === 'programs') {
    const q = req.nextUrl.searchParams.get('q') ?? '';
    const filtered = q
      ? PROGRAMS.filter(p => p.programId.includes(q) || p.programName.includes(q))
      : PROGRAMS;
    return NextResponse.json(filtered);
  }
  const programId = req.nextUrl.searchParams.get('programId') ?? '';
  const outputQ   = req.nextUrl.searchParams.get('q') ?? '';
  let list = MOCK_OUTPUT;
  if (programId) list = list.filter(r => r.programId === programId);
  if (outputQ)   list = list.filter(r => r.outputId.includes(outputQ) || r.outputName.includes(outputQ));
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
