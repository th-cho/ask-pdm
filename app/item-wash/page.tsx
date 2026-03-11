'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Save, RotateCcw, Star, Info } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface ItemRow   { itemCode: string; itemName: string; }
interface WashRow   { no: string; category: string; categoryName: string; desc: string; useYn: boolean; }

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '' };

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
