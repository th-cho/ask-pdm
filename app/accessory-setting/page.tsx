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

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '' };

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

      <div className="pdm-filter-bar" style={{ flexWrap: 'nowrap', gap: 4 }}>
        <span className="pdm-filter-label">브랜드</span>
        <select className="form-select form-select-sm" style={{ width: 90 }} value={filter.brand} onChange={setF('brand')}>
          <option value="">전체</option><option value="S">SALOMON</option><option value="W">WILSON</option><option value="A">ATOMIC</option>
        </select>
        <span className="pdm-filter-label">년도</span>
        <input className="form-control form-control-sm" style={{ width: 45 }} value={filter.year} onChange={setF('year')} />
        <span className="pdm-filter-label">시즌</span>
        <select className="form-select form-select-sm" style={{ width: 70 }} value={filter.season} onChange={setF('season')}>
          <option value="">전체</option><option value="1">Q1</option><option value="2">Q2</option><option value="3">Q3</option><option value="4">Q4</option><option value="S">SS</option><option value="F">FW</option><option value="0">NON</option>
        </select>
        <span className="pdm-filter-label">수입구분</span>
        <select className="form-select form-select-sm" style={{ width: 80 }} value={filter.importType} onChange={setF('importType')}>
          <option value="">전체</option><option value="0">국내</option><option value="1">수입</option>
        </select>
        <span className="pdm-filter-label">협찬/정산</span>
        <select className="form-select form-select-sm" style={{ width: 100 }} value={filter.mktType} onChange={setF('mktType')}>
          <option value="">전체</option><option value="0">정상판매</option><option value="1">마케팅샘플</option><option value="2">후원</option><option value="3">협찬</option><option value="4">홈쇼핑(남)</option><option value="5">홈쇼핑(여)</option><option value="6">홈쇼핑(유)</option><option value="7">수출</option>
        </select>
        <span className="pdm-filter-label">클래스</span>
        <select className="form-select form-select-sm" style={{ width: 100 }} value={filter.class} onChange={setF('class')}>
          <option value="">전체</option><option value="01">의류남성</option><option value="02">의류여성</option><option value="03">의류유니</option><option value="07">신발남성</option><option value="08">신발여성</option><option value="09">신발유니</option><option value="0">NO GEN</option><option value="J">주니어</option>
        </select>
        <span className="pdm-filter-label">카테고리</span>
        <select className="form-select form-select-sm" style={{ width: 100 }} value={filter.category} onChange={setF('category')}>
          <option value="">전체</option><option value="H">하이킹</option><option value="S">스포츠스타일</option><option value="W">윈터스포츠</option><option value="R">러닝</option><option value="T">테니스</option><option value="G">골프</option><option value="K">바스켓볼</option><option value="B">베이스볼</option><option value="L">라이프스타일</option><option value="C">축구</option><option value="N">트레이닝</option>
        </select>
        <span className="pdm-filter-label">아이템</span>
        <select className="form-select form-select-sm" style={{ width: 120 }} value={filter.item} onChange={setF('item')}>
          <option value="">전체</option><option value="DJ">DOWN JACKET</option><option value="DV">DOWN VEST</option><option value="PJ">PADDED JACKET</option><option value="PV">PADDED VEST</option><option value="VE">VEST</option><option value="JK">JACKET</option><option value="JA">JACKET ANORAK</option><option value="PT">PANTS(WOVEN)</option><option value="PH">PANTS HALF</option><option value="FJ">FLEECE JACKET</option><option value="FA">FLEECE ANORAK</option><option value="FP">FLEECE PANTS</option><option value="HT">HEAVY TOP</option><option value="HD">HOODED</option><option value="TL">T-LONG</option><option value="TS">T-SHORT</option><option value="TW">T-WOVEN</option><option value="SL">SLEEVELESS</option><option value="LL">LEGGINGS-LONG</option><option value="LS">LEGGINGS-SHORTS</option><option value="SK">SKIRT</option><option value="OP">ONEPIECE</option><option value="SJ">SKI JACKET</option><option value="SP">SKI PANTS</option><option value="SH">SHIRTS</option>
        </select>
        <span className="pdm-filter-label">두자리코드</span>
        <input className="form-control form-control-sm" style={{ width: 55 }} value={filter.itemCode} onChange={setF('itemCode')} placeholder="00" />
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
