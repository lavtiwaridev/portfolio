import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiHome, FiUser, FiCode, FiAward, FiBook, FiMail,
  FiGithub, FiLinkedin, FiDownload, FiMessageSquare,
  FiZap, FiTerminal, FiSearch, FiArrowRight
} from 'react-icons/fi';
import styles from './CommandPalette.module.scss';

const COMMANDS = [
  // Navigation
  { id: 'hero',          label: 'Go to Home',           icon: FiHome,         group: 'navigate', section: 'hero' },
  { id: 'about',         label: 'Go to About',          icon: FiUser,         group: 'navigate', section: 'about' },
  { id: 'projects',      label: 'Go to Projects',       icon: FiCode,         group: 'navigate', section: 'projects' },
  { id: 'skills',        label: 'Go to Skills',         icon: FiZap,          group: 'navigate', section: 'skills' },
  { id: 'certifications',label: 'Go to Certifications', icon: FiAward,        group: 'navigate', section: 'certifications' },
  { id: 'education',     label: 'Go to Education',      icon: FiBook,         group: 'navigate', section: 'education' },
  { id: 'testimonials',  label: 'Go to Testimonials',   icon: FiMessageSquare,group: 'navigate', section: 'testimonials' },
  { id: 'contact',       label: 'Go to Contact',        icon: FiMail,         group: 'navigate', section: 'contact' },
  // Actions
  { id: 'resume',        label: 'Download Résumé',      icon: FiDownload,     group: 'action',   action: () => { const a = document.createElement('a'); a.href = '/Lav_Resume.pdf'; a.download = 'Lav_Resume.pdf'; a.click(); } },
  { id: 'github',        label: 'Open GitHub Profile',  icon: FiGithub,       group: 'action',   action: () => window.open('https://github.com/lavtiwaridev', '_blank') },
  { id: 'linkedin',      label: 'Open LinkedIn',        icon: FiLinkedin,     group: 'action',   action: () => window.open('https://www.linkedin.com/in/lavtiwaridev/', '_blank') },
  { id: 'email',         label: 'Send Email',           icon: FiMail,         group: 'action',   action: () => window.location.href = 'mailto:lavtiwari.dev@gmail.com' },
];

const GROUP_LABELS = {
  navigate: 'Navigation',
  action: 'Actions'
};

export default function CommandPalette({ onSectionChange, isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [focusedIdx, setFocusedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filter commands
  const filtered = query.trim() === ''
    ? COMMANDS
    : COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.id.toLowerCase().includes(query.toLowerCase()) ||
        cmd.group.toLowerCase().includes(query.toLowerCase())
      );

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setFocusedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keep focused item in view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const focused = list.querySelector(`[data-focused="true"]`);
    if (focused) focused.scrollIntoView({ block: 'nearest' });
  }, [focusedIdx]);

  const executeCommand = useCallback((cmd) => {
    onClose();
    if (cmd.section) {
      setTimeout(() => {
        const el = document.getElementById(cmd.section);
        if (el) {
          const isMobile = window.innerWidth <= 760;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offset = isMobile ? 8 : 44;

          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        }
        onSectionChange?.(cmd.section);
      }, 80);
    } else if (cmd.action) {
      setTimeout(cmd.action, 80);
    }
  }, [onClose, onSectionChange]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[focusedIdx]) {
      executeCommand(filtered[focusedIdx]);
    }
  }, [isOpen, filtered, focusedIdx, onClose, executeCommand]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset focus index when query changes
  useEffect(() => { setFocusedIdx(0); }, [query]);

  if (!isOpen) return null;

  // Group filtered commands
  const groups = {};
  filtered.forEach(cmd => {
    if (!groups[cmd.group]) groups[cmd.group] = [];
    groups[cmd.group].push(cmd);
  });

  let globalIdx = 0;

  return (
    <div
      className={styles.palette__overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.palette}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Header bar */}
        <div className={styles.palette__bar}>
          <span className={`${styles.palette__dot} ${styles.red}`} />
          <span className={`${styles.palette__dot} ${styles.yellow}`} />
          <span className={`${styles.palette__dot} ${styles.green}`} />
          <span className={styles.palette__title}>command-palette.sh</span>
          <kbd className={styles.palette__esc} onClick={onClose}>esc</kbd>
        </div>

        {/* Search input */}
        <div className={styles.palette__search}>
          <FiSearch className={styles.palette__search_icon} />
          <span className={styles.palette__prompt}>❯</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command..."
            className={styles.palette__input}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search commands"
          />
        </div>

        {/* Results */}
        <div className={styles.palette__results} ref={listRef} role="listbox">
          {filtered.length === 0 ? (
            <div className={styles.palette__empty}>
              <span className={styles.palette__comment}>{'// no commands found'}</span>
            </div>
          ) : (
            Object.entries(groups).map(([group, cmds]) => (
              <div key={group} className={styles.palette__group}>
                <div className={styles.palette__group_label}>
                  <span>{GROUP_LABELS[group] || group}</span>
                </div>
                {cmds.map(cmd => {
                  const idx = globalIdx++;
                  const isFocused = idx === focusedIdx;
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      className={`${styles.palette__item} ${isFocused ? styles['palette__item--focused'] : ''}`}
                      data-focused={isFocused}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setFocusedIdx(idx)}
                      role="option"
                      aria-selected={isFocused}
                    >
                      <span className={styles.palette__item_icon}>
                        <Icon />
                      </span>
                      <span className={styles.palette__item_label}>{cmd.label}</span>
                      {isFocused && (
                        <span className={styles.palette__item_enter}>
                          <FiArrowRight />
                          <kbd>enter</kbd>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className={styles.palette__footer}>
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
