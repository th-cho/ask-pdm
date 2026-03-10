'use client';

import React, { useState } from 'react';
import { Save, RotateCcw, Star, Bell, ChevronRight, Mail, MessageSquare, Smartphone } from 'lucide-react';

interface BizRow { id: number; bizCode: string; bizName: string; }
interface NotifyStep {
  step: string; label: string;
  submitEmail: boolean; submitSms: boolean; submitKakao: boolean;
  receiveEmail: boolean; receiveSms: boolean; receiveKakao: boolean;
}

const BIZ_LIST: BizRow[] = [
  { id: 1, bizCode: 'BIZ001', bizName: '원단구매의뢰' },
  { id: 2, bizCode: 'BIZ002', bizName: '상품사입의뢰' },
  { id: 3, bizCode: 'BIZ003', bizName: '부자재구매의뢰' },
  { id: 4, bizCode: 'BIZ004', bizName: '완성품입고의뢰' },
  { id: 5, bizCode: 'BIZ005', bizName: '반품처리의뢰' },
];

const INIT_STEPS: NotifyStep[] = [
  { step: '1', label: '임시저장',  submitEmail: false, submitSms: false, submitKakao: false, receiveEmail: false, receiveSms: false, receiveKakao: false },
  { step: '2', label: '결재상신',  submitEmail: true,  submitSms: false, submitKakao: true,  receiveEmail: true,  receiveSms: false, receiveKakao: true  },
  { step: '3', label: '1차 승인',  submitEmail: true,  submitSms: false, submitKakao: false, receiveEmail: true,  receiveSms: false, receiveKakao: false },
  { step: '4', label: '2차 승인',  submitEmail: true,  submitSms: false, submitKakao: false, receiveEmail: true,  receiveSms: false, receiveKakao: false },
  { step: '5', label: '최종 승인', submitEmail: true,  submitSms: true,  submitKakao: true,  receiveEmail: true,  receiveSms: true,  receiveKakao: true  },
  { step: '6', label: '결재 반려', submitEmail: true,  submitSms: true,  submitKakao: false, receiveEmail: true,  receiveSms: true,  receiveKakao: false },
];

function CheckBox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#1a5cb8' }}
    />
  );
}

const TH: React.CSSProperties = {
  padding: '6px 10px', textAlign: 'center', fontWeight: 600, fontSize: 11, color: '#475569',
  border: '1px solid #e2e8f0', background: '#f8fafc',
};
const TD: React.CSSProperties = { padding: '5px 8px', textAlign: 'center', border: '1px solid #f1f5f9' };

export default function NotifySetting() {
  const [selectedBiz, setSelectedBiz] = useState<BizRow | null>(BIZ_LIST[0]);
  const [steps, setSteps] = useState<NotifyStep[]>(INIT_STEPS);

  const toggle = (idx: number, field: keyof NotifyStep) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: !s[field] } : s));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">알림발송설정 <span className="pdm-page-code">RQB040</span></span>
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

        {/* 우측: 알림 설정 테이블 */}
        {selectedBiz ? (
          <div style={{ flex: 1, padding: '8px 10px', overflow: 'auto' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', padding: '2px 4px', borderBottom: '1px solid #e2e8f0', marginBottom: 10 }}>
              [{selectedBiz.bizCode}] {selectedBiz.bizName} — 알림 발송 설정
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <colgroup>
                <col style={{ width: 40 }} /><col style={{ width: 110 }} />
                <col style={{ width: 70 }} /><col style={{ width: 70 }} /><col style={{ width: 70 }} />
                <col style={{ width: 70 }} /><col style={{ width: 70 }} /><col style={{ width: 70 }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH} rowSpan={2}>단계</th>
                  <th style={TH} rowSpan={2}>업무단계명</th>
                  <th style={{ ...TH, background: '#eff6ff', color: '#1a5cb8' }} colSpan={3}>
                    <Bell size={11} style={{ display: 'inline', marginRight: 4 }} />상신업무 알림
                  </th>
                  <th style={{ ...TH, background: '#f0fdf4', color: '#16a34a' }} colSpan={3}>
                    <Bell size={11} style={{ display: 'inline', marginRight: 4 }} />받은업무 알림
                  </th>
                </tr>
                <tr>
                  <th style={{ ...TH, background: '#eff6ff' }}><Mail size={11} />이메일</th>
                  <th style={{ ...TH, background: '#eff6ff' }}><Smartphone size={11} />SMS</th>
                  <th style={{ ...TH, background: '#eff6ff' }}><MessageSquare size={11} />카카오</th>
                  <th style={{ ...TH, background: '#f0fdf4' }}><Mail size={11} />이메일</th>
                  <th style={{ ...TH, background: '#f0fdf4' }}><Smartphone size={11} />SMS</th>
                  <th style={{ ...TH, background: '#f0fdf4' }}><MessageSquare size={11} />카카오</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((s, i) => (
                  <tr key={s.step} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ ...TD, fontWeight: 600, color: '#1a5cb8' }}>{s.step}</td>
                    <td style={{ ...TD, textAlign: 'left', paddingLeft: 12, fontWeight: 500 }}>{s.label}</td>
                    <td style={TD}><CheckBox checked={s.submitEmail} onChange={() => toggle(i, 'submitEmail')} /></td>
                    <td style={TD}><CheckBox checked={s.submitSms}   onChange={() => toggle(i, 'submitSms')}   /></td>
                    <td style={TD}><CheckBox checked={s.submitKakao} onChange={() => toggle(i, 'submitKakao')} /></td>
                    <td style={TD}><CheckBox checked={s.receiveEmail} onChange={() => toggle(i, 'receiveEmail')} /></td>
                    <td style={TD}><CheckBox checked={s.receiveSms}   onChange={() => toggle(i, 'receiveSms')}   /></td>
                    <td style={TD}><CheckBox checked={s.receiveKakao} onChange={() => toggle(i, 'receiveKakao')} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 10, padding: '8px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 4, fontSize: 11, color: '#92400e' }}>
              <Bell size={11} style={{ display: 'inline', marginRight: 4 }} />
              이메일은 사용자 계정의 등록 이메일로, SMS는 등록된 휴대폰 번호로, 카카오는 카카오 비즈메시지로 발송됩니다.
            </div>
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
