import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiGithub, FiMail, FiLinkedin,
  FiArrowDown, FiDownload, FiMessageCircle
} from 'react-icons/fi';
import styles from './Hero.module.scss';



// ── 3D Tilt Hook ──────────────────────────────────────────────────────────────
function useTilt(strength = 8) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rx = -dy * strength;
    const ry = dx * strength;
    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
    }
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}

// ── Terminal Data ─────────────────────────────────────────────────────────────
const TERMINAL_LINES = [
  {
    type: 'comment', indent: 0,
    segments: [{ text: '// Output:', type: 'comment' }]
  },
  {
    type: 'bracket', indent: 0,
    segments: [{ text: '{', type: 'bracket' }]
  },
  {
    type: 'property', indent: 2,
    segments: [
      { text: 'name', type: 'key' }, { text: ': ', type: 'plain' },
      { text: '"LAV KUMAR"', type: 'val' }, { text: ',', type: 'plain' }
    ]
  },
  {
    type: 'property', indent: 2,
    segments: [
      { text: 'role', type: 'key' }, { text: ': ', type: 'plain' },
      { text: '"Final year CSE Undergraduate"', type: 'val' }, { text: ',', type: 'plain' }
    ]
  },
  {
    type: 'property', indent: 2,
    segments: [
      { text: 'stack', type: 'key' }, { text: ': ', type: 'plain' },
      { text: '["Java", "JavaScript", "React", "Node.js"]', type: 'val' }, { text: ',', type: 'plain' }
    ]
  },
  {
    type: 'property', indent: 2,
    segments: [
      { text: 'status', type: 'key' }, { text: ': ', type: 'plain' },
      { text: '"actively seeking Full-Stack Developer roles"', type: 'val' }
    ]
  },
  {
    type: 'bracket', indent: 0,
    segments: [{ text: '}', type: 'bracket' }]
  }
];

// Precompute offsets and flatText at module scope
const linesWithOffsets = [];
let globalOffset = 0;
let flatText = '';

TERMINAL_LINES.forEach((line, lineIdx) => {
  const lineSegments = [];
  const lineStart = globalOffset;

  line.segments.forEach((seg) => {
    const start = globalOffset;
    const end = globalOffset + seg.text.length;
    lineSegments.push({ ...seg, start, end });
    flatText += seg.text;
    globalOffset += seg.text.length;
  });

  const hasNewline = lineIdx < TERMINAL_LINES.length - 1;
  if (hasNewline) { flatText += '\n'; globalOffset += 1; }

  linesWithOffsets.push({
    ...line, segments: lineSegments,
    start: lineStart, end: globalOffset, hasNewline
  });
});

const totalChars = globalOffset;

// ── Typing Command ────────────────────────────────────────────────────────────
function TypingCommand({ command, onComplete }) {
  const [text, setText] = useState('');

  useEffect(() => {
    let intervalId = null;
    const startTimeout = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        setText(command.slice(0, i + 1));
        i++;
        if (i >= command.length) {
          clearInterval(intervalId);
          if (onComplete) setTimeout(onComplete, 300);
        }
      }, 100);
    }, 1000);

    return () => { clearTimeout(startTimeout); if (intervalId) clearInterval(intervalId); };
  }, [command, onComplete]);

  return <span className={styles.cmd}>{text}</span>;
}

