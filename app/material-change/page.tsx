'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, RotateCcw, Printer, Star, Download, ArrowRight } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow  { id: number; styleCode: string; brand: string; season: string; }
interface ChangeRow {
  id: number; changeNo: string; changeDate: string; changeType: string;
  materialCode: string; materialName: string; color: string;
  beforeValue: string; afterValue: string; drafter: string; reason: string;
}

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', style: '', changeType: '' };

const MOCK_STYLES: StyleRow[] = [
  { id: 1,  styleCode: 'VOBAL451111', brand: 'VOLCOM', season: '24SS' },
  { id: 2,  styleCode: 'VVBEB452241', brand: 'VOLCOM', season: '24SS' },
  { id: 3,  styleCode: 'VOBBC451151', brand: 'VOLCOM', season: '24SS' },
  { id: 4,  styleCode: 'VOBBC452216', brand: 'VOLCOM', season: '24FW' },
  { id: 5,  styleCode: 'VOBBL451111', brand: 'VOLCOM', season: '24FW' },
  { id: 6,  styleCode: 'VOBJN452131', brand: 'VOLCOM', season: '24SS' },
];

const MOCK_CHANGES: ChangeRow[] = [
  { id: 1, changeNo: 'CHG-2024-001', changeDate: '2024-02-05', changeType: '원단변경',    materialCode: 'F2024-001', materialName: '겉감 원단',   color: 'NVY', beforeValue: '울 60% 폴리 40%', afterValue: '울 70% 폴리 30%',  drafter: '홍길동', reason: '품질 개선' },
  { id: 2, changeNo: 'CHG-2024-002', changeDate: '2024-02-10', changeType: '컬러변경',    materialCode: 'F2024-002', materialName: '안감',        color: 'NVY', beforeValue: 'NVY',             afterValue: 'BLK',              drafter: '이철수', reason: '디자인 변경' },
  { id: 3, changeNo: 'CHG-2024-003', changeDate: '2024-02-18', changeType: '소요량변경',  materialCode: 'A2024-001', materialName: '단추',        color: 'NVY', beforeValue: '5개',             afterValue: '6개',              drafter: '박영희', reason: '디자인 수정' },
  { id: 4, changeNo: 'CHG-2024-004', changeDate: '2024-02-25', changeType: '공급업체변경', materialCode: 'A2024-002', materialName: '지퍼',       color: 'NVY', beforeValue: '(주)구식지퍼',    afterValue: '(주)YKK코리아',    drafter: '홍길동', reason: '단가 절감' },
  { id: 5, changeNo: 'CHG-2024-005', changeDate: '2024-03-02', changeType: '스펙변경',    materialCode: 'F2024-003', materialName: '접착심지',    color: 'WHT', beforeValue: '90cm',            afterValue: '110cm',            drafter: '이철수', reason: '원단폭 변경' },
];

const CHANGE_TYPE_COLOR: Record<string, string> = {
  '원단변경': '#1a5cb8', '컬러변경': '#16a34a', '소요량변경': '#d97706', '공급업체변경': '#7c3aed', '스펙변경': '#dc2626',
};

