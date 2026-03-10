'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { RotateCcw, Search, Save, Folder, List } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function CommonCode() {
  const [searchText,        setSearchText]        = useState('');
  const [masterRowData,     setMasterRowData]     = useState<any[]>([]);
  const [detailRowData,     setDetailRowData]     = useState<any[]>([]);
  const [selectedGroupCode, setSelectedGroupCode] = useState('');
  const [loading,           setLoading]           = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: 'master' });
      if (searchText) params.set('q', searchText);
      const res = await fetch(`/api/common-code?${params}`);
      if (!res.ok) throw new Error('조회에 실패했습니다.');
      setMasterRowData(await res.json());
      setDetailRowData([]);
      setSelectedGroupCode('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  const handleInit = useCallback(() => {
    setSearchText('');
    setMasterRowData([]);
    setDetailRowData([]);
    setSelectedGroupCode('');
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedGroupCode) { alert('코드구분을 선택하세요.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/common-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupCode: selectedGroupCode, items: detailRowData }),
      });
      if (!res.ok) throw new Error('저장에 실패했습니다.');
      alert('상세코드가 저장되었습니다.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedGroupCode, detailRowData]);

  const onMasterRowSelected = useCallback(async (event: any) => {
    if (!event.node.isSelected()) return;
    const code = event.data.groupCode;
    setSelectedGroupCode(code);
    try {
      const res = await fetch(`/api/common-code?groupCode=${code}`);
      if (!res.ok) throw new Error('상세코드 조회 실패');
      setDetailRowData(await res.json());
    } catch (err: any) {
      alert(err.message);
    }
  }, []);

  const onDetailCellValueChanged = useCallback((event: any) => {
    setDetailRowData(prev => prev.map(row => row.code === event.data.code ? { ...row, ...event.data } : row));
  }, []);

  const masterColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'groupCode', headerName: '구분코드', width: 100, pinned: 'left', cellStyle: { fontWeight: 'bold' } },
    { field: 'groupName', headerName: '구분명',   flex: 1 },
  ], []);

  const detailColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'code',  headerName: '코드',   width: 100, editable: true, cellStyle: { fontWeight: 'bold' } },
    { field: 'name',  headerName: '코드명', flex: 1,    editable: true },
    { field: 'useYn', headerName: '사용여부', width: 100, editable: true,
      cellRenderer: (params: any) => <input type="checkbox" checked={params.value} readOnly />
    },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, wrapHeaderText: true, sortable: true, filter: true, autoHeaderHeight: true }), []);

  return (
    <div className="container-fluid">
      <div className="card mb-4 p-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-8">
            <label className="form-label small fw-bold text-muted">코드구분명 검색</label>
            <input type="text" className="form-control form-control-sm border-secondary-subtle"
              placeholder="코드구분명 또는 코드를 입력하세요"
              value={searchText} onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <div className="col-md-4 d-flex gap-2 justify-content-end">
            <button className="btn btn-sm btn-amer px-4 shadow-sm" onClick={handleSearch} disabled={loading}>
              <Search size={14} className="me-1" />조회
            </button>
            <button className="btn btn-sm btn-light border px-4" onClick={handleInit} disabled={loading}>
              <RotateCcw size={14} className="me-1" />초기화
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white p-3 border-bottom-0">
              <div className="d-flex align-items-center gap-2">
                <Folder size={18} style={{ color: 'var(--amer-red)' }} />
                <h6 className="mb-0 fw-bold">코드구분 목록</h6>
              </div>
            </div>
            <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
              <AgGridReact
                rowData={masterRowData}
                columnDefs={masterColumnDefs}
                defaultColDef={defaultColDef}
                rowSelection="single"
                onRowSelected={onMasterRowSelected}
              />
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white p-3 border-bottom-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <List size={18} style={{ color: 'var(--amer-red)' }} />
                <h6 className="mb-0 fw-bold">상세코드 목록 {selectedGroupCode && <span className="text-muted fw-normal small">({selectedGroupCode})</span>}</h6>
              </div>
              <button className="btn btn-sm btn-amer px-3 shadow-sm" onClick={handleSave} disabled={loading}>
                <Save size={14} className="me-1" />저장
              </button>
            </div>
            <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
              <AgGridReact
                rowData={detailRowData}
                columnDefs={detailColumnDefs}
                defaultColDef={defaultColDef}
                onCellValueChanged={onDetailCellValueChanged}
                singleClickEdit={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
