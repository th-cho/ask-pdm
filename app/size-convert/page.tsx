'use client';

import React, { useState, useCallback } from 'react';
import { Search, Save, RotateCcw, Printer, Download, Star, Upload } from 'lucide-react';

interface SizeRow {
  item: string; kr85: string; kr90: string; kr95: string; kr100: string; kr105: string; kr110: string;
  us_xs: string; us_s: string; us_m: string; us_l: string; us_xl: string; us_xxl: string;
  eu_34: string; eu_36: string; eu_38: string; eu_40: string; eu_42: string; eu_44: string;
  uk_6: string; uk_8: string; uk_10: string; uk_12: string; uk_14: string; uk_16: string;
  cm_unit: string; note: string;
}

const ITEM_LIST = [
  '가슴둘레', '허리둘레', '엉덩이둘레', '어깨너비', '총기장', '소매기장', '소매통', '소매부리',
  '밑단둘레', '목둘레', '등기장', '앞기장', '허리높이', '엉덩이높이', '허벅지둘레', '무릎둘레',
  '발목둘레', '바지기장', '샅높이', '밑위기장',
];

const INIT_ROWS: SizeRow[] = ITEM_LIST.map(item => ({
  item,
  kr85: '', kr90: '', kr95: '', kr100: '', kr105: '', kr110: '',
  us_xs: '', us_s: '', us_m: '', us_l: '', us_xl: '', us_xxl: '',
  eu_34: '', eu_36: '', eu_38: '', eu_40: '', eu_42: '', eu_44: '',
  uk_6: '', uk_8: '', uk_10: '', uk_12: '', uk_14: '', uk_16: '',
  cm_unit: 'cm', note: '',
}));

const SAMPLE_DATA: Partial<Record<string, Partial<SizeRow>>> = {
  '가슴둘레': { kr85: '82-86', kr90: '86-90', kr95: '90-94', kr100: '94-98', kr105: '98-104', kr110: '104-110', us_xs: '30-32', us_s: '34-36', us_m: '38-40', us_l: '42-44', us_xl: '46-48', us_xxl: '50-52', eu_34: '34', eu_36: '36', eu_38: '38', eu_40: '40', eu_42: '42', eu_44: '44' },
  '허리둘레': { kr85: '64-68', kr90: '68-72', kr95: '72-76', kr100: '76-80', kr105: '80-86', kr110: '86-92' },
  '엉덩이둘레': { kr85: '86-90', kr90: '90-94', kr95: '94-98', kr100: '98-102', kr105: '102-108', kr110: '108-114' },
  '어깨너비': { kr85: '36', kr90: '38', kr95: '40', kr100: '42', kr105: '44', kr110: '46' },
  '총기장': { kr85: '60', kr90: '62', kr95: '64', kr100: '66', kr105: '68', kr110: '70' },
};

const FILTER_INIT = { zone: 'WM', brand: '', year: '24', season: '', itemType: '', gender: 'F' };

