import React from 'react';
import { X } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 className="modal-title">개인정보처리방침</h2>
          <button className="modal-close" onClick={onClose}><X size={24} /></button>
        </div>
        <div style={{ lineHeight: '1.6', fontSize: '0.95rem', wordBreak: 'keep-all' }}>
          <p>본 서비스 상담 신청 관리 시스템은 상담 신청 및 일정 관리를 위해 필요한 최소한의 개인정보를 처리합니다. 본 개인정보처리방침은 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고, 개인정보 처리에 관한 사항을 안내하기 위해 마련되었습니다.</p>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제1조 개인정보의 처리 목적</h4>
          <p>본 서비스는 다음의 목적을 위해 개인정보를 처리합니다.</p>
          <ul>
            <li>상담 신청 접수 및 일정 관리</li>
            <li>상담 가능 시간 확인 및 중복 신청 방지</li>
            <li>교사의 상담 신청 현황 확인 및 관리</li>
            <li>신청자의 상담 날짜와 시간 확인</li>
          </ul>
          <p>수집된 개인정보는 위 목적 이외의 용도로 사용하지 않습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제2조 처리하는 개인정보 항목</h4>
          <p>본 서비스는 상담 신청을 위해 다음 항목을 수집할 수 있습니다.</p>
          <ul>
            <li>신청자 유형: 학생 또는 학부모</li>
            <li>학생 학번</li>
            <li>학생 이름</li>
            <li>상담 신청 날짜</li>
            <li>상담 신청 시간</li>
            <li>신청 상태</li>
          </ul>
          <p>본 서비스는 주민등록번호, 주소, 전화번호, 개인 이메일 등 상담 신청에 필요하지 않은 정보는 수집하지 않습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제3조 개인정보의 처리 및 보유 기간</h4>
          <p>본 서비스는 상담 신청 및 상담 주간 운영에 필요한 기간 동안 개인정보를 보관합니다.</p>
          <ul>
            <li>보유 기간: 상담 주간 종료 후 관리자가 삭제할 때까지</li>
            <li>파기 시점: 상담 운영 목적이 달성되었거나 관리자가 삭제하는 경우</li>
          </ul>
          <p>단, 학교 운영상 상담 신청 내역 확인이 필요한 경우 필요한 기간 동안 보관할 수 있습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제4조 개인정보의 저장 및 관리</h4>
          <ul>
            <li>본 서비스의 상담 신청 정보는 Firebase 또는 Firestore 데이터베이스에 저장될 수 있습니다.</li>
            <li>교사 관리자만 상담 신청 내역을 확인하고 관리할 수 있으며, 학생과 학부모는 다른 신청자의 개인정보를 확인할 수 없습니다.</li>
            <li>학생 또는 학부모 화면에서 이미 신청된 시간은 신청자의 이름이나 학번을 표시하지 않고 "다른 학생"으로만 표시합니다.</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제5조 개인정보의 제3자 제공</h4>
          <p>본 서비스는 이용자의 개인정보를 외부에 제공하지 않습니다.<br/>다만, 법령에 따라 요구되는 경우에는 관련 법령에 따라 처리할 수 있습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제6조 개인정보의 파기 절차 및 방법</h4>
          <p>개인정보는 보유 기간이 지나거나 처리 목적이 달성된 경우 삭제합니다.<br/>전자적으로 저장된 개인정보는 Firebase 또는 Firestore 관리자 화면에서 삭제하며, 복구하기 어려운 방식으로 처리합니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제7조 개인정보의 안전성 확보 조치</h4>
          <p>본 서비스는 개인정보 보호를 위해 다음과 같은 조치를 취합니다.</p>
          <ul>
            <li>교사 관리자 계정은 Firebase Authentication을 통해 관리합니다.</li>
            <li>학생과 학부모는 교사가 설정한 4자리 인증코드를 통해서만 상담 신청 화면에 접근할 수 있습니다.</li>
            <li>교사만 상담 가능 날짜, 상담 불가 시간, 신청 내역을 관리할 수 있습니다.</li>
            <li>이미 신청된 시간은 다른 사용자가 다시 신청할 수 없도록 제한합니다.</li>
            <li>학생과 학부모 화면에는 다른 신청자의 개인정보가 표시되지 않도록 합니다.</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제8조 정보주체의 권리</h4>
          <p>이용자는 본인의 개인정보에 대해 열람, 정정, 삭제를 요청할 수 있습니다.<br/>개인정보 삭제 또는 수정이 필요한 경우 상담 담당 교사에게 요청할 수 있으며, 담당 교사는 확인 후 필요한 조치를 합니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제9조 개인정보 보호책임자</h4>
          <p>본 서비스의 개인정보 처리와 관련한 문의는 아래 담당자에게 할 수 있습니다.</p>
          <ul>
            <li>소속: 세종과학고등학교</li>
            <li>담당: 상담 신청 관리 시스템 담당 교사</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제10조 개인정보처리방침의 변경</h4>
          <p>본 개인정보처리방침은 서비스 운영 방식이나 관련 법령 변경에 따라 수정될 수 있습니다.<br/>변경 사항이 있는 경우 서비스 화면 또는 공지사항을 통해 안내합니다.</p>

          <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>부칙<br/>본 개인정보처리방침은 2026년 7월 2일부터 적용됩니다.</p>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ maxWidth: '200px' }}>확인</button>
        </div>
      </div>
    </div>
  );
}
