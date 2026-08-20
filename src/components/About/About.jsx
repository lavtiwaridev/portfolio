import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FiArrowUpRight,
  FiEye,
  FiGithub,
  FiCode,
  FiActivity,
  FiCpu,
} from 'react-icons/fi';
import ResumeModal from '../ResumeModal/ResumeModal';
import AnimatedCounter from '../AnimatedCounter/AnimatedCounter';
import styles from './About.module.scss';

const GITHUB_USER = 'lavtiwaridev';

const stats = [
  { value: '300+', label: 'DSA problems', note: 'solved across coding platforms' },
  { value: '4', label: 'Certifications', note: 'across cloud and development' },
  { value: '5+', label: 'Projects', note: 'built from idea to interface' },
];

// Static LeetCode-style card data (replace with real API if username is provided)
const dsaStats = [
  { label: 'Total Solved', value: '300+', color: 'var(--blue)' },
  { label: 'Easy', value: '120+', color: 'var(--green)' },
  { label: 'Medium', value: '140+', color: 'var(--blue)' },
  { label: 'Hard', value: '40+', color: 'var(--green)' },
];

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, delay } },
});

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 18, stiffness: 110, delay: 0.12 },
  },
};

export default function About({ theme = 'dark' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 });
  const [resumeOpen, setResumeOpen] = useState(false);

  const isDark = theme === 'dark';
  
  const streakUrl = isDark
    ? `https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USER}&theme=transparent&hide_border=true&stroke=transparent&ring=6366F1&fire=22D3EE&currStreakNum=F8FAFC&sideNums=F8FAFC&currStreakLabel=94a3b8&sideLabels=94a3b8&dates=94a3b8&background=00000000`
    : `https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USER}&theme=transparent&hide_border=true&stroke=transparent&ring=4338CA&fire=0E7490&currStreakNum=020617&sideNums=020617&currStreakLabel=334155&sideLabels=334155&dates=475569&background=00000000`;

  const topLangsUrl = isDark
    ? `https://github-readme-stats.vercel.app/api/top-langs?username=${GITHUB_USER}&layout=compact&theme=transparent&hide_border=true&title_color=6366F1&text_color=F8FAFC&icon_color=22D3EE&bg_color=00000000&langs_count=6`
    : `https://github-readme-stats.vercel.app/api/top-langs?username=${GITHUB_USER}&layout=compact&theme=transparent&hide_border=true&title_color=4338CA&text_color=020617&icon_color=0E7490&bg_color=00000000&langs_count=6`;

  return (
    <>
      <section id="about" className={`section ${styles.about}`} ref={ref}>
        <div className="container">
          <h2 className="section-title" data-prefix="02">about.js</h2>

          <div className={styles.about__grid}>
            <motion.div
              className={styles.about__content}
              variants={fade()}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              <div className={styles.about__eyebrow}>
                <span aria-hidden="true">//</span> beyond the résumé
              </div>

              <h3 className={styles.about__headline}>
                I build web products and solve algorithmic challenges.
              </h3>

              <div className={styles.about__copy}>
                <p>
                  I'm a final-year CSE student focused on React, Node.js, and Java.
                  I write clean code for full-stack applications and enjoy engineering reliable backend APIs.
                  Beyond coding, I actively solve algorithmic challenges to strengthen my problem-solving skills.
                  I am always excited to learn new technology stacks and build projects that make an impact.
                </p>
              </div>

              <div className={styles.about__actions}>
                <button
                  className="btn btn--primary"
                  onClick={() => setResumeOpen(true)}
                  id="view-resume-btn"
                >
                  <FiEye /> View résumé
                </button>
                <a href="#contact" className={styles.about__contact_link}>
                  Let's work together <FiArrowUpRight />
                </a>
              </div>
            </motion.div>

            <motion.figure
              className={styles.about__portrait}
              variants={scaleIn}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              <div className={styles.about__portrait_window}>
                {/* Terminal bar */}
                <div className={styles.about__portrait_bar}>
                  <span className={`${styles.dot} ${styles.red}`} />
                  <span className={`${styles.dot} ${styles.yellow}`} />
                  <span className={`${styles.dot} ${styles.green}`} />
                  <span className={styles.title}>portrait.jpg</span>
                </div>

                {/* Image frame */}
                <div className={styles.about__portrait_frame}>
                  <img src="/images/profile.webp" alt="Lav Kumar" loading="lazy" decoding="async" />
                  <div className={styles.about__portrait_glow} aria-hidden="true" />

                  <figcaption className={styles.about__identity}>
                    <span className={styles.about__availability}>
                      <span aria-hidden="true" /> Available for opportunities
                    </span>
                    <strong>Lav Kumar</strong>
                    <small>Full-stack developer</small>
                  </figcaption>
                </div>
              </div>
            </motion.figure>

            <motion.div
              className={styles.about__stats}
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              {stats.map((stat) => (
                <motion.article
                  key={stat.label}
                  className={styles.about__stat_card}
                  variants={fade(0.14)}
                >
                  <strong><AnimatedCounter value={stat.value} /></strong>
                  <div>
                    <span>{stat.label}</span>
                    <small>{stat.note}</small>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>

          {/* ── GitHub Stats ──────────────────────────────────────────────────── */}
          <motion.div
            className={styles.about__activity}
            variants={fade(0.2)}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            <div className={styles.about__activity_header}>
              <FiGithub className={styles.about__activity_icon} />
              <span className={styles.about__activity_title}>GitHub Activity</span>
              <span className={styles.about__activity_comment}>{'// live data · auto-updated'}</span>
            </div>

            <div className={styles.about__github_grid}>
              {/* Contribution streak */}
              <div className={styles.about__github_card}>
                <div className={styles.about__github_card_label}>
                  <FiActivity /> Contribution Streak
                </div>
                <img
                  src={streakUrl}
                  alt="GitHub contribution streak"
                  className={styles.about__github_img}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className={styles.about__github_fallback} style={{ display: 'none' }}>
                  <FiActivity />
                  <span>Streak data loading...</span>
                </div>
              </div>

              {/* Top languages */}
              <div className={styles.about__github_card}>
                <div className={styles.about__github_card_label}>
                  <FiCode /> Top Languages
                </div>
                <img
                  src={topLangsUrl}
                  alt="Top programming languages"
                  className={styles.about__github_img}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className={styles.about__github_fallback_languages} style={{ display: 'none' }}>
                  <div className={styles.about__github_lang_row}>
                    <span className={styles.about__github_lang_name}>JavaScript</span>
                    <div className={styles.about__github_lang_bar_wrapper}>
                      <div className={styles.about__github_lang_bar} style={{ width: '48%', backgroundColor: 'var(--blue)' }} />
                    </div>
                    <span className={styles.about__github_lang_percent}>48%</span>
                  </div>
                  <div className={styles.about__github_lang_row}>
                    <span className={styles.about__github_lang_name}>SCSS &amp; CSS</span>
                    <div className={styles.about__github_lang_bar_wrapper}>
                      <div className={styles.about__github_lang_bar} style={{ width: '32%', backgroundColor: 'var(--green)' }} />
                    </div>
                    <span className={styles.about__github_lang_percent}>32%</span>
                  </div>
                  <div className={styles.about__github_lang_row}>
                    <span className={styles.about__github_lang_name}>TypeScript</span>
                    <div className={styles.about__github_lang_bar_wrapper}>
                      <div className={styles.about__github_lang_bar} style={{ width: '18%', backgroundColor: 'var(--yellow)' }} />
                    </div>
                    <span className={styles.about__github_lang_percent}>18%</span>
                  </div>
                  <div className={styles.about__github_lang_row}>
                    <span className={styles.about__github_lang_name}>HTML</span>
                    <div className={styles.about__github_lang_bar_wrapper}>
                      <div className={styles.about__github_lang_bar} style={{ width: '2%', backgroundColor: 'var(--mauve)' }} />
                    </div>
                    <span className={styles.about__github_lang_percent}>2%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── DSA / LeetCode Stats ──────────────────────────────────────────── */}
          <motion.div
            className={styles.about__dsa}
            variants={fade(0.3)}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            <div className={styles.about__dsa_header}>
              <FiCpu className={styles.about__activity_icon} />
              <span className={styles.about__activity_title}>Competitive Coding</span>
              <span className={styles.about__activity_comment}>{'// LeetCode · Codeforces · GFG'}</span>
            </div>

            <div className={styles.about__dsa_grid}>
              {dsaStats.map((s) => (
                <div
                  key={s.label}
                  className={styles.about__dsa_card}
                  style={{ '--dsa-color': s.color }}
                >
                  <span className={styles.about__dsa_value}><AnimatedCounter value={s.value} /></span>
                  <span className={styles.about__dsa_label}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.about__dsa_note}>
              <span aria-hidden="true" className={styles.about__dsa_comment}>{'// '}</span>
              problems solved across platforms · consistently improving · strong in Trees, Graphs, DP
            </div>
          </motion.div>

        </div>
      </section>

      {/* Resume preview modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