export default function SizeConvert() {
  const [filter, setFilter] = useState(FILTER_INIT);
  const [rows, setRows]     = useState<SizeRow[]>(() =>
    INIT_ROWS.map(r => ({ ...r, ...(SAMPLE_DATA[r.item] ?? {}) }))
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F3') { e.preventDefault(); }
  }, []);
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));
  const updateCell = (rowIdx: number, field: keyof SizeRow, val: string) => {
    setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [field]: val } : r));
  };

  const TH: React.CSSProperties = {
    padding: '4px 6px', fontSize: 10, fontWeight: 600, color: '#475569',
    border: '1px solid #e2e8f0', background: '#f1f5f9',
    textAlign: 'center', whiteSpace: 'nowrap',
  };
  const TD: React.CSSProperties = {
    padding: '2px 4px', border: '1px solid #e2e8f0', fontSize: 11, textAlign: 'center',
  };
  const INPUT_STYLE: React.CSSProperties = {
    width: '100%', border: 'none', background: 'transparent', fontSize: 11,
    textAlign: 'center', padding: 0, outline: 'none',
  };

  const KR_SIZES = ['85', '90', '95', '100', '105', '110'];
  const US_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  const EU_SIZES = ['34', '36', '38', '40', '42', '44'];
  const UK_SIZES = ['6', '8', '10', '12', '14', '16'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">사이즈단위환산(파일) <span className="pdm-page-code">CSB005</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary"><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-success"><Save size={13} /> 저장 <kbd>F9</kbd></button>
          <button className="pdm-btn pdm-btn-info"><Printer size={13} /> 출력 <kbd>F11</kbd></button>
          <button className="pdm-btn pdm-btn-default"><Upload size={13} /> 엑셀 업로드</button>
          <button className="pdm-btn pdm-btn-default"><Download size={13} /> 엑셀 다운로드</button>
          <button className="pdm-btn pdm-btn-default"><RotateCcw size={13} /> 초기화 <kbd>F12</kbd></button>
        </div>
      </div>

      {/* 필터 */}
      <div className="pdm-filter-bar">
        <label>존</label>
        <select value={filter.zone} onChange={e => ff('zone', e.target.value)}>
          <option value="WM">WM</option><option value="OL">OL</option>
        </select>
        <label>브랜드</label>
        <select value={filter.brand} onChange={e => ff('brand', e.target.value)}>
          <option value="">전체</option><option value="VOLCOM">VOLCOM</option>
        </select>
        <label>년도</label>
        <input style={{ width: 50 }} value={filter.year} onChange={e => ff('year', e.target.value)} />
        <label>시즌</label>
        <select value={filter.season} onChange={e => ff('season', e.target.value)}>
          <option value="">전체</option><option value="SS">SS</option><option value="FW">FW</option>
        </select>
        <label>아이템</label>
        <input style={{ width: 100 }} value={filter.itemType} onChange={e => ff('itemType', e.target.value)} placeholder="아이템구분" />
        <label>성별</label>
        <select value={filter.gender} onChange={e => ff('gender', e.target.value)}>
          <option value="F">여성(F)</option><option value="M">남성(M)</option><option value="U">유니섹스(U)</option>
        </select>
        <button className="pdm-btn pdm-btn-primary" style={{ marginLeft: 4 }}><Search size={12} /> 조회</button>
      </div>

      {/* 사이즈 환산 테이블 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Star size={12} color="#1a5cb8" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>사이즈 환산 테이블</span>
          <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>— 셀 클릭 후 직접 편집 가능</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 11, minWidth: '100%' }}>
            <colgroup>
              <col style={{ width: 110 }} />
              {KR_SIZES.map(s => <col key={`kr${s}`} style={{ width: 75 }} />)}
              {US_SIZES.map(s => <col key={`us${s}`} style={{ width: 70 }} />)}
              {EU_SIZES.map(s => <col key={`eu${s}`} style={{ width: 55 }} />)}
              {UK_SIZES.map(s => <col key={`uk${s}`} style={{ width: 55 }} />)}
              <col style={{ width: 55 }} />
              <col style={{ width: 120 }} />
            </colgroup>
            <thead>
              {/* 국가 그룹 헤더 */}
              <tr>
                <th style={TH} rowSpan={2}>항목명</th>
                <th style={{ ...TH, background: '#eff6ff', color: '#1a5cb8' }} colSpan={6}>한국 (KR) — 사이즈별</th>
                <th style={{ ...TH, background: '#f0fdf4', color: '#16a34a' }} colSpan={6}>미국 (US) — 사이즈별</th>
                <th style={{ ...TH, background: '#faf5ff', color: '#7c3aed' }} colSpan={6}>유럽 (EU) — 사이즈별</th>
                <th style={{ ...TH, background: '#fff7ed', color: '#c2410c' }} colSpan={6}>영국 (UK) — 사이즈별</th>
                <th style={TH} rowSpan={2}>단위</th>
                <th style={TH} rowSpan={2}>비고</th>
              </tr>
              <tr>
                {KR_SIZES.map(s => <th key={`kr-h-${s}`} style={{ ...TH, background: '#eff6ff' }}>{s}</th>)}
                {US_SIZES.map(s => <th key={`us-h-${s}`} style={{ ...TH, background: '#f0fdf4' }}>{s}</th>)}
                {EU_SIZES.map(s => <th key={`eu-h-${s}`} style={{ ...TH, background: '#faf5ff' }}>{s}</th>)}
                {UK_SIZES.map(s => <th key={`uk-h-${s}`} style={{ ...TH, background: '#fff7ed' }}>{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.item} style={{ background: ri % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ ...TD, fontWeight: 600, textAlign: 'left', paddingLeft: 8, background: '#f1f5f9' }}>{row.item}</td>
                  {/* KR */}
                  {(['kr85','kr90','kr95','kr100','kr105','kr110'] as const).map(f => (
                    <td key={f} style={{ ...TD, background: ri % 2 === 0 ? '#f0f7ff' : '#e8f3ff' }}>
                      <input value={row[f]} onChange={e => updateCell(ri, f, e.target.value)} style={INPUT_STYLE} />
                    </td>
                  ))}
                  {/* US */}
                  {(['us_xs','us_s','us_m','us_l','us_xl','us_xxl'] as const).map(f => (
                    <td key={f} style={{ ...TD, background: ri % 2 === 0 ? '#f0fdf4' : '#e7faf0' }}>
                      <input value={row[f]} onChange={e => updateCell(ri, f, e.target.value)} style={INPUT_STYLE} />
                    </td>
                  ))}
                  {/* EU */}
                  {(['eu_34','eu_36','eu_38','eu_40','eu_42','eu_44'] as const).map(f => (
                    <td key={f} style={{ ...TD, background: ri % 2 === 0 ? '#faf5ff' : '#f4eeff' }}>
                      <input value={row[f]} onChange={e => updateCell(ri, f, e.target.value)} style={INPUT_STYLE} />
                    </td>
                  ))}
                  {/* UK */}
                  {(['uk_6','uk_8','uk_10','uk_12','uk_14','uk_16'] as const).map(f => (
                    <td key={f} style={{ ...TD, background: ri % 2 === 0 ? '#fff7ed' : '#fef0e0' }}>
                      <input value={row[f]} onChange={e => updateCell(ri, f, e.target.value)} style={INPUT_STYLE} />
                    </td>
                  ))}
                  <td style={TD}>
                    <input value={row.cm_unit} onChange={e => updateCell(ri, 'cm_unit', e.target.value)} style={INPUT_STYLE} />
                  </td>
                  <td style={TD}>
                    <input value={row.note} onChange={e => updateCell(ri, 'note', e.target.value)} style={{ ...INPUT_STYLE, textAlign: 'left', paddingLeft: 4 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
