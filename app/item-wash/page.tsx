'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Save, RotateCcw, Star, Info } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface ItemRow   { itemCode: string; itemName: string; }
interface WashRow   { no: string; category: string; categoryName: string; desc: string; useYn: boolean; }

const FILTER_INIT = { zone: 'OL', brand: 'OL', line: 'B', year: '24', item: '' };

export default function ItemWash() {
  const [filter, setFilter]       = useState(FILTER_INIT);
  const [items, setItems]         = useState<ItemRow[]>([]);
  const [washList, setWashList]   = useState<WashRow[]>([]);
  const [selItem, setSelItem]     = useState<ItemRow | null>(null);
  const [loading, setLoading]     = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const [itemRes, washRes] = await Promise.all([
        fetch('/api/item-wash?type=items'),
        fetch('/api/item-wash'),
      ]);
      setItems(await itemRes.json());
      setWashList(await washRes.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { handleSearch(); }, []);

  const handleSave = useCallback(async () => {
    await fetch('/api/item-wash', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(washList) });
    alert('저장되었습니다.');
  }, [washList]);

  const handleInit = useCallback(() => { setFilter(FILTER_INIT); setItems([]); setWashList([]); setSelItem(null); }, []);
  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(f => ({ ...f, [k]: e.target.value }));

  const itemCols = useMemo<ColDef[]>(() => [
    { field: 'itemCode', headerName: '아이템', width: 80 },
    { field: 'itemName', headerName: '아이템명', flex: 1 },
  ], []);

  const useYnRenderer = (p: any) => (
    <input type="checkbox" checked={!!p.value} onChange={() => {}} style={{ cursor: 'pointer' }} />
  );

  const washCols = useMemo<ColDef[]>(() => [
    { field: '_chk',         headerName: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'no',           headerName: '번호',   width: 60 },
    { field: 'category',     headerName: '분류',   width: 80 },
    { field: 'categoryName', headerName: '분류명', flex: 1 },
    { field: 'desc',         headerName: '목록',   flex: 1 },
    { field: 'useYn',        headerName: '사용여부', width: 90, cellRenderer: useYnRenderer },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
    <div className="pdm-page">
      <div className="pdm-title-bar">
        <h5 className="pdm-title">아이템별세탁방법 (CMA010)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action" onClick={handleSave}   disabled={loading}><Save size={13} /> 저장[F9]</button>
          <button className="btn-pdm-action" onClick={handleInit}   disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Star size={13} /></button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Info size={13} /></button>
        </div>
      </div>

      <div className="pdm-filter-bar" style={{ flexWrap: 'nowrap', gap: 6 }}>
        <span className="pdm-filter-label">브랜드존</span>
        <input className="form-control" style={{ width: 55 }} value={filter.zone} onChange={setF('zone')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">브랜드</span>
        <input className="form-control" style={{ width: 55 }} value={filter.brand} onChange={setF('brand')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">라인</span>
        <input className="form-control" style={{ width: 40 }} value={filter.line} onChange={setF('line')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">년도</span>
        <input className="form-control" style={{ width: 40 }} value={filter.year} onChange={setF('year')} />
        <button className="pdm-lookup-btn">?</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="pdm-filter-label">아이템</span>
          <input className="form-control" style={{ width: 80 }} value={filter.item} onChange={setF('item')} />
          <button className="pdm-lookup-btn">?</button>
        </div>
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
      </div>

      <div className="pdm-content">
        <div className="pdm-panel" style={{ width: '220px' }}>
          <div className="pdm-panel-header">아이템 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                rowData={items}
                columnDefs={itemCols}
                defaultColDef={defaultColDef}
                rowSelection="single"
                onRowSelected={e => { if (e.node.isSelected()) setSelItem(e.data); }}
              />
            </div>
          </div>
        </div>

        <div className="pdm-divider" />

        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header">
            아이템 세탁방법 목록
            {selItem && <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: 8 }}>— {selItem.itemCode} {selItem.itemName}</span>}
          </div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                rowData={washList}
                columnDefs={washCols}
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
