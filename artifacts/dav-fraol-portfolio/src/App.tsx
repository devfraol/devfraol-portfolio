import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Play, X } from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  visual: string;
  description: string;
  idea: string;
  process: string;
  tools: string[];
};

type Skill = { name: string; detail: string };

const projects: Project[] = [
  {
    id: 'project-01',
    title: 'Signal / Field',
    category: 'Web Development',
    year: 'PLACEHOLDER',
    visual: 'visual-one',
    description: 'A placeholder digital environment for a future web experience.',
    idea: 'Translate a point of view into an interface with its own atmosphere.',
    process: 'A replaceable case-study shell for concept, process, visuals, and motion.',
    tools: ['React', 'TypeScript', 'Motion'],
  },
  {
    id: 'project-02',
    title: 'Blue Hour',
    category: 'Graphic Design',
    year: 'PLACEHOLDER',
    visual: 'visual-two',
    description: 'A placeholder visual identity study built around light and contrast.',
    idea: 'Build a graphic language that feels discovered, not decorated.',
    process: 'Typography, composition, and a sharp visual system ready for real content.',
    tools: ['Figma', 'Illustrator', 'Art direction'],
  },
  {
    id: 'project-03',
    title: 'Frame / 03',
    category: 'Video Editing',
    year: 'PLACEHOLDER',
    visual: 'visual-three',
    description: 'A placeholder moving-image world for edits, titles, and rhythm.',
    idea: 'Let cuts, sound, and pacing carry the feeling before words arrive.',
    process: 'A cinematic project detail view waiting for media and a real story.',
    tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
  },
  {
    id: 'project-04',
    title: 'Night Capture',
    category: 'Cinematography',
    year: 'PLACEHOLDER',
    visual: 'visual-four',
    description: 'A placeholder visual treatment for a future camera-led piece.',
    idea: 'Find the image inside the atmosphere: light, texture, and timing.',
    process: 'A flexible frame for footage, visual references, and final sequences.',
    tools: ['Cinematography', 'Lighting', 'Story'],
  },
];

const worlds = [
  ['01', 'Web development', 'Interfaces with depth, rhythm, and a pulse.'],
  ['02', 'Graphic design', 'Systems, symbols, type, and visual tension.'],
  ['03', 'Video editing', 'Cuts that create movement before the image moves.'],
  ['04', 'Cinematography', 'Light-led images with somewhere to go.'],
  ['05', 'Content creation', 'Media made to move through a real feed.'],
  ['06', 'Social media marketing', 'Ideas shaped for attention and connection.'],
];

const skills: Skill[] = [
  { name: 'React', detail: 'Building responsive digital worlds with component thinking.' },
  { name: 'TypeScript', detail: 'Keeping ambitious interfaces clear, expressive, and resilient.' },
  { name: 'Figma', detail: 'Exploring visual systems before they become pixels.' },
  { name: 'Illustrator', detail: 'Drawing the marks, shapes, and graphic language.' },
  { name: 'Premiere Pro', detail: 'Finding the cut, the cadence, and the story in a timeline.' },
  { name: 'After Effects', detail: 'Giving type, image, and transitions a sense of motion.' },
  { name: 'Cinematography', detail: 'Working with light, lens, atmosphere, and intention.' },
  { name: 'Social Media', detail: 'Connecting content to people, context, and the moment.' },
];

const navItems = [
  { label: 'Work', target: 'work' },
  { label: 'About', target: 'about' },
  { label: 'Experience', target: 'experience' },
  { label: 'Contact', target: 'contact' },
];

function useSectionNavigation() {
  return (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

function LoadingReveal() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const startedAt = window.setTimeout(() => setProgress(100), 90);
    const finishedAt = window.setTimeout(() => setDone(true), 1450);
    return () => {
      window.clearTimeout(startedAt);
      window.clearTimeout(finishedAt);
    };
  }, []);

  return (
    <div className={`loading-screen ${done ? 'is-done' : ''}`} aria-label="Loading Dav Fraol digital world">
      <div>
        <div className="eyebrow mb-5 text-center">Entering digital world</div>
        <div className="loading-line" />
        <div className="mt-4 flex items-center justify-between font-mono-custom text-[.62rem] tracking-[.16em] text-white/55">
          <span>DAV FRAOL</span><span>{String(progress).padStart(2, '0')} → 100</span>
        </div>
      </div>
    </div>
  );
}

