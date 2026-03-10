'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Plus, Save, Trash2, RotateCcw, Star, Info, Upload } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface TemplateRow {
  id: number;
  menuModule: string;
  menuModuleClass: string;
  programName: string;
  templateName: string;
  fileName: string;
  fileSize: string;
  note: string;
}

const EMPTY_DETAIL: Partial<TemplateRow> = {
  menuModule: '', menuModuleClass: '', programName: '',
  templateName: '', fileName: '', fileSize: '', note: '',
};

export default function ExcelTemplate() {
  const [filterProgram, setFilterProgram] = useState('');
  const [rowData, setRowData]             = useState<TemplateRow[]>([]);
  const [selected, setSelected]           = useState<TemplateRow | null>(null);
  const [detail, setDetail]               = useState<Partial<TemplateRow>>(EMPTY_DETAIL);
  const [loading, setLoading]             = useState(false);

  /* ── 조회 ── */
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterProgram) params.set('program', filterProgram);
      const res = await fetch(`/api/excel-template?${params}`);
      if (!res.ok) throw new Error('조회에 실패했습니다.');
      const data = await res.json();
      setRowData(data);
      setSelected(null);
      setDetail(EMPTY_DETAIL);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, [filterProgram]);

  /* ── 신규 ── */
  const handleNew = useCallback(() => {
    setSelected(null);
    setDetail(EMPTY_DETAIL);
  }, []);

  /* ── 저장 ── */
  const handleSave = useCallback(async () => {
    if (!detail.programName || !detail.templateName) {
      alert('프로그램명과 양식명을 입력하세요.');
      return;
    }
    const res = await fetch('/api/excel-template', {
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
    if (!selected) { alert('삭제할 항목을 선택하세요.'); return; }
    if (!confirm(`"${selected.templateName}" 양식을 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/excel-template?id=${selected.id}`, { method: 'DELETE' });
    if (!res.ok) { alert('삭제에 실패했습니다.'); return; }
    alert('삭제되었습니다.');
    handleSearch();
  }, [selected, handleSearch]);

  /* ── 초기화 ── */
  const handleInit = useCallback(() => {
    setFilterProgram('');
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
    { field: 'menuModule',      headerName: '메뉴모듈',     width: 100 },
    { field: 'menuModuleClass', headerName: '메뉴모듈분류', width: 120 },
    { field: 'programName',     headerName: '프로그램명',   flex: 1 },
    { field: 'templateName',    headerName: '엑셀양식명',   flex: 1 },
    { field: 'note',            headerName: '비고',         width: 120 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
    <div className="pdm-page">
      {/* 타이틀 바 */}
      <div className="pdm-title-bar">
        <h5 className="pdm-title">엑셀양식관리 (SYB050)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action" onClick={handleNew} disabled={loading}><Plus size={13} /> 신규[F4]</button>
          <button className="btn-pdm-action" onClick={handleSave} disabled={loading}><Save size={13} /> 저장[F9]</button>
          <button className="btn-pdm-action danger" onClick={handleDelete} disabled={loading}><Trash2 size={13} /> 삭제[F5]</button>
          <button className="btn-pdm-action" onClick={handleInit} disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Star size={13} /></button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Info size={13} /></button>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="pdm-filter-bar">
        <span className="pdm-filter-label">프로그램</span>
        <input
          className="form-control"
          style={{ width: 200 }}
          value={filterProgram}
          onChange={e => setFilterProgram(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="프로그램명 검색"
        />
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}>
          <Search size={13} />
        </button>
      </div>

      {/* 컨텐츠: 좌 목록 + 우 상세 */}
      <div className="pdm-content">
        {/* 좌 목록 */}
        <div className="pdm-panel" style={{ width: '55%' }}>
          <div className="pdm-panel-header">엑셀양식 목록</div>
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
        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header">엑셀양식 상세</div>
          <div className="pdm-panel-body">
            <div className="pdm-detail-form">
              <div className="pdm-form-row">
                <span className="pdm-form-label required">프로그램</span>
                <input
                  className="form-control form-control-sm"
                  style={{ flex: 1 }}
                  value={detail.programName ?? ''}
                  onChange={e => setDetail(d => ({ ...d, programName: e.target.value }))}
                  placeholder="프로그램명"
                />
                <button className="pdm-lookup-btn" title="검색">?</button>
              </div>
              <div className="pdm-form-row">
                <span className="pdm-form-label">양식ID</span>
                <input
                  className="form-control form-control-sm"
                  style={{ flex: 1 }}
                  value={detail.id ? String(detail.id).padStart(5, '0') : ''}
                  readOnly
                  placeholder="자동 생성"
                />
              </div>
              <div className="pdm-form-row">
                <span className="pdm-form-label required">양식명</span>
                <input
                  className="form-control form-control-sm"
                  style={{ flex: 1 }}
                  value={detail.templateName ?? ''}
                  onChange={e => setDetail(d => ({ ...d, templateName: e.target.value }))}
                  placeholder="양식명 입력"
                />
              </div>
              <div className="pdm-form-row" style={{ alignItems: 'flex-start' }}>
                <span className="pdm-form-label required" style={{ marginTop: '6px' }}>양식파일</span>
                <div style={{ flex: 1 }}>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      className="form-control form-control-sm"
                      style={{ flex: 1 }}
                      value={detail.fileName ?? ''}
                      readOnly
                      placeholder="파일을 선택하세요"
                    />
                    {detail.fileSize && (
                      <span style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>{detail.fileSize}</span>
                    )}
                    {detail.fileName && (
                      <>
                        <button className="btn-pdm-action" style={{ padding: '2px 6px' }}>✓</button>
                        <button className="btn-pdm-action danger" style={{ padding: '2px 6px' }}>✕</button>
                      </>
                    )}
                    <button
                      className="btn btn-sm"
                      style={{ background: '#0891b2', color: '#fff', border: 'none', fontSize: '11px', padding: '3px 10px', borderRadius: '4px', whiteSpace: 'nowrap' }}
                    >
                      <Upload size={12} className="me-1" />파일
                    </button>
                  </div>
                </div>
              </div>
              <div className="pdm-form-row" style={{ alignItems: 'flex-start' }}>
                <span className="pdm-form-label" style={{ marginTop: '6px' }}>비고</span>
                <textarea
                  className="form-control form-control-sm"
                  style={{ flex: 1, height: '100px', resize: 'none' }}
                  value={detail.note ?? ''}
                  onChange={e => setDetail(d => ({ ...d, note: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