// ── Typing Terminal ───────────────────────────────────────────────────────────
function TypingTerminal() {
  const [commandComplete, setCommandComplete] = useState(false);
  const [visibleChars, setVisibleChars] = useState(0);
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useTilt(7);

  useEffect(() => {
    if (!commandComplete) return;
    if (visibleChars >= totalChars) return;

    const nextCharIndex = visibleChars;
    let delay = 25;
    const char = flatText[nextCharIndex];
    if (char === '\n') delay = 200;
    else if (char === ',' || char === ':') delay = 100;
    else if (char === ' ') delay = 10;

    const timer = setTimeout(() => setVisibleChars((prev) => prev + 1), delay);
    return () => clearTimeout(timer);
  }, [commandComplete, visibleChars]);

  // Find cursor position
  let activeLineIdx = -1;
  let activeSegIdx = -1;
  let cursorFound = false;

  for (let l = 0; l < linesWithOffsets.length; l++) {
    const line = linesWithOffsets[l];
    for (let s = 0; s < line.segments.length; s++) {
      const seg = line.segments[s];
      if (visibleChars >= seg.start && visibleChars < seg.end) {
        activeLineIdx = l; activeSegIdx = s; cursorFound = true; break;
      }
    }
    if (cursorFound) break;
  }

  if (!cursorFound && visibleChars === totalChars) {
    activeLineIdx = linesWithOffsets.length - 1;
    activeSegIdx = linesWithOffsets[activeLineIdx].segments.length - 1;
    cursorFound = true;
  }

  if (!cursorFound && visibleChars > 0) {
    for (let l = 0; l < linesWithOffsets.length; l++) {
      const line = linesWithOffsets[l];
      for (let s = 0; s < line.segments.length; s++) {
        const seg = line.segments[s];
        if (visibleChars === seg.end) { activeLineIdx = l; activeSegIdx = s; }
      }
    }
  }

  return (
    <div
      className={styles['hero__terminal-tilt']}
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.hero__terminal}>
        <div className={styles['hero__term-bar']}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
          <span className={styles.title}>~ whoami</span>
        </div>
        <div className={styles['hero__term-body']}>
          <div>
            <span className={styles.prompt}>❯ </span>
            <TypingCommand command="whoami" onComplete={() => setCommandComplete(true)} />
            {!commandComplete && <span className={styles['cursor-blink']} />}
          </div>

          {commandComplete && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {linesWithOffsets.map((line, lineIdx) => {
                if (visibleChars < line.start) return null;
                return (
                  <div
                    key={lineIdx}
                    style={{ paddingLeft: line.indent ? line.indent * 13 : 0, lineHeight: 1.8 }}
                  >
                    {line.segments.map((seg, segIdx) => {
                      if (visibleChars < seg.start) return null;
                      const visibleLength = Math.min(seg.text.length, visibleChars - seg.start);
                      const typedText = seg.text.slice(0, visibleLength);
                      const showCursor = (lineIdx === activeLineIdx && segIdx === activeSegIdx);
                      return (
                        <span key={segIdx} className={styles[seg.type]}>
                          {typedText}
                          {showCursor && <span className={styles['cursor-blink']} />}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function Hero({ onSectionChange }) {
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const isMobile = window.innerWidth <= 760;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offset = isMobile ? 8 : 44;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      onSectionChange?.(id);
    }
  };

  return (
    <section id="hero" className={styles.hero}>


      <div className="container">
        <div className={styles.hero__grid}>
          {/* Left — text */}
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden"
            animate="show"
          >
            <motion.div className={styles.hero__eyebrow} variants={fade}>
              <span className={styles.dot} />
              seeking Full-Stack Developer roles
            </motion.div>

            <motion.h1 className={styles.hero__headline} variants={fade}>
              Building full-stack apps &amp; solving{' '}
              <span>algorithmic challenges.</span>
            </motion.h1>

            <motion.p className={styles.hero__subtext} variants={fade}>
              Computer Science &amp; Engineering student focused on Java, JavaScript, and React —
              passionate about clean code, scalable APIs, and system optimization.
            </motion.p>

            <motion.div className={styles.hero__ctas} variants={fade}>
              <div className={styles['hero__cta-group']}>
                <a href="#projects" className="btn btn--primary" onClick={e => { e.preventDefault(); handleScroll('projects'); }}>
                  <FiArrowDown /> View projects
                </a>
                <a href="/Lav_Resume.pdf" className="btn btn--outline" download>
                  <FiDownload /> Download résumé
                </a>
              </div>
              <a href="#contact" className="btn btn--ghost" onClick={e => { e.preventDefault(); handleScroll('contact'); }}>
                <FiMessageCircle /> Get in touch
              </a>
            </motion.div>

            <motion.div className={styles.hero__socials} variants={fade}>
              <a href="https://github.com/lavtiwaridev" target="_blank" rel="noopener noreferrer" aria-label="Lav Kumar on GitHub" className={styles.github}><FiGithub /></a>
              <a href="https://www.linkedin.com/in/lavtiwaridev/" target="_blank" rel="noopener noreferrer" aria-label="Lav Kumar on LinkedIn" className={styles.linkedin}><FiLinkedin /></a>
              <a href="mailto:lavtiwari.dev@gmail.com" aria-label="Email" className={styles.mail}><FiMail /></a>
            </motion.div>
          </motion.div>

          {/* Right — 3D-tilt terminal */}
          <motion.div
            className={styles.hero__right}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <TypingTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
