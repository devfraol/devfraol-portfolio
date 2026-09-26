import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Play, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import ScrollScene from '@/components/ScrollScene';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type SkillTool = {
  name: string;
  category: string;
  description: string;
  icon?: string;
  logo?: string;
};

type World = {
  id: string;
  number: string;
  name: string;
  visual: string;
  description: string;
  tools: SkillTool[];
  skills: string[];
  accent: string;
};

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  visual: string;
  description: string;
  role: string;
  tools: string;
  process: string;
  result: string;
};

const tool = (name: string, category: string, description: string): SkillTool => ({ name, category, description });

const worlds: World[] = [
  {
    id: 'world-01',
    number: '01',
    name: 'WEB DEVELOPMENT',
    visual: 'digital architecture',
    description: 'Building modern, responsive, interactive digital experiences and full-stack web applications.',
    accent: '#48d8ff',
    tools: [
      tool('HTML', 'Frontend', 'The structural language of the web.'),
      tool('CSS', 'Frontend', 'Responsive visual systems with rhythm and texture.'),
      tool('JavaScript', 'Frontend', 'Interfaces that respond, move, and communicate.'),
      tool('TypeScript', 'Frontend', 'A clearer foundation for ambitious interfaces.'),
      tool('React', 'Frontend', 'Composable interfaces built for real interaction.'),
      tool('Next.js', 'Frontend', 'A flexible framework for digital experiences.'),
      tool('Tailwind CSS', 'Frontend', 'Rapid, intentional systems for styling.'),
      tool('Node.js', 'Backend', 'The runtime behind connected web experiences.'),
      tool('Express', 'Backend', 'A lightweight layer for web application logic.'),
      tool('REST APIs', 'Backend', 'Clear communication between digital systems.'),
      tool('Supabase', 'Database / Backend Services', 'A flexible backend service placeholder.'),
      tool('PostgreSQL', 'Database / Backend Services', 'Structured data for durable products.'),
      tool('Git', 'Development', 'A record of the work and the thinking behind it.'),
      tool('GitHub', 'Development', 'A collaborative home for code.'),
      tool('VS Code', 'Development', 'A focused space for building.'),
      tool('Cursor', 'Development', 'A development environment in the toolset.'),
    ],
    skills: [],
  },
  {
    id: 'world-02',
    number: '02',
    name: 'GRAPHIC DESIGN',
    visual: 'the visual lab',
    description: 'Creating visual identities, digital graphics, social media designs, promotional materials, and brand experiences.',
    accent: '#a8a5ff',
    tools: [
      tool('Adobe Photoshop', 'Tools', 'Professional image editing and visual design.'),
      tool('Adobe Illustrator', 'Tools', 'Marks, shapes, and graphic language.'),
      tool('Adobe InDesign', 'Tools', 'Composed layouts for considered communication.'),
      tool('Figma', 'Tools', 'Visual systems before they become pixels.'),
      tool('Canva', 'Tools', 'A flexible canvas for fast visual communication.'),
    ],
    skills: ['Branding', 'Visual Identity', 'Poster Design', 'Social Media Design', 'UI Design', 'Typography', 'Layout Design', 'Photo Manipulation'],
  },
  {
    id: 'world-03',
    number: '03',
    name: 'VIDEO EDITING',
    visual: 'the edit suite',
    description: 'Turning raw footage into engaging visual stories through editing, motion, pacing, sound, and color.',
    accent: '#ffbf72',
    tools: [
      tool('Adobe Premiere Pro', 'Tools', 'A timeline for finding the cut and the cadence.'),
      tool('Adobe After Effects', 'Tools', 'Motion, titles, compositing, and visual effects.'),
      tool('DaVinci Resolve', 'Tools', 'A flexible home for edit and color.'),
      tool('CapCut', 'Tools', 'An accessible tool for short-form moving image.'),
    ],
    skills: ['Video Editing', 'Motion Graphics', 'Color Grading', 'Visual Effects', 'Sound Editing', 'Short-form Content', 'Storytelling'],
  },
  {
    id: 'world-04',
    number: '04',
    name: 'CINEMATOGRAPHY',
    visual: 'the cinematic world',
    description: 'Creating visual stories through composition, lighting, camera movement, atmosphere, and cinematic direction.',
    accent: '#ff7795',
    tools: [
      tool('CAMERA / PLACEHOLDER', 'Camera', 'Equipment details will be added when provided.'),
      tool('LENSES / PLACEHOLDER', 'Lenses', 'Equipment details will be added when provided.'),
      tool('LIGHTING / PLACEHOLDER', 'Lighting', 'Equipment details will be added when provided.'),
      tool('AUDIO / PLACEHOLDER', 'Audio', 'Equipment details will be added when provided.'),
      tool('STABILIZATION / PLACEHOLDER', 'Stabilization', 'Equipment details will be added when provided.'),
      tool('POST-PRODUCTION', 'Post-production', 'A flexible category for the finishing stage.'),
    ],
    skills: ['Camera Operation', 'Composition', 'Lighting', 'Camera Movement', 'Visual Storytelling', 'Color', 'Shot Planning', 'Cinematic Direction'],
  },
  {
    id: 'world-05',
    number: '05',
    name: 'CONTENT CREATION',
    visual: 'the content engine',
    description: 'Creating visual content designed to communicate ideas, tell stories, and connect with audiences across digital platforms.',
    accent: '#65e2bd',
    tools: [
      tool('Adobe Premiere Pro', 'Tools', 'A timeline for short-form and long-form edits.'),
      tool('After Effects', 'Tools', 'Motion language for content that moves.'),
      tool('Photoshop', 'Tools', 'Image-making for the feed and beyond.'),
      tool('Illustrator', 'Tools', 'Graphic assets with a clear point of view.'),
      tool('Canva', 'Tools', 'A flexible canvas for publishing.'),
      tool('CapCut', 'Tools', 'A fast route from idea to vertical video.'),
      tool('Figma', 'Tools', 'Planning content systems and visual direction.'),
    ],
    skills: ['Short-form Video', 'Social Content', 'Creative Direction', 'Content Planning', 'Visual Storytelling', 'Thumbnail Design', 'Brand Content'],
  },
  {
    id: 'world-06',
    number: '06',
    name: 'SOCIAL MEDIA MARKETING',
    visual: 'the network',
    description: 'Creating and organizing digital content and campaigns that help brands communicate consistently across social platforms.',
    accent: '#85b8ff',
    tools: [],
    skills: ['Social Media Strategy', 'Content Strategy', 'Campaign Planning', 'Creative Content', 'Social Branding', 'Audience Engagement', 'Digital Marketing', 'SEO'],
  },
];

