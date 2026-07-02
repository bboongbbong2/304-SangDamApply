import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">개인정보보호방침</h2>
          <button className="modal-close" onClick={onClose}><X size={24} /></button>
        </div>
        <div style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
          <p>세종과학고등학교 상담 신청 서비스는 원활한 상담 일정 관리를 위해 다음과 같이 개인정보를 수집 및 이용합니다.</p>
          <br/>
          <ul>
            <li><strong>수집 항목:</strong> 사용자 유형, 학번, 이름, 상담 신청 날짜, 상담 신청 시간, 신청 상태</li>
            <li><strong>수집 목적:</strong> 상담 신청 일정 관리 및 중복 신청 방지</li>
            <li><strong>보관 기간:</strong> 상담 주간 종료 후 관리자가 삭제할 때까지 보관</li>
            <li><strong>제3자 제공 여부:</strong> 외부에 제공하지 않음</li>
            <li><strong>문의처:</strong> 세종과학고등학교 상담 담당 교사</li>
          </ul>
          <br/>
          <p style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
            사용자는 상담 신청을 위해 필요한 최소한의 개인정보 제공에 동의한 것으로 봅니다.
          </p>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ maxWidth: '200px' }}>확인</button>
        </div>
      </div>
    </div>
  );
}
