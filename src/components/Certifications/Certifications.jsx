import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCheckCircle, FiExternalLink, FiX } from 'react-icons/fi';
import styles from './Certifications.module.scss';

const certs = [
  {
    name: 'SAP Generative AI Developer Certification',
    issuer: 'SAP',
    year: '2024',
    link: 'https://www.credly.com/badges/50f0c7c4-4821-4f65-8670-dfcc4a2aa49d',
    image: '/images/cert-sap.webp',
    monogram: 'SAP',
    color: '#008FD3',
    iconBg: 'rgba(0,143,211,0.12)',
    iconBorder: 'rgba(0,143,211,0.4)',
  },
  {
    name: 'GitHub Foundations Certification (GH-900)',
    issuer: 'GitHub',
    year: '2026',
    link: 'https://learn.microsoft.com/en-gb/users/lavkumar-official/credentials/certification/github-foundations?tab=credentials-tab',
    image: '/images/cert-github-foundations.webp',
    monogram: 'GH',
    color: 'var(--github-color)',
    iconBg: 'var(--github-bg)',
    iconBorder: 'var(--github-border)',
  },
  {
    name: 'Microsoft Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    year: '2026',
    link: 'https://www.credly.com/badges/1ded4fce-c205-4daf-8c3b-1b5b604fa6e6',
    image: '/images/cert-azure.webp',
    monogram: 'AZ',
    color: '#0078D4',
    iconBg: 'rgba(0,120,212,0.12)',
    iconBorder: 'rgba(0,120,212,0.4)',
  },
  {
    name: 'MongoDB Skill: Relational to Document Model',
    issuer: 'MongoDB',
    year: '2026',
    link: 'https://www.credly.com/badges/ef06b4a6-049b-40c4-a868-5e8021eba2b3',
    image: '/images/cert-mongodb.webp',
    monogram: 'MDB',
    color: '#13AA52',
    iconBg: 'rgba(19,170,82,0.12)',
    iconBorder: 'rgba(19,170,82,0.4)',
  },
  {
    name: 'NPTEL Elite Certification in Cloud Computing',
    issuer: 'IIT/NPTEL',
    year: '2023',
    link: '#',
    image: '/images/cert-nptel.webp',
    monogram: 'IIT',
    color: '#F39C12',
    iconBg: 'rgba(243,156,18,0.12)',
    iconBorder: 'rgba(243,156,18,0.4)',
  },
];

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export default function Certifications() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const [activeCert, setActiveCert] = useState(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);
  const gridRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!gridRef.current) return;
    const { scrollLeft, clientWidth } = gridRef.current;
    const card = gridRef.current.querySelector(`.${styles.certs__card}`);
    const step = card ? card.getBoundingClientRect().width + 12 : clientWidth - 8;
    const index = Math.round(scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(index, certs.length - 1)));
  };

  // Close lightbox on escape key
  useEffect(() => {
    if (!activeCert) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCert]);

  useEffect(() => {
    if (!activeCert) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeCert]);

  useEffect(() => {
    if (activeCert) {
      closeButtonRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [activeCert]);

  return (
    <section id="certifications" className={`section ${styles.certs}`} ref={ref}>
      <div className="container">
        <h2 className="section-title" data-prefix="05">certifications.md</h2>

        <motion.div
          ref={gridRef}
          onScroll={handleScroll}
          className={styles.certs__grid}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {certs.map(c => (
            <motion.div
              key={c.name}
              className={styles.certs__card}
              variants={fade}
              style={{ '--cert-color': c.color }}
            >
              {/* Badge image (clickable) */}
              <button
                type="button"
                className={styles.certs__image}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setActiveCert(c);
                }}
                aria-label={`Preview ${c.name}`}
                title="Click to view large certificate"
              >
                <img src={c.image} alt={`${c.issuer} certification badge`} loading="lazy" />
              </button>

              {/* Top row */}
              <div className={styles['certs__card-top']}>
                <div
                  className={styles.certs__icon}
                  style={{
                    background: c.iconBg,
                    color: c.color,
                    borderColor: c.iconBorder,
                  }}
                >
                  {c.monogram}
                </div>
                <span className={styles.certs__year}>{c.year}</span>
              </div>

              {/* Body */}
              <div className={styles['certs__card-body']}>
                <div className={styles.certs__name}>{c.name}</div>
                <div className={styles.certs__issuer}>{c.issuer}</div>
              </div>

              {/* Footer */}
              <div className={styles['certs__card-footer']}>
                <span className={styles.certs__passed}>
                  <FiCheckCircle /> passed
                </span>
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.certs__verify}
                >
                  verify credential <FiExternalLink />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Swipe Indicators */}
        <div className={styles.certs__indicators}>
          {certs.map((_, idx) => (
            <div
              key={idx}
              className={`${styles.certs__indicator} ${activeIndex === idx ? styles['certs__indicator--active'] : ''}`}
            />
          ))}
        </div>

        {/* View-all link removed per request */}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            className={styles.certs__lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
            role="presentation"
          >
            <motion.div
              className={styles['certs__lightbox-content']}
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificate-dialog-title"
            >
              <button
                ref={closeButtonRef}
                type="button"
                className={styles['certs__lightbox-close']}
                onClick={() => setActiveCert(null)}
                aria-label="Close preview"
              >
                <FiX />
              </button>
              <img src={activeCert.image} alt={`${activeCert.name} full preview`} />
              <div id="certificate-dialog-title" className={styles['certs__lightbox-caption']}>
                {activeCert.name}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
