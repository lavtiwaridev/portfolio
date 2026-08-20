import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMail, FiPhone, FiMapPin, FiCopy, FiCheck, FiSend, FiGithub, FiLinkedin } from 'react-icons/fi';
import styles from './Contact.module.scss';

const EMAIL = 'lavtiwari.dev@gmail.com';
const PHONE = '+91 8797855667';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(PHONE).then(() => {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Error: --from-name is required');
      return;
    }
    if (!form.email.trim()) {
      setError('Error: --from-email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError('Error: --from-email format is invalid');
      return;
    }
    if (!form.message.trim()) {
      setError('Error: --body is empty');
      return;
    }

    setSending(true);
    
    // Briefly show progress before opening a pre-filled draft in the visitor's mail app.
    await new Promise(r => setTimeout(r, 600));
    
    const subject = encodeURIComponent(`Message from ${form.name.trim()} (via Portfolio)`);
    const body = encodeURIComponent(
      `Hello Lav,\n\nYou received a message from your portfolio website:\n\nSender: ${form.name.trim()} (${form.email.trim()})\n\nMessage:\n${form.message.trim()}\n`
    );
    
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    
    setSending(false);
    setSent(true);
  };

  const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="contact" className={`section ${styles.contact}`} ref={ref}>
      <div className="container">
        <h2 className="section-title" data-prefix="08">contact.sh</h2>
        <div className={styles.contact__grid}>

          {/* Left */}
          <motion.div
            className={styles.contact__info}
            variants={fade}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            <p className={styles.invite}>
              I'm always up for a chat about interesting projects, open roles,
              or just swapping notes on tech. Pick your preferred channel
              and I'll get back within 24 hours.
            </p>

            {/* Email */}
            <div className={styles.contact__detail}>
              <span className={styles.icon_wrap}><FiMail /></span>
              <div>
                <div className={styles.label}>email</div>
                <div className={styles.value}>{EMAIL}</div>
              </div>
              <button
                className={`${styles.copy_btn} ${copied ? styles['copy_btn--copied'] : ''}`}
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copied ? <><FiCheck /> copied!</> : <><FiCopy /> copy</>}
              </button>
            </div>

            {/* Phone */}
            <div className={styles.contact__detail}>
              <span className={styles.icon_wrap}><FiPhone /></span>
              <div>
                <div className={styles.label}>phone</div>
                <div className={styles.value}>{PHONE}</div>
              </div>
              <button
                className={`${styles.copy_btn} ${copiedPhone ? styles['copy_btn--copied'] : ''}`}
                onClick={copyPhone}
                aria-label="Copy phone number"
              >
                {copiedPhone ? <><FiCheck /> copied!</> : <><FiCopy /> copy</>}
              </button>
            </div>

            {/* Location */}
            <div className={styles.contact__detail}>
              <span className={styles.icon_wrap}><FiMapPin /></span>
              <div>
                <div className={styles.label}>location</div>
                <div className={styles.value}>Bhopal, India · remote-friendly 🌏</div>
              </div>
            </div>

            {/* Social Links */}
            <div className={styles.contact__socials}>
              <a
                href="https://github.com/lavtiwaridev"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contact__social_link}
                aria-label="GitHub Profile"
              >
                <FiGithub /> <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/lavtiwaridev/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contact__social_link}
                aria-label="LinkedIn Profile"
              >
                <FiLinkedin /> <span>LinkedIn</span>
              </a>
            </div>
          </motion.div>

          {/* Right — terminal form */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            transition={{ delay: 0.15 }}
          >
            <div className={styles.contact__form_wrap}>
              <div className={styles.contact__form_bar}>
                <span className={`${styles.dot} ${styles.red}`} />
                <span className={`${styles.dot} ${styles.yellow}`} />
                <span className={`${styles.dot} ${styles.green}`} />
                <span>contact.sh — send message</span>
              </div>

              {sent ? (
                <div style={{ padding: 20 }}>
                  <div className={styles.contact__success}>
                    <FiCheck /> Email draft opened. Send it from your mail app to finish.
                  </div>
                </div>
              ) : (
                <form className={styles.contact__form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.prompt_line}>$ send --message \</div>

                  {error && (
                    <div className={styles.contact__error}>
                      {error}
                    </div>
                  )}

                  <div className={styles.contact__field}>
                    <label htmlFor="contact-name">--from-name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className={styles.contact__field}>
                    <label htmlFor="contact-email">--from-email</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className={styles.contact__field}>
                    <label htmlFor="contact-message">--body</label>
                    <textarea
                      id="contact-message"
                      placeholder="What's on your mind?"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.contact__submit}
                    disabled={sending}
                  >
                    <FiSend />
                    {sending ? 'Opening email...' : '$ send --execute'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
