'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Plus, Save, Trash2, Printer, RotateCcw, Star, Info, FileText, Download } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow { id: number; styleCode: string; styleName: string; }

const TABS = ['기기정보', '디자인도면', '세탁봉사항', '원부자재레퍼', 'SIZE.SPEC', '추가정보'];

const MOCK_STYLES: StyleRow[] = [
  { id: 1,  styleCode: 'VOBAL451111', styleName: 'VOBAL451111' },
  { id: 2,  styleCode: 'VVBEB452241', styleName: 'VVBEB452241' },
  { id: 3,  styleCode: 'VOBBC451151', styleName: 'VOBBC451151' },
  { id: 4,  styleCode: 'VOBBC452216', styleName: 'VOBBC452216' },
  { id: 5,  styleCode: 'VOBBL451111', styleName: 'VOBBL451111' },
  { id: 6,  styleCode: 'VOBBL451151', styleName: 'VOBBL451151' },
  { id: 7,  styleCode: 'VOBBL451211', styleName: 'VOBBL451211' },
  { id: 8,  styleCode: 'VOBBL4512SS', styleName: 'VOBBL4512SS' },
  { id: 9,  styleCode: 'VOBJN452131', styleName: 'VOBJN452131' },
  { id: 10, styleCode: 'VOBJN452141', styleName: 'VOBJN452141' },
  { id: 11, styleCode: 'VOBJN452151', styleName: 'VOBJN452151' },
  { id: 12, styleCode: 'VOBKD451121', styleName: 'VOBKD451121' },
  { id: 13, styleCode: 'VOBN452121',  styleName: 'VOBN452121' },
  { id: 14, styleCode: 'VOBKD451121', styleName: 'VOBKD451121' },
];

const SIZE_ITEMS = [
  { item: '삼푸기장',     s085: 62.0, s090: 64.0, s095: 64.4, s100: 56.6, s105: null },
  { item: '가슴폭(반)',   s085: 52,   s090: 53.3, s095: 54.8, s100: 56.6, s105: null },
  { item: '어깨너비',     s085: 104,  s090: 109,  s095: 115,  s100: 122,  s105: null },
  { item: '밑단둘레(반)', s085: 113,  s090: 118,  s095: 124,  s100: 131,  s105: null },
  { item: '힙단',         s085: 77,   s090: 77.5, s095: 79.5, s100: 80,   s105: null },
  { item: '소매통',       s085: 38,   s090: 39.5, s095: 41.5, s100: 43.7, s105: null },
  { item: '소매부리',     s085: 24,   s090: 24.8, s095: 25.9, s100: 26.4, s105: null },
];

const FABRIC_ROWS = [
  { no: 1,  type: '원단', kind: '겉감', fabricCode: 'F2024-001', fabricName: '울 혼방 원단', color: 'NVY', content: '울 60% 폴리 40%', spec: '150cm', reqQty: '2.5m', unitPrice: 15000, amount: 37500 },
  { no: 2,  type: '원단', kind: '안감', fabricCode: 'F2024-002', fabricName: '폴리 안감',    color: 'NVY', content: '폴리 100%',    spec: '140cm', reqQty: '2.0m', unitPrice: 3500,  amount: 7000 },
  { no: 3,  type: '부자재', kind: '심지', fabricCode: 'A2024-001', fabricName: '접착심지',   color: 'WHT', content: '폴리 100%',    spec: '90cm',  reqQty: '0.5m', unitPrice: 2000,  amount: 1000 },
];

const LABEL_ROWS = [
  { no: 1, labelName: '케어라벨', labelQty: 1, note: '' },
  { no: 2, labelName: 'SIZE 라벨', labelQty: 1, note: '' },
  { no: 3, labelName: '행텍', labelQty: 1, note: '' },
];

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', style: '' };

