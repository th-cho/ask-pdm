'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Printer, RotateCcw, Star, Info } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow {
  id: number;
  styleCode: string;
  styleName: string;
  repStyleCode: string;
  designerName: string;
}

const OUTPUT_OPTIONS = ['작업지시서 - 기본', '작업지시서 - 방자재', '봉제사양서', '재봉'];
const FILTER_INIT = { zone: 'OL', brand: '', year: '24', season: '5', style: '', repStyle: '', queryType: '' };

export default function StylePrint() {
  const [filter, setFilter]       = useState(FILTER_INIT);
  const [rowData, setRowData]     = useState<StyleRow[]>([]);
  const [outputType, setOutputType] = useState(OUTPUT_OPTIONS[0]);
  const [loading, setLoading]     = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/style-print');
      const data = await res.json();
      setRowData(data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { handleSearch(); }, []);

  const handlePrint = useCallback(() => alert(`[${outputType}] 출력을 시작합니다.`), [outputType]);
  const handleInit  = useCallback(() => { setFilter(FILTER_INIT); setRowData([]); }, []);

  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilter(f => ({ ...f, [k]: e.target.value }));

  const colDefs = useMemo<ColDef[]>(() => [
    { field: '_chk',         headerName: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'styleCode',    headerName: '스타일코드',    flex: 1 },
    { field: 'styleName',    headerName: '스타일명',      flex: 1 },
    { field: 'repStyleCode', headerName: '대표스타일코드', flex: 1 },
    { field: 'designerName', headerName: '디자이너명',    width: 110 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
    <div className="pdm-page">
      <div className="pdm-title-bar">
        <h5 className="pdm-title">문서일괄출력 (CMB060)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action" onClick={handlePrint}  disabled={loading}><Printer size={13} /> 출력[F1]</button>
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
          <span className="pdm-filter-label">스타일</span>
          <input className="form-control" style={{ width: 120 }} value={filter.style} onChange={setF('style')} />
          <button className="pdm-lookup-btn">?</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="pdm-filter-label">대표스타일</span>
          <input className="form-control" style={{ width: 120 }} value={filter.repStyle} onChange={setF('repStyle')} />
          <button className="pdm-lookup-btn">?</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="pdm-filter-label">조회구분</span>
          <select className="form-select" style={{ width: 80 }} value={filter.queryType} onChange={setF('queryType')}>
            <option value="">전체</option><option value="1">신규</option><option value="2">기존</option>
          </select>
        </div>
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
      </div>

      <div className="pdm-content" style={{ flexDirection: 'column', gap: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 8px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>출력물 선택</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 200 }}
              value={outputType}
              onChange={e => setOutputType(e.target.value)}
            >
              {OUTPUT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header">스타일 목록</div>
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