const projects: Project[] = [
  {
    id: 'project-01',
    title: 'Digital artifact / 01',
    category: 'WEB',
    year: 'PLACEHOLDER',
    visual: 'visual-one',
    description: 'Project media and a specific description will be added when the work is available.',
    role: 'PLACEHOLDER — role details unavailable.',
    tools: 'PLACEHOLDER — tools unavailable.',
    process: 'PLACEHOLDER — process details unavailable.',
    result: 'PLACEHOLDER — result details unavailable.',
  },
  {
    id: 'project-02',
    title: 'Visual artifact / 02',
    category: 'DESIGN',
    year: 'PLACEHOLDER',
    visual: 'visual-two',
    description: 'Project media and a specific description will be added when the work is available.',
    role: 'PLACEHOLDER — role details unavailable.',
    tools: 'PLACEHOLDER — tools unavailable.',
    process: 'PLACEHOLDER — process details unavailable.',
    result: 'PLACEHOLDER — result details unavailable.',
  },
  {
    id: 'project-03',
    title: 'Moving image / 03',
    category: 'VIDEO',
    year: 'PLACEHOLDER',
    visual: 'visual-three',
    description: 'Project media and a specific description will be added when the work is available.',
    role: 'PLACEHOLDER — role details unavailable.',
    tools: 'PLACEHOLDER — tools unavailable.',
    process: 'PLACEHOLDER — process details unavailable.',
    result: 'PLACEHOLDER — result details unavailable.',
  },
  {
    id: 'project-04',
    title: 'Cinematic artifact / 04',
    category: 'CINEMATOGRAPHY',
    year: 'PLACEHOLDER',
    visual: 'visual-four',
    description: 'Project media and a specific description will be added when the work is available.',
    role: 'PLACEHOLDER — role details unavailable.',
    tools: 'PLACEHOLDER — tools unavailable.',
    process: 'PLACEHOLDER — process details unavailable.',
    result: 'PLACEHOLDER — result details unavailable.',
  },
];

