'use client';

import React from 'react';
import { FileSpreadsheet, Printer, Timer, Settings, Code, Users, ShieldCheck, LayoutGrid, Menu as MenuIcon, Database, Shirt, Scissors, FileText, Layers, Copy } from 'lucide-react';
import { useTabContext } from '@/contexts/TabContext';

const QUICK_LINKS = [
  { path: '/excel-template',    title: '엑셀양식관리',      code: 'SYB050', icon: FileSpreadsheet, color: '#1a5cb8' },
  { path: '/output-item',       title: '출력물등록',        code: 'SYB060', icon: Printer,         color: '#0891b2' },
  { path: '/batch-manage',      title: '배치관리',          code: 'SYF010', icon: Timer,           color: '#7c3aed' },
  { path: '/item-wash',         title: '아이템별세탁방법',   code: 'CMA010', icon: Layers,          color: '#0891b2' },
  { path: '/accessory-base',    title: '완성부자재기초정보', code: 'CMA020', icon: Database,        color: '#059669' },
  { path: '/accessory-setting', title: '복종별완성부자재설정', code: 'CMA030', icon: Settings,      color: '#d97706' },
  { path: '/style-delete',      title: '스타일삭제',        code: 'CMB010', icon: Layers,          color: '#dc2626' },
  { path: '/style-collab',      title: '스타일관리(콜라보)', code: 'CMB020', icon: Shirt,           color: '#db2777' },
  { path: '/style-copy',        title: '스타일복사',        code: 'CMB050', icon: Copy,            color: '#374151' },
  { path: '/style-print',       title: '문서일괄출력',      code: 'CMB060', icon: Printer,         color: '#6d28d9' },
  { path: '/work-order',        title: '작업지시서',        code: 'DCA010', icon: FileText,        color: '#1a5cb8' },
  { path: '/sewing-spec',       title: '봉제사양서',        code: 'DCB010', icon: Scissors,        color: '#0891b2' },
];

const UPCOMING = [
  { label: '의뢰관리 (RQ)', desc: '상품사입의뢰, 원단구매의뢰, 결재라인관리, 알림설정',     phase: 6 },
  { label: '현황관리 (CS)', desc: '배포이력현황, 요척현황, 원부자재변경현황',               phase: 7 },
];

export default function Home() {
  const { openTab } = useTabContext();

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f4f6f9' }}>
      {/* Hero 배너 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1c2e4a 0%, #1a5cb8 100%)',
          color: '#fff',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', opacity: 0.6, marginBottom: '8px', textTransform: 'uppercase' }}>
            Amer Sports PDM SYSTEM
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>
            Digital Innovation,<br />Sustainable Growth
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.75, maxWidth: '480px', lineHeight: 1.7, margin: 0 }}>
            기업의 지속가능한 성장을 위해 디지털 혁신을 선도한다<br />
            디지털 기술을 기반으로 업무 플랫폼을 고도화하여 지속가능한 성장을 선도합니다.
          </p>
        </div>
        {/* 장식 원 */}
        <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '260px', height: '260px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '80px', bottom: '-80px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
      </div>

      <div style={{ padding: '28px 40px' }}>
        {/* 바로가기 */}
        <div style={{ marginBottom: '28px' }}>
          <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '14px', fontSize: '13px' }}>
            시스템 바로가기
          </h6>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {QUICK_LINKS.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => openTab(item.path, item.title)}
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'box-shadow 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(26,92,184,0.12)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = item.color;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: item.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Icon size={18} color={item.color} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>{item.title}</div>
                  {item.code && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{item.code}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 개발 예정 모듈 */}
        <div>
          <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '14px', fontSize: '13px' }}>
            개발 예정 모듈
          </h6>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
            {UPCOMING.map(item => (
              <div
                key={item.label}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  minWidth: '22px', height: '22px', borderRadius: '50%',
                  background: '#1a5cb8', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, marginTop: '1px',
                }}>
                  {item.phase}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
