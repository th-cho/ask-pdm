'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Save, Trash2, RotateCcw, Info, Download } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow   { id: number; styleCode: string; styleName: string; }
interface SectionRow { id: number; category: string; no: number; }

const MOCK_STYLES: StyleRow[] = [
  { id: 1,  styleCode: 'A251010SFJ02', styleName: 'A251010SFJ02' },
  { id: 2,  styleCode: 'A251010SFJ03', styleName: 'A251010SFJ03' },
  { id: 3,  styleCode: 'A251010SFJ04', styleName: 'A251010SFJ04' },
  { id: 4,  styleCode: 'A251010SFJ05', styleName: 'A251010SFJ05' },
  { id: 5,  styleCode: 'A251010SFJ06', styleName: 'A251010SFJ06' },
  { id: 6,  styleCode: 'A251010STL01', styleName: 'A251010STL01' },
  { id: 7,  styleCode: 'A251010STL02', styleName: 'A251010STL02' },
  { id: 8,  styleCode: 'A251010STL03', styleName: 'A251010STL03' },
  { id: 9,  styleCode: 'A251010STL04', styleName: 'A251010STL04' },
  { id: 10, styleCode: 'A251010SFP01', styleName: 'A251010SFP01' },
  { id: 11, styleCode: 'A251010SFP02', styleName: 'A251010SFP02' },
  { id: 12, styleCode: 'A252010SJK01', styleName: 'A252010SJK01' },
  { id: 13, styleCode: 'A251010SHT01', styleName: 'A251010SHT01' },
  { id: 14, styleCode: 'A252010SFJ07', styleName: 'A252010SFJ07' },
];

const MOCK_SECTIONS: SectionRow[] = [
  { id: 1, category: '부분봉제(SIZE SPEC)', no: 1 },
  { id: 2, category: '부분봉제1',          no: 2 },
  { id: 3, category: '부분봉제2',          no: 3 },
  { id: 4, category: '부분봉제3',          no: 4 },
  { id: 5, category: '부분봉제4',          no: 5 },
  { id: 6, category: '부분봉제5',          no: 6 },
];

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', style: '' };

/* ── 부분봉제도 Mock SVG 다이어그램 ── */
function DiagramSleeve() {
  return (
      <svg viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: 200 }}>
        {/* 몸판(암홀) */}
        <path d="M50 50 Q160 110 270 50 L280 160 L40 160Z" fill="#dbeafe" stroke="#334155" strokeWidth="1.3"/>
        {/* 소매캡 */}
        <path d="M80 160 Q160 205 240 160" stroke="#334155" strokeWidth="1.3" fill="none"/>
        <line x1="80"  y1="160" x2="58"  y2="205" stroke="#334155" strokeWidth="1.1"/>
        <line x1="240" y1="160" x2="262" y2="205" stroke="#334155" strokeWidth="1.1"/>
        {/* 봉제선 */}
        <path d="M85 155 Q160 198 235 155" stroke="#1a5cb8" strokeWidth="1" strokeDasharray="4 2" fill="none"/>
        {/* 이즈 표시 */}
        {[100,120,140,160,180,200,220].map(x => (
            <circle key={x} cx={x} cy={159} r="2.2" fill="#1a5cb8" opacity="0.7"/>
        ))}
        <text x="160" y="22"  textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">소매 달기 (부분봉제1)</text>
        <text x="160" y="175" textAnchor="middle" fontSize="9"  fill="#1a5cb8">● 봉제선</text>
        <text x="68"  y="105" fontSize="9" fill="#475569">앞·뒷판</text>
        <text x="130" y="198" fontSize="9" fill="#475569">소매캡</text>
      </svg>
  );
}

