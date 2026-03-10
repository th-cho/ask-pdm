import { NextRequest, NextResponse } from 'next/server';

const MOCK_DATA = [
  { id: 1, menuModule: '문서관리', menuModuleClass: '작업지시서', programName: '작업지시서', templateName: 'SIZE_SPEC_EXCEL',    fileName: 'SIZE_SPEC_입로드_양식.xlsx', fileSize: '11.38 KB', note: '' },
  { id: 2, menuModule: '문서관리', menuModuleClass: '봉제사양서', programName: '봉제사양서', templateName: 'SEWSPEC_EXCEL',       fileName: 'SEWSPEC_양식.xlsx',           fileSize: '8.21 KB',  note: '' },
  { id: 3, menuModule: '공통관리', menuModuleClass: '스타일관리', programName: '스타일복사',  templateName: 'STYLE_COPY_EXCEL',   fileName: 'STYLE_COPY_양식.xlsx',        fileSize: '5.10 KB',  note: '' },
  { id: 4, menuModule: '의뢰관리', menuModuleClass: '상품사입의뢰', programName: '상품사입의뢰', templateName: 'PRODUCT_REQ_EXCEL', fileName: 'PRODUCT_REQ_양식.xlsx',      fileSize: '9.44 KB',  note: '' },
];

export async function GET(req: NextRequest) {
  const program = req.nextUrl.searchParams.get('program') ?? '';
  const filtered = program
    ? MOCK_DATA.filter(d => d.programName.includes(program))
    : MOCK_DATA;
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