function Cursor() {
  const [position, setPosition] = useState({ x: -30, y: -30 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setHovering(Boolean(target.closest('a, button, [data-cursor="interactive"]')));
    };
    document.addEventListener('mouseover', onOver);
    return () => document.removeEventListener('mouseover', onOver);
  }, []);

  return <div className={`custom-cursor ${hovering ? 'is-hover' : ''}`} style={{ left: position.x, top: position.y }} />;
}

function Navigation({ onMenu }: { onMenu: () => void }) {
  const navigate = useSectionNavigation();
  return (
    <header className="top-nav">
      <button type="button" className="nav-mark" onClick={() => navigate('top')} data-testid="button-nav-home">
        DAV <span>FRAOL</span>
      </button>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button type="button" className="nav-link" key={item.target} onClick={() => navigate(item.target)} data-testid={`button-nav-${item.target}`}>
            {item.label}
          </button>
        ))}
      </nav>
      <button type="button" className="menu-trigger" onClick={onMenu} data-testid="button-open-menu" aria-label="Open navigation menu">
        Menu <span className="menu-icon" aria-hidden="true"><span /><span /></span>
      </button>
    </header>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useSectionNavigation();
  const go = (target: string) => {
    onClose();
    window.setTimeout(() => navigate(target), 180);
  };
  return (
    <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button type="button" className="menu-close" onClick={onClose} data-testid="button-close-menu">
        Close <X className="ml-2 inline-block" size={15} />
      </button>
      <div className="menu-nav">
        <div className="eyebrow mb-7">Navigate the world / 00—04</div>
        {navItems.map((item, index) => (
          <button type="button" className="menu-item" key={item.target} onClick={() => go(item.target)} data-testid={`button-menu-${item.target}`}>
            <span className="menu-index">0{index + 1}</span>{item.label}
          </button>
        ))}
        <div className="mt-10 flex items-center gap-4 font-mono-custom text-[.62rem] uppercase tracking-[.14em] text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-[#24a8ff] shadow-[0_0_16px_#24a8ff]" /> Scroll slowly. Look closer.
        </div>
      </div>
    </div>
  );
}

function Hero({ onMenu }: { onMenu: () => void }) {
  const navigate = useSectionNavigation();
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-orbit" />
      <div className="hero-sculpture" data-cursor="interactive" aria-label="Abstract electric blue digital sculpture" />
      <div className="hero-corner left">Digital creative / developer / designer / filmmaker</div>
      <div className="hero-corner right">Scroll to explore<br /><span className="text-[#24a8ff]">01 — 06</span></div>
      <h1 className="hero-name text-glow" id="hero-title"><span>DAV</span><span>FRAOL</span></h1>
      <div className="absolute top-[17%] left-[12%] z-[3] font-mono-custom text-[.6rem] tracking-[.14em] text-[#24a8ff]">DIGITAL CREATIVE</div>
      <div className="absolute top-[22%] right-[13%] z-[3] font-mono-custom text-[.6rem] tracking-[.14em] text-white/50">DEVELOPER</div>
      <button type="button" className="hero-scroll" onClick={() => navigate('statement')} data-testid="button-scroll-explore">
        <span className="scroll-dot" /> Enter the sequence <ArrowDown size={14} />
      </button>
      <button type="button" className="absolute bottom-7 left-7 z-[4] hidden font-mono-custom text-[.58rem] uppercase tracking-[.15em] text-white/45 md:block" onClick={onMenu} data-testid="button-hero-menu">
        Open full navigation
      </button>
    </section>
  );
}

