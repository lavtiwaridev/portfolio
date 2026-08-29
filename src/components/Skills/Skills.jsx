import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaJava, FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt, FaGithub, FaDatabase, FaAws
} from 'react-icons/fa';
import { 
  SiJavascript, SiTailwindcss, SiExpress, SiMongodb, SiPostman,
  SiDocker, SiKubernetes
} from 'react-icons/si';
import { VscCode, VscAzure } from 'react-icons/vsc';
import { DiMysql } from 'react-icons/di';
import { FiMonitor, FiServer, FiTool, FiDatabase, FiCpu } from 'react-icons/fi';
import { TbBinaryTree, TbSettingsCog, TbDatabase, TbTerminal } from 'react-icons/tb';
import styles from './Skills.module.scss';

const groups = [
  {
    label: 'Programming Languages',
    file: 'languages.java',
    icon: <FiMonitor />,
    skills: [
      {
        name: 'Java',
        icon: <FaJava />,
        color: '#E76F51',
        level: 'Proficient'
      },
      {
        name: 'JavaScript',
        icon: <SiJavascript />,
        color: 'var(--yellow)',
        level: 'Proficient'
      }
    ],
  },
  {
    label: 'Frontend & UI',
    file: 'frontend.tsx',
    icon: <FiMonitor />,
    skills: [
      {
        name: 'React.js',
        icon: <FaReact />,
        color: 'var(--blue)',
        level: 'Proficient'
      },
      {
        name: 'Tailwind CSS',
        icon: <SiTailwindcss />,
        color: 'var(--blue)',
        level: 'Proficient'
      },
      {
        name: 'HTML5',
        icon: <FaHtml5 />,
        color: '#E34F26',
        level: 'Proficient'
      },
      {
        name: 'CSS3',
        icon: <FaCss3Alt />,
        color: '#1572B6',
        level: 'Proficient'
      }
    ],
  },
  {
    label: 'Backend Development',
    file: 'backend.js',
    icon: <FiServer />,
    skills: [
      {
        name: 'Node.js',
        icon: <FaNodeJs />,
        color: 'var(--green)',
        level: 'Proficient'
      },
      {
        name: 'Express.js',
        icon: <SiExpress />,
        color: 'var(--text)',
        level: 'Proficient'
      },
      {
        name: 'RESTful APIs',
        icon: <TbTerminal />,
        color: '#FF6C37',
        level: 'Proficient'
      }
    ],
  },
  {
    label: 'Databases & Storage',
    file: 'database.sql',
    icon: <FiDatabase />,
    skills: [
      {
        name: 'MongoDB',
        icon: <SiMongodb />,
        color: 'var(--green)',
        level: 'Proficient'
      },
      {
        name: 'MySQL',
        icon: <DiMysql />,
        color: '#4479A1',
        level: 'Familiar'
      }
    ],
  },
  {
    label: 'Tools & Platforms',
    file: 'tools.config',
    icon: <FiTool />,
    skills: [
      {
        name: 'Git',
        icon: <FaGitAlt />,
        color: '#F05032',
        level: 'Proficient'
      },
      {
        name: 'GitHub',
        icon: <FaGithub />,
        color: 'var(--github-color)',
        level: 'Proficient'
      },
      {
        name: 'Postman',
        icon: <SiPostman />,
        color: '#FF6C37',
        level: 'Proficient'
      },
      {
        name: 'VS Code',
        icon: <VscCode />,
        color: '#007ACC',
        level: 'Proficient'
      }
    ],
  },
  {
    label: 'Core Computer Science',
    file: 'core_cs.py',
    icon: <FiCpu />,
    skills: [
      {
        name: 'Data Structures & Algorithms',
        icon: <TbBinaryTree />,
        color: '#FFA116',
        level: 'Proficient'
      },
      {
        name: 'OOP',
        icon: <TbSettingsCog />,
        color: 'var(--mauve)',
        level: 'Proficient'
      },
      {
        name: 'DBMS',
        icon: <TbDatabase />,
        color: 'var(--blue)',
        level: 'Proficient'
      },
      {
        name: 'Operating Systems',
        icon: <FaDatabase />,
        color: '#E74C3C',
        level: 'Familiar'
      }
    ],
  },
  {
    label: 'Currently Learning',
    file: 'future_focus.log',
    icon: <TbTerminal />,
    skills: [
      {
        name: 'Docker',
        icon: <SiDocker />,
        color: '#2496ED',
        level: 'Learning'
      },
      {
        name: 'Microsoft Azure',
        icon: <VscAzure />,
        level: 'Familiar',
        color: '#0078D4'
      },
      {
        name: 'Kubernetes',
        icon: <SiKubernetes />,
        color: '#326CE5',
        level: 'Learning'
      }
    ],
  }
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 }
};

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="skills" className={`section ${styles.skills}`} ref={ref}>
      <div className="container">
        <h2 className="section-title" data-prefix="04">skills.json</h2>
        <motion.div
          className={styles.skills__groups}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {groups.map(g => (
            <motion.div 
              key={g.label} 
              className={styles.skills__group} 
              variants={cardVariants}
              whileHover={{ y: -4 }}
            >
              <div className={styles['skills__group-header']}>
                <span className={styles.icon}>{g.icon}</span>
                <span className={styles.file}>{g.file}</span>
                <span className={styles.count}>
                  {g.skills.length} items
                </span>
              </div>
              <div className={styles.skills__pills}>
                {g.skills.map(s => (
                  <span 
                    key={s.name} 
                    className={styles.skills__pill}
                    style={{
                      '--skill-color': s.color
                    }}
                  >
                    <span className={styles.skills__pill_icon}>{s.icon}</span>
                    <span className={styles.skills__pill_name}>{s.name}</span>
                    {s.level !== 'Proficient' && (
                      <>
                        <span className={styles.skills__pill_dot} />
                        <span className={styles.skills__pill_level}>{s.level}</span>
                      </>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