function DiagramPocket() {
  return (
      <svg viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: 200 }}>
        {/* 몸판 */}
        <rect x="30" y="30" width="260" height="150" fill="#f0f9ff" stroke="#334155" strokeWidth="1"/>
        {/* 포켓 */}
        <rect x="90" y="70" width="140" height="90" fill="#dbeafe" stroke="#334155" strokeWidth="1.3"/>
        {/* 상단 탑스티치 */}
        <line x1="94" y1="84" x2="226" y2="84" stroke="#1a5cb8" strokeWidth="0.9" strokeDasharray="4 2"/>
        {/* 양옆·하단 탑스티치 */}
        <line x1="104" y1="74" x2="104" y2="156" stroke="#1a5cb8" strokeWidth="0.9" strokeDasharray="4 2"/>
        <line x1="216" y1="74" x2="216" y2="156" stroke="#1a5cb8" strokeWidth="0.9" strokeDasharray="4 2"/>
        <line x1="94"  y1="150" x2="226" y2="150" stroke="#1a5cb8" strokeWidth="0.9" strokeDasharray="4 2"/>
        {/* 바택 */}
        <rect x="87" y="67" width="8" height="8" fill="#334155" rx="1"/>
        <rect x="225" y="67" width="8" height="8" fill="#334155" rx="1"/>
        <text x="160" y="20"  textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">포켓 봉제 (부분봉제2)</text>
        <text x="160" y="120" textAnchor="middle" fontSize="9"  fill="#1a5cb8" strokeDasharray="4 2">탑스티치</text>
        <text x="84"  y="63"  fontSize="8"  fill="#334155">바택</text>
      </svg>
  );
}

function DiagramZipper() {
  return (
      <svg viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: 200 }}>
        {/* 왼쪽 패널 */}
        <rect x="30"  y="30" width="110" height="150" fill="#dbeafe" stroke="#334155" strokeWidth="1.3"/>
        {/* 오른쪽 패널 */}
        <rect x="180" y="30" width="110" height="150" fill="#bfdbfe" stroke="#334155" strokeWidth="1.3"/>
        {/* 지퍼 테이프 */}
        <rect x="130" y="30" width="20" height="150" fill="#e2e8f0" stroke="#334155" strokeWidth="0.8"/>
        <rect x="155" y="30" width="20" height="150" fill="#e2e8f0" stroke="#334155" strokeWidth="0.8"/>
        {/* 지퍼 이빨 */}
        {Array.from({length:12},(_,i)=>30+i*12).map(y=>(
            <g key={y}>
              <rect x="138" y={y+2} width="6" height="8" rx="1" fill="#94a3b8"/>
              <rect x="156" y={y+6} width="6" height="8" rx="1" fill="#94a3b8"/>
            </g>
        ))}
        {/* 봉제선 */}
        <line x1="125" y1="30" x2="125" y2="180" stroke="#1a5cb8" strokeWidth="1" strokeDasharray="4 2"/>
        <line x1="200" y1="30" x2="200" y2="180" stroke="#1a5cb8" strokeWidth="1" strokeDasharray="4 2"/>
        <text x="160" y="20"  textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">지퍼 봉제 (부분봉제3)</text>
        <text x="75"  y="115" textAnchor="middle" fontSize="9"  fill="#475569">앞판</text>
        <text x="235" y="115" textAnchor="middle" fontSize="9"  fill="#475569">뒷판</text>
        <text x="143" y="200" textAnchor="middle" fontSize="8"  fill="#94a3b8">지퍼</text>
      </svg>
  );
}

function DiagramSeamSection() {
  return (
      <svg viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: 200 }}>
        {/* 원단 A */}
        <path d="M40 60 L160 60 L160 110 L40 110Z" fill="#dbeafe" stroke="#334155" strokeWidth="1.3"/>
        {/* 원단 B */}
        <path d="M160 60 L280 60 L280 110 L160 110Z" fill="#bfdbfe" stroke="#334155" strokeWidth="1.3"/>
        {/* 봉제(시접) 접힌 부분 */}
        <path d="M140 110 L140 140 L160 140 L160 110" fill="#dbeafe" stroke="#334155" strokeWidth="1"/>
        <path d="M160 110 L160 140 L180 140 L180 110" fill="#bfdbfe" stroke="#334155" strokeWidth="1"/>
        {/* 봉제선 */}
        <line x1="160" y1="58" x2="160" y2="142" stroke="#1a5cb8" strokeWidth="1.1" strokeDasharray="4 2"/>
        {/* 시접 표시 화살표 */}
        <line x1="160" y1="150" x2="180" y2="150" stroke="#475569" strokeWidth="0.9"/>
        <polygon points="182,150 178,147 178,153" fill="#475569"/>
        <line x1="160" y1="150" x2="140" y2="150" stroke="#475569" strokeWidth="0.9"/>
        <polygon points="138,150 142,147 142,153" fill="#475569"/>
        <text x="160" y="168" textAnchor="middle" fontSize="8" fill="#475569">시접 1cm</text>
        <text x="160" y="20"  textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">솔기 봉제 단면 (부분봉제4)</text>
        <text x="95"  y="90"  textAnchor="middle" fontSize="9"  fill="#475569">원단 A</text>
        <text x="225" y="90"  textAnchor="middle" fontSize="9"  fill="#475569">원단 B</text>
      </svg>
  );
}

