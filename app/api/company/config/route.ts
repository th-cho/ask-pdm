import { NextRequest, NextResponse } from 'next/server';

// ── Mock 회사 설정 데이터 ─────────────────────────────────────────────────────
let CONFIG: any[] = [
  { id:1, codeName:'weeklyHourLimit',       value:'52',   description:'주 최대 근로시간 (시간)' },
  { id:2, codeName:'dailyOvertimeLimit',    value:'12',   description:'일 최대 연장근로 (시간)' },
  { id:3, codeName:'overtimePayRate',       value:'1.5',  description:'연장수당 배율' },
  { id:4, codeName:'nightPayRate',          value:'1.5',  description:'심야수당 배율 (22:00~06:00)' },
  { id:5, codeName:'holidayPayRate',        value:'1.5',  description:'휴일근무수당 배율' },
  { id:6, codeName:'mealAllowanceHour',     value:'8',    description:'식대 지급 기준 근무시간 (시간)' },
  { id:7, codeName:'submitDeadlineDay',     value:'5',    description:'당월 근태 제출 마감일 (일)' },
  { id:8, codeName:'confirmDeadlineDay',    value:'10',   description:'본사 확정 마감일 (일)' },
  { id:9, codeName:'breakTime4h',           value:'0.5',  description:'4시간 근무 시 휴게시간 (시간)' },
  { id:10, codeName:'breakTime8h',          value:'1.0',  description:'8시간 근무 시 휴게시간 (시간)' },
  { id:11, codeName:'annualLeaveBase',      value:'15',   description:'연차 기본 발생 일수 (일)' },
  { id:12, codeName:'maternityOvertimeBlock', value:'Y',  description:'임신기 연장/심야/휴근 입력 차단 여부' },
];

// ── GET /api/company/config ────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json(CONFIG);
}

// ── POST /api/company/config (저장) ───────────────────────────────────────────
export async function POST(request: NextRequest) {
  const rows: { codeName: string; value: string }[] = await request.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: '저장할 데이터가 없습니다.' }, { status: 400 });
  }

  for (const row of rows) {
    const item = CONFIG.find(c => c.codeName === row.codeName);
    if (item) item.value = row.value;
  }

  return NextResponse.json({ success: true });
}
