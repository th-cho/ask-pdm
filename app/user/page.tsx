'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { RotateCcw, Search, Users, UserPlus, Heart } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function UserPage() {
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [searchText,       setSearchText]       = useState('');
  const [rowData,          setRowData]          = useState<any[]>([]);
  const [loading,          setLoading]          = useState(false);

  const [selectedUser,   setSelectedUser]   = useState<any>(null);
  const [formName,       setFormName]       = useState('');
  const [formId,         setFormId]         = useState('');
  const [formTypeCode,   setFormTypeCode]   = useState('REGULAR');
  const [isMaternity,    setIsMaternity]    = useState(false);
  const [maternityStart, setMaternityStart] = useState('');
  const [maternityEnd,   setMaternityEnd]   = useState('');

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedWorkType) params.set('workType', selectedWorkType);
      if (searchText)       params.set('q', searchText);
      const res = await fetch(`/api/user?${params}`);
      if (!res.ok) throw new Error('조회에 실패했습니다.');
      setRowData(await res.json());
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedWorkType, searchText]);

  const handleInit = useCallback(() => {
    setSelectedUserType('');
    setSelectedWorkType('');
    setSearchText('');
    setRowData([]);
  }, []);

  const handleNewUser = useCallback(() => {
    setSelectedUser(null);
    setFormName('');
    setFormId('');
    setFormTypeCode('REGULAR');
    setIsMaternity(false);
    setMaternityStart('');
    setMaternityEnd('');
  }, []);

  const handleUserSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formId) { alert('사용자명과 사번을 입력하세요.'); return; }
    if (isMaternity && (!maternityStart || !maternityEnd)) {
      alert('임신기 시작일과 종료예정일을 입력하세요.');
      return;
    }
    setLoading(true);
    try {
      const body = { id: formId, name: formName, typeCode: formTypeCode, maternity: isMaternity, maternityStart, maternityEnd };
      const method = selectedUser ? 'PATCH' : 'POST';
      const res = await fetch('/api/user', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '저장에 실패했습니다.');
      alert(selectedUser ? `[${formName}] 사용자 정보가 수정되었습니다.` : `[${formName}] 사용자가 등록되었습니다.`);
      await handleSearch();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [formName, formId, formTypeCode, isMaternity, maternityStart, maternityEnd, selectedUser, handleSearch]);

  const onRowSelected = useCallback((event: any) => {
    if (!event.node.isSelected()) return;
    const data = event.data;
    setSelectedUser(data);
    setFormName(data.name);
    setFormId(data.id);
    setFormTypeCode(data.typeCode);
    setIsMaternity(data.maternity);
    setMaternityStart(data.maternityStart ?? '');
    setMaternityEnd(data.maternityEnd ?? '');
  }, []);

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'no',    headerName: 'NO',      width: 60,  pinned: 'left' },
    { field: 'id',    headerName: '사번',    width: 100, cellStyle: { fontWeight: 'bold', color: '#8B0029' } },
    { field: 'name',  headerName: '사용자명', width: 100 },
    { field: 'store', headerName: '매장/부서', width: 120 },
    { field: 'type',  headerName: '근무유형', width: 120,
      cellRenderer: (params: any) => {
        if (params.value === '정규직')   return <span className="badge bg-light text-dark border">정규직</span>;
        if (params.value === '단시간')   return <span className="badge bg-light text-dark border">단시간(15h↑)</span>;
        if (params.value === '초단시간') return <span className="badge bg-light text-muted border">초단시간(15h↓)</span>;
        return params.value;
      }
    },
    { field: 'maternity', headerName: '임신기', width: 80,
      cellRenderer: (params: any) => params.value ? <Heart className="text-danger" size={14} /> : '-'
    },
    { field: 'status', headerName: '상태', width: 80,
      cellRenderer: () => <span className="status-badge bg-success-subtle text-success">재직</span>
    },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, wrapHeaderText: true, sortable: true, filter: true, autoHeaderHeight: true }), []);

  return (
    <div className="container-fluid">
      <div className="card mb-4 p-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
            <label className="form-label small fw-bold text-muted">사용자구분</label>
            <select className="form-select form-select-sm border-secondary-subtle"
              value={selectedUserType} onChange={e => setSelectedUserType(e.target.value)}>
              <option value="">전체</option>
              <option value="HQ">본사사용자</option>
              <option value="STORE">매장사용자</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-bold text-muted">근무구분</label>
            <select className="form-select form-select-sm border-secondary-subtle"
              value={selectedWorkType} onChange={e => setSelectedWorkType(e.target.value)}>
              <option value="">전체</option>
              <option value="REGULAR">정규근무자</option>
              <option value="SHORT">파트타이머(단시간)</option>
              <option value="ULTRA">파트타이머(초단시간)</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label small fw-bold text-muted">ID / 성명 / 사번</label>
            <input type="text" className="form-control form-control-sm border-secondary-subtle"
              placeholder="ID, 성명 또는 사번을 입력하세요."
              value={searchText} onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <div className="col-md-3 d-flex gap-2 justify-content-end">
            <button className="btn btn-sm btn-amer px-4 shadow-sm" onClick={handleSearch} disabled={loading}>
              <Search size={14} className="me-1" />조회
            </button>
            <button className="btn btn-sm btn-light border px-3" onClick={handleInit} disabled={loading}>
              <RotateCcw size={14} className="me-1" />초기화
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center border-bottom-0">
              <div className="d-flex align-items-center gap-2">
                <Users size={18} style={{ color: 'var(--amer-red)' }} />
                <h6 className="mb-0 fw-bold">사용자 목록</h6>
              </div>
              <button className="btn btn-sm btn-amer px-3 shadow-sm" onClick={handleNewUser}>
                <UserPlus size={14} className="me-1" />신규등록
              </button>
            </div>
            <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowSelection="single"
                onRowSelected={onRowSelected}
              />
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white p-3 border-bottom-0">
              <div className="d-flex align-items-center gap-2">
                <UserPlus size={18} style={{ color: 'var(--amer-red)' }} />
                <h6 className="mb-0 fw-bold">{selectedUser ? `사용자 수정 (${selectedUser.id})` : '사용자 신규 등록'}</h6>
              </div>
            </div>
            <div className="card-body p-4 pt-2">
              <form onSubmit={handleUserSave}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">사용자명</label>
                    <input type="text" className="form-control form-control-sm border-secondary-subtle"
                      placeholder="성명 입력" value={formName} onChange={e => setFormName(e.target.value)} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">사번</label>
                    <input type="text" className="form-control form-control-sm border-secondary-subtle"
                      placeholder="사번 입력" value={formId} onChange={e => setFormId(e.target.value)} />
                  </div>
                  <div className="col-md-12 mt-3 pt-3 border-top">
                    <label className="form-label small fw-bold text-amer">근무유형 (정책 적용)</label>
                    <select className="form-select form-select-sm border-secondary-subtle"
                      value={formTypeCode} onChange={e => setFormTypeCode(e.target.value)}>
                      <option value="REGULAR">정규근무자 (일 8h)</option>
                      <option value="SHORT">파트타이머 (단시간 - 15h↑)</option>
                      <option value="ULTRA">파트타이머 (초단시간 - 15h↓)</option>
                    </select>
                    <div className="mt-1 text-muted" style={{ fontSize: '10px' }}>* 유형에 따라 주휴수당 및 공휴일 유급 여부가 자동 판정됩니다.</div>
                  </div>
                  <div className="col-md-12 mt-3">
                    <div className="card bg-light border-0 p-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small fw-bold d-flex align-items-center"><Heart className="text-danger me-2" size={14} />임신기 설정</span>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" role="switch"
                            checked={isMaternity} onChange={e => setIsMaternity(e.target.checked)} />
                        </div>
                      </div>
                      {isMaternity && (
                        <div className="mt-3">
                          <div className="row g-2">
                            <div className="col-6">
                              <label className="form-label" style={{ fontSize: '10px' }}>시작일</label>
                              <input type="date" className="form-control form-control-sm border-secondary-subtle"
                                value={maternityStart} onChange={e => setMaternityStart(e.target.value)} />
                            </div>
                            <div className="col-6">
                              <label className="form-label" style={{ fontSize: '10px' }}>종료예정일</label>
                              <input type="date" className="form-control form-control-sm border-secondary-subtle"
                                value={maternityEnd} onChange={e => setMaternityEnd(e.target.value)} />
                            </div>
                          </div>
                          <p className="text-danger mt-2 mb-0 fw-bold" style={{ fontSize: '10px' }}>* 해당 기간 중 연장/심야 근무가 자동 차단됩니다.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 d-grid gap-2 border-top pt-3">
                  <button type="submit" className="btn btn-sm btn-amer px-5 shadow-sm" disabled={loading}>저장하기</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