function DiagramHem() {
  return (
      <svg viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: 200 }}>
        {/* 원단 본체 */}
        <rect x="40" y="30" width="240" height="80" fill="#dbeafe" stroke="#334155" strokeWidth="1.3"/>
        {/* 1차 접기 */}
        <rect x="40" y="110" width="240" height="25" fill="#bfdbfe" stroke="#334155" strokeWidth="1.1"/>
        {/* 2차 접기 */}
        <rect x="40" y="135" width="240" height="30" fill="#93c5fd" stroke="#334155" strokeWidth="1.1"/>
        {/* 접기 방향 화살표 */}
        <path d="M290 122 Q310 115 310 95" stroke="#475569" strokeWidth="0.9" fill="none"/>
        <polygon points="309,93 306,98 312,97" fill="#475569"/>
        <text x="285" y="132" fontSize="8" fill="#475569">1차</text>
        <path d="M290 148 Q315 140 315 80" stroke="#475569" strokeWidth="0.9" fill="none"/>
        <polygon points="314,78 311,83 317,82" fill="#475569"/>
        <text x="285" y="158" fontSize="8" fill="#475569">2차</text>
        {/* 봉제선 */}
        <line x1="44" y1="130" x2="276" y2="130" stroke="#1a5cb8" strokeWidth="1" strokeDasharray="4 2"/>
        <text x="160" y="20"  textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">밑단 처리 (부분봉제5)</text>
        <text x="160" y="75"  textAnchor="middle" fontSize="9"  fill="#475569">원단</text>
        <text x="160" y="127" textAnchor="middle" fontSize="8"  fill="#1a5cb8">── 봉제선</text>
      </svg>
  );
}

function MockSewingDiagram({ no, category }: { no: number; category: string }) {
  const map: Record<number, React.ReactElement> = {
    2: <DiagramSleeve />,
    3: <DiagramPocket />,
    4: <DiagramZipper />,
    5: <DiagramSeamSection />,
    6: <DiagramHem />,
  };
  return map[no] ?? (
      <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, minHeight: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
        {category} 도면
      </div>
  );
}

const SEWING_SPEC_NOTES = `SIZ SPEC CHECK POINT (사이즈 스펙 체크 포인트 등 관할 준)

• 가슴폭 - 암홀 위쪽 두번째 봉 아래 2cm
• 어깨너비 - 어깨 끝에서 어깨 끝까지, 봉 좌우 넉넉

• 메인 - 안쪽 쪽 골 에서 옆 단에서 1/3
• 허리 - 앞길과 뒷길을 겹쳐놓고 허리끝에서 소매부리 소매길이와 1/2 더하기
• 소매통 - 앞뒤 겹쳐 놓고 소매끝에서 14cm 들어온 곳에서 측정 1/2 더하기
• 소매부리 - 소매 골 끝에서 소매 끝까지 1/2 더하기`;

