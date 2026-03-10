'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { RotateCcw, Search, Plus, Save, LayoutGrid } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function Program() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType,  setSelectedType]  = useState('');
  const [searchText,    setSearchText]    = useState('');
  const [rowData,       setRowData]       = useState<any[]>([]);
  const [loading,       setLoading]       = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGroup) params.set('group', selectedGroup);
      if (selectedType)  params.set('type',  selectedType);
      if (searchText)    params.set('q',     searchText);
      const res = await fetch(`/api/program?${params}`);
      if (!res.ok) throw new Error('조회에 실패했습니다.');
      setRowData(await res.json());
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup, selectedType, searchText]);

  const handleInit = useCallback(() => {
    setSelectedGroup('');
    setSelectedType('');
    setSearchText('');
    setRowData([]);
  }, []);

  const handleAdd = useCallback(() => {
    const newNo = rowData.length > 0 ? Math.max(...rowData.map(r => r.no)) + 1 : 1;
    setRowData(prev => [...prev, { no: newNo, group: '', id: '', name: '신규 프로그램', type: '화면', url: '', useYn: true, status: '대기' }]);
  }, [rowData]);

  const handleSave = useCallback(async () => {
    if (!rowData.length) { alert('조회 후 저장하세요.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData),
      });
      if (!res.ok) throw new Error('저장에 실패했습니다.');
      alert('프로그램 정보가 저장되었습니다.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [rowData]);

  const onCellValueChanged = useCallback((event: any) => {
    setRowData(prev => prev.map(row => row.no === event.data.no ? { ...row, ...event.data } : row));
  }, []);

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'no',     headerName: 'NO',          width: 60,  pinned: 'left' },
    { field: 'group',  headerName: '업무그룹',    width: 120, editable: true },
    { field: 'id',     headerName: '프로그램 ID', width: 150, editable: true, cellStyle: { fontWeight: 'bold', color: '#8B0029' } },
    { field: 'name',   headerName: '프로그램 명', width: 200, editable: true },
    { field: 'type',   headerName: '유형',        width: 100, editable: true,
      cellRenderer: (params: any) => {
        if (params.value === '화면') return <span className="badge bg-light text-dark border">화면</span>;
        if (params.value === 'API')  return <span className="badge bg-light text-primary border">API</span>;
        return params.value;
      }
    },
    { field: 'url',    headerName: '경로 (URL)', flex: 1, minWidth: 200, editable: true },
    { field: 'useYn',  headerName: '사용',       width: 80,
      cellRenderer: (params: any) => <input type="checkbox" className="form-check-input" checked={params.value} readOnly />
    },
    { field: 'status', headerName: '상태',       width: 100,
      cellRenderer: (params: any) => {
        if (params.value === '정상') return <span className="status-badge bg-success-subtle text-success">정상</span>;
        if (params.value === '대기') return <span className="status-badge bg-secondary-subtle text-secondary">대기</span>;
        return params.value;
      }
    },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, wrapHeaderText: true, sortable: true, filter: true, autoHeaderHeight: true }), []);

  return (
    <div className="container-fluid">
      <div className="card mb-4 p-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
            <label className="form-label small fw-bold text-muted">업무그룹</label>
            <select className="form-select form-select-sm border-secondary-subtle"
              value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
              <option value="">전체</option>
              <option value="SY">시스템관리</option>
              <option value="BS">기초관리</option>
              <option value="AT">근태관리</option>
              <option value="ST">현황관리</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-bold text-muted">프로그램유형</label>
            <select className="form-select form-select-sm border-secondary-subtle"
              value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="">전체</option>
              <option value="S">화면(Screen)</option>
              <option value="A">API</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label small fw-bold text-muted">프로그램 ID / 명</label>
            <input type="text" className="form-control form-control-sm border-secondary-subtle"
              placeholder="검색어를 입력하세요."
              value={searchText} onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <div className="col-md-3 d-flex gap-2 justify-content-end">
            <button className="btn btn-sm btn-amer px-4 shadow-sm" onClick={handleSearch} disabled={loading}>
              <Search size={14} className="me-1" />조회
            </button>
            <button className="btn btn-sm btn-light border px-3" onClick={handleInit} disabled={loading}>
              <RotateCcw size={14} className="me-1" />초기화
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center border-bottom-0">
          <div className="d-flex align-items-center gap-2">
            <LayoutGrid size={18} style={{ color: 'var(--amer-red)' }} />
            <h6 className="mb-0 fw-bold">프로그램 리스트</h6>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary px-3" onClick={handleAdd} disabled={loading}>
              <Plus size={14} className="me-1" />추가
            </button>
            <button className="btn btn-sm btn-amer px-3 shadow-sm" onClick={handleSave} disabled={loading}>
              <Save size={14} className="me-1" />저장
            </button>
          </div>
        </div>
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onCellValueChanged={onCellValueChanged}
            singleClickEdit={true}
          />
        </div>
      </div>
    </div>
  );
}
