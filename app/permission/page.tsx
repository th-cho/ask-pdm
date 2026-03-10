'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { RotateCcw, Search, Save, ShieldCheck } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function Permission() {
  const [selectedGroup, setSelectedGroup] = useState('시스템관리자');
  const [rowData,       setRowData]       = useState<any[]>([]);
  const [loading,       setLoading]       = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/permission?group=${encodeURIComponent(selectedGroup)}`);
      if (!res.ok) throw new Error('조회에 실패했습니다.');
      setRowData(await res.json());
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  const handleInit = useCallback(() => {
    setSelectedGroup('시스템관리자');
    setRowData([]);
  }, []);

  const handleSave = useCallback(async () => {
    if (!rowData.length) { alert('조회 후 저장하세요.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: selectedGroup, rows: rowData }),
      });
      if (!res.ok) throw new Error('저장에 실패했습니다.');
      alert(`[${selectedGroup}] 권한 설정이 저장되었습니다.`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup, rowData]);

  const checkboxRenderer = (params: any) =>
    <input type="checkbox" className="form-check-input" checked={params.value} readOnly />;

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'id',     headerName: '프로그램 ID', width: 150, pinned: 'left', cellStyle: { fontWeight: 'bold', color: '#8B0029' } },
    { field: 'name',   headerName: '프로그램명',  width: 200, pinned: 'left' },
    { field: 'access', headerName: '접근권한',    width: 100, cellRenderer: checkboxRenderer },
    { field: 'read',   headerName: '조회',        width: 100, cellRenderer: checkboxRenderer },
    { field: 'write',  headerName: '저장/수정',   width: 100, cellRenderer: checkboxRenderer },
    { field: 'delete', headerName: '삭제',        width: 100, cellRenderer: checkboxRenderer },
    { field: 'print',  headerName: '출력/엑셀',   width: 100, cellRenderer: checkboxRenderer },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, wrapHeaderText: true, sortable: true, filter: true, autoHeaderHeight: true }), []);

  return (
    <div className="container-fluid">
      <div className="card mb-4 p-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label small fw-bold text-muted">권한 그룹 선택</label>
            <select className="form-select form-select-sm border-secondary-subtle"
              value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
              <option>시스템관리자</option>
              <option>매장관리자</option>
              <option>일반사용자</option>
            </select>
          </div>
          <div className="col-md-8 d-flex justify-content-end gap-2">
            <button className="btn btn-sm btn-amer px-4 shadow-sm" onClick={handleSearch} disabled={loading}>
              <Search size={14} className="me-1" />조회
            </button>
            <button className="btn btn-sm btn-amer px-4 shadow-sm" onClick={handleSave} disabled={loading}>
              <Save size={14} className="me-1" />저장
            </button>
            <button className="btn btn-sm btn-light border px-4" onClick={handleInit} disabled={loading}>
              <RotateCcw size={14} className="me-1" />초기화
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white p-3 border-bottom-0">
          <div className="d-flex align-items-center gap-2">
            <ShieldCheck size={18} style={{ color: 'var(--amer-red)' }} />
            <h6 className="mb-0 fw-bold">프로그램별 권한 설정 — <span className="text-muted fw-normal">{selectedGroup}</span></h6>
          </div>
        </div>
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
          />
        </div>
      </div>
    </div>
  );
}
