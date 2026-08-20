import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink, FiFile, FiX } from 'react-icons/fi';
import styles from './Projects.module.scss';

const projects = [
  {
    name: 'Gen AI Inventory Assistant',
    file: 'ai-inventory/App.jsx',
    desc: 'AI-powered inventory assistant with natural-language queries and multi-provider support.',
    status: 'live',
    flagship: true,
    stack: ['React', 'Node.js', 'MongoDB', 'Google Gemini API'],
    demo: 'https://genai-inventry-assistant.vercel.app/',
    repo: 'https://github.com/lavtiwaridev/genai-inventry-assistant',
    image: '/images/proj-ai-assistant.webp',
    color: 'var(--white)',
    longDesc: 'Gen AI Inventory Assistant is a modern inventory management application integrating the Google Gemini API. It features a natural-language query interface for generating inventory insights, structured data modules for products, suppliers, and orders, and role-based access control for secure administration.',
    metric: 'AI-powered natural language queries',
    features: [
      'Built an AI inventory assistant with 4 modules—Products, Inventory, Suppliers, and Orders.',
      'Integrated Google Gemini API for natural-language queries and inventory insights.',
      'Implemented 3 roles—Admin, Manager, and Staff—for role-based access.',
      'Designed AI provider support for Offline, Gemini, and SAP modes with minimal changes.'
    ]
  },
  {
    name: 'MovieLens',
    file: 'movie-lens/App.jsx',
    desc: 'A modern movie exploration platform powered by the OMDb API for searching, cataloging, and rating films.',
    status: 'live',
    stack: ['React', 'Vite', 'OMDb API', 'CSS/SCSS', 'Framer Motion'],
    demo: 'https://movie-lens-kappa.vercel.app/',
    repo: 'https://github.com/lavtiwaridev/movie_lens',
    image: '/images/proj-movielens.webp',
    color: 'var(--mauve)',
    longDesc: 'MovieLens is a premium movie discovery and rating web application integrating the OMDb API. It features detailed metadata cards, search autocompletion, popular tags filtering, and interactive watchlist controls with modern aesthetics.',
    metric: 'Live deployment · OMDb API integrations',
    features: [
      'Integrated OMDb API for real-time movie, actor, and director queries.',
      'Designed a glassmorphic dashboard with a dark-theme UI and custom rating metrics.',
      'Built a persistent watchlist enabling users to save and view favorites via local storage.',
      'Created interactive search filter tags for popular franchise shortcuts.'
    ]
  },
  {
    name: 'WasteChain',
    file: 'waste-chain/index.js',
    desc: 'Full-stack industrial waste exchange platform enabling organic byproduct reuse between organizations.',
    status: 'live',
    flagship: true,
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    demo: '#',
    repo: '#',
    image: '/images/proj-wastechain.webp',
    color: 'var(--green)',
    longDesc: 'WasteChain is an innovative industrial reuse platform created to facilitate structured recycling and waste redistribution between different business entities. It allows organizations to list surplus production materials and negotiate exchanges, lowering operational overhead and building environment-friendly supply chains.',
    metric: 'Full-stack prototype · role-based exchange workflow',
    caseStudy: {
      problem: 'Industrial organizations generate significant organic waste with no structured mechanism to exchange it with others who could reuse it as raw material — causing environmental harm and economic loss.',
      approach: 'Built a full-stack marketplace where producers can list waste and consumers can browse, filter, and negotiate exchanges. Chose MongoDB for flexible waste-type schemas and JWT for secure multi-role auth.',
      tradeoffs: 'Opted for REST over GraphQL to keep the backend accessible to junior contributors. Used server-side filtering instead of client-side search to reduce payload size — tradeoff is higher API latency on complex queries.',
      improvements: 'Would add real-time notifications via WebSockets, a recommendation engine matching waste types to historical buyers, and integrate geolocation to optimize logistics cost estimates.',
      architecture: `  Client (React)
       │
       ▼
  ┌─────────────────────────────┐
  │  Express REST API (Node.js)  │
  │  JWT Auth · Role middleware  │
  └──────────┬──────────────────┘
             │
    ┌────────┴─────────┐
    ▼                  ▼
 MongoDB Atlas    File Storage
 (Waste docs,    (Listing images)
  User models,
  Exchange logs)`,
    },
    features: [
      'Built a full-stack platform enabling industrial waste exchange between organizations.',
      'Developed secure RESTful APIs with JWT authentication and role-based access control.',
      'Designed efficient MongoDB data models and optimized query performance using indexing.',
      'Designed fully responsive UI templates using React and Tailwind CSS custom components.'
    ]
  },
  {
    name: 'Hiring Search Tool',
    file: 'hiring-search/main.js',
    desc: 'Boolean-based smart lookup search engine to find and identify target hiring managers.',
    status: 'live',
    stack: ['React.js', 'Node.js', 'Firebase'],
    demo: '#',
    repo: '#',
    image: '/images/proj-hiring-search.webp',
    color: 'var(--blue)',
    longDesc: 'Hiring Search Tool is a boolean-based lookup system customized for recruitment mapping. It queries datasets instantly to search for managers matching target skills, processes candidate attributes, and caches frequently accessed search indexes.',
    metric: 'Boolean search · Firebase-backed data retrieval',
    features: [
      'Developed a Boolean-based search tool to identify relevant hiring managers.',
      'Integrated Firebase real-time database for efficient data storage and retrieval.',
      'Improved UI responsiveness using React Hooks and optimized state management.',
      'Implemented clean query parsers that filter and evaluate search keywords instantly.'
    ]
  }
];

