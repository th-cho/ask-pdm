'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Plus, Save, Trash2, RotateCcw, Printer, Star, Info, Send } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface RequestRow {
  id: number; reqNo: string; reqDate: string; brand: string; season: string;
  styleCode: string; styleName: string; colorCode: string; reqQty: number; status: string; drafter: string;
}
interface SpecRow {
  no: number; size: string; reqQty: number; supplyQty: number; note: string;
}

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', reqNo: '', status: '' };

const MOCK_REQUESTS: RequestRow[] = [
  { id: 1,  reqNo: 'RQB-2024-0001', reqDate: '2024-03-01', brand: 'VOLCOM', season: '24SS', styleCode: 'VOBAL451111', styleName: 'V TEAM 5 PACK 반바지', colorCode: 'NVY', reqQty: 500, status: '승인완료', drafter: '홍길동' },
  { id: 2,  reqNo: 'RQB-2024-0002', reqDate: '2024-03-03', brand: 'VOLCOM', season: '24SS', styleCode: 'VVBEB452241', styleName: 'FRICKIN 모던 스트레치 쇼츠', colorCode: 'BLK', reqQty: 300, status: '결재중', drafter: '이철수' },
  { id: 3,  reqNo: 'RQB-2024-0003', reqDate: '2024-03-05', brand: 'VOLCOM', season: '24SS', styleCode: 'VOBBC451151', styleName: '스탠 스트레치 팬츠', colorCode: 'GRY', reqQty: 200, status: '임시저장', drafter: '박영희' },
  { id: 4,  reqNo: 'RQB-2024-0004', reqDate: '2024-03-07', brand: 'VOLCOM', season: '24FW', styleCode: 'VOBBC452216', styleName: '스키 고어텍스 자켓', colorCode: 'RED', reqQty: 150, status: '승인완료', drafter: '홍길동' },
  { id: 5,  reqNo: 'RQB-2024-0005', reqDate: '2024-03-10', brand: 'VOLCOM', season: '24FW', styleCode: 'VOBBL451111', styleName: '플리스 집업 자켓', colorCode: 'BLU', reqQty: 400, status: '결재반려', drafter: '이철수' },
  { id: 6,  reqNo: 'RQB-2024-0006', reqDate: '2024-03-12', brand: 'VOLCOM', season: '24FW', styleCode: 'VOBBL451151', styleName: '보드 팬츠', colorCode: 'GRN', reqQty: 350, status: '승인완료', drafter: '박영희' },
];

const STATUS_COLOR: Record<string, string> = {
  '승인완료': '#16a34a', '결재중': '#d97706', '결재반려': '#dc2626', '임시저장': '#6b7280',
};

const MOCK_SPEC: SpecRow[] = [
  { no: 1, size: 'XS', reqQty: 50,  supplyQty: 50,  note: '' },
  { no: 2, size: 'S',  reqQty: 100, supplyQty: 100, note: '' },
  { no: 3, size: 'M',  reqQty: 150, supplyQty: 150, note: '' },
  { no: 4, size: 'L',  reqQty: 120, supplyQty: 120, note: '' },
  { no: 5, size: 'XL', reqQty: 80,  supplyQty: 80,  note: '' },
];