export default function SewingSpec() {
  const [filter, setFilter]         = useState(FILTER_INIT);
  const [styleList, setStyleList]   = useState<StyleRow[]>(MOCK_STYLES);
  const [sectionList, setSectionList] = useState<SectionRow[]>([]);
  const [selStyle, setSelStyle]     = useState<StyleRow | null>(null);
  const [selSection, setSelSection] = useState<SectionRow | null>(null);
  const [loading, setLoading]       = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 200));
    setStyleList(MOCK_STYLES);
    setLoading(false);
  }, []);

  useEffect(() => { handleSearch(); }, []);

  const handleSave   = useCallback(() => alert('저장되었습니다.'), []);
  const handleDelete = useCallback(() => { if (!selStyle) { alert('스타일을 선택하세요.'); return; } alert('삭제되었습니다.'); }, [selStyle]);
  const handleInit   = useCallback(() => { setFilter(FILTER_INIT); setSelStyle(null); setSectionList([]); setSelSection(null); }, []);

  const onStyleSelect = useCallback((style: StyleRow) => {
    setSelStyle(style);
    setSectionList(MOCK_SECTIONS);
    setSelSection(null);
  }, []);

  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFilter(f => ({ ...f, [k]: e.target.value }));

  const styleCols = useMemo<ColDef[]>(() => [
    { field: 'styleCode', headerName: '스타일코드', flex: 1 },
    { field: 'styleName', headerName: '스타일명',   flex: 1 },
  ], []);

  const sectionCols = useMemo<ColDef[]>(() => [
    { field: '_chk',     headerName: '',   width: 45, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'category', headerName: '구분', flex: 1 },
    { field: 'no',       headerName: '순번', width: 65 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
      <div className="pdm-page">
        <div className="pdm-title-bar">
          <h5 className="pdm-title">봉제사양서 (DCB010)</h5>
          <div className="pdm-actions">
            <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F3]</button>
            <button className="btn-pdm-action" onClick={handleSave}   disabled={loading}><Save size={13} /> 저장[F9]</button>
            <button className="btn-pdm-action danger" onClick={handleDelete} disabled={loading}><Trash2 size={13} /> 삭제[F5]</button>
            <button className="btn-pdm-action" onClick={handleInit}   disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
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
          <span className="pdm-filter-label">스타일</span>
          <input className="form-control form-control-sm" style={{ width: 130 }} value={filter.style} onChange={setF('style')} />
          <button className="pdm-lookup-btn">?</button>
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
        </div>

        <div className="pdm-content" style={{ gap: 0 }}>
          {/* 스타일 목록 */}
          <div className="pdm-panel" style={{ width: '280px' }}>
            <div className="pdm-panel-header">스타일 목록</div>
            <div className="pdm-panel-body">
              <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                <AgGridReact
                    rowData={styleList}
                    columnDefs={styleCols}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    onRowSelected={e => { if (e.node.isSelected()) onStyleSelect(e.data); }}
                />
              </div>
            </div>
          </div>
          <div className="pdm-divider" />

          {/* 봉제사양서 목록 */}
          <div className="pdm-panel" style={{ width: '260px' }}>
            <div className="pdm-panel-header">봉제사양서 목록</div>
            <div className="pdm-panel-body">
              <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                <AgGridReact
                    rowData={sectionList}
                    columnDefs={sectionCols}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    onRowSelected={e => { if (e.node.isSelected()) setSelSection(e.data); }}
                />
              </div>
            </div>
          </div>
          <div className="pdm-divider" />

          {/* 부분봉제도 */}
          <div className="pdm-panel" style={{ flex: 1 }}>
            <div className="pdm-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>부분봉제도</span>
              <button className="btn-pdm-action" style={{ fontSize: '11px', padding: '2px 10px' }}><Download size={11} /> 원본 다운로드</button>
            </div>
            <div className="pdm-panel-body" style={{ overflowY: 'auto', padding: 14 }}>
              {selSection ? (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: 8, color: '#1e293b' }}>
                      {selStyle?.styleCode} — {selSection.category}
                    </div>
                    {selSection.no === 1 ? (
                        <div>
                          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, minHeight: 200, marginBottom: 12 }}>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: 8 }}>SIZ SPEC CHECK POINT</div>
                            <pre style={{ fontSize: '11px', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{SEWING_SPEC_NOTES}</pre>
                          </div>
                        </div>
                    ) : (
                        <MockSewingDiagram no={selSection.no} category={selSection.category} />
                    )}
                  </div>
              ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: '12px' }}>
                    봉제사양서 항목을 선택하세요
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
