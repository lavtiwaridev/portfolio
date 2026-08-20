import { useEffect, useRef } from 'react';
import { FiX, FiDownload, FiMaximize2 } from 'react-icons/fi';
import styles from './ResumeModal.module.scss';

export default function ResumeModal({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.style.overflow = 'hidden';

    // Focus close button
    setTimeout(() => closeButtonRef.current?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.resume_modal__overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.resume_modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Resume preview"
      >
        {/* Terminal bar */}
        <div className={styles.resume_modal__bar}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
          <span className={styles.resume_modal__title}>~/documents/Lav_Resume.pdf</span>
          <div className={styles.resume_modal__actions}>
            <a
              href="/Lav_Resume.pdf"
              download="Lav_Resume.pdf"
              className={styles.resume_modal__action_btn}
              title="Download PDF"
            >
              <FiDownload /> <span>Download</span>
            </a>
            <a
              href="/Lav_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resume_modal__action_btn}
              title="Open in new tab"
            >
              <FiMaximize2 /> <span>Full screen</span>
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.resume_modal__close}
              onClick={onClose}
              aria-label="Close resume preview"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* PDF iframe */}
        <div className={styles.resume_modal__body}>
          <iframe
            src="/Lav_Resume.pdf#toolbar=0&navpanes=0"
            title="Lav Kumar Resume"
            className={styles.resume_modal__iframe}
          />
        </div>
      </div>
    </div>
  );
}
