import React from 'react';
import { X } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 className="modal-title">이용약관</h2>
          <button className="modal-close" onClick={onClose}><X size={24} /></button>
        </div>
        <div style={{ lineHeight: '1.6', fontSize: '0.95rem', wordBreak: 'keep-all' }}>
          <p>본 이용약관은 상담 신청 관리 시스템의 이용 조건과 이용자 및 서비스 제공자의 권리와 의무를 정하기 위한 것입니다.</p>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제1조 목적</h4>
          <p>이 약관은 상담 신청 관리 시스템을 이용함에 있어 서비스 제공자와 이용자의 권리, 의무 및 책임사항을 규정하는 것을 목적으로 합니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제2조 정의</h4>
          <p>이 약관에서 사용하는 용어의 뜻은 다음과 같습니다.</p>
          <ul>
            <li><strong>서비스</strong>란 학생 또는 학부모가 상담 시간을 신청하고, 교사가 상담 일정을 관리할 수 있도록 제공되는 웹 기반 상담 신청 시스템을 말합니다.</li>
            <li><strong>이용자</strong>란 본 서비스에 접속하여 상담 신청 기능을 이용하는 학생, 학부모, 교사를 말합니다.</li>
            <li><strong>교사 관리자</strong>란 Firebase 계정으로 로그인하여 상담 가능 날짜, 상담 시간, 신청 현황을 관리하는 사용자를 말합니다.</li>
            <li><strong>학생/학부모 이용자</strong>란 교사가 설정한 인증코드를 입력한 후 상담 신청 기능을 이용하는 사용자를 말합니다.</li>
            <li><strong>인증코드</strong>란 학생과 학부모가 상담 신청 화면에 접근하기 위해 입력하는 4자리 코드를 말합니다.</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제3조 약관의 게시와 변경</h4>
          <ul>
            <li>본 서비스는 이용자가 약관의 내용을 확인할 수 있도록 서비스 화면 또는 푸터에 게시합니다.</li>
            <li>서비스 운영상 필요한 경우 약관을 변경할 수 있습니다.</li>
            <li>약관이 변경되는 경우 서비스 화면을 통해 변경 내용을 안내합니다.</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제4조 서비스의 제공</h4>
          <p>본 서비스는 다음 기능을 제공합니다.</p>
          <ul>
            <li>학생 및 학부모의 상담 신청</li>
            <li>교사의 상담 가능 날짜 설정</li>
            <li>날짜별 상담 시간표 관리</li>
            <li>상담 불가 시간 표시</li>
            <li>신청 완료 시간의 중복 신청 방지</li>
            <li>상담 신청 현황 확인</li>
          </ul>
          <p>본 서비스는 교육 및 상담 일정 관리를 위한 목적으로 제공되며, 상업적 목적으로 운영되지 않습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제5조 서비스 이용 방법</h4>
          <p>학생 및 학부모는 다음 절차에 따라 서비스를 이용합니다.</p>
          <ol>
            <li>학생 또는 학부모를 선택합니다.</li>
            <li>교사가 안내한 4자리 인증코드를 입력합니다.</li>
            <li>학번과 이름을 입력합니다.</li>
            <li>교사가 열어 둔 날짜와 시간 중 신청 가능한 시간을 선택합니다.</li>
            <li>신청 내용을 확인하고 제출합니다.</li>
          </ol>
          <p>교사는 Firebase 계정으로 로그인한 뒤 상담 가능 날짜, 시간표, 상담 불가 시간, 신청 현황을 관리합니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제6조 이용자의 의무</h4>
          <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
          <ul>
            <li>타인의 학번이나 이름을 도용하여 신청하는 행위</li>
            <li>허위 정보를 입력하여 상담을 신청하는 행위</li>
            <li>다른 사람의 상담 신청을 방해하는 행위</li>
            <li>인증코드를 무단으로 공유하거나 부정하게 사용하는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>서비스 화면이나 데이터를 무단으로 변경하려는 행위</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제7조 교사 관리자의 의무</h4>
          <p>교사 관리자는 다음 사항을 준수해야 합니다.</p>
          <ul>
            <li>상담 가능 날짜와 시간을 정확하게 설정합니다.</li>
            <li>상담이 불가능한 시간은 미리 불가로 표시합니다.</li>
            <li>신청자의 개인정보가 불필요하게 노출되지 않도록 관리합니다.</li>
            <li>상담 신청 목적이 끝난 개인정보는 필요한 시점에 삭제합니다.</li>
            <li>관리자 계정과 인증코드가 외부에 노출되지 않도록 주의합니다.</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제8조 신청 제한 및 변경</h4>
          <ul>
            <li>이미 다른 이용자가 신청한 시간은 신청할 수 없습니다.</li>
            <li>교사가 불가로 표시한 시간은 신청할 수 없습니다.</li>
            <li>상담 신청 후 변경이나 취소가 필요한 경우 담당 교사에게 요청해야 합니다.</li>
            <li>학교 일정이나 교사 사정에 따라 상담 시간이 변경될 수 있습니다.</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제9조 서비스의 중단</h4>
          <p>다음과 같은 경우 서비스 이용이 일시적으로 중단될 수 있습니다.</p>
          <ul>
            <li>시스템 점검 또는 오류가 발생한 경우</li>
            <li>Firebase, Vercel 등 외부 서비스 장애가 발생한 경우</li>
            <li>네트워크 문제로 접속이 어려운 경우</li>
            <li>학교 운영상 서비스 제공이 어려운 경우</li>
          </ul>
          <p>서비스는 무료로 제공되는 교육용 시스템이므로, 서비스 중단으로 인한 별도의 보상은 제공하지 않습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제10조 개인정보 보호</h4>
          <p>본 서비스는 상담 신청에 필요한 최소한의 개인정보만 수집합니다.<br/>개인정보 처리에 관한 자세한 내용은 별도의 개인정보처리방침에 따릅니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제11조 저작권</h4>
          <p>본 서비스의 화면 구성, 문구, 코드 등 서비스 제공자가 작성한 자료의 권리는 서비스 제공자에게 있습니다.<br/>이용자는 서비스를 무단 복제, 배포, 수정하거나 상업적으로 이용할 수 없습니다.</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제12조 면책 조항</h4>
          <ul>
            <li>본 서비스는 교육 및 상담 신청 편의를 위해 제공되는 무료 서비스입니다.</li>
            <li>이용자가 잘못된 정보를 입력하여 발생한 문제에 대해서는 이용자 본인에게 책임이 있습니다.</li>
            <li>네트워크 오류, 외부 서비스 장애, 기기 문제 등으로 발생한 접속 문제에 대해 서비스 제공자는 제한적인 책임만 부담합니다.</li>
            <li>학교 일정 변경, 교사 사정 등으로 상담 시간이 조정될 수 있습니다.</li>
          </ul>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>제13조 분쟁 해결</h4>
          <p>본 서비스 이용과 관련하여 문제가 발생한 경우, 이용자와 담당 교사는 상호 협의하여 해결합니다.<br/>필요한 경우 대한민국 법령 및 학교의 관련 규정에 따릅니다.</p>

          <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>부칙<br/>본 약관은 2026년 7월 2일부터 시행됩니다.</p>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ maxWidth: '200px' }}>확인</button>
        </div>
      </div>
    </div>
  );
}