const statusLabel = { live: 'live', progress: 'in progress', archived: 'archived' };
const hasProjectLink = (link) => Boolean(link && link !== '#');

const fade = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const [activeProject, setActiveProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);
  const gridRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const FILTER_OPTIONS = [
    { value: 'all', label: 'all_files.sh' },
    { value: 'flagship', label: 'flagships/' },
    { value: 'live', label: 'live/' },
    { value: 'progress', label: 'in_progress/' },
    { value: 'archived', label: 'archived/' }
  ];

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'flagship') return p.flagship;
    return p.status === filter;
  });

  const handleScroll = () => {
    if (!gridRef.current) return;
    const { scrollLeft, clientWidth } = gridRef.current;
    const card = gridRef.current.querySelector(`.${styles.projects__card}`);
    const step = card ? card.getBoundingClientRect().width + 12 : clientWidth - 8;
    const index = Math.round(scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(index, projects.length - 1)));
  };

  const openProject = (project, trigger) => {
    triggerRef.current = trigger;
    setActiveProject(project);
  };

  // Lock body scroll when popup is active
  useEffect(() => {
    if (activeProject) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
    };
  }, [activeProject]);

  // Close popup on escape key
  useEffect(() => {
    if (!activeProject) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  useEffect(() => {
    if (activeProject) {
      closeButtonRef.current?.focus();
    } else {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [activeProject]);
  return (
    <section id="projects" className={`section ${styles.projects}`} ref={ref}>
      <div className="container">
        <h2 className="section-title" data-prefix="03">projects/</h2>

        <div className={styles.projects__filters}>
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.projects__filter_btn} ${filter === opt.value ? styles['projects__filter_btn--active'] : ''}`}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <motion.div
          ref={gridRef}
          onScroll={handleScroll}
          className={styles.projects__grid}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {filteredProjects.map(p => (
            <motion.article
              key={p.name}
              className={styles.projects__card}
              variants={fade}
              style={{ '--proj-color': p.color }}
            >
              <div
                className={styles.projects__card_inner}
                onClick={(event) => openProject(p, event.currentTarget)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openProject(p, event.currentTarget);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${p.name}`}
                title="Click to view project details"
              >
                {/* Tab header */}
                <div className={styles['projects__card-header']}>
                  <span className={styles.projects__filename}>
                    <FiFile />
                    {p.file}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.flagship && (
                      <span className={styles['projects__badge--flagship']}>★ case study</span>
                    )}
                    <span className={`${styles.projects__badge} ${styles[`projects__badge--${p.status}`]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </div>
                </div>

                {/* Preview image */}
                <div className={styles.projects__preview}>
                  <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" />
                  <div className={styles.projects__overlay} />
                </div>

                {/* Body */}
                <div className={styles['projects__card-body']}>
                  <h3 className={styles.projects__title}>{p.name}</h3>
                  <p className={styles.projects__desc}>{p.desc}</p>
                  {p.metric && (
                    <div className={styles.projects__metric}>{p.metric}</div>
                  )}
                  <div className={styles.projects__stack}>
                    {p.stack.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={styles['projects__card-footer']}>
                {hasProjectLink(p.demo) ? (
                  <a href={p.demo} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink /> Live demo
                  </a>
                ) : (
                  <span className={styles.projects__link_unavailable}>
                    <FiExternalLink /> Demo soon
                  </span>
                )}
                {hasProjectLink(p.repo) ? (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">
                    <FiGithub /> Source
                  </a>
                ) : (
                  <span className={styles.projects__link_unavailable}>
                    <FiGithub /> Private repo
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Mobile Swipe Indicators */}
        <div className={styles.projects__indicators}>
          {projects.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.projects__indicator} ${activeIndex === idx ? styles['projects__indicator--active'] : ''}`}
              onClick={() => {
                if (gridRef.current) {
                  const card = gridRef.current.querySelector(`.${styles.projects__card}`);
                  const step = card ? card.getBoundingClientRect().width + 12 : gridRef.current.clientWidth - 8;
                  gridRef.current.scrollTo({
                    left: idx * step,
                    behavior: 'smooth'
                  });
                }
              }}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Details Popup Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className={styles.projects__popup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            role="presentation"
          >
            <motion.div
              className={styles['projects__popup-content']}
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`${activeProject.name} details`}
            >
            {/* Header bar */}
            <div className={styles['projects__popup-header']}>
              <span className={styles.projects__filename}>
                <FiFile /> {activeProject.file}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                className={styles['projects__popup-close']}
                onClick={() => setActiveProject(null)}
                aria-label="Close details"
              >
                <FiX />
              </button>
            </div>

            {/* Scrollable details */}
            <div className={styles['projects__popup-scroll']}>
              <div className={styles['projects__popup-image']}>
                <img src={activeProject.image} alt={activeProject.name} />
              </div>

              <div className={styles['projects__popup-meta']}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h3 className={styles['projects__popup-title']}>{activeProject.name}</h3>
                  {activeProject.flagship && (
                    <span className={styles['projects__badge--flagship']} style={{ fontSize: 11 }}>★ flagship</span>
                  )}
                </div>
                <div className={styles.projects__stack} style={{ margin: '8px 0 12px' }}>
                  {activeProject.stack.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <p className={styles['projects__popup-longdesc']}>{activeProject.longDesc}</p>
                {activeProject.metric && (
                  <div style={{ marginTop: 12 }}>
                    <strong>Project outcome:</strong>
                    <div style={{ marginTop: 6, color: 'var(--text)' }}>
                      {activeProject.metric}
                    </div>
                  </div>
                )}
              </div>

              {/* Flagship case-study deep-dive */}
              {activeProject.caseStudy && (
                <div className={styles['projects__case-study']}>
                  <h4 className={styles['projects__popup-section-title']}>Case Study Deep-Dive</h4>
                  <div className={styles['projects__case-grid']}>
                    <div className={styles['projects__case-block']}>
                      <div className={styles['projects__case-label']}><span>// 01</span> Problem</div>
                      <p>{activeProject.caseStudy.problem}</p>
                    </div>
                    <div className={styles['projects__case-block']}>
                      <div className={styles['projects__case-label']}><span>// 02</span> Approach</div>
                      <p>{activeProject.caseStudy.approach}</p>
                    </div>
                    <div className={styles['projects__case-block']}>
                      <div className={styles['projects__case-label']}><span>// 03</span> Tradeoffs</div>
                      <p>{activeProject.caseStudy.tradeoffs}</p>
                    </div>
                    <div className={styles['projects__case-block']}>
                      <div className={styles['projects__case-label']}><span>// 04</span> What I'd improve</div>
                      <p>{activeProject.caseStudy.improvements}</p>
                    </div>
                  </div>
                  <div className={styles['projects__arch-diagram']}>
                    <div className={styles['projects__arch-label']}>Architecture</div>
                    <pre>{activeProject.caseStudy.architecture}</pre>
                  </div>
                </div>
              )}

              <div>
                <h4 className={styles['projects__popup-section-title']}>Technical Features</h4>
                <ul className={styles['projects__popup-features']}>
                  {activeProject.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action links */}
            <div className={styles['projects__popup-footer']}>
              {hasProjectLink(activeProject.repo) && (
                <a
                  href={activeProject.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                  style={{ padding: '8px 16px' }}
                >
                  <FiGithub /> Source Code
                </a>
              )}
              {hasProjectLink(activeProject.demo) && (
                <a
                  href={activeProject.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  style={{ padding: '8px 16px' }}
                >
                  <FiExternalLink /> Visit Project
                </a>
              )}
              {!hasProjectLink(activeProject.repo) && !hasProjectLink(activeProject.demo) && (
                <span className={styles.projects__popup_unavailable}>Links will be added soon.</span>
              )}
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
