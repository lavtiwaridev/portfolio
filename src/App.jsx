import { useState, useEffect, useCallback, useRef } from 'react';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import LineGutter from './components/LineGutter/LineGutter';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Certifications from './components/Certifications/Certifications';
import Education from './components/Education/Education';
import Contact from './components/Contact/Contact';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop';
import CommandPalette from './components/CommandPalette/CommandPalette';
import NotFound from './components/NotFound/NotFound';
import './styles/global.scss';

const SECTIONS = ['hero', 'about', 'projects', 'skills', 'certifications', 'education', 'testimonials', 'contact'];

// Simple 404 detection — check if the current path is not the root
const is404 = () => {
  const path = window.location.pathname;
  return path !== '/' && path !== '/index.html' && !path.endsWith('.pdf');
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const lockRef = useRef(false);
  const timeoutRef = useRef(null);

  // Check for 404
  useEffect(() => {
    setNotFound(is404());
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme-color meta tag for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = theme === 'light' ? '#f1f5f9' : '#0f1015';
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K / Ctrl+K — open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle active section change when tab is clicked
  const handleSectionChange = useCallback((id) => {
    setActiveSection(id);

    // Lock scrollspy for 800ms to allow smooth scroll to complete
    lockRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      lockRef.current = false;
    }, 800);
  }, []);

  // Scrollspy & Bottom-of-page detection
  useEffect(() => {
    if (!loaded) return;

    const handleScroll = () => {
      if (lockRef.current) return;

      // If we are at the very bottom of the page, force 'contact' active
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      // Check which section is in the active middle-top of the viewport
      const threshold = window.innerHeight / 3;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold && rect.bottom >= threshold) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set initial active section
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loaded]);

  // 404 page
  if (notFound) {
    return (
      <NotFound onGoHome={() => {
        window.history.pushState({}, '', '/');
        setNotFound(false);
      }} />
    );
  }

  return (
    <>

      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {loaded && (
        <>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <Navbar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenPalette={() => setPaletteOpen(true)}
          />
          <LineGutter activeSection={activeSection} />

          <main id="main-content" className="main-content" tabIndex="-1">
            <Hero onSectionChange={handleSectionChange} />
            <About theme={theme} />
            <Projects />
            <Skills />
            <Certifications />
            <Education />
            <Testimonials />
            <Contact />
          </main>

          <Footer />
          <BackToTop />

          {/* Global command palette — mounted outside main for z-index isolation */}
          <CommandPalette
            isOpen={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            onSectionChange={handleSectionChange}
          />
        </>
      )}
    </>
  );
}
