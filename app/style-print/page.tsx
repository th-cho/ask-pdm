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
const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', style: '', repStyle: '', queryType: '' };

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
        <span className="pdm-filter-label">스타일</span>
        <input className="form-control form-control-sm" style={{ width: 110 }} value={filter.style} onChange={setF('style')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">대표스타일</span>
        <input className="form-control form-control-sm" style={{ width: 110 }} value={filter.repStyle} onChange={setF('repStyle')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">조회구분</span>
        <select className="form-select form-select-sm" style={{ width: 80 }} value={filter.queryType} onChange={setF('queryType')}>
          <option value="">전체</option><option value="1">신규</option><option value="2">기존</option>
        </select>
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