export default function ProductRequest() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [rowData, setRowData] = useState<RequestRow[]>([]);
  const [selected, setSelected] = useState<RequestRow | null>(null);
  const [specRows] = useState<SpecRow[]>(MOCK_SPEC);
  const [loading, setLoading] = useState(false);
  const [detailForm, setDetailForm] = useState({
    supplierCode: 'S2024-001', supplierName: '(주)삼성물산', deliveryDate: '2024-04-30',
    unitPrice: '25000', currency: 'KRW', totalAmount: '12500000',
    deliveryAddr: '서울시 강남구 삼성동 123', note: '납기일 준수 요망',
  });

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/product-request');
      const data = await res.json();
      setRowData(data);
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

  const listCols = useMemo<ColDef[]>(() => [
    { field: 'reqNo',     headerName: '의뢰번호',   flex: 1.2 },
    { field: 'reqDate',   headerName: '의뢰일자',   width: 100 },
    { field: 'brand',     headerName: '브랜드',     width: 80 },
    { field: 'season',    headerName: '시즌',       width: 70 },
    { field: 'styleCode', headerName: '스타일코드', flex: 1.2 },
    { field: 'colorCode', headerName: '컬러',       width: 70 },
    { field: 'reqQty',    headerName: '의뢰수량',   width: 90, type: 'numericColumn' },
    {
      field: 'status', headerName: '상태', width: 90,
      cellRenderer: (p: any) => (
        <span style={{ color: STATUS_COLOR[p.value] ?? '#334155', fontWeight: 600, fontSize: 12 }}>{p.value}</span>
      ),
    },
    { field: 'drafter', headerName: '기안자', width: 80 },
  ], []);

  const specCols = useMemo<ColDef[]>(() => [
    { field: 'no',        headerName: 'No',      width: 50 },
    { field: 'size',      headerName: '사이즈',   flex: 1 },
    { field: 'reqQty',    headerName: '의뢰수량', flex: 1, type: 'numericColumn', editable: true },
    { field: 'supplyQty', headerName: '공급수량', flex: 1, type: 'numericColumn', editable: true },
    { field: 'note',      headerName: '비고',     flex: 2, editable: true },
  ], []);

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));
  const df = (key: string, val: string) => setDetailForm(p => ({ ...p, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">상품사입의뢰 <span className="pdm-page-code">RQA020</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary" onClick={handleSearch}><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-default"><Plus size={13} /> 신규 <kbd>F4</kbd></button>
          <button className="pdm-btn pdm-btn-success"><Save size={13} /> 저장 <kbd>F9</kbd></button>
          <button className="pdm-btn pdm-btn-danger"><Trash2 size={13} /> 삭제 <kbd>F5</kbd></button>
          <button className="pdm-btn pdm-btn-info"><Send size={13} /> 결재상신</button>
          <button className="pdm-btn pdm-btn-info"><Printer size={13} /> 출력 <kbd>F11</kbd></button>
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
        <label>두자리코드</label>
        <input style={{ width: 50 }} value={filter.itemCode} onChange={e => ff('itemCode', e.target.value)} placeholder="00" />
        <label>의뢰번호</label>
        <input style={{ width: 130 }} value={filter.reqNo} onChange={e => ff('reqNo', e.target.value)} placeholder="RQB-2024-" />
        <label>상태</label>
        <select value={filter.status} onChange={e => ff('status', e.target.value)}>
          <option value="">전체</option><option value="임시저장">임시저장</option><option value="결재중">결재중</option>
          <option value="승인완료">승인완료</option><option value="결재반려">결재반려</option>
        </select>
        <button className="pdm-btn pdm-btn-primary" onClick={handleSearch} style={{ marginLeft: 4 }}>
          <Search size={12} /> 조회
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, gap: 0 }}>
        {/* 좌측: 목록 (3컬럼 스타일) */}
        <div style={{ width: 340, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '6px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Star size={12} color="#1a5cb8" /><span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>의뢰 목록</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>{rowData.length}건</span>
          </div>
          <div className="ag-theme-alpine" style={{ flex: 1 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={[
                { field: 'reqNo',     headerName: '의뢰번호',   flex: 1 },
                { field: 'styleCode', headerName: '스타일',     flex: 1 },
                { field: 'status',    headerName: '상태',       width: 80,
                  cellRenderer: (p: any) => <span style={{ color: STATUS_COLOR[p.value], fontWeight: 600, fontSize: 11 }}>{p.value}</span> },
              ]}
              // loading={loading}
              rowSelection="single"
              defaultColDef={{ resizable: true, suppressMovable: true }}
              rowHeight={26} headerHeight={28}
              onRowClicked={e => setSelected(e.data)}
              getRowStyle={p => p.data?.id === selected?.id ? { background: '#dbeafe' } : undefined}
            />
          </div>
        </div>

        {/* 우측: 상세 폼 + 명세 */}
        {selected ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 10px', gap: 8, minWidth: 0 }}>
            {/* 상품사입의뢰 상세 폼 */}
            <div className="pdm-detail-section">
              <div className="pdm-section-title"><Info size={12} /> 상품사입의뢰 상세</div>
              <div className="pdm-form-grid">
                <div className="pdm-form-row">
                  <label>의뢰번호</label><input readOnly value={selected.reqNo} />
                  <label>의뢰일자</label><input readOnly value={selected.reqDate} />
                  <label>상태</label>
                  <input readOnly value={selected.status} style={{ color: STATUS_COLOR[selected.status], fontWeight: 600 }} />
                  <label>기안자</label><input readOnly value={selected.drafter} />
                </div>
                <div className="pdm-form-row">
                  <label>브랜드</label><input readOnly value={selected.brand} />
                  <label>시즌</label><input readOnly value={selected.season} />
                  <label>스타일코드</label><input readOnly value={selected.styleCode} />
                  <label>컬러</label><input readOnly value={selected.colorCode} />
                </div>
                <div className="pdm-form-row">
                  <label>스타일명</label><input readOnly value={selected.styleName} style={{ flex: 3 }} />
                  <label>총의뢰수량</label><input readOnly value={selected.reqQty.toLocaleString()} />
                </div>
                <div className="pdm-form-row">
                  <label>거래처코드</label>
                  <div style={{ display: 'flex', gap: 2, flex: 1 }}>
                    <input value={detailForm.supplierCode} onChange={e => df('supplierCode', e.target.value)} style={{ flex: 1 }} />
                    <button className="pdm-btn pdm-btn-default" style={{ padding: '1px 6px', fontSize: 11 }}>?</button>
                  </div>
                  <label>거래처명</label><input value={detailForm.supplierName} onChange={e => df('supplierName', e.target.value)} style={{ flex: 2 }} />
                  <label>납기일</label><input type="date" value={detailForm.deliveryDate} onChange={e => df('deliveryDate', e.target.value)} />
                </div>
                <div className="pdm-form-row">
                  <label>단가</label><input value={detailForm.unitPrice} onChange={e => df('unitPrice', e.target.value)} />
                  <label>통화</label>
                  <select value={detailForm.currency} onChange={e => df('currency', e.target.value)}>
                    <option value="KRW">KRW</option><option value="USD">USD</option><option value="EUR">EUR</option>
                  </select>
                  <label>합계금액</label><input value={detailForm.totalAmount} onChange={e => df('totalAmount', e.target.value)} />
                  <label>납품지</label><input value={detailForm.deliveryAddr} onChange={e => df('deliveryAddr', e.target.value)} style={{ flex: 3 }} />
                </div>
                <div className="pdm-form-row">
                  <label>비고</label><input value={detailForm.note} onChange={e => df('note', e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
            </div>

            {/* 사이즈별 명세 그리드 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Star size={12} color="#1a5cb8" /><span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>사이즈별 의뢰 명세</span>
                <button className="pdm-btn pdm-btn-default" style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: 11 }}><Plus size={11} /> 행 추가</button>
              </div>
              <div className="ag-theme-alpine" style={{ flex: 1 }}>
                <AgGridReact
                  rowData={specRows}
                  columnDefs={specCols}
                  defaultColDef={{ resizable: true, sortable: true, suppressMovable: true }}
                  rowHeight={28} headerHeight={30}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
            목록에서 의뢰 건을 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}
