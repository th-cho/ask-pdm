import { NextResponse } from 'next/server';

const MOCK_DATA = {
  currentWorkers: 8,
  totalWorkers: 12,
  prevDiff: 2,
  errorCount: 3,
  confirmRate: 92,
  avgWeeklyHours: 46.5,
  weeklyTop5: [
    { name: '박지홍 (점장)',  hours: 50.5 },
    { name: '김예지 (캡틴)',  hours: 48.2 },
    { name: '최근태 (스탭)',  hours: 40.0 },
    { name: '이하늘 (스탭)',  hours: 38.5 },
    { name: '홍길동 (스탭)',  hours: 32.0 },
  ],
  alerts: [
    { type: 'danger',  icon: 'shield-alert', title: '박지홍 - 주 52시간 근접',       body: '현재 50.5시간 누적. 추가 연장 자제 필요' },
    { type: 'warning', icon: 'user-minus',   title: '이하늘 - 조퇴 발생',             body: '2026-02-19 14:00 병원 방문 사유' },
    { type: 'info',    icon: 'heart',        title: '김예지 - 임신기 적용',           body: '임신기 단축근무 시간 엄수 확인 요망' },
    { type: 'success', icon: 'file-check',   title: '광복점 - 전주 근태 승인 완료',   body: '본사(P&C)에서 최종 확정 처리가 완료되었습니다.' },
  ],
};

export async function GET() {
  return NextResponse.json(MOCK_DATA);
}