export default function MaterialChange() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [styles, setStyles]   = useState<StyleRow[]>([]);
  const [changes]             = useState<ChangeRow[]>(MOCK_CHANGES);
  const [selectedStyle, setSelectedStyle] = useState<StyleRow | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/material-change');
      const data = await res.json();
      setStyles(data);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { handleSearch(); }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F3') { e.preventDefault(); handleSearch(); }
  }, [handleSearch]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const styleCols = useMemo<ColDef[]>(() => [
    { field: 'styleCode', headerName: '스타일코드', flex: 1 },
    { field: 'brand',     headerName: '브랜드',     width: 80 },
    { field: 'season',    headerName: '시즌',       width: 70 },
  ], []);

  const changeCols = useMemo<ColDef[]>(() => [
    { field: 'changeNo',   headerName: '변경번호',   flex: 1 },
    { field: 'changeDate', headerName: '변경일자',   width: 100 },
    {
      field: 'changeType', headerName: '변경유형', width: 110,
      cellRenderer: (p: any) => (
        <span style={{ color: CHANGE_TYPE_COLOR[p.value] ?? '#334155', fontWeight: 600, fontSize: 11 }}>{p.value}</span>
      ),
    },
    { field: 'materialCode', headerName: '자재코드',   flex: 1 },
    { field: 'materialName', headerName: '자재명',     flex: 1.2 },
    { field: 'color',        headerName: '컬러',       width: 70 },
    {
      headerName: '변경전', field: 'beforeValue', flex: 1,
      cellRenderer: (p: any) => <span style={{ color: '#dc2626' }}>{p.value}</span>,
    },
    {
      headerName: '', field: '_arrow', width: 30,
      cellRenderer: () => <ArrowRight size={12} color="#64748b" />,
    },
    {
      headerName: '변경후', field: 'afterValue', flex: 1,
      cellRenderer: (p: any) => <span style={{ color: '#16a34a', fontWeight: 500 }}>{p.value}</span>,
    },
    { field: 'drafter', headerName: '수정자', width: 80 },
    { field: 'reason',  headerName: '변경사유', flex: 1.2 },
  ], []);

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">원부자재변경현황 <span className="pdm-page-code">CSA030</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary" onClick={handleSearch}><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-info"><Printer size={13} /> 출력 <kbd>F11</kbd></button>
          <button className="pdm-btn pdm-btn-default"><Download size={13} /> 엑셀</button>
          <button className="pdm-btn pdm-btn-default"><RotateCcw size={13} /> 초기화 <kbd>F12</kbd></button>
        </div>
      </div>

      {/* 필터 */}
      <div className="pdm-filter-bar">
        <label>브랜드</label>
        <select value={filter.brand} onChange={e => ff('brand', e.target.value)}>
          <option value="">전체</option><option value="S">SALOMON</option><option value="W">WILSON</option><option value="A">ATOMIC</option>
        </select>
        <label>년도</label>
        <input style={{ width: 45 }} value={filter.year} onChange={e => ff('year', e.target.value)} />
        <label>시즌</label>
        <select value={filter.season} onChange={e => ff('season', e.target.value)}>
          <option value="">전체</option><option value="1">Q1</option><option value="2">Q2</option><option value="3">Q3</option><option value="4">Q4</option><option value="S">SS</option><option value="F">FW</option><option value="0">NON</option>
        </select>
        <label>수입구분</label>
        <select value={filter.importType} onChange={e => ff('importType', e.target.value)}>
          <option value="">전체</option><option value="0">국내</option><option value="1">수입</option>
        </select>
        <label>협찬/정산</label>
        <select value={filter.mktType} onChange={e => ff('mktType', e.target.value)}>
          <option value="">전체</option><option value="0">정상판매</option><option value="1">마케팅샘플</option><option value="2">후원</option><option value="3">협찬</option><option value="4">홈쇼핑(남)</option><option value="5">홈쇼핑(여)</option><option value="6">홈쇼핑(유)</option><option value="7">수출</option>
        </select>
        <label>클래스</label>
        <select value={filter.class} onChange={e => ff('class', e.target.value)}>
          <option value="">전체</option><option value="01">의류남성</option><option value="02">의류여성</option><option value="03">의류유니</option><option value="07">신발남성</option><option value="08">신발여성</option><option value="09">신발유니</option><option value="0">NO GEN</option><option value="J">주니어</option>
        </select>
        <label>카테고리</label>
        <select value={filter.category} onChange={e => ff('category', e.target.value)}>
          <option value="">전체</option><option value="H">하이킹</option><option value="S">스포츠스타일</option><option value="W">윈터스포츠</option><option value="R">러닝</option><option value="T">테니스</option><option value="G">골프</option><option value="K">바스켓볼</option><option value="B">베이스볼</option><option value="L">라이프스타일</option><option value="C">축구</option><option value="N">트레이닝</option>
        </select>
        <label>아이템</label>
        <select value={filter.item} onChange={e => ff('item', e.target.value)}>
          <option value="">전체</option><option value="DJ">DOWN JACKET</option><option value="DV">DOWN VEST</option><option value="PJ">PADDED JACKET</option><option value="PV">PADDED VEST</option><option value="VE">VEST</option><option value="JK">JACKET</option><option value="JA">JACKET ANORAK</option><option value="PT">PANTS(WOVEN)</option><option value="PH">PANTS HALF</option><option value="FJ">FLEECE JACKET</option><option value="FA">FLEECE ANORAK</option><option value="FP">FLEECE PANTS</option><option value="HT">HEAVY TOP</option><option value="HD">HOODED</option><option value="TL">T-LONG</option><option value="TS">T-SHORT</option><option value="TW">T-WOVEN</option><option value="SL">SLEEVELESS</option><option value="LL">LEGGINGS-LONG</option><option value="LS">LEGGINGS-SHORTS</option><option value="SK">SKIRT</option><option value="OP">ONEPIECE</option><option value="SJ">SKI JACKET</option><option value="SP">SKI PANTS</option><option value="SH">SHIRTS</option>
        </select>
        <label>스타일</label>
        <input style={{ width: 120 }} value={filter.style} onChange={e => ff('style', e.target.value)} />
        <label>변경유형</label>
        <select value={filter.changeType} onChange={e => ff('changeType', e.target.value)}>
          <option value="">전체</option>
          <option value="원단변경">원단변경</option><option value="컬러변경">컬러변경</option>
          <option value="소요량변경">소요량변경</option><option value="공급업체변경">공급업체변경</option>
          <option value="스펙변경">스펙변경</option>
        </select>
        <button className="pdm-btn pdm-btn-primary" onClick={handleSearch} style={{ marginLeft: 4 }}><Search size={12} /> 조회</button>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, gap: 0 }}>
        {/* 좌측: 스타일 목록 */}
        <div style={{ width: 240, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '6px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Star size={12} color="#1a5cb8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>스타일 목록</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>{styles.length}건</span>
          </div>
          <div className="ag-theme-alpine" style={{ flex: 1 }}>
            <AgGridReact
              rowData={styles} columnDefs={styleCols}
              // loading={loading}
              rowSelection="single" rowHeight={26} headerHeight={28}
              defaultColDef={{ resizable: true, suppressMovable: true }}
              onRowClicked={e => setSelectedStyle(e.data)}
              getRowStyle={p => p.data?.id === selectedStyle?.id ? { background: '#dbeafe' } : undefined}
            />
          </div>
        </div>

        {/* 우측: 변경이력 그리드 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 8px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Star size={12} color="#1a5cb8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>수정내역 그리드</span>
            {selectedStyle && <span style={{ fontSize: 11, color: '#64748b' }}>({selectedStyle.styleCode})</span>}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>{selectedStyle ? changes.length : 0}건</span>
          </div>
          <div className="ag-theme-alpine" style={{ flex: 1 }}>
            <AgGridReact
              rowData={selectedStyle ? changes : []}
              columnDefs={changeCols}
              rowHeight={28} headerHeight={30}
              defaultColDef={{ resizable: true, sortable: true, suppressMovable: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
