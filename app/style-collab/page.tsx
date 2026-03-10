'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Save, RotateCcw, Star, Info, Send } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface CollabRow {
  id: number;
  ordered: string;
  regDate: string;
  vendor: string;
  styleCode: string;
  styleName: string;
  color: string;
  tagPrice: number;
  settlePrice: number;
  spec: string;
  specPlanQty: number;
  colorPlanQty: number;
  specZone: string;
}

const FILTER_INIT = { zone: 'WM', brand: '', year: '24', season: 'M', vendor: '', designerNo: '1112121', designerName: '정신혜', regType: '전체' };

export default function StyleCollab() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [rowData, setRowData] = useState<CollabRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/style-collab');
      const data = await res.json();
      setRowData(data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { handleSearch(); }, []);

  const handleSave  = useCallback(async () => { await fetch('/api/style-collab', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rowData) }); alert('저장되었습니다.'); }, [rowData]);
  const handleOrder = useCallback(() => alert('발주 처리되었습니다.'), []);
  const handleInit  = useCallback(() => { setFilter(FILTER_INIT); setRowData([]); }, []);

  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilter(f => ({ ...f, [k]: e.target.value }));

  const orderedRenderer = (p: any) => (
    <span style={{ color: p.value === 'Y' ? '#16a34a' : '#9ca3af', fontWeight: 600 }}>{p.value}</span>
  );

  const colDefs = useMemo<ColDef[]>(() => [
    { field: '_chk',         headerName: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'ordered',      headerName: '발주여부', width: 80, cellRenderer: orderedRenderer },
    { field: 'regDate',      headerName: '등록일자', width: 110 },
    { field: 'vendor',       headerName: '거래처',   flex: 1 },
    { field: 'styleCode',    headerName: '스타일',   width: 130 },
    { field: 'styleName',    headerName: '스타일명', flex: 1 },
    { field: 'color',        headerName: '색상',     width: 70 },
    { field: 'tagPrice',     headerName: '태그가',   width: 90 },
    { field: 'settlePrice',  headerName: '정산단가', width: 90 },
    { field: 'spec',         headerName: '규격',     width: 70 },
    { field: 'specPlanQty',  headerName: '규격별기획량', width: 110 },
    { field: 'colorPlanQty', headerName: '색상기획량',  width: 100 },
    { field: 'specZone',     headerName: '규격존',   width: 80 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
    <div className="pdm-page">
      <div className="pdm-title-bar">
        <h5 className="pdm-title">스타일관리(콜라보) (CMB020)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action" onClick={handleSave}   disabled={loading}><Save size={13} /> 저장[F9]</button>
          <button className="btn-pdm-action" onClick={handleOrder}  disabled={loading}><Send size={13} /> 발주</button>
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
        <input className="form-control" style={{ width: 38 }} value={filter.season} onChange={setF('season')} />
        <button className="pdm-lookup-btn">?</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="pdm-filter-label">거래처</span>
          <input className="form-control" style={{ width: 100 }} value={filter.vendor} onChange={setF('vendor')} />
          <button className="pdm-lookup-btn">?</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="pdm-filter-label">디자이너사번</span>
          <input className="form-control" style={{ width: 80 }} value={filter.designerNo} onChange={setF('designerNo')} />
          <button className="pdm-lookup-btn">?</button>
          <input className="form-control" style={{ width: 80 }} value={filter.designerName} onChange={setF('designerName')} readOnly />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="pdm-filter-label">등록구분</span>
          <select className="form-select" style={{ width: 80 }} value={filter.regType} onChange={setF('regType')}>
            <option>전체</option><option>신규</option><option>기존</option>
          </select>
        </div>
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
      </div>

      <div className="pdm-content">
        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header">스타일(콜라보) 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={defaultColDef} rowSelection="multiple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