function MockJacketFront({ styleCode }: { styleCode: string }) {
  return (
      <svg viewBox="0 0 200 255" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: 240 }}>
        {/* Main body */}
        <path d="M78 52 L45 62 L52 75 L40 220 L160 220 L148 75 L155 62 L122 52 L100 38Z"
              fill="#dbeafe" stroke="#334155" strokeWidth="1.3"/>
        {/* Left sleeve */}
        <path d="M45 62 L8 190 L20 195 L52 75Z" fill="#bfdbfe" stroke="#334155" strokeWidth="1.3"/>
        {/* Right sleeve */}
        <path d="M155 62 L192 190 L180 195 L148 75Z" fill="#bfdbfe" stroke="#334155" strokeWidth="1.3"/>
        {/* Left collar lapel */}
        <path d="M100 52 L100 38 L85 35 L78 52Z" fill="#93c5fd" stroke="#334155" strokeWidth="1"/>
        {/* Right collar lapel */}
        <path d="M100 52 L100 38 L115 35 L122 52Z" fill="#93c5fd" stroke="#334155" strokeWidth="1"/>
        {/* Center zip line */}
        <line x1="100" y1="38" x2="100" y2="220" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 2"/>
        {/* Chest pocket */}
        <rect x="55" y="95" width="28" height="16" rx="2" stroke="#334155" strokeWidth="0.9" fill="none"/>
        {/* Side pockets */}
        <rect x="43" y="168" width="42" height="18" rx="2" stroke="#334155" strokeWidth="0.9" fill="none"/>
        <rect x="115" y="168" width="42" height="18" rx="2" stroke="#334155" strokeWidth="0.9" fill="none"/>
        {/* Hem band */}
        <line x1="40" y1="208" x2="160" y2="208" stroke="#334155" strokeWidth="0.8"/>
        {/* Sleeve cuffs */}
        <line x1="9" y1="188" x2="20" y2="194" stroke="#334155" strokeWidth="1.5"/>
        <line x1="180" y1="194" x2="191" y2="188" stroke="#334155" strokeWidth="1.5"/>
        <text x="100" y="232" textAnchor="middle" fontSize="9" fill="#475569" fontFamily="monospace">{styleCode}</text>
        <text x="100" y="244" textAnchor="middle" fontSize="8" fill="#94a3b8">앞면 (FRONT)</text>
      </svg>
  );
}

function MockJacketBack() {
  return (
      <svg viewBox="0 0 200 255" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: 240 }}>
        {/* Main body */}
        <path d="M78 52 L45 62 L52 75 L40 220 L160 220 L148 75 L155 62 L122 52 Q100 60 78 52Z"
              fill="#dbeafe" stroke="#334155" strokeWidth="1.3"/>
        {/* Left sleeve */}
        <path d="M45 62 L8 190 L20 195 L52 75Z" fill="#bfdbfe" stroke="#334155" strokeWidth="1.3"/>
        {/* Right sleeve */}
        <path d="M155 62 L192 190 L180 195 L148 75Z" fill="#bfdbfe" stroke="#334155" strokeWidth="1.3"/>
        {/* Back yoke seam */}
        <path d="M52 98 Q100 108 148 98" stroke="#334155" strokeWidth="0.9" fill="none"/>
        {/* Center back seam */}
        <line x1="100" y1="60" x2="100" y2="220" stroke="#334155" strokeWidth="0.8"/>
        {/* Hem band */}
        <line x1="40" y1="208" x2="160" y2="208" stroke="#334155" strokeWidth="0.8"/>
        {/* Sleeve cuffs */}
        <line x1="9" y1="188" x2="20" y2="194" stroke="#334155" strokeWidth="1.5"/>
        <line x1="180" y1="194" x2="191" y2="188" stroke="#334155" strokeWidth="1.5"/>
        <text x="100" y="244" textAnchor="middle" fontSize="8" fill="#94a3b8">뒷면 (BACK)</text>
      </svg>
  );
}

