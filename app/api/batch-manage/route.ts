import { NextRequest, NextResponse } from 'next/server';

const MOCK_BATCH = [
  {
    jobCode: 'SY001', jobName: '일별 통계 집계',  jobPath: 'ex.sy.SY001',
    schedule: '0 1 * * *',   useYn: 'Y', workDiv: 'SYS', workDivName: '시스템',
    desc: '매일 새벽 1시에 전일 통계를 집계하여 저장합니다.',
  },
  {
    jobCode: 'SY002', jobName: '배치 로그 정리', jobPath: 'ex.sy.SY002',
    schedule: '0 2 * * 0',   useYn: 'Y', workDiv: 'SYS', workDivName: '시스템',
    desc: '매주 일요일 새벽 2시에 30일 이상 된 배치 로그를 삭제합니다.',
  },
  {
    jobCode: 'CM001', jobName: '스타일 집계',    jobPath: 'ex.cm.CM001',
    schedule: '0 6 * * 1-5', useYn: 'Y', workDiv: 'CM',  workDivName: '공통관리',
    desc: '평일 오전 6시에 스타일별 집계 데이터를 갱신합니다.',
  },
  {
    jobCode: 'DC001', jobName: '작업지시 마감',  jobPath: 'ex.dc.DC001',
    schedule: '30 23 * * 5', useYn: 'N', workDiv: 'DC',  workDivName: '문서관리',
    desc: '매주 금요일 23:30에 미확정 작업지시서를 자동 마감 처리합니다.',
  },
];

const WORK_DIVS = [
  { code: 'SYS', name: '시스템' },
  { code: 'CM',  name: '공통관리' },
  { code: 'DC',  name: '문서관리' },
  { code: 'RQ',  name: '의뢰관리' },
  { code: 'CS',  name: '현황관리' },
];

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  if (type === 'work-divs') return NextResponse.json(WORK_DIVS);

  const jobCode = req.nextUrl.searchParams.get('jobCode') ?? '';
  const useYn   = req.nextUrl.searchParams.get('useYn')   ?? '';
  const workDiv = req.nextUrl.searchParams.get('workDiv') ?? '';

  let list = MOCK_BATCH;
  if (jobCode)  list = list.filter(r => r.jobCode.includes(jobCode.toUpperCase()));
  if (useYn && useYn !== '전체')   list = list.filter(r => r.useYn === useYn);
  if (workDiv)  list = list.filter(r => r.workDiv === workDiv);

  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ ok: true });
}