const navItems = [
  { label: 'WORK', target: 'work' },
  { label: 'SKILLS', target: 'skills' },
  { label: 'ABOUT', target: 'about-space' },
  { label: 'CONTACT', target: 'contact' },
];

const journeyWorlds = [
  { number: '01', name: 'ENTRY' },
  { number: '02', name: 'IDENTITY' },
  { number: '03', name: 'WEB DEVELOPMENT' },
  { number: '04', name: 'GRAPHIC DESIGN' },
  { number: '05', name: 'VIDEO' },
  { number: '06', name: 'CINEMATOGRAPHY' },
  { number: '07', name: 'CONTENT' },
  { number: '08', name: 'MARKETING' },
  { number: '09', name: 'SELECTED WORK' },
  { number: '10', name: 'CONTACT' },
];

function useSectionNavigation() {
  return (target: string) => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function useSceneProgress() {
  const [scene, setScene] = useState({ progress: 0, world: journeyWorlds[0] });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
       const worldIndex = Math.min(journeyWorlds.length - 1, Math.max(0, Math.floor(progress * journeyWorlds.length)));
       setScene({ progress, world: journeyWorlds[worldIndex] });
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);
  return scene;
}

function LoadingReveal() {
  const [done, setDone] = useState(() => window.location.hash.length > 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [progress, setProgress] = useState(1);
  useEffect(() => {
    const startedAt = window.setTimeout(() => setProgress(100), 90);
    const finishedAt = window.setTimeout(() => setDone(true), 720);
    return () => { window.clearTimeout(startedAt); window.clearTimeout(finishedAt); };
  }, []);
  return <div className={`loading-screen ${done ? 'is-done' : ''}`} aria-label="Loading Dev Fraol digital world">
    <div className="loading-inner">
      <div className="eyebrow" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>Entering the digital world</div>
      <div className="loading-line" />
      <div className="font-mono-custom" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.8rem', color: 'rgba(237,247,255,.5)', fontSize: '.62rem', letterSpacing: '.16em' }}>
        <span>DEV FRAOL</span><span>{String(progress).padStart(2, '0')} → 100</span>
      </div>
    </div>
  </div>;
}

function Cursor() {
  const [position, setPosition] = useState({ x: -30, y: -30 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const move = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY });
    const over = (event: MouseEvent) => setHovering(Boolean((event.target as HTMLElement).closest('a, button, [data-cursor="interactive"]')));
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); };
  }, []);
  return <div className={`custom-cursor ${hovering ? 'is-hover' : ''}`} style={{ left: position.x, top: position.y }} />;
}

function WorldIndicator({ world, progress }: { world: { number: string; name: string }; progress: number }) {
  return <aside className="world-indicator" aria-live="polite" data-testid="status-current-world">
    <strong>{world.number} / 10 — {world.name}</strong><span className="progress-rail"><i style={{ height: `${Math.round(progress * 100)}%` }} /></span>
  </aside>;
}

function Navigation({ onMenu }: { onMenu: () => void }) {
  const navigate = useSectionNavigation();
  return <header className="top-nav">
    <button type="button" className="nav-mark" onClick={() => navigate('top')} data-testid="button-nav-home">DEV <span>FRAOL</span></button>
    <nav className="nav-links" aria-label="Primary navigation">{navItems.map((item) => <button type="button" className="nav-link" key={item.target} onClick={() => navigate(item.target)} data-testid={`button-nav-${item.target}`}>{item.label}</button>)}</nav>
    <button type="button" className="menu-trigger" onClick={onMenu} data-testid="button-open-menu" aria-label="Open navigation menu">MENU <span className="menu-icon" aria-hidden="true"><span /><span /></span></button>
  </header>;
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useSectionNavigation();
  const go = (target: string) => { onClose(); window.setTimeout(() => navigate(target), 180); };
  return <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
    <button type="button" className="menu-close" onClick={onClose} data-testid="button-close-menu">CLOSE <X size={15} /></button>
    <div className="menu-nav">
      <div className="eyebrow" style={{ marginBottom: '1.75rem' }}>Navigate the world / 00—06</div>
      <button type="button" className="menu-item" onClick={() => go('top')} data-testid="button-menu-home"><span className="menu-index">00</span>DEV FRAOL</button>
      {navItems.map((item, index) => <button type="button" className="menu-item" key={item.target} onClick={() => go(item.target)} data-testid={`button-menu-${item.target}`}><span className="menu-index">0{index + 1}</span>{item.label}</button>)}
      <div className="tech-label" style={{ marginTop: '2.5rem' }}>Scroll slowly. Look closer.</div>
    </div>
  </div>;
}

