import React, { useState } from 'react';
import PrivacyModal from './PrivacyModal';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div>
          <span>제작: 세종과학고등학교 이예린</span>
          <span style={{ margin: '0 10px' }}>|</span>
          <a onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>개인정보보호방침</a>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <a href="https://github.com/bboongbbong2/304-SangDamApply" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
        </div>
      </footer>
      <PrivacyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
