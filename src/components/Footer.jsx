import React, { useState } from 'react';
import PrivacyModal from './PrivacyModal';
import TermsModal from './TermsModal';

export default function Footer() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div>
          <span>제작: 세종과학고등학교 이예린</span>
          <span style={{ margin: '0 10px' }}>|</span>
          <a onClick={(e) => { e.preventDefault(); setIsPrivacyOpen(true); }} style={{ cursor: 'pointer' }}>개인정보처리방침</a>
          <span style={{ margin: '0 10px' }}>|</span>
          <a onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }} style={{ cursor: 'pointer' }}>이용약관</a>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <a href="https://github.com/bboongbbong2/304-SangDamApply" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
        </div>
      </footer>
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}
