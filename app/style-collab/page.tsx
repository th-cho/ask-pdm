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

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', vendor: '', designerNo: '1112121', designerName: '정신혜', regType: '전체' };

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
        <span className="pdm-filter-label">거래처</span>
        <input className="form-control form-control-sm" style={{ width: 90 }} value={filter.vendor} onChange={setF('vendor')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">디자이너사번</span>
        <input className="form-control form-control-sm" style={{ width: 75 }} value={filter.designerNo} onChange={setF('designerNo')} />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control form-control-sm" style={{ width: 75 }} value={filter.designerName} onChange={setF('designerName')} readOnly />
        <span className="pdm-filter-label">등록구분</span>
        <select className="form-select form-select-sm" style={{ width: 80 }} value={filter.regType} onChange={setF('regType')}>
          <option>전체</option><option>신규</option><option>기존</option>
        </select>
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