function Hero({ onMenu }: { onMenu: () => void }) {
  const navigate = useSectionNavigation();
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-grid" /><div className="hero-glow" /><div className="hero-orbit" />
    <div className="hero-sculpture" data-cursor="interactive" aria-label="Abstract futuristic floating core" role="img" />
    <div className="hero-corner left">DIGITAL CREATIVE / DEVELOPER / DESIGNER / FILMMAKER</div>
     <div className="hero-corner right">SYSTEM 01 / DIGITAL UNIVERSE<br /><span className="cyan">SCROLL TO ENTER</span></div>
    <div className="hero-roles">DIGITAL CREATIVE<br />DEVELOPER<br />DESIGNER<br />FILMMAKER</div>
    <div className="hero-code">CORE / 00<br />SIGNAL / ACTIVE<br />GRID / INFINITE</div>
    <h1 className="hero-name" id="hero-title"><span>DEV</span><span>FRAOL</span></h1>
    <div style={{ position: 'absolute', zIndex: 3, bottom: '8%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem', color: 'rgba(237,247,255,.4)', font: '.6rem var(--app-font-mono)', letterSpacing: '.24em' }} aria-label="Core disciplines"><span>CODE</span><span>DESIGN</span><span>MOTION</span><span>STORY</span></div>
    <button type="button" className="hero-scroll" onClick={() => navigate('intro')} data-testid="button-scroll-explore"><span className="scroll-dot" /> ENTER THE SEQUENCE <ArrowDown size={14} /></button>
    <button type="button" className="tech-label" style={{ position: 'absolute', bottom: '1.8rem', left: '4vw' }} onClick={onMenu} data-testid="button-hero-menu">OPEN FULL NAVIGATION</button>
  </section>;
}

function Intro() {
  const statements = ['I BUILD DIGITAL EXPERIENCES.', 'I DESIGN THEM.', 'I MAKE THEM MOVE.', 'I MAKE THEM MATTER.'];
  return <section className="section-wrap statement" id="intro" aria-labelledby="intro-title">
    <div className="eyebrow">A point of view / entry sequence</div>
    <h2 id="intro-title" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Introduction</h2>
    {statements.map((statement, index) => <div className="statement-block" key={statement}><span className={`statement-line ${index === 0 ? 'dim' : index === 3 ? 'cyan' : ''}`}>{statement}</span></div>)}
  </section>;
}

function AboutIntro() {
  return <section className="section-wrap section-pad" id="about" aria-labelledby="about-title">
    <div className="about-layout">
      <div className="portrait-art" role="img" aria-label="Abstract portrait treatment representing Dev Fraol">
        <div className="portrait-core" />
        <span className="tech-label" style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', zIndex: 2 }}>PORTRAIT STUDY / DF—01</span>
        <span className="eyebrow" style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', zIndex: 2 }}>LIGHT / FORM / SIGNAL</span>
      </div>
      <div className="about-copy">
        <div className="eyebrow">The person behind the work / 00</div>
        <h2 id="about-title">DEV FRAOL.<br /><span className="cyan">DIGITAL</span><br />CREATIVE &amp;<br />DEVELOPER.</h2>
        <p className="body-copy">Dev Fraol works across technology, visual design, motion, cinematography, content creation, and digital marketing. These disciplines are connected by one point of view: make the work feel alive.</p>
        <div className="about-meta"><div><span className="meta-label">Approach</span><span className="meta-value">Curious / precise / visual</span></div><div><span className="meta-label">Working across</span><span className="meta-value">Code / design / motion / story</span></div></div>
      </div>
    </div>
  </section>;
}