function Statement() {
  return (
    <section className="section-wrap statement" id="statement" aria-labelledby="statement-title">
      <div className="eyebrow mb-8">A point of view / 01</div>
      <h2 id="statement-title">
        <span className="statement-line dim">I DON&apos;T JUST</span>
        <span className="statement-line">BUILD WEBSITES.</span>
        <span className="statement-line blue mt-4">I BUILD EXPERIENCES.</span>
      </h2>
      <div className="disciplines" aria-label="Creative disciplines">
        {['Web', 'Design', 'Video', 'Cinematography', 'Content', 'Social media'].map((item) => (
          <span className="discipline" key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section-wrap section-pad" id="about" aria-labelledby="about-title">
      <div className="about-layout">
        <div className="portrait-art" role="img" aria-label="Abstract portrait artwork representing Dav Fraol">
          <div className="portrait-core" />
          <span className="absolute bottom-5 left-5 z-[2] font-mono-custom text-[.58rem] uppercase tracking-[.15em] text-white/55">Portrait study / DF—01</span>
          <span className="absolute right-5 top-5 z-[2] font-mono-custom text-[.58rem] uppercase tracking-[.15em] text-[#24a8ff]">Light / form / signal</span>
        </div>
        <div className="about-copy">
          <div className="eyebrow">About Dav / 02</div>
          <h2 id="about-title">Digital creative.<br /><span className="text-[#24a8ff]">Developer.</span><br />Designer.</h2>
          <p>Dav Fraol works across web development, graphic design, video editing, cinematography, content creation, and social media marketing. The common thread is simple: make the work feel alive.</p>
          <div className="about-meta">
            <div><span className="meta-label">Approach</span><span className="meta-value">Curious / precise / visual</span></div>
            <div><span className="meta-label">Based in the work</span><span className="meta-value">Digital / moving image / story</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Worlds() {
  return (
    <section className="section-wrap section-pad" id="experience" aria-labelledby="worlds-title">
      <div className="worlds-header">
        <div><div className="eyebrow mb-7">Six ways in / 03</div><h2 id="worlds-title">THE<br /><span className="text-[#24a8ff]">WORLDS.</span></h2></div>
        <p>Different disciplines.<br />One connected point of view.<br />Move through the work.</p>
      </div>
      <div className="worlds-list">
        {worlds.map(([number, name, detail]) => (
          <div className="world-row" key={number}>
            <span className="world-number">{number}</span>
            <span className="world-name">{name}</span>
            <span className="world-detail">{detail}</span>
            <ArrowUpRight className="world-arrow" size={17} />
          </div>
        ))}
      </div>
    </section>
  );
}

function SelectedWork({ onSelect }: { onSelect: (project: Project) => void }) {
  return (
    <section className="section-wrap section-pad work-section" id="work" aria-labelledby="work-title">
      <div className="work-head">
        <div><div className="eyebrow mb-7">Spatial archive / 04</div><h2 className="work-title" id="work-title">SELECTED<br /><span className="text-[#24a8ff]">WORK.</span></h2></div>
        <p className="work-subtitle">A replaceable gallery<br />for future worlds<br />and real stories.</p>
      </div>
      <div className="work-grid">
        {projects.map((project, index) => (
          <button type="button" className="project-card text-left" key={project.id} onClick={() => onSelect(project)} data-cursor="interactive" data-testid={`button-project-${project.id}`}>
            <div className={`project-visual ${project.visual}`} aria-label={`${project.title}, placeholder project artwork`} />
            <div className="project-info">
              <span className="project-name">{project.title}</span>
              <span className="project-meta">{project.category}<br />{project.year}<br />0{index + 1}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Showreel({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="showreel" aria-labelledby="showreel-title">
      <div className="reel-content">
        <span className="reel-kicker">A moving-image placeholder / 05</span>
        <h2 className="reel-title" id="showreel-title">SHOWREEL<br /><span className="text-[#24a8ff]">2026</span></h2>
        <button type="button" className="reel-play" onClick={onOpen} data-cursor="interactive" data-testid="button-open-showreel">
          <Play size={15} fill="currentColor" /> Play showreel
        </button>
      </div>
    </section>
  );
}

function Skills() {
  const [activeSkill, setActiveSkill] = useState<Skill>(skills[0]);
  return (
    <section className="section-wrap section-pad" aria-labelledby="skills-title">
      <div className="skills-layout">
        <div className="skills-intro">
          <div className="eyebrow mb-7">The skill galaxy / 06</div>
          <h2 className="work-title" id="skills-title">ORBIT<br /><span className="text-[#24a8ff]">AROUND.</span></h2>
          <p>Not a list of percentages. A constellation of tools, instincts, and disciplines that move around the idea.</p>
          <div className="mt-8 font-mono-custom text-[.58rem] uppercase tracking-[.14em] text-white/35">Select a signal to decode it</div>
        </div>
        <div className="skill-universe" data-cursor="interactive">
          <div className="skill-core" aria-hidden="true" />
          {skills.map((skill, index) => (
            <button type="button" className={`skill-node ${activeSkill.name === skill.name ? 'active' : ''}`} key={skill.name} onClick={() => setActiveSkill(skill)} data-testid={`button-skill-${index}`}>
              {skill.name}
            </button>
          ))}
          <div className="skill-detail"><strong>{activeSkill.name}</strong>{activeSkill.detail}</div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ['01', 'Idea', 'Start with the feeling, question, or visual tension worth following.'],
    ['02', 'Create', 'Turn the spark into references, shapes, frames, and a direction.'],
    ['03', 'Build', 'Give the idea a responsive body, a rhythm, and room to move.'],
    ['04', 'Refine', 'Remove the noise. Keep the signal. Make every detail earn its place.'],
    ['05', 'Release', 'Put it into the world and let the experience meet a real person.'],
  ];
  return (
    <section className="section-wrap section-pad" aria-labelledby="process-title">
      <div className="eyebrow mb-7">The sequence / 07</div>
      <h2 className="process-title" id="process-title">FROM SPARK<br /><span className="text-[#24a8ff]">TO SIGNAL.</span></h2>
      <div className="process-list">
        {steps.map(([number, title, copy]) => (
          <div className="process-step" key={number}><span className="step-num">{number}</span><span className="step-name">{title}</span><span className="step-copy">{copy}</span></div>
        ))}
      </div>
    </section>
  );
}

function ContentWall() {
  return (
    <section className="section-wrap section-pad" aria-labelledby="wall-title">
      <div className="eyebrow mb-7">Fragments from the feed / 08</div>
      <h2 className="work-title" id="wall-title">CONTENT<br /><span className="text-[#24a8ff]">WALL.</span></h2>
      <div className="content-wall">
        {['Social post / placeholder', 'Poster study / placeholder', 'Vertical edit / placeholder', 'Campaign frame / placeholder', 'Brand signal / placeholder', 'Motion still / placeholder'].map((label, index) => (
          <div className="wall-tile" key={label} data-testid={`tile-content-${index}`}><span className="wall-label">{label}</span></div>
        ))}
      </div>
    </section>
  );
}

function BrandMoment() {
  return (
    <section className="section-wrap brand-moment" aria-labelledby="brand-title">
      <div className="eyebrow mb-12">The personal brand / 09</div>
      <h2 id="brand-title">
        {['CODE', 'DESIGN', 'MOTION', 'STORY'].map((word) => <span className="brand-word" key={word}>{word}<span className="sr-only">.</span></span>)}
      </h2>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !message || !email.includes('@')) {
      setError('Please complete name, a valid email, and a message.');
      setSent(false);
      return;
    }
    setError('');
    setSent(true);
    form.reset();
  };
  return (
    <section className="section-wrap section-pad contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-layout">
        <div>
          <div className="eyebrow mb-8">Open channel / 10</div>
          <h2 className="contact-title" id="contact-title">LET&apos;S MAKE SOMETHING THAT <span className="text-[#24a8ff]">PEOPLE REMEMBER.</span></h2>
        </div>
        <div className="contact-aside">
          <p>Have a feeling, a frame, a product, or a story that needs a world around it? Start the signal below.</p>
          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" data-testid="input-contact-name" placeholder="Your name" /></div>
            <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" data-testid="input-contact-email" placeholder="you@email.com" /></div>
            <div className="field"><label htmlFor="project-type">Project type</label><select id="project-type" name="project-type" defaultValue="" data-testid="select-contact-project"><option value="" disabled>Select a direction</option><option>Web development</option><option>Graphic design</option><option>Video editing</option><option>Cinematography</option><option>Content creation</option><option>Social media marketing</option></select></div>
            <div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" data-testid="textarea-contact-message" placeholder="Tell me what you are imagining." /></div>
            {error && <div className="form-error" role="alert" data-testid="status-contact-error">{error}</div>}
            {sent && <div className="form-success" role="status" data-testid="status-contact-success"><Check size={15} className="mr-2 inline-block" />Signal received. The rest starts with a conversation.</div>}
            <button type="submit" className="button-electric w-fit" data-testid="button-submit-contact">Start a project <ArrowUpRight size={15} /></button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const backTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <footer className="footer">
      <div className="section-wrap">
        <div className="footer-word">DAV <span>FRAOL</span></div>
        <div className="footer-bottom">
          <div className="footer-sub">Digital creative / developer / designer / filmmaker<br />A world in progress.</div>
          <div>
            <div className="footer-socials">
              {['LinkedIn', 'GitHub', 'Instagram', 'YouTube'].map((label) => <a href={`https://www.${label.toLowerCase()}.com`} target="_blank" rel="noreferrer" key={label} data-testid={`link-social-${label.toLowerCase()}`}>{label}</a>)}
            </div>
            <button type="button" className="back-top" onClick={backTop} data-testid="button-back-top">Back to the beginning <ArrowUp size={14} /></button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article className="project-modal">
        <div className="modal-top"><div><div className="eyebrow">Placeholder project / {project.category}</div><h2 className="modal-title" id="project-modal-title">{project.title}</h2></div><button type="button" className="modal-close" onClick={onClose} data-testid="button-close-project">Close <X className="ml-2 inline-block" size={15} /></button></div>
        <div className={`modal-visual ${project.visual}`} aria-label={`${project.title} placeholder project visual`} />
        <p className="max-w-2xl text-base leading-7 text-white/65">{project.description}</p>
        <div className="modal-grid mt-10">
          <div className="modal-block"><div className="eyebrow">01 / The idea</div><p>{project.idea}</p></div>
          <div className="modal-block"><div className="eyebrow">02 / The process</div><p>{project.process}</p></div>
          <div className="modal-block"><div className="eyebrow">03 / Tools</div><p>{project.tools.join(' / ')}</p></div>
        </div>
      </article>
    </div>
  );
}

function ShowreelModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Showreel player" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="showreel-player">
        <button type="button" className="player-close" onClick={onClose} data-testid="button-close-showreel">Close <X className="ml-2 inline-block" size={15} /></button>
        <div className="player-center"><Play size={21} fill="currentColor" /><span>Showreel media placeholder</span></div>
      </div>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const navigate = useSectionNavigation();
  const activeModal = useMemo(() => selectedProject || showreelOpen, [selectedProject, showreelOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || Boolean(activeModal) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, activeModal]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setSelectedProject(null);
        setShowreelOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <main className="site-shell">
      <LoadingReveal />
      <Cursor />
      <Navigation onMenu={() => setMenuOpen(true)} />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      <Hero onMenu={() => setMenuOpen(true)} />
      <Statement />
      <About />
      <Worlds />
      <SelectedWork onSelect={setSelectedProject} />
      <Showreel onOpen={() => setShowreelOpen(true)} />
      <Skills />
      <Process />
      <ContentWall />
      <BrandMoment />
      <Contact />
      <Footer />
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {showreelOpen && <ShowreelModal onClose={() => setShowreelOpen(false)} />}
      <button type="button" className="fixed bottom-5 right-5 z-[70] hidden border border-white/15 bg-black/40 p-3 text-[#24a8ff] backdrop-blur md:block" onClick={() => navigate('top')} aria-label="Scroll to top" data-testid="button-floating-top"><ArrowUp size={15} /></button>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;