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
        <div style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
          <h3 style={{ marginTop: 0 }}>학생 상담 신청 관리 시스템 및 AI 활용 윤리 가이드 게이트 개인정보처리방침</h3>
          <p>본 서비스(이하 '학생 상담 신청 관리 시스템')는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제1조 (개인정보의 처리 목적)</h4>
          <p>본 서비스는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ol>
            <li><strong>상담 신청 접수 및 일정 관리:</strong> 학생의 상담 신청 내역 접수, 상담 일정 조율 및 확정, 교사의 상담 신청 관리</li>
            <li><strong>신청 결과 조회:</strong> 학생이 본인의 학번과 이름을 통해 상담 신청 상태(대기 중, 상담 확정, 상담 완료 등)를 확인 및 조회</li>
          </ol>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제2조 (개인정보의 처리 및 보유기간)</h4>
          <p>① 본 서비스는 학생의 개인정보를 원칙적으로 교육 활동 기간 동안에만 한시적으로 보유하며, 목적이 달성된 후에는 지체 없이 파기합니다.</p>
          <p>② 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
          <ul>
            <li><strong>보유 기간:</strong> 해당 학년도 종료 시(익년 2월 말) 또는 학생의 졸업/진급 시까지</li>
            <li><strong>파기 시점:</strong> 보유 기간 종료 또는 이용자가 삭제를 요청한 경우 지체 없이(5일 이내) 파기</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제3조 (처리하는 개인정보 항목)</h4>
          <p>본 서비스는 상담 신청 및 예약 관리를 위해 필요한 최소한의 개인정보만을 수집하며, 민감정보나 불필요한 개인정보는 수집하지 않습니다.</p>
          <ul>
            <li><strong>수집 항목:</strong> 학번, 이름, 희망 상담 날짜, 희망 상담 시간</li>
            <li><strong>수집하지 않는 항목:</strong> 주민등록번호, 주소, 전화번호, 이메일 등 기타 불필요한 정보</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제4조 (만 14세 미만 아동의 개인정보 처리에 관한 사항)</h4>
          <p>① 본 서비스는 만 14세 미만 아동의 개인정보를 처리하기 위하여 학교 가정통신문(개인정보 수집·이용 동의서)을 통하여 법정대리인의 동의를 받거나 가입/신청 단계에서 법정대리인의 동의를 확인합니다.</p>
          <p>② 법정대리인이 동의하지 않는 경우, 해당 아동은 서비스 이용에 제한이 있을 수 있습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제5조 (개인정보의 파기 절차 및 방법)</h4>
          <p>① 본 서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
          <p>② <strong>파기 방법:</strong> 본 서비스는 시스템 관리자(담당 교사)가 시스템 내에서 삭제를 실행할 시 데이터베이스에서 영구 삭제됩니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제6조 (개인정보의 안전성 확보조치)</h4>
          <p>본 서비스는 이용자의 개인정보가 분실·도난·유출·변조 또는 훼손되지 않도록 안전성 확보를 위해 다음과 같은 기술적/관리적 조치를 취하고 있습니다.</p>
          <ol>
            <li><strong>취급 담당자 최소화:</strong> 상담 정보에 접근할 수 있는 교사(관리자)를 최소한으로 지정하여 관리 권한을 제한합니다.</li>
            <li><strong>접근 권한 관리:</strong> 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있습니다.</li>
          </ol>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제7조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h4>
          <p>① 학생(정보주체) 및 법정대리인은 언제든지 본인의 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
          <p>② 권리 행사는 시스템 내에서 신청 내역 조회 후 취소/삭제를 요청하거나, 담당 교사에게 구두 또는 서면으로 요청하시면 지체 없이 조치하겠습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제8조 (개인정보 보호책임자)</h4>
          <p>본 서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <p><strong>성명:</strong> [담당 교사 성명 입력]<br/><strong>소속:</strong> 세종과학고등학교<br/><strong>직위:</strong> 교사<br/><strong>연락처:</strong> [학교 교무실 내선 번호 입력]</p>

          <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>이 개인정보 처리방침은 2026년 6월 27일부터 적용됩니다.</p>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ maxWidth: '200px' }}>확인</button>
        </div>
      </div>
    </div>
  );
}
