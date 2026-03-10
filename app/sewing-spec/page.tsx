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
  { id: 1,  styleCode: 'MACFF451421', styleName: 'MACFF451421' },
  { id: 2,  styleCode: 'MACFF451431', styleName: 'MACFF451431' },
  { id: 3,  styleCode: 'MACFF451441', styleName: 'MACFF451441' },
  { id: 4,  styleCode: 'MACFF451451', styleName: 'MACFF451451' },
  { id: 5,  styleCode: 'MACFF451111', styleName: 'MACFF451111' },
  { id: 6,  styleCode: 'MACTL451121', styleName: 'MACTL451121' },
  { id: 7,  styleCode: 'MACTL451221', styleName: 'MACTL451221' },
  { id: 8,  styleCode: 'MACTL451251', styleName: 'MACTL451251' },
  { id: 9,  styleCode: 'MACTL451361', styleName: 'MACTL451361' },
  { id: 10, styleCode: 'MAEFF451411', styleName: 'MAEFF451411' },
  { id: 11, styleCode: 'MAEFF7416',   styleName: 'MAEFF7416' },
  { id: 12, styleCode: 'MANGL452431', styleName: 'MANGL452431' },
  { id: 13, styleCode: 'MANE851111',  styleName: 'MANE851111' },
  { id: 14, styleCode: 'MANFF452111', styleName: 'MANFF452111' },
];

const MOCK_SECTIONS: SectionRow[] = [
  { id: 1, category: '부분봉제(SIZE SPEC)', no: 1 },
  { id: 2, category: '부분봉제1',          no: 2 },
  { id: 3, category: '부분봉제2',          no: 3 },
  { id: 4, category: '부분봉제3',          no: 4 },
  { id: 5, category: '부분봉제4',          no: 5 },
  { id: 6, category: '부분봉제5',          no: 6 },
];

const FILTER_INIT = { zone: 'WM', brand: '', year: '24', season: '', style: '' };

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

  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement>) =>
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

      <div className="pdm-filter-bar" style={{ flexWrap: 'nowrap', gap: 6 }}>
        <span className="pdm-filter-label">존브랜드년시</span>
        <input className="form-control" style={{ width: 55 }} value={filter.zone} onChange={setF('zone')} />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control" style={{ width: 55 }} value={filter.brand} onChange={setF('brand')} placeholder="브랜드" />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control" style={{ width: 38 }} value={filter.year} onChange={setF('year')} />
        <button className="pdm-lookup-btn">?</button>
        <input className="form-control" style={{ width: 38 }} value={filter.season} onChange={setF('season')} placeholder="시즌" />
        <button className="pdm-lookup-btn">?</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="pdm-filter-label">스타일</span>
          <input className="form-control" style={{ width: 140 }} value={filter.style} onChange={setF('style')} />
          <button className="pdm-lookup-btn">?</button>
        </div>
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
      </div>

      <div className="pdm-content" style={{ gap: 0 }}>
        {/* 스타일 목록 */}
        <div className="pdm-panel" style={{ width: '220px' }}>
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
        <div className="pdm-panel" style={{ width: '220px' }}>
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
                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
                    부분봉제도 이미지 ({selSection.category})
                  </div>
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
