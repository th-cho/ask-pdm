'use client';

import React from 'react';
import { LogOut, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTabContext } from '@/contexts/TabContext';

const BREADCRUMB_MAP: Record<string, string> = {
  '/':                  '시스템 / 홈',
  '/company':           '시스템 / 시스템관리 / 환경설정',
  '/common-code':       '시스템 / 시스템관리 / 공통코드',
  '/program':           '시스템 / 조직정보관리 / 프로그램정보',
  '/menu':              '시스템 / 메뉴관리',
  '/user':              '시스템 / 조직정보관리 / 사용자관리',
  '/permission':        '시스템 / 권한관리',
  '/excel-template':    '시스템 / 시스템관리 / 엑셀양식관리',
  '/output-item':       '시스템 / 시스템관리 / 출력물 / 출력물등록',
  '/batch-manage':      '시스템 / 시스템관리 / 배치관리 / 배치관리',
  '/item-wash':         '공통관리 / 템플릿관리 / 아이템별세탁방법',
  '/accessory-base':    '공통관리 / 템플릿관리 / 완성부자재기초정보',
  '/accessory-setting': '공통관리 / 템플릿관리 / 복종별완성부자재설정',
  '/style-delete':      '공통관리 / 스타일관리 / 스타일삭제',
  '/style-collab':      '공통관리 / 스타일관리 / 스타일관리(콜라보)',
  '/style-copy':        '공통관리 / 스타일관리 / 스타일복사',
  '/style-print':       '공통관리 / 스타일관리 / 문서일괄출력',
  '/work-order':        '문서관리 / 작업지시서 / 작업지시서',
  '/sewing-spec':       '문서관리 / 봉제사양서 / 봉제사양서',
};

export default function Header() {
  const { activeTabId } = useTabContext();
  const router = useRouter();

  const breadcrumbStr = activeTabId
    ? (BREADCRUMB_MAP[activeTabId] ?? activeTabId)
    : '홈';
  const breadcrumbParts = breadcrumbStr.split(' / ');

  return (
    <header>
      {/* 브레드크럼 */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-0" style={{ fontSize: '12px' }}>
          {breadcrumbParts.map((part, i) => (
            <li
              key={i}
              className={`breadcrumb-item ${i === breadcrumbParts.length - 1 ? 'active fw-bold' : 'text-muted'}`}
              style={{ color: i === breadcrumbParts.length - 1 ? 'var(--pdm-primary)' : undefined }}
            >
              {part}
            </li>
          ))}
        </ol>
      </nav>

      {/* 우측 사용자 영역 */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link p-1 text-secondary position-relative" title="알림">
          <Bell size={16} />
        </button>
        <div className="text-end">
          <div className="fw-bold" style={{ fontSize: '12px', color: '#1e293b' }}>이창훈 (0704128)</div>
          <div className="text-muted" style={{ fontSize: '10px' }}>관리자부서</div>
        </div>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
          style={{ width: '34px', height: '34px', background: 'var(--pdm-primary)', color: '#fff', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}
        >
          이
        </div>
        <button onClick={() => router.push('/login')} className="btn btn-sm logout-btn d-flex align-items-center gap-1">
          <LogOut size={13} />
          <span>로그아웃</span>
        </button>
      </div>
    </header>
  );
}
