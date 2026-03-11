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

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', q: '' };

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

  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
        <span className="pdm-filter-label">자재명</span>
        <input className="form-control form-control-sm" style={{ width: 130 }} value={filter.q} onChange={setF('q')} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="자재명 검색" />
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