export default function WorkOrder() {
  const [filter, setFilter]     = useState(FILTER_INIT);
  const [styleList, setStyleList] = useState<StyleRow[]>(MOCK_STYLES);
  const [selStyle, setSelStyle] = useState<StyleRow | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading]   = useState(false);
  const [approvalDate, setApprovalDate] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [washNote, setWashNote] = useState('2023.07.28 에인수정\n1. 봉제지시서에 의거 봉제할 것\n4. 실금장 통: 봉제, 가종후 상부로 박음질 뒤집어 맞음 함.\n');
  const [checkedSizes, setCheckedSizes] = useState<Record<string, boolean>>({ s085: true, s090: true, s095: true, s100: true, s105: false, s110: false, s95M: false });

  const handleSearch = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 200));
    setStyleList(MOCK_STYLES);
    setLoading(false);
  }, []);

  useEffect(() => { handleSearch(); }, []);

  const handleNew    = useCallback(() => { setSelStyle(null); }, []);
  const handleSave   = useCallback(() => alert('저장되었습니다.'), []);
  const handleDelete = useCallback(() => { if (!selStyle) { alert('스타일을 선택하세요.'); return; } alert('삭제되었습니다.'); }, [selStyle]);
  const handlePrint  = useCallback(() => alert('출력합니다.'), []);
  const handleInit   = useCallback(() => { setFilter(FILTER_INIT); setSelStyle(null); }, []);

  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFilter(f => ({ ...f, [k]: e.target.value }));

  const styleCols = useMemo<ColDef[]>(() => [
    { field: 'styleCode', headerName: '스타일코드', flex: 1 },
    { field: 'styleName', headerName: '스타일명',   flex: 1 },
  ], []);

  const fabricCols = useMemo<ColDef[]>(() => [
    { field: 'no',         headerName: 'No',    width: 50 },
    { field: 'type',       headerName: '구분',  width: 70 },
    { field: 'kind',       headerName: '종류',  width: 70 },
    { field: 'fabricCode', headerName: '원단코드', width: 120 },
    { field: 'fabricName', headerName: '원단명', flex: 1 },
    { field: 'color',      headerName: '색상',  width: 70 },
    { field: 'content',    headerName: '성분',  flex: 1 },
    { field: 'spec',       headerName: '규격',  width: 70 },
    { field: 'reqQty',     headerName: '소요량', width: 80 },
    { field: 'unitPrice',  headerName: '단가',  width: 90 },
    { field: 'amount',     headerName: '금액',  width: 90 },
  ], []);

  const labelCols = useMemo<ColDef[]>(() => [
    { field: 'no',        headerName: 'No',    width: 50 },
    { field: 'labelName', headerName: '라벨명', flex: 1 },
    { field: 'labelQty',  headerName: '수량',   width: 80 },
    { field: 'note',      headerName: '비고',   flex: 1 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  const SIZES = ['085', '090', '095', '100', '105', '110', '95M', '95L', '10L'];
  const sizeKeys = SIZES.map(s => `s${s}`);

  const sizeCols = useMemo<ColDef[]>(() => [
    { field: 'item', headerName: '항목', width: 130, pinned: 'left' },
    ...SIZES.map(s => ({ field: `s${s}`, headerName: s, width: 80 })),
  ], []);

  const sizeRows = SIZE_ITEMS.map(r => ({
    item: r.item,
    s085: r.s085, s090: r.s090, s095: r.s095, s100: r.s100, s105: r.s105,
  }));

  return (
      <div className="pdm-page">
        <div className="pdm-title-bar">
          <h5 className="pdm-title">작업지시서 (DCA010)</h5>
          <div className="pdm-actions">
            <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
            <button className="btn-pdm-action" onClick={handleNew}    disabled={loading}><Plus size={13} /> 신규[F4]</button>
            <button className="btn-pdm-action" onClick={handleSave}   disabled={loading}><Save size={13} /> 저장[F9]</button>
            <button className="btn-pdm-action danger" onClick={handleDelete} disabled={loading}><Trash2 size={13} /> 삭제[F5]</button>
            <button className="btn-pdm-action" onClick={handlePrint}  disabled={loading}><Printer size={13} /> 출력[F1]</button>
            <button className="btn-pdm-action" style={{ fontSize: '11px' }}><FileText size={13} /> 닫기레포</button>
            <button className="btn-pdm-action" style={{ fontSize: '11px' }}><FileText size={13} /> SRM레포</button>
            <button className="btn-pdm-action" style={{ fontSize: '11px' }}>결재</button>
            <button className="btn-pdm-action" style={{ fontSize: '11px' }}>스타일리스트</button>
            <button className="btn-pdm-action" onClick={handleInit} disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="pdm-filter-label">스타일</span>
            <input className="form-control form-control-sm" style={{ width: 130 }} value={filter.style} onChange={setF('style')} />
            <button className="pdm-lookup-btn">?</button>
          </div>
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
        </div>

        <div className="pdm-content">
          {/* 좌: 스타일 목록 */}
          <div className="pdm-panel" style={{ width: '280px' }}>
            <div className="pdm-panel-header">스타일 목록</div>
            <div className="pdm-panel-body">
              <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                <AgGridReact
                    rowData={styleList}
                    columnDefs={styleCols}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    onRowSelected={e => { if (e.node.isSelected()) setSelStyle(e.data); }}
                />
              </div>
            </div>
          </div>

          <div className="pdm-divider" />

          {/* 우: 탭 패널 */}
          <div className="pdm-panel" style={{ flex: 1 }}>
            {/* 탭 헤더 */}
            <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
              {TABS.map((tab, i) => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(i)}
                      style={{
                        padding: '7px 14px', fontSize: '12px', fontWeight: activeTab === i ? 700 : 400,
                        color: activeTab === i ? '#1a5cb8' : '#6b7280',
                        background: activeTab === i ? '#fff' : 'transparent',
                        border: 'none', borderBottom: activeTab === i ? '2px solid #1a5cb8' : 'none',
                        marginBottom: activeTab === i ? '-2px' : 0, cursor: 'pointer',
                      }}
                  >{tab}</button>
              ))}
            </div>

            <div className="pdm-panel-body" style={{ padding: 0 }}>
              {/* 기기정보 탭 */}
              {activeTab === 0 && (
                  <div style={{ padding: 14, height: '100%', overflowY: 'auto' }}>
                    <div className="pdm-form-row">
                      <span className="pdm-form-label required">스타일코드</span>
                      <input className="form-control form-control-sm" style={{ width: 200 }} value={selStyle?.styleCode ?? ''} readOnly />
                      <span className="pdm-form-label" style={{ marginLeft: 16 }}>스타일명</span>
                      <input className="form-control form-control-sm" style={{ flex: 1 }} value={selStyle?.styleName ?? ''} readOnly />
                    </div>
                    <div className="pdm-form-row" style={{ marginTop: 8 }}>
                      <span className="pdm-form-label">브랜드존</span>
                      <input className="form-control form-control-sm" style={{ width: 80 }} value={filter.zone} readOnly />
                      <span className="pdm-form-label" style={{ marginLeft: 16 }}>년도</span>
                      <input className="form-control form-control-sm" style={{ width: 60 }} value={filter.year} readOnly />
                      <span className="pdm-form-label" style={{ marginLeft: 16 }}>시즌</span>
                      <input className="form-control form-control-sm" style={{ width: 60 }} value={filter.season} readOnly />
                    </div>
                    <div style={{ marginTop: 14, padding: 12, background: '#f0f9ff', borderRadius: 6, border: '1px solid #bae6fd', fontSize: '12px', color: '#374151' }}>
                      스타일을 선택하면 기기정보가 표시됩니다.
                    </div>
                  </div>
              )}

              {/* 디자인도면 탭 */}
              {activeTab === 1 && (
                  <div style={{ display: 'flex', height: '100%', gap: 0 }}>
                    <div style={{ flex: 1, padding: 14, borderRight: '1px solid #e2e8f0', overflowY: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>디자인도</span>
                        <button className="btn-pdm-action" style={{ fontSize: '11px' }}><Download size={11} /> 원본 다운로드</button>
                      </div>
                      {selStyle ? (
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 8px' }}>
                            <MockJacketFront styleCode={selStyle.styleCode} />
                            <MockJacketBack />
                          </div>
                      ) : (
                          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
                            스타일을 선택하세요
                          </div>
                      )}
                    </div>
                    <div style={{ width: 320, padding: 14, overflowY: 'auto' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: 8, color: '#1e293b' }}>디자인설명</div>
                      <div className="pdm-form-row">
                        <span className="pdm-form-label">Approval 일자</span>
                        <input className="form-control form-control-sm" type="date" style={{ flex: 1 }} value={approvalDate} onChange={e => setApprovalDate(e.target.value)} />
                      </div>
                      <div className="pdm-form-row" style={{ alignItems: 'flex-start', marginTop: 6 }}>
                        <span className="pdm-form-label" style={{ marginTop: 4 }}>내용</span>
                        <textarea className="form-control form-control-sm" style={{ flex: 1, height: 80, resize: 'none' }} value={approvalNote} onChange={e => setApprovalNote(e.target.value)} />
                      </div>
                      <div style={{ marginTop: 14, fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>라벨 및 자수</div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                        <button className="btn-pdm-action" style={{ fontSize: '11px', padding: '2px 8px' }}>행삽제</button>
                      </div>
                      <div className="ag-theme-alpine" style={{ height: 140 }}>
                        <AgGridReact rowData={selStyle ? LABEL_ROWS : []} columnDefs={labelCols} defaultColDef={defaultColDef} />
                      </div>
                    </div>
                  </div>
              )}

              {/* 세탁봉사항 탭 */}
              {activeTab === 2 && (
                  <div style={{ display: 'flex', height: '100%', gap: 0 }}>
                    <div style={{ width: '40%', padding: 14, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>세탁방법</span>
                          <button className="btn-pdm-action" style={{ fontSize: '11px', padding: '2px 8px' }}>행삽제</button>
                        </div>
                        <div className="ag-theme-alpine" style={{ height: 160 }}>
                          <AgGridReact rowData={selStyle ? [{ category: '구분', desc: '분류명' }] : []}
                                       columnDefs={[{ field: 'category', headerName: '구분', flex: 1 }, { field: 'desc', headerName: '분류명', flex: 2 }]}
                                       defaultColDef={defaultColDef} />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>해인수정</div>
                        <textarea className="form-control form-control-sm" style={{ height: 140, resize: 'none', fontSize: '11px' }} value={washNote} onChange={e => setWashNote(e.target.value)} />
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {['B/T', 'S/O', '메인광단'].map(label => (
                            <div key={label} style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 6, padding: 8 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '11px', fontWeight: 700, color: '#374151' }}>
                                <span>{label}</span>
                                <span style={{ color: '#1a5cb8', cursor: 'pointer' }}>확인</span>
                              </div>
                              <div className="pdm-form-row" style={{ fontSize: '11px' }}>
                                <span style={{ minWidth: 40 }}>전반일자</span>
                                <input className="form-control form-control-sm" type="date" style={{ flex: 1, fontSize: '11px' }} />
                              </div>
                              <div className="pdm-form-row" style={{ fontSize: '11px', marginTop: 4 }}>
                                <span style={{ minWidth: 40 }}>납기자</span>
                                <input className="form-control form-control-sm" style={{ flex: 1, fontSize: '11px' }} />
                              </div>
                              <button className="btn btn-sm w-100 mt-2" style={{ fontSize: '10px', background: '#0891b2', color: '#fff', border: 'none' }}>첨부파일</button>
                            </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>니트편직</span>
                        <button className="btn-pdm-action" style={{ fontSize: '11px', padding: '2px 8px' }}>행삽제</button>
                      </div>
                      <div className="ag-theme-alpine" style={{ height: 200 }}>
                        <AgGridReact rowData={[]}
                                     columnDefs={[{ field: 'category', headerName: '구분', flex: 1 }, { field: 'detail', headerName: '부위별', flex: 1 }, { field: 'stitchCount', headerName: '침수', width: 80 }, { field: 'rowCount', headerName: '열수', width: 80 }, { field: 'note', headerName: '비고', flex: 1 }]}
                                     defaultColDef={defaultColDef} />
                      </div>
                      <div style={{ marginTop: 12, fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>비고</div>
                      <textarea className="form-control form-control-sm" style={{ height: 80, resize: 'none' }} />
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: 6, color: '#1e293b' }}>제품사진</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <select className="form-select form-select-sm" style={{ width: 200 }}>
                            <option>02 - 아이보리</option>
                          </select>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>2.53 MB</span>
                          <span style={{ fontSize: '11px', color: '#16a34a' }}>✓</span>
                          <button className="btn btn-sm" style={{ background: '#0891b2', color: '#fff', border: 'none', fontSize: '11px' }}>확인</button>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* 원부자재레퍼 탭 */}
              {activeTab === 3 && (
                  <div style={{ padding: 0, height: '100%' }}>
                    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                      <AgGridReact rowData={selStyle ? FABRIC_ROWS : []} columnDefs={fabricCols} defaultColDef={defaultColDef} />
                    </div>
                  </div>
              )}

              {/* SIZE.SPEC 탭 */}
              {activeTab === 4 && (
                  <div style={{ display: 'flex', height: '100%', gap: 0 }}>
                    <div style={{ width: 160, borderRight: '1px solid #e2e8f0', overflowY: 'auto' }}>
                      <div style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 700, borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#374151' }}>규격 목록</div>
                      <div style={{ padding: '6px 10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, background: '#f0f9ff', borderBottom: '1px solid #e2e8f0', color: '#374151' }}>
                        <span>대표주어</span><span>규격</span>
                      </div>
                      {SIZES.map(s => (
                          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderBottom: '1px solid #f1f5f9' }}>
                            <input type="checkbox" checked={!!checkedSizes[`s${s}`]} onChange={e => setCheckedSizes(c => ({ ...c, [`s${s}`]: e.target.checked }))} />
                            <span style={{ fontSize: '12px', color: '#374151' }}>{s}</span>
                          </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, overflow: 'auto', padding: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '6px 10px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <button className="btn-pdm-action" style={{ fontSize: '11px', padding: '2px 8px' }}>EXCEL 양식</button>
                        <button className="btn-pdm-action" style={{ fontSize: '11px', padding: '2px 8px' }}>EXCEL 업로드</button>
                        <button className="btn-pdm-action" style={{ fontSize: '11px', padding: '2px 8px' }}>행삽제</button>
                      </div>
                      <div className="ag-theme-alpine" style={{ height: 'calc(100% - 38px)' }}>
                        <AgGridReact rowData={selStyle ? sizeRows : []} columnDefs={sizeCols} defaultColDef={defaultColDef} />
                      </div>
                    </div>
                  </div>
              )}

              {/* 추가정보 탭 */}
              {activeTab === 5 && (
                  <div style={{ padding: 14, height: '100%', overflowY: 'auto' }}>
                    <div style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', marginTop: 40 }}>추가 정보가 없습니다.</div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
