'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Save, Trash2, RotateCcw, Star, UserCheck, Bell, Users, ChevronRight, GripVertical } from 'lucide-react';

interface BizRow { id: number; bizCode: string; bizName: string; }
interface LineItem { seq: number; userId: string; userName: string; dept: string; role: string; type: '승인' | '통보(개인)' | '통보(부서)'; }

const BIZ_LIST: BizRow[] = [
  { id: 1, bizCode: 'BIZ001', bizName: '원단구매의뢰' },
  { id: 2, bizCode: 'BIZ002', bizName: '상품사입의뢰' },
  { id: 3, bizCode: 'BIZ003', bizName: '부자재구매의뢰' },
  { id: 4, bizCode: 'BIZ004', bizName: '완성품입고의뢰' },
  { id: 5, bizCode: 'BIZ005', bizName: '반품처리의뢰' },
];

const MOCK_APPROVE: LineItem[] = [
  { seq: 1, userId: 'U001', userName: '이과장', dept: '생산관리팀', role: '1차 결재자', type: '승인' },
  { seq: 2, userId: 'U002', userName: '김부장', dept: '생산본부',   role: '2차 결재자', type: '승인' },
  { seq: 3, userId: 'U003', userName: '박상무', dept: '경영진',     role: '최종 결재자', type: '승인' },
];
const MOCK_NOTIFY_IND: LineItem[] = [
  { seq: 1, userId: 'U004', userName: '최대리', dept: '구매팀',     role: '담당자', type: '통보(개인)' },
  { seq: 2, userId: 'U005', userName: '정주임', dept: '자재팀',     role: '담당자', type: '통보(개인)' },
];
const MOCK_NOTIFY_DEPT: LineItem[] = [
  { seq: 1, userId: 'D001', userName: '생산관리팀',  dept: '', role: '전체통보', type: '통보(부서)' },
  { seq: 2, userId: 'D002', userName: '구매팀',      dept: '', role: '전체통보', type: '통보(부서)' },
];

function LineSection({
  title, icon, items, color,
}: { title: string; icon: React.ReactNode; items: LineItem[]; color: string }) {
  return (
    <div className="pdm-detail-section" style={{ flex: 1 }}>
      <div className="pdm-section-title" style={{ color }}>{icon} {title}</div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        <button className="pdm-btn pdm-btn-default" style={{ fontSize: 11, padding: '2px 8px' }}><Plus size={11} /> 추가</button>
        <button className="pdm-btn pdm-btn-danger"  style={{ fontSize: 11, padding: '2px 8px' }}><Trash2 size={11} /> 삭제</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={TH}>순서</th>
            <th style={TH}>사용자ID</th>
            <th style={TH}>성명</th>
            <th style={TH}>부서</th>
            <th style={TH}>역할</th>
            <th style={TH}>이동</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.seq} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={TD}>{item.seq}</td>
              <td style={TD}>{item.userId}</td>
              <td style={{ ...TD, fontWeight: 600 }}>{item.userName}</td>
              <td style={TD}>{item.dept}</td>
              <td style={TD}><span style={{ color, fontWeight: 500 }}>{item.role}</span></td>
              <td style={TD}>
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}>▲</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}>▼</button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 16, color: '#94a3b8', fontSize: 12 }}>결재자를 추가하세요</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const TH: React.CSSProperties = { padding: '5px 8px', textAlign: 'center', fontWeight: 600, fontSize: 11, color: '#475569', border: '1px solid #e2e8f0' };
const TD: React.CSSProperties = { padding: '4px 8px', textAlign: 'center', border: '1px solid #f1f5f9' };

export default function ApprovalLine() {
  const [selectedBiz, setSelectedBiz] = useState<BizRow | null>(BIZ_LIST[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">결재라인관리 <span className="pdm-page-code">RQB030</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-success"><Save size={13} /> 저장 <kbd>F9</kbd></button>
          <button className="pdm-btn pdm-btn-default"><RotateCcw size={13} /> 초기화 <kbd>F12</kbd></button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, gap: 0 }}>
        {/* 좌측: 업무 목록 */}
        <div style={{ width: 220, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '6px 0' }}>
          <div style={{ padding: '4px 12px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={12} color="#1a5cb8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>업무 목록</span>
          </div>
          {BIZ_LIST.map(biz => (
            <button
              key={biz.id}
              onClick={() => setSelectedBiz(biz)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 14px', border: 'none', textAlign: 'left', cursor: 'pointer',
                background: selectedBiz?.id === biz.id ? '#dbeafe' : 'transparent',
                color: selectedBiz?.id === biz.id ? '#1a5cb8' : '#334155',
                fontSize: 12, fontWeight: selectedBiz?.id === biz.id ? 600 : 400,
                borderLeft: selectedBiz?.id === biz.id ? '3px solid #1a5cb8' : '3px solid transparent',
              }}
            >
              <ChevronRight size={12} />
              <span>{biz.bizName}</span>
            </button>
          ))}
        </div>

        {/* 우측: 3섹션 */}
        {selectedBiz ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 10px', gap: 8, minWidth: 0, overflow: 'auto' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', padding: '2px 4px', borderBottom: '1px solid #e2e8f0', marginBottom: 2 }}>
              [{selectedBiz.bizCode}] {selectedBiz.bizName} — 결재라인 설정
            </div>

            <LineSection title="승인" icon={<UserCheck size={12} />} items={MOCK_APPROVE} color="#1a5cb8" />
            <LineSection title="통보 (개인별)" icon={<Bell size={12} />} items={MOCK_NOTIFY_IND} color="#16a34a" />
            <LineSection title="통보 (부서별)" icon={<Users size={12} />} items={MOCK_NOTIFY_DEPT} color="#d97706" />
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
            업무를 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}
