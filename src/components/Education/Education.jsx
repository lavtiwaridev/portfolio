import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './Education.module.scss';

const education = [
  {
    degree: 'Bachelor of Technology in Computer Science & Engineering',
    institution: 'Technocrats Institute of Technology – Excellence, Bhopal',
    years: '2023 - 2027',
    gpa: 'CGPA: 7.7',
  },
  {
    degree: 'Senior Secondary Education (Class XII)',
    institution: 'Gandak Uchh Vidyalaya, Tarwara, Siwan',
    board: 'Bihar School Examination Board (BSEB)',
    years: '2023',
    gpa: 'Score: 66.4%',
  },
  {
    degree: 'Secondary Education (Class X)',
    institution: 'Gandak High School, Tarwara, Siwan',
    board: 'Bihar School Examination Board (BSEB)',
    years: '2021',
    gpa: 'Score: 69.4%',
  },
];

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="education" className={`section ${styles.education}`} ref={ref}>
      <div className="container">
        <h2 className="section-title" data-prefix="06">education.md</h2>
        <motion.div
          className={styles.education__timeline}
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {education.map((e, index) => (
            <motion.div
              key={e.degree}
              className={`${styles.education__item} ${index % 2 === 0 ? styles['education__item--right'] : styles['education__item--left']}`}
              variants={fade}
            >
              {/* Central Indicator Dot */}
              <div className={styles.education__dot}>
                <div className={styles.education__dot_inner} />
              </div>

              {/* Time Label on Opposite Side (Desktop only) */}
              <div className={styles.education__time_label}>
                <span>{e.years}</span>
              </div>

              {/* Content Card */}
              <div className={styles.education__card}>
                <div className={styles.education__degree}>{e.degree}</div>
                <div className={styles.education__meta}>
                  <span className={styles.institution}>{e.institution}</span>
                  <span className={styles.years_mobile}>{e.years}</span>
                  {e.gpa && <span className={styles.gpa}>{e.gpa}</span>}
                </div>
                {e.board && <div className={styles.education__board}>{e.board}</div>}
                {e.notes && <p className={styles.education__notes}>{e.notes}</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
