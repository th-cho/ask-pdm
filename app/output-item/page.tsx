'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Save, Trash2, RotateCcw, Star, Info, X } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface OutputRow {
  id: number;
  programId: string;
  programName: string;
  outputId: string;
  outputName: string;
  outputPath: string;
  sortOrder: number;
}

interface ProgramRow {
  moduleId: string;
  moduleClassId: string;
  moduleClassName: string;
  programId: string;
  programName: string;
}

export default function OutputItem() {
  const [filterProgramId, setFilterProgramId] = useState('');
  const [filterProgramName, setFilterProgramName] = useState('');
  const [filterOutputQ, setFilterOutputQ]       = useState('');
  const [rowData, setRowData]                   = useState<OutputRow[]>([]);
  const [loading, setLoading]                   = useState(false);

  // 프로그램 검색 모달
  const [showModal, setShowModal]               = useState(false);
  const [modalPrograms, setModalPrograms]       = useState<ProgramRow[]>([]);
  const [modalFilter, setModalFilter]           = useState({ id: '', name: '' });
  const [modalLoading, setModalLoading]         = useState(false);

  /* ── 조회 ── */
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterProgramId) params.set('programId', filterProgramId);
      if (filterOutputQ)   params.set('q', filterOutputQ);
      const res = await fetch(`/api/output-item?${params}`);
      if (!res.ok) throw new Error('조회에 실패했습니다.');
      setRowData(await res.json());
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, [filterProgramId, filterOutputQ]);

  /* ── 저장 ── */
  const handleSave = useCallback(async () => {
    const res = await fetch('/api/output-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rowData),
    });
    if (!res.ok) { alert('저장에 실패했습니다.'); return; }
    alert('저장되었습니다.');
  }, [rowData]);

  /* ── 삭제 ── */
  const handleDelete = useCallback(async () => {
    alert('삭제할 행을 체크박스로 선택 후 삭제하세요.');
  }, []);

  /* ── 초기화 ── */
  const handleInit = useCallback(() => {
    setFilterProgramId('');
    setFilterProgramName('');
    setFilterOutputQ('');
    setRowData([]);
  }, []);

  /* ── 프로그램 검색 모달 ── */
  const openModal = async () => {
    setShowModal(true);
    setModalFilter({ id: '', name: '' });
    await loadModalPrograms('', '');
  };

  const loadModalPrograms = async (id: string, name: string) => {
    setModalLoading(true);
    try {
      const q = id || name;
      const res = await fetch(`/api/output-item?type=programs${q ? `&q=${q}` : ''}`);
      setModalPrograms(await res.json());
    } finally {
      setModalLoading(false);
    }
  };

  const onModalSearch = () => loadModalPrograms(modalFilter.id, modalFilter.name);

  const onModalSelect = (row: ProgramRow) => {
    setFilterProgramId(row.programId);
    setFilterProgramName(row.programName);
    setShowModal(false);
  };

  /* ── 컬럼 정의 ── */
  const colDefs = useMemo<ColDef[]>(() => [
    { checkboxSelection: true, width: 40, headerCheckboxSelection: true, pinned: 'left', resizable: false, sortable: false },
    { field: 'programId',   headerName: '프로그램ID',  width: 100 },
    { field: 'programName', headerName: '프로그램명',  width: 140 },
    { field: 'outputId',    headerName: '출력물ID',    width: 100, editable: true },
    { field: 'outputName',  headerName: '출력물명',    flex: 1,    editable: true },
    { field: 'outputPath',  headerName: '출력물경로',  flex: 1,    editable: true },
    { field: 'sortOrder',   headerName: '정렬순서',    width: 90,  editable: true, type: 'numericColumn' },
  ], []);

  const modalColDefs = useMemo<ColDef[]>(() => [
    { field: 'moduleId',        headerName: '모듈ID',     width: 80 },
    { field: 'moduleClassId',   headerName: '모듈분류ID', width: 100 },
    { field: 'moduleClassName', headerName: '모듈분류명', width: 110 },
    { field: 'programId',       headerName: '프로그램ID', width: 100 },
    { field: 'programName',     headerName: '프로그램명', flex: 1 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
    <div className="pdm-page">
      {/* 타이틀 바 */}
      <div className="pdm-title-bar">
        <h5 className="pdm-title">출력물등록 (SYB060)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action" onClick={handleSave}   disabled={loading}><Save   size={13} /> 저장[F9]</button>
          <button className="btn-pdm-action danger" onClick={handleDelete} disabled={loading}><Trash2 size={13} /> 삭제[F5]</button>
          <button className="btn-pdm-action" onClick={handleInit}   disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Star size={13} /></button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Info size={13} /></button>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="pdm-filter-bar">
        <span className="pdm-filter-label">프로그램ID</span>
        <input
          className="form-control"
          style={{ width: 130 }}
          value={filterProgramId}
          readOnly
          placeholder="프로그램ID"
        />
        <button className="pdm-lookup-btn" onClick={openModal}>?</button>
        <input
          className="form-control"
          style={{ width: 160 }}
          value={filterProgramName}
          readOnly
          placeholder="프로그램명"
        />
        <span className="pdm-filter-label" style={{ marginLeft: 16 }}>출력물ID/명</span>
        <input
          className="form-control"
          style={{ width: 160 }}
          value={filterOutputQ}
          onChange={e => setFilterOutputQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="출력물ID 또는 명칭"
        />
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}>
          <Search size={13} />
        </button>
      </div>

      {/* 그리드 */}
      <div className="pdm-content">
        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header">출력물 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
                singleClickEdit
              />
            </div>
          </div>
        </div>
      </div>

      {/* 프로그램 검색 모달 */}
      {showModal && (
        <div className="pdm-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="pdm-modal" style={{ minWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="pdm-modal-header">
              <span className="pdm-modal-title">프로그램 검색</span>
              <button className="pdm-modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="pdm-modal-body">
              {/* 모달 필터 */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="pdm-filter-label">프로그램ID</span>
                <input
                  className="form-control form-control-sm"
                  style={{ width: 140 }}
                  value={modalFilter.id}
                  onChange={e => setModalFilter(f => ({ ...f, id: e.target.value }))}
                  placeholder="프로그램ID"
                />
                <span className="pdm-filter-label">프로그램명</span>
                <input
                  className="form-control form-control-sm"
                  style={{ width: 160 }}
                  value={modalFilter.name}
                  onChange={e => setModalFilter(f => ({ ...f, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && onModalSearch()}
                  placeholder="프로그램명"
                />
                <button className="btn-pdm-action" onClick={onModalSearch} disabled={modalLoading}>
                  <Search size={12} /> 조회[F3]
                </button>
                <button className="btn-pdm-action" onClick={() => setModalFilter({ id: '', name: '' })}>
                  <RotateCcw size={12} /> 초기화[F12]
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '8px', color: '#374151' }}>프로그램ID 목록</div>
              <div className="ag-theme-alpine" style={{ height: 300 }}>
                <AgGridReact
                  rowData={modalPrograms}
                  columnDefs={modalColDefs}
                  defaultColDef={defaultColDef}
                  rowSelection="single"
                  onRowDoubleClicked={e => onModalSelect(e.data)}
                  onRowClicked={e => e.node.setSelected(true)}
                />
              </div>
            </div>
            <div className="pdm-modal-footer">
              <button
                className="btn btn-sm btn-primary px-4"
                onClick={() => {
                  // 선택된 행 처리
                  setShowModal(false);
                }}
              >
                확인
              </button>
              <button className="btn btn-sm btn-light border px-4" onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
