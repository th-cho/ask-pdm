'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Trash2, RotateCcw, Star, Info } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow {
  id: number;
  styleCode: string;
  styleName: string;
  repStyleCode: string;
  brandZone: string;
}

const FILTER_INIT = { zone: 'OL', brand: '', year: '24', season: 'S', style: '', repStyle: '' };

export default function StyleDelete() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [rowData, setRowData] = useState<StyleRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.style)    params.set('style', filter.style);
      if (filter.repStyle) params.set('repStyle', filter.repStyle);
      const res  = await fetch(`/api/style-delete?${params}`);
      const data = await res.json();
      setRowData(data);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { handleSearch(); }, []);

  const handleDelete = useCallback(async () => {
    const checked = rowData.filter((r: any) => r._checked);
    if (!checked.length) { alert('삭제할 항목을 선택하세요.'); return; }
    if (!confirm(`선택한 ${checked.length}개 스타일을 삭제하시겠습니까?`)) return;
    await fetch('/api/style-delete', { method: 'DELETE' });
    alert('삭제되었습니다.');
    handleSearch();
  }, [rowData, handleSearch]);

  const handleInit = useCallback(() => {
    setFilter(FILTER_INIT);
    setRowData([]);
  }, []);

  const colDefs = useMemo<ColDef[]>(() => [
    { field: '_checked', headerName: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'styleCode',    headerName: '스타일코드',    flex: 1 },
    { field: 'styleName',    headerName: '스타일명',      flex: 1 },
    { field: 'repStyleCode', headerName: '대표스타일코드', flex: 1 },
    { field: 'brandZone',    headerName: '브랜드존',      width: 100 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="pdm-page">
      <div className="pdm-title-bar">
        <h5 className="pdm-title">스타일삭제 (CMB010)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action danger" onClick={handleDelete} disabled={loading}><Trash2 size={13} /> 삭제[F5]</button>
          <button className="btn-pdm-action" onClick={handleInit} disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Star size={13} /></button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Info size={13} /></button>
        </div>
      </div>

      <div className="pdm-filter-bar" style={{ flexWrap: 'nowrap' }}>
        <span className="pdm-filter-label">존브랜드년시</span>
        <input className="form-control" style={{ width: 60 }} value={filter.zone} onChange={setF('zone')} />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control" style={{ width: 60 }} value={filter.brand} onChange={setF('brand')} placeholder="브랜드" />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control" style={{ width: 40 }} value={filter.year} onChange={setF('year')} />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control" style={{ width: 40 }} value={filter.season} onChange={setF('season')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">스타일</span>
        <input className="form-control" style={{ width: 120 }} value={filter.style} onChange={setF('style')} placeholder="스타일코드" />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">대표스타일</span>
        <input className="form-control" style={{ width: 120 }} value={filter.repStyle} onChange={setF('repStyle')} placeholder="대표스타일코드" />
        <button className="pdm-lookup-btn">?</button>
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
      </div>

      <div className="pdm-content">
        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header">스타일 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