function SkillTool({ item, active, onSelect, accent }: { item: SkillTool; active: boolean; onSelect: () => void; accent: string }) {
  return <button type="button" className={`skill-tool ${active ? 'active' : ''}`} style={{ '--world-accent': accent } as CSSProperties} onClick={onSelect} data-cursor="interactive" data-testid={`button-tool-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
    {item.name}<span className="tool-detail"><strong>{item.category}</strong>{item.description}</span>
  </button>;
}

function WorldSection({ world }: { world: World }) {
  const [active, setActive] = useState(world.tools[0]?.name || '');
  const activeTool = world.tools.find((item) => item.name === active);
  return <section className="world" id={world.id} aria-labelledby={`${world.id}-title`} style={{ '--world-accent': world.accent } as CSSProperties}>
    <div className="world-inner">
      <div>
        <div className="world-index">WORLD {world.number} / 06</div>
        <h3 id={`${world.id}-title`}>{world.name}</h3>
        <div className="world-kicker">{world.visual}</div>
        <p className="world-description body-copy">{world.description}</p>
        {world.skills.length > 0 && <div className="world-skill-list">{world.skills.map((skill) => <span className="tech-label" key={skill} style={{ display: 'inline-block', margin: '.4rem .65rem 0 0' }}>{skill}</span>)}</div>}
      </div>
      <div className="world-visual" data-cursor="interactive" aria-label={`${world.name} interactive tool orbit`}>
        <div className="world-orbit" /><div className="world-core" />
        <div className="world-tools">{world.tools.length > 0 ? world.tools.map((item) => <SkillTool key={`${world.id}-${item.name}`} item={item} active={active === item.name} onSelect={() => setActive(item.name)} accent={world.accent} />) : <div className="tech-label" style={{ maxWidth: '15rem', textAlign: 'center' }}>TOOLS / TO BE ADDED LATER THROUGH PROJECT DATA</div>}</div>
        {activeTool && <div className="tech-label" style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', textAlign: 'center' }}>SELECTED / {activeTool.name}</div>}
      </div>
    </div>
    <div className="world-meta">SYSTEM / CREATIVE-{world.number} &nbsp;&nbsp; STATUS / ACTIVE &nbsp;&nbsp; TOOLS / {String(world.tools.length).padStart(2, '0')}</div>
  </section>;
}

function SkillUniverse() {
  return <section id="skills" aria-labelledby="skills-title">
    <div className="section-wrap section-pad">
      <div className="universe-header"><div><div className="eyebrow">Six connected disciplines / skill map</div><h2 className="display-title" id="skills-title">THE SKILL<br /><span className="cyan">UNIVERSE.</span></h2></div><p className="body-copy">Six major creative and technical disciplines. Each one is a world with its own atmosphere, tools, and way of thinking.</p></div>
    </div>
    {worlds.map((world) => <WorldSection key={world.id} world={world} />)}
  </section>;
}

function SelectedWork({ onSelect }: { onSelect: (project: Project) => void }) {
  return <section className="section-wrap section-pad work-section" id="work" aria-labelledby="work-title">
    <div className="work-head"><div><div className="eyebrow">Featured work / after the universe</div><h2 className="display-title" id="work-title">WORK<span className="cyan">.</span></h2></div><p className="work-subtitle body-copy">A spatial archive for future work and real stories.<br /><span className="tech-label">PROJECT MEDIA / PLACEHOLDER-SAFE</span></p></div>
    <div className="work-grid">{projects.map((project, index) => <button type="button" className="project-card" key={project.id} onClick={() => onSelect(project)} data-cursor="interactive" data-testid={`button-project-${project.id}`}>
      <div className={`project-visual ${project.visual}`} aria-label={`${project.title}, placeholder project artwork`} />
      <div className="project-info"><span className="project-name">{project.title}</span><span className="project-meta">{project.category}<br />{project.year}<br />0{index + 1}</span></div>
    </button>)}</div>
  </section>;
}

function Process() {
  const steps = [['01', 'DISCOVER', 'Find the feeling, question, or tension worth following.'], ['02', 'CONCEPT', 'Turn the spark into references, shapes, frames, and direction.'], ['03', 'DESIGN', 'Give the idea a visual language and room to move.'], ['04', 'BUILD', 'Give the experience a responsive body and rhythm.'], ['05', 'CREATE', 'Make the images, edits, systems, and details real.'], ['06', 'REFINE', 'Remove the noise. Keep the signal.'], ['07', 'LAUNCH', 'Put the experience into the world.']];
  return <section className="section-wrap section-pad" aria-labelledby="process-title"><div className="eyebrow">The sequence / creative process</div><h2 className="display-title" id="process-title" style={{ marginTop: '1.5rem' }}>FROM IDEA<br /><span className="cyan">→ EXPERIENCE.</span></h2><div className="process-list">{steps.map(([number, title, copy]) => <div className="process-step" key={number}><span className="step-num">{number}</span><span className="step-name">{title}</span><span className="step-copy body-copy">{copy}</span></div>)}</div></section>;
}

function Showreel({ onOpen }: { onOpen: () => void }) {
  return <section className="showreel" id="showreel" aria-labelledby="showreel-title"><div className="reel-content"><span className="reel-kicker">Moving image / source replaceable later</span><h2 className="reel-title" id="showreel-title">DEV FRAOL<br /><span className="cyan">SHOWREEL</span></h2><button type="button" className="reel-play" onClick={onOpen} data-cursor="interactive" data-testid="button-open-showreel"><Play size={15} fill="currentColor" /> PLAY SHOWREEL</button></div></section>;
}

function AboutSpace() {
  return <section className="section-wrap section-pad about-space" id="about-space" aria-labelledby="space-title"><div className="space-labels" aria-hidden="true">{['DEVELOPER', 'DESIGNER', 'VIDEOGRAPHER', 'CINEMATOGRAPHER', 'CONTENT CREATOR', 'DIGITAL CREATIVE'].map((label) => <span className="space-label" key={label}>{label}</span>)}</div><div className="eyebrow">3D about space / floating labels</div><h2 className="display-title" id="space-title" style={{ marginTop: '1.5rem' }}>THE PERSON<br /><span className="cyan">IN THE FRAME.</span></h2><p className="body-copy" style={{ maxWidth: '31rem', marginTop: '2rem' }}>A multidisciplinary practice held together by curiosity, visual thinking, and the desire to make digital work that stays with people.</p></section>;
}

function Philosophy() {
  return <section className="section-wrap section-pad philosophy" aria-labelledby="philosophy-title"><div className="eyebrow">Personal philosophy / signal</div><h2 className="display-title" id="philosophy-title" style={{ marginTop: '1.5rem' }}>ONE PERSON.<br />MANY DISCIPLINES.<br /><span className="cyan">ONE VISION.</span></h2><div className="philosophy-lines">{['Technology gives me the tools.', 'Design gives me the language.', 'Motion gives me the energy.', 'Story gives it meaning.'].map((line) => <span className="philosophy-line" key={line}>{line}</span>)}</div></section>;
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
    if (!name || !email || !message || !email.includes('@')) { setError('Please complete name, a valid email, and a message.'); setSent(false); return; }
    setError(''); setSent(true); form.reset();
  };
  return <section className="section-wrap section-pad contact-section" id="contact" aria-labelledby="contact-title"><div className="contact-layout"><div><div className="eyebrow">Open channel / command center</div><h2 className="contact-title" id="contact-title">LET&apos;S<br />CREATE<br /><span className="cyan">SOMETHING</span><br /><span className="cyan">REMARKABLE.</span></h2></div><div className="contact-aside"><p className="body-copy">Have a feeling, a frame, a product, or a story that needs a world around it? Start the signal below.</p><form className="contact-form" onSubmit={submit} noValidate><div className="field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" placeholder="Your name" data-testid="input-contact-name" /></div><div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@email.com" data-testid="input-contact-email" /></div><div className="field"><label htmlFor="project-type">Project Type</label><select id="project-type" name="project-type" defaultValue="" data-testid="select-contact-project"><option value="" disabled>Select a direction</option>{worlds.map((world) => <option key={world.id}>{world.name}</option>)}<option>Branding</option><option>Other</option></select></div><div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" placeholder="Tell me what you are imagining." data-testid="textarea-contact-message" /></div>{error && <div className="form-error" role="alert" data-testid="status-contact-error">{error}</div>}{sent && <div className="form-success" role="status" data-testid="status-contact-success"><Check size={15} style={{ display: 'inline-block', marginRight: '.5rem' }} />Transmission sent locally. Thanks — the rest starts with a conversation.</div>}<button type="submit" className="button-electric" data-testid="button-submit-contact">START A PROJECT <ArrowUpRight size={15} /></button></form><div className="contact-connect"><span className="eyebrow">Connect</span><div className="contact-links"><a href="#contact" data-testid="link-connect-linkedin">LinkedIn</a><a href="#contact" data-testid="link-connect-github">GitHub</a><a href="#contact" data-testid="link-connect-instagram">Instagram</a><a href="#contact" data-testid="link-connect-youtube">YouTube</a></div></div></div></div></section>;
}

function Footer() {
  const backTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return <footer className="footer"><div className="section-wrap"><div className="footer-word">DEV <span>FRAOL</span></div><div className="footer-bottom"><div className="footer-sub">Digital creative / developer / designer / filmmaker<br />A world in progress.</div><div><div className="footer-socials"><a href="#contact" data-testid="link-footer-contact">CONNECT WITH DEV</a><a href="#work" data-testid="link-footer-work">WORK</a><a href="#skills" data-testid="link-footer-skills">SKILLS</a></div><button type="button" className="back-top" onClick={backTop} data-testid="button-back-top">BACK TO THE BEGINNING <ArrowUp size={14} /></button></div></div></div></footer>;
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><article className="project-modal"><div className="modal-top"><div><div className="eyebrow">Placeholder project / {project.category}</div><h2 className="modal-title" id="project-modal-title">{project.title}</h2></div><button type="button" className="modal-close" onClick={onClose} data-testid="button-close-project">CLOSE <X size={15} /></button></div><div className={`modal-visual ${project.visual}`} aria-label={`${project.title} placeholder project visual`} /><p className="body-copy">{project.description}</p><div className="modal-grid" style={{ marginTop: '2.5rem' }}><div className="modal-block"><div className="eyebrow">ROLE</div><p>{project.role}</p></div><div className="modal-block"><div className="eyebrow">DISCIPLINE / TOOLS</div><p>{project.category}<br />{project.tools}</p></div><div className="modal-block"><div className="eyebrow">PROCESS / RESULT</div><p>{project.process}<br /><br />{project.result}</p></div></div></article></div>;
}

function ShowreelModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Dev Fraol showreel player" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="showreel-player"><button type="button" className="player-close" onClick={onClose} data-testid="button-close-showreel">CLOSE <X size={15} /></button><div className="player-center"><Play size={21} fill="currentColor" /><span>Showreel media placeholder</span></div></div></div>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const navigate = useSectionNavigation();
  const scene = useSceneProgress();
  const activeModal = useMemo(() => Boolean(selectedProject || showreelOpen), [selectedProject, showreelOpen]);
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const frame = window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { document.body.style.overflow = menuOpen || activeModal ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen, activeModal]);
  useEffect(() => { const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); setSelectedProject(null); setShowreelOpen(false); } }; window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape); }, []);
   return <main className="site-shell" style={{ '--scene-progress': scene.progress } as CSSProperties}><ScrollScene progress={scene.progress} /><LoadingReveal /><Cursor /><WorldIndicator world={scene.world} progress={scene.progress} /><Navigation onMenu={() => setMenuOpen(true)} />{menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}<div className="content-layer"><Hero onMenu={() => setMenuOpen(true)} /><Intro /><AboutIntro /><SkillUniverse /><SelectedWork onSelect={setSelectedProject} /><Process /><Showreel onOpen={() => setShowreelOpen(true)} /><AboutSpace /><Philosophy /><Contact /><Footer /></div>{selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}{showreelOpen && <ShowreelModal onClose={() => setShowreelOpen(false)} />}<button type="button" className="back-top" style={{ position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 70, padding: '.7rem', background: 'rgba(5,8,16,.7)' }} onClick={() => navigate('top')} aria-label="Scroll to top" data-testid="button-floating-top"><ArrowUp size={15} /></button></main>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;