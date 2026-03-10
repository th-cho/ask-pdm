'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Save, Trash2, RotateCcw, Star, Info, Play } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface BatchRow {
  jobCode: string;
  jobName: string;
  jobPath: string;
  schedule: string;
  useYn: string;
  workDiv: string;
  workDivName: string;
  desc: string;
}

const EMPTY_DETAIL: BatchRow = {
  jobCode: '', jobName: '', jobPath: '',
  schedule: '', useYn: 'Y', workDiv: '', workDivName: '', desc: '',
};

export default function BatchManage() {
  const [filterJobCode,  setFilterJobCode]  = useState('');
  const [filterUseYn,   setFilterUseYn]    = useState('전체');
  const [filterWorkDiv, setFilterWorkDiv]  = useState('');
  const [rowData, setRowData]              = useState<BatchRow[]>([]);
  const [detail, setDetail]               = useState<BatchRow>(EMPTY_DETAIL);
  const [selected, setSelected]           = useState<BatchRow | null>(null);
  const [loading, setLoading]             = useState(false);

  /* ── 조회 ── */
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterJobCode)              params.set('jobCode',  filterJobCode);
      if (filterUseYn !== '전체')     params.set('useYn',   filterUseYn);
      if (filterWorkDiv)              params.set('workDiv',  filterWorkDiv);
      const res = await fetch(`/api/batch-manage?${params}`);
      if (!res.ok) throw new Error('조회에 실패했습니다.');
      setRowData(await res.json());
      setSelected(null);
      setDetail(EMPTY_DETAIL);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, [filterJobCode, filterUseYn, filterWorkDiv]);

  /* ── 저장 ── */
  const handleSave = useCallback(async () => {
    if (!detail.jobCode || !detail.jobName) {
      alert('JOB 코드와 JOB 명을 입력하세요.');
      return;
    }
    const res = await fetch('/api/batch-manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detail),
    });
    if (!res.ok) { alert('저장에 실패했습니다.'); return; }
    alert('저장되었습니다.');
    handleSearch();
  }, [detail, handleSearch]);

  /* ── 삭제 ── */
  const handleDelete = useCallback(async () => {
    if (!selected) { alert('삭제할 배치를 선택하세요.'); return; }
    if (!confirm(`"${selected.jobName}" 배치를 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/batch-manage?jobCode=${selected.jobCode}`, { method: 'DELETE' });
    if (!res.ok) { alert('삭제에 실패했습니다.'); return; }
    alert('삭제되었습니다.');
    handleSearch();
  }, [selected, handleSearch]);

  /* ── 즉시 실행 ── */
  const handleRun = useCallback(() => {
    if (!selected) { alert('실행할 배치를 선택하세요.'); return; }
    if (!confirm(`"${selected.jobName}"을 즉시 실행하시겠습니까?`)) return;
    alert(`${selected.jobCode} 배치를 실행 요청했습니다.`);
  }, [selected]);

  /* ── 초기화 ── */
  const handleInit = useCallback(() => {
    setFilterJobCode('');
    setFilterUseYn('전체');
    setFilterWorkDiv('');
    setRowData([]);
    setSelected(null);
    setDetail(EMPTY_DETAIL);
  }, []);

  /* ── 행 선택 ── */
  const onRowSelected = useCallback((e: any) => {
    if (!e.node.isSelected()) return;
    setSelected(e.data);
    setDetail(e.data);
  }, []);

  const colDefs = useMemo<ColDef[]>(() => [
    { checkboxSelection: true, width: 40, resizable: false, sortable: false },
    { field: 'jobCode',      headerName: 'JOB코드',   width: 90,  pinned: 'left' },
    { field: 'jobName',      headerName: 'JOB명',     flex: 1 },
    { field: 'jobPath',      headerName: 'JOB경로',   flex: 1 },
    { field: 'schedule',     headerName: '설명주기',  width: 120 },
    { field: 'useYn',        headerName: '사용여부',  width: 80,
      cellRenderer: (p: any) => (
        <span style={{ color: p.value === 'Y' ? '#059669' : '#dc2626', fontWeight: 600 }}>{p.value}</span>
      )
    },
    { field: 'workDivName',  headerName: '업무구분',  width: 100 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
    <div className="pdm-page">
      {/* 타이틀 바 */}
      <div className="pdm-title-bar">
        <h5 className="pdm-title">배치관리 (SYF010)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action" onClick={handleSave}   disabled={loading}><Save   size={13} /> 저장[F9]</button>
          <button className="btn-pdm-action danger" onClick={handleDelete} disabled={loading}><Trash2 size={13} /> 삭제[F5]</button>
          <button className="btn-pdm-action" onClick={handleRun} disabled={loading} style={{ color: '#7c3aed', borderColor: '#7c3aed' }}>
            <Play size={13} /> 시각실행
          </button>
          <button className="btn-pdm-action" onClick={handleInit} disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Star size={13} /></button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Info size={13} /></button>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="pdm-filter-bar" style={{ flexWrap: 'nowrap' }}>
        <span className="pdm-filter-label">JOB 코드</span>
        <input
          className="form-control"
          style={{ width: 130 }}
          value={filterJobCode}
          onChange={e => setFilterJobCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="JOB 코드"
        />
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 12 }}>
          <span className="pdm-filter-label">사용여부</span>
          <select
            className="form-select"
            style={{ width: 90, height: 28, fontSize: 12, padding: '2px 6px' }}
            value={filterUseYn}
            onChange={e => setFilterUseYn(e.target.value)}
          >
            <option>전체</option>
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 12 }}>
          <span className="pdm-filter-label">업무구분</span>
          <input
            className="form-control"
            style={{ width: 110, height: 28, fontSize: 12, padding: '2px 8px' }}
            value={filterWorkDiv}
            onChange={e => setFilterWorkDiv(e.target.value)}
            placeholder="업무구분"
          />
          <button className="pdm-lookup-btn" title="검색">?</button>
        </div>
      </div>

      {/* 컨텐츠: 좌 목록 + 우 상세 */}
      <div className="pdm-content">
        {/* 좌 목록 */}
        <div className="pdm-panel" style={{ width: '55%' }}>
          <div className="pdm-panel-header">배치 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                rowSelection="single"
                onRowSelected={onRowSelected}
              />
            </div>
          </div>
        </div>

        <div className="pdm-divider" />

        {/* 우 상세 */}
        <div className="pdm-panel" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="pdm-panel-header">배치 내용</div>
          <div className="pdm-panel-body" style={{ overflowY: 'auto' }}>
            <div className="pdm-detail-form">
              <div className="pdm-form-row">
                <span className="pdm-form-label required">JOB 코드</span>
                <input className="form-control form-control-sm" style={{ flex: 1 }}
                  value={detail.jobCode}
                  onChange={e => setDetail(d => ({ ...d, jobCode: e.target.value }))}
                  placeholder="예) SY001" />
              </div>
              <div className="pdm-form-row">
                <span className="pdm-form-label required">JOB 명</span>
                <input className="form-control form-control-sm" style={{ flex: 1 }}
                  value={detail.jobName}
                  onChange={e => setDetail(d => ({ ...d, jobName: e.target.value }))}
                  placeholder="배치 이름" />
              </div>
              <div className="pdm-form-row">
                <span className="pdm-form-label">JOB 경로</span>
                <input className="form-control form-control-sm" style={{ flex: 1 }}
                  value={detail.jobPath}
                  onChange={e => setDetail(d => ({ ...d, jobPath: e.target.value }))}
                  placeholder="예) ex.sy.SY001" />
              </div>
              <div className="pdm-form-row">
                <span className="pdm-form-label">설명주기</span>
                <input className="form-control form-control-sm" style={{ flex: 1 }}
                  value={detail.schedule}
                  onChange={e => setDetail(d => ({ ...d, schedule: e.target.value }))}
                  placeholder="cron 표현식 (예: 0 1 * * *)" />
              </div>
              <div className="pdm-form-row">
                <span className="pdm-form-label">사용여부</span>
                <div className="d-flex gap-3">
                  {['Y', 'N'].map(v => (
                    <label key={v} className="d-flex align-items-center gap-1" style={{ fontSize: '12px', cursor: 'pointer' }}>
                      <input type="radio" name="useYn" value={v} checked={detail.useYn === v}
                        onChange={() => setDetail(d => ({ ...d, useYn: v }))} />
                      {v === 'Y' ? '사용' : '미사용'}
                    </label>
                  ))}
                </div>
              </div>
              <div className="pdm-form-row">
                <span className="pdm-form-label">업무구분코드</span>
                <input className="form-control form-control-sm" style={{ flex: 1 }}
                  value={detail.workDiv}
                  onChange={e => setDetail(d => ({ ...d, workDiv: e.target.value }))}
                  placeholder="업무구분 코드" />
                <button className="pdm-lookup-btn ms-1" title="검색">?</button>
              </div>
              <div className="pdm-form-row" style={{ alignItems: 'flex-start' }}>
                <span className="pdm-form-label" style={{ marginTop: 6 }}>비고</span>
                <textarea className="form-control form-control-sm" style={{ flex: 1, height: 80, resize: 'none' }}
                  value={detail.desc}
                  onChange={e => setDetail(d => ({ ...d, desc: e.target.value }))} />
              </div>
            </div>

            {/* Cron 도움말 */}
            <div className="pdm-help-box mx-3 mb-3">
              <div style={{ fontWeight: 700, marginBottom: 6, color: '#1e293b' }}>★ 배치 서비스 실행 개념에 두 가지 필수 등록</div>
              <div>• <span className="highlight">JOB 코드</span> : 개발팀 배치 job Class 명. 구성을 위해 <span className="highlight">업무구분+JOB코드</span>에 맞게 생성</div>
              <div>• <span className="highlight">JOB 명</span> : 개발팀 배치 job.xml 에 명시되어 있는 항목</div>
              <div>• <span className="highlight">JOB 경로</span> : job-Class를 실행 하려면, <span className="highlight">경로(패키지명).JOB 코드</span> 로 입력한다. ex) sy.SY001</div>
              <div>• <span className="highlight">설명주기</span> : cron 입력시 1 초 부터 시 일 일 일</div>
              <div style={{ marginLeft: 12 }}>
                <div>- <span className="highlight">0 15 50 * * ?</span> → 매일 10:15 실행</div>
                <div>- <span className="highlight">0 0/y * * * ?</span> → 매일 기준으로 y분마다 실행</div>
                <div>- <span className="highlight">0 15 17 * * 5</span> → 매주 금요일 17시 15분 실행</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
