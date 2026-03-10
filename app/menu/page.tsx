'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { RotateCcw, Search, PlusCircle, Save, Menu, Plus, Trash2 } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function MenuPage() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchName,    setSearchName]    = useState('');
  const [rowData,       setRowData]       = useState<any[]>([]);
  const [loading,       setLoading]       = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGroup) params.set('group', selectedGroup);
      if (searchName)    params.set('name',  searchName);
      const res = await fetch(`/api/menu?${params}`);
      if (!res.ok) throw new Error('조회에 실패했습니다.');
      setRowData(await res.json());
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup, searchName]);

  const handleInit = useCallback(() => {
    setSelectedGroup('');
    setSearchName('');
    setRowData([]);
  }, []);

  const handleAddMenu = useCallback(() => {
    const name = prompt('새 대메뉴 이름을 입력하세요:');
    if (!name) return;
    const newOrder = rowData.length > 0 ? Math.max(...rowData.map(r => r.order)) + 1 : 1;
    setRowData(prev => [...prev, {
      order: newOrder, group: name, level: '1단계', name,
      programId: '-', sortOrder: newOrder * 10, useYn: true,
    }]);
  }, [rowData]);

  const handleAddSubMenu = useCallback((parentName: string) => {
    const name = prompt(`[${parentName}] 하위 메뉴 이름을 입력하세요:`);
    if (!name) return;
    const newOrder = rowData.length > 0 ? Math.max(...rowData.map(r => r.order)) + 1 : 1;
    setRowData(prev => [...prev, {
      order: newOrder, group: parentName, level: '2단계', name,
      programId: '-', sortOrder: newOrder * 10, useYn: true,
    }]);
  }, [rowData]);

  const handleDeleteMenu = useCallback((order: number, name: string) => {
    if (!confirm(`[${name}] 메뉴를 삭제하시겠습니까?`)) return;
    setRowData(prev => prev.filter(r => r.order !== order));
  }, []);

  const handleSave = useCallback(async () => {
    if (!rowData.length) { alert('조회 후 저장하세요.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData),
      });
      if (!res.ok) throw new Error('저장에 실패했습니다.');
      alert('메뉴 변경사항이 저장되었습니다.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [rowData]);

  const onCellValueChanged = useCallback((event: any) => {
    setRowData(prev => prev.map(row => row.order === event.data.order ? { ...row, ...event.data } : row));
  }, []);

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'order',     headerName: '순서', width: 60, pinned: 'left' },
    { field: 'group',     headerName: '그룹', width: 120 },
    { field: 'level',     headerName: '레벨', width: 80,
      cellRenderer: (params: any) => {
        if (params.value === '1단계') return <span className="badge bg-dark">1단계</span>;
        if (params.value === '2단계') return <span className="badge bg-secondary">2단계</span>;
        return params.value;
      }
    },
    { field: 'name',      headerName: '메뉴 명', width: 200,
      cellRenderer: (params: any) => {
        if (params.data.level === '2단계') return <span style={{ paddingLeft: '20px' }}>└ {params.value}</span>;
        return <b>{params.value}</b>;
      }
    },
    { field: 'programId', headerName: '연결 프로그램 ID', width: 150, cellStyle: { color: '#8B0029', fontWeight: 'bold' } },
    { field: 'sortOrder', headerName: '정렬순서',  width: 100, editable: true },
    { field: 'useYn',     headerName: '사용여부',  width: 100,
      cellRenderer: (params: any) => <input type="checkbox" className="form-check-input" checked={params.value} readOnly />
    },
    { field: 'manage',    headerName: '관리',      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.level === '1단계')
          return <Plus size={14} style={{ cursor: 'pointer' }} onClick={() => handleAddSubMenu(params.data.name)} />;
        return <Trash2 className="text-muted" size={14} style={{ cursor: 'pointer' }} onClick={() => handleDeleteMenu(params.data.order, params.data.name)} />;
      }
    },
  ], [handleAddSubMenu, handleDeleteMenu]);

  const defaultColDef = useMemo(() => ({ resizable: true, wrapHeaderText: true, sortable: false, filter: false, autoHeaderHeight: true }), []);

  return (
    <div className="container-fluid">
      <div className="card mb-4 p-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-bold text-muted">메뉴 그룹</label>
            <select className="form-select form-select-sm border-secondary-subtle"
              value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
              <option value="">전체</option>
              <option value="SY">시스템 관리</option>
              <option value="BS">기초 관리</option>
              <option value="AT">근태 관리</option>
              <option value="ST">현황 관리</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold text-muted">메뉴 명</label>
            <input type="text" className="form-control form-control-sm border-secondary-subtle"
              placeholder="찾으실 메뉴 이름을 입력하세요."
              value={searchName} onChange={e => setSearchName(e.target.value)}
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
            <Menu size={18} style={{ color: 'var(--amer-red)' }} />
            <h6 className="mb-0 fw-bold">시스템 메뉴 계층 구조</h6>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary px-3" onClick={handleAddMenu} disabled={loading}>
              <PlusCircle size={14} className="me-1" />대메뉴 추가
            </button>
            <button className="btn btn-sm btn-amer px-3 shadow-sm" onClick={handleSave} disabled={loading}>
              <Save size={14} className="me-1" />변경사항 저장
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
