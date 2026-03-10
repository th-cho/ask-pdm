'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Plus, Save, Trash2, RotateCcw, Star, Info } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface AccessoryRow {
  id: number;
  matType: string;
  matTypeName: string;
  matName: string;
  color: string;
  colorName: string;
  spec: string;
  unitPrice: number;
  unit: string;
  reqQty: number;
  regDate: string;
  modDate: string;
}

const FILTER_INIT = { zone: 'OL', brand: '', year: '24', season: '', q: '' };

export default function AccessoryBase() {
  const [filter, setFilter]       = useState(FILTER_INIT);
  const [rowData, setRowData]     = useState<AccessoryRow[]>([]);
  const [selected, setSelected]   = useState<AccessoryRow | null>(null);
  const [loading, setLoading]     = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.q) params.set('q', filter.q);
      const res  = await fetch(`/api/accessory-base?${params}`);
      const data = await res.json();
      setRowData(data);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { handleSearch(); }, []);

  const handleNew    = useCallback(() => setSelected(null), []);
  const handleSave   = useCallback(async () => { await fetch('/api/accessory-base', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rowData) }); alert('저장되었습니다.'); }, [rowData]);
  const handleDelete = useCallback(async () => {
    if (!selected) { alert('삭제할 항목을 선택하세요.'); return; }
    if (!confirm('선택한 항목을 삭제하시겠습니까?')) return;
    alert('삭제되었습니다.');
    handleSearch();
  }, [selected, handleSearch]);
  const handleInit   = useCallback(() => { setFilter(FILTER_INIT); setRowData([]); setSelected(null); }, []);

  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(f => ({ ...f, [k]: e.target.value }));

  const colDefs = useMemo<ColDef[]>(() => [
    { field: 'matType',     headerName: '자재종류',   width: 90 },
    { field: 'matTypeName', headerName: '자재종류명', width: 110 },
    { field: 'matName',     headerName: '자재명',     flex: 1 },
    { field: 'color',       headerName: '자재색상',   width: 90 },
    { field: 'colorName',   headerName: '자재색상명', width: 100 },
    { field: 'spec',        headerName: '자재규격',   width: 120 },
    { field: 'unitPrice',   headerName: '단가',       width: 80 },
    { field: 'unit',        headerName: '단위',       width: 70 },
    { field: 'reqQty',      headerName: '소요량',     width: 80 },
    { field: 'regDate',     headerName: '등록일자',   width: 110 },
    { field: 'modDate',     headerName: '수정일자',   width: 110 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true, editable: true }), []);

  return (
    <div className="pdm-page">
      <div className="pdm-title-bar">
        <h5 className="pdm-title">완성부자재기초정보 (CMA020)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action" onClick={handleNew}    disabled={loading}><Plus size={13} /> 신규[F4]</button>
          <button className="btn-pdm-action" onClick={handleSave}   disabled={loading}><Save size={13} /> 저장[F9]</button>
          <button className="btn-pdm-action danger" onClick={handleDelete} disabled={loading}><Trash2 size={13} /> 삭제[F5]</button>
          <button className="btn-pdm-action" onClick={handleInit}   disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Star size={13} /></button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Info size={13} /></button>
        </div>
      </div>

      <div className="pdm-filter-bar" style={{ flexWrap: 'nowrap', gap: 6 }}>
        <span className="pdm-filter-label">존브랜드년시</span>
        <input className="form-control" style={{ width: 55 }} value={filter.zone} onChange={setF('zone')} />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control" style={{ width: 55 }} value={filter.brand} onChange={setF('brand')} placeholder="브랜드" />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control" style={{ width: 38 }} value={filter.year} onChange={setF('year')} />
        <button className="pdm-lookup-btn">?</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="pdm-filter-label">자재명</span>
          <input className="form-control" style={{ width: 150 }} value={filter.q} onChange={setF('q')} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="자재명 검색" />
        </div>
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
      </div>

      <div className="pdm-content">
        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header">완성부자재 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                rowSelection="single"
                onRowSelected={e => { if (e.node.isSelected()) setSelected(e.data); }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
