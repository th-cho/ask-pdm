'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Save, Trash2, Copy, RotateCcw, Star, Info, Plus } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface ItemRow     { itemCode: string; itemName: string; }
interface SeasonRow   { seasonCode: string; seasonName: string; matCount: number; }
interface AccessRow   { id: number; matType: string; matTypeName: string; matName: string; color: string; colorName: string; spec: string; unitPrice: number; unit: string; reqQty: number; }

const FILTER_INIT = { zone: 'OL', brand: 'OL', line: 'B', year: '24', item: '' };

export default function AccessorySetting() {
  const [filter, setFilter]         = useState(FILTER_INIT);
  const [items, setItems]           = useState<ItemRow[]>([]);
  const [seasons, setSeasons]       = useState<SeasonRow[]>([]);
  const [accessories, setAccessories] = useState<AccessRow[]>([]);
  const [selItem, setSelItem]       = useState<ItemRow | null>(null);
  const [selSeason, setSelSeason]   = useState<SeasonRow | null>(null);
  const [loading, setLoading]       = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const [ir, sr] = await Promise.all([
        fetch('/api/accessory-setting?type=items'),
        fetch('/api/accessory-setting?type=seasons'),
      ]);
      setItems(await ir.json());
      setSeasons(await sr.json());
      setAccessories([]);
    } finally { setLoading(false); }
  }, []);

  const loadAccessories = useCallback(async () => {
    const res  = await fetch('/api/accessory-setting');
    const data = await res.json();
    setAccessories(data);
  }, []);

  useEffect(() => { handleSearch(); }, []);

  const handleSave   = useCallback(async () => { alert('저장되었습니다.'); }, []);
  const handleDelete = useCallback(async () => { if (!selSeason) { alert('시즌을 선택하세요.'); return; } alert('삭제되었습니다.'); }, [selSeason]);
  const handleCopy   = useCallback(() => alert('복사되었습니다.'), []);
  const handleInit   = useCallback(() => { setFilter(FILTER_INIT); setItems([]); setSeasons([]); setAccessories([]); }, []);
  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(f => ({ ...f, [k]: e.target.value }));

  const itemCols = useMemo<ColDef[]>(() => [
    { field: 'itemCode', headerName: '아이템', width: 70 },
    { field: 'itemName', headerName: '아이템명', flex: 1 },
  ], []);

  const seasonCols = useMemo<ColDef[]>(() => [
    { field: 'seasonCode', headerName: '시즌',   width: 60 },
    { field: 'seasonName', headerName: '시즌명', flex: 1 },
    { field: 'matCount',   headerName: '자재갯수', width: 80 },
  ], []);

  const accessCols = useMemo<ColDef[]>(() => [
    { field: '_chk',        headerName: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'matType',     headerName: '자재종류',   width: 90 },
    { field: 'matTypeName', headerName: '자재종류명', width: 110 },
    { field: 'matName',     headerName: '자재명',     flex: 1, editable: true },
    { field: 'color',       headerName: '자재색상',   width: 90 },
    { field: 'colorName',   headerName: '자재색상명', width: 100 },
    { field: 'spec',        headerName: '자재규격',   width: 110, editable: true },
    { field: 'unitPrice',   headerName: '단가',       width: 80, editable: true },
    { field: 'unit',        headerName: '단위',       width: 70 },
    { field: 'reqQty',      headerName: '소요량',     width: 80, editable: true },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
    <div className="pdm-page">
      <div className="pdm-title-bar">
        <h5 className="pdm-title">복종별완성부자재설정 (CMA030)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
          <button className="btn-pdm-action" onClick={handleSave}   disabled={loading}><Save size={13} /> 저장[F9]</button>
          <button className="btn-pdm-action danger" onClick={handleDelete} disabled={loading}><Trash2 size={13} /> 삭제[F5]</button>
          <button className="btn-pdm-action" onClick={handleCopy}   disabled={loading}><Copy size={13} /> 복사</button>
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

      <div className="pdm-content" style={{ gap: 0 }}>
        {/* 아이템 목록 */}
        <div className="pdm-panel" style={{ width: '180px', minWidth: 140 }}>
          <div className="pdm-panel-header">아이템 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact rowData={items} columnDefs={itemCols} defaultColDef={defaultColDef} rowSelection="single"
                onRowSelected={e => { if (e.node.isSelected()) setSelItem(e.data); }} />
            </div>
          </div>
        </div>
        <div className="pdm-divider" />

        {/* 시즌 목록 */}
        <div className="pdm-panel" style={{ width: '200px', minWidth: 160 }}>
          <div className="pdm-panel-header">시즌 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact rowData={seasons} columnDefs={seasonCols} defaultColDef={defaultColDef} rowSelection="single"
                onRowSelected={e => { if (e.node.isSelected()) { setSelSeason(e.data); loadAccessories(); } }} />
            </div>
          </div>
        </div>
        <div className="pdm-divider" />

        {/* 완성부자재 목록 */}
        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>완성부자재 목록</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn-pdm-action" style={{ padding: '2px 10px', fontSize: '11px' }} onClick={() => setAccessories(a => [...a, { id: Date.now(), matType: '', matTypeName: '', matName: '', color: '', colorName: '', spec: '', unitPrice: 0, unit: 'EA', reqQty: 1 }])}>
                <Plus size={11} /> 부자재 추가
              </button>
              <button className="btn-pdm-action" style={{ padding: '2px 10px', fontSize: '11px' }} onClick={handleSave}>적용</button>
            </div>
          </div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact rowData={accessories} columnDefs={accessCols} defaultColDef={defaultColDef} rowSelection="multiple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
