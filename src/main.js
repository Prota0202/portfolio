import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { getData, getLang, setLang, onLangChange, initLang } from './i18n.js';
import { createCarousel } from './three/carousel.js';
import { createRing } from './three/ring.js';
import { initEasterEggs } from './eggs.js';

gsap.registerPlugin(ScrollTrigger);
document.body.classList.add('is-loading');
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const $ = (s) => document.querySelector(s);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const isMobile = window.matchMedia('(max-width: 900px)').matches;
initLang();

let carouselRef = null;
let ringRef = null;
let lastDossierIdx = -1;

const NAV_KEYS = ['home', 'about', 'experience', 'projects', 'dossiers', 'services'];

/* ---------------- smooth scroll ---------------- */
const lenis = new Lenis({ lerp: 0.09 });
lenis.stop();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = a.getAttribute('href');
    if (target.length < 2) return;
    e.preventDefault();
    lenis.scrollTo(target === '#top' ? 0 : target, { duration: 1.6 });
  });
});

/* ---------------- i18n UI ---------------- */
function applyStaticUI() {
  const { meta, ui } = getData();
  document.documentElement.lang = getData().htmlLang;
  document.title = meta.title;
  $('meta[name="description"]').setAttribute('content', meta.description);
  $('#loaderSuffix').textContent = ui.loaderSuffix;
  document.querySelectorAll('.nav__links a').forEach((a, i) => {
    a.textContent = ui.nav[NAV_KEYS[i]];
  });
  $('#navStatus').textContent = ui.status;
  $('#navCv').textContent = ui.cv;

  const h = ui.hero;
  const l1 = $('.hero__line:nth-child(1)');
  const l2 = $('.hero__line:nth-child(2)');
  l1.textContent = h.line1;
  l1.dataset.text = h.line1;
  l2.textContent = h.line2;
  l2.dataset.text = h.line2;
  $('.hero__left').innerHTML = `${h.left}<div class="hero__scroll"><span></span>${h.scroll}</div>`;
  $('.hero__right p').textContent = h.pitch;
  $('.hero__right ul').innerHTML = h.roles.map((r) => `<li>${r}</li>`).join('');
  $('.hero__portrait img').alt = h.portraitAlt;
  $('#portraitBubble').innerHTML = h.portraitBubble;

  const ab = ui.about;
  $('.about__headline').innerHTML = ab.headline;
  $('.about__meta').innerHTML = ab.meta;
  $('.about__label').innerHTML = ab.label;
  document.querySelector('.scramble').textContent = ab.body;
  $('.about__actions .btn--light').textContent = ab.downloadCv;
  $('.about__actions .btn--ghost').textContent = ab.services;
  $('.about__word--l').textContent = ab.wordL;
  $('.about__word--r').textContent = ab.wordR;

  $('#expLabel').textContent = ui.exp.defaultLabel;
  $('.projects__kicker').textContent = ui.projects.kicker;
  $('.projects__title').textContent = ui.projects.title;
  $('#ringCenter').textContent = ui.dossiers.center;
  $('#dossHint').textContent = ui.dossiers.hint;
  $('.services__title').textContent = ui.services.title;
  $('.services__intro').textContent = ui.services.intro;
  $('.contact__title').textContent = ui.contact.title;
  $('.contact__title').dataset.text = ui.contact.title;
  $('.contact__sub').textContent = ui.contact.sub;
  $('.contact__links a:nth-child(3)').textContent = ui.contact.email;
  $('.contact__links a:nth-child(4)').textContent = ui.contact.phone;
  $('.contact__links a:nth-child(5)').textContent = ui.contact.downloadCv;
  $('.contact__foot span:first-child').textContent = ui.contact.foot;
  $('.contact__egg').textContent = ui.contact.egg;

  const bg = ui.bingo;
  $('.bingo__kicker').textContent = bg.kicker;
  $('.bingo__card h3').textContent = bg.title;
  $('#bingoClose').textContent = bg.close;
  const bingoFoot = $('.bingo__foot');
  if (bingoFoot.firstChild?.nodeType === Node.TEXT_NODE) bingoFoot.firstChild.textContent = `${bg.foot} `;

  document.querySelectorAll('.lang__btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.lang === getLang());
  });
}

function rebuildExperience() {
  const { experiences, ui } = getData();
  const track = $('#expTrack');
  const tabs = $('#expTabs');
  track.querySelectorAll('.exp__panel:not(.exp__panel--intro)').forEach((p) => p.remove());
  tabs.innerHTML = '';

  const intro = track.querySelector('.exp__panel--intro');
  intro.querySelector('.pill').textContent = ui.exp.introPill;
  intro.querySelector('.exp__intro').innerHTML = ui.exp.introTitle;
  intro.querySelector('p').textContent = ui.exp.introText;

  const existing = [...track.querySelectorAll('.exp__panel:not(.exp__panel--intro)')];
  const fillPanel = (panel, x) => {
    panel.innerHTML = `
      <div class="exp__ghost">${x.ghost} — ${x.ghost}</div>
      <div class="exp__body">
        <div class="exp__meta mono"><span>${x.period}</span><b>${x.tag}</b></div>
        <h3 class="exp__title">${x.title.join('<br/>')}</h3>
        <p class="exp__desc">${x.desc}</p>
        <div class="exp__miles">
          ${x.milestones.map(([k, v]) => `<div><div class="mono">${ui.exp.milestone} ${k}</div><p>${v}</p></div>`).join('')}
        </div>
      </div>`;
  };

  if (existing.length === experiences.length) {
    experiences.forEach((x, i) => {
      fillPanel(existing[i], x);
      if (tabs.children[i]) tabs.children[i].textContent = x.tab;
    });
    return;
  }

  experiences.forEach((x, i) => {
    const panel = document.createElement('article');
    panel.className = 'exp__panel';
    fillPanel(panel, x);
    track.appendChild(panel);
    const b = document.createElement('button');
    b.textContent = x.tab;
    b.dataset.i = i;
    tabs.appendChild(b);
  });
}

function rebuildServices() {
  const { services, ui } = getData();
  const list = $('#servicesList');
  list.innerHTML = '';
  services.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'svc' + (i === 0 ? ' is-open' : '');
    el.tabIndex = 0;
    el.innerHTML = `
      <div class="svc__head"><h3>${s.title}</h3><span>0${i + 1} / 0${services.length}</span></div>
      <div class="svc__body"><div>
        <p>${s.desc}</p>
        <div class="svc__del mono"><span>${ui.services.deliverables}</span><span>${s.deliverables}</span></div>
      </div></div>`;
    const open = () => {
      list.querySelectorAll('.svc').forEach((n) => n.classList.toggle('is-open', n === el));
    };
    el.addEventListener('click', open);
    el.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open()));
    list.appendChild(el);
  });
}

function applyLanguage() {
  applyStaticUI();
  rebuildExperience();
  rebuildServices();
  if (carouselRef) carouselRef.setLocale(getData().projects, getData().ui.textures);
  if (ringRef) ringRef.setLocale(getData().dossiers, getData().ui.textures, getLang());
  if (lastDossierIdx >= 0) onDossierChange(lastDossierIdx);
  scrambled = false;
  ScrollTrigger.refresh();
}

function initLangSwitcher() {
  document.querySelectorAll('.lang__btn').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  onLangChange(() => applyLanguage());
}

rebuildExperience();
rebuildServices();
applyStaticUI();
initLangSwitcher();

/* ---------------- preloader ---------------- */
function wavyCirclePath() {
  const pts = [];
  const n = 220;
  for (let k = 0; k <= n; k++) {
    const t = (k / n) * Math.PI * 2 - Math.PI * 0.65;
    const r = 150 + Math.sin(t * 7) * 9 + Math.sin(t * 3 + 1.3) * 7 + Math.cos(t * 11) * 3;
    pts.push(`${(200 + Math.cos(t) * r).toFixed(1)},${(200 + Math.sin(t) * r).toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
}

function runLoader() {
  return new Promise((resolve) => {
    const path = $('#loaderPath');
    const dot = $('#loaderDot');
    path.setAttribute('d', wavyCirclePath());
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    const state = { p: 0 };
    const tl = gsap.timeline({ onComplete: resolve });
    tl.from('.loader__word', { opacity: 0, filter: 'blur(12px)', letterSpacing: '0.5em', duration: 0.9, ease: 'power3.out' })
      .to(state, {
        p: 1,
        duration: 1.7,
        ease: 'power2.inOut',
        onUpdate: () => {
          path.style.strokeDashoffset = len * (1 - state.p);
          const pt = path.getPointAtLength(len * state.p);
          dot.setAttribute('cx', pt.x);
          dot.setAttribute('cy', pt.y);
          $('#loaderCount').textContent = String(Math.round(state.p * 100)).padStart(3, '0');
        },
      }, '-=0.3')
      .to('.loader__ring', { scale: 1.15, opacity: 0, duration: 0.6, ease: 'power2.in' }, '+=0.15')
      .to('#loader', { backgroundColor: 'rgba(5,5,5,0)', duration: 0.8, ease: 'power2.inOut' }, '-=0.2')
      .to('.loader__word', { scale: 0.55, opacity: 0, filter: 'blur(10px)', duration: 0.8, ease: 'power2.in' }, '<')
      .set('#loader', { display: 'none' });
  });
}

function heroIntro() {
  const tl = gsap.timeline();
  tl.from('.hero__line', { filter: 'blur(24px)', opacity: 0, scale: 1.08, y: 30, stagger: 0.12, duration: 1.3, ease: 'power3.out' })
    .from('.hero__portrait', { y: 120, opacity: 0, duration: 1.3, ease: 'power3.out' }, '-=1.1')
    .from('.nav, .hero__left, .hero__right', { opacity: 0, y: 12, duration: 0.8, stagger: 0.08 }, '-=0.8');
  return tl;
}

/* ---------------- scroll scenes ---------------- */
function heroScroll() {
  gsap.to('.hero__title', { yPercent: -40, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__portrait', { yPercent: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  const portrait = $('#portrait');
  const title = $('#heroTitle');
  window.addEventListener('pointermove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    gsap.to(portrait, { x: x * 18, duration: 1, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(title, { x: -x * 26, y: -y * 12, duration: 1.2, ease: 'power3.out', overwrite: 'auto' });
  });
}

function aboutScroll() {
  const card = $('#aboutCard');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.about', start: 'top top', end: '+=260%', scrub: 1, pin: '.about__pin' },
  });
  tl.fromTo('.about__bg', { scale: 1.15 }, { scale: 1, duration: 1, ease: 'none' }, 0)
    .to('.about__word--l', { xPercent: -140, duration: 0.6, ease: 'power2.inOut' }, 0.15)
    .to('.about__word--r', { xPercent: 140, duration: 0.6, ease: 'power2.inOut' }, 0.15)
    .to('.about__word', { opacity: 0, duration: 0.25 }, 0.6)
    .to(card, { width: () => window.innerWidth * (isMobile ? 1 : 0.86), height: () => window.innerHeight * (isMobile ? 1 : 0.82), borderRadius: isMobile ? 0 : 16, duration: 0.8, ease: 'power2.inOut' }, 0.3)
    .to('.about__spot', { opacity: 0.85, duration: 0.4 }, 0.6)
    .to('.about__content', { opacity: 1, duration: 0.3, onStart: scrambleAbout }, 0.95)
    .to('.about__bg', { opacity: 0.25, duration: 0.4 }, 1.0)
    .to({}, { duration: 0.35 });
}

let scrambled = false;
function scrambleAbout() {
  if (scrambled) return;
  scrambled = true;
  const el = document.querySelector('.scramble');
  const final = el.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>_';
  const state = { p: 0 };
  gsap.to(state, {
    p: 1,
    duration: 1.6,
    ease: 'power1.out',
    onUpdate: () => {
      const n = Math.floor(final.length * state.p);
      let out = final.slice(0, n);
      for (let i = n; i < Math.min(final.length, n + 18); i++) {
        out += final[i] === ' ' ? ' ' : chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = out;
    },
    onComplete: () => (el.textContent = final),
  });
}

function experienceScroll() {
  const track = $('#expTrack');
  const panels = track.querySelectorAll('.exp__panel');
  const tabs = [...document.querySelectorAll('#expTabs button')];
  const last = panels[panels.length - 1];
  const distance = () => last.offsetLeft + last.offsetWidth - window.innerWidth;
  let current = -1;

  const st = ScrollTrigger.create({
    trigger: '.exp',
    start: 'top top',
    end: () => '+=' + distance() * 1.1,
    pin: '.exp__pin',
    scrub: 1,
    invalidateOnRefresh: true,
    animation: gsap.to(track, { x: () => -distance(), ease: 'none' }),
    onUpdate: (self) => {
      $('#expProgress').style.width = self.progress * 100 + '%';
      const x = -distance() * self.progress;
      panels.forEach((p, i) => {
        const center = p.offsetLeft + x + p.offsetWidth / 2;
        const off = (center - window.innerWidth / 2) / window.innerWidth;
        const ghost = p.querySelector('.exp__ghost');
        if (ghost) ghost.style.transform = `translate(${off * -40}vw, -50%)`;
        if (i > 0 && Math.abs(off) < 0.3 && current !== i) {
          current = i;
          const title = p.querySelector('.exp__title');
          title.classList.remove('glitch');
          void title.offsetWidth;
          title.classList.add('glitch');
          tabs.forEach((t, k) => t.classList.toggle('is-active', k === i - 1));
          $('#expLabel').textContent = getData().experiences[i - 1].tag;
        }
      });
      if (self.progress < 0.05 && current !== 0) {
        current = 0;
        tabs.forEach((t) => t.classList.remove('is-active'));
        $('#expLabel').textContent = getData().ui.exp.defaultLabel;
      }
    },
  });

  tabs.forEach((t, k) => {
    t.addEventListener('click', () => {
      const panel = panels[k + 1];
      const p = (panel.offsetLeft - (window.innerWidth - panel.offsetWidth) / 2) / distance();
      lenis.scrollTo(st.start + clamp(p) * (st.end - st.start), { duration: 1.4 });
    });
  });
}

function projectsScroll(carousel) {
  gsap.from('.projects__sheet', {
    borderRadius: '60px 60px 0 0',
    scrollTrigger: { trigger: '.projects', start: 'top bottom', end: 'top top', scrub: true },
  });
  ScrollTrigger.create({
    trigger: '.projects',
    start: 'top top',
    end: '+=220%',
    pin: '.projects__pin',
    onUpdate: (self) => carousel.setProgress(self.progress),
    onToggle: (self) => carousel.setVisible(true),
  });
  ScrollTrigger.create({
    trigger: '.projects',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => carousel.setVisible(self.isActive),
  });
  gsap.from('.projects__title', {
    y: 80, opacity: 0, ease: 'power3.out',
    scrollTrigger: { trigger: '.projects', start: 'top 60%', end: 'top top', scrub: true },
  });
}

function dossiersScroll(ring) {
  ScrollTrigger.create({
    trigger: '.dossiers',
    start: 'top top',
    end: '+=420%',
    pin: '.dossiers__pin',
    onUpdate: (self) => {
      const p = self.progress;
      ring.setProgress(p);
      $('#ringCenter').style.opacity = 1 - clamp((p - 0.2) / 0.08);
      $('#dossHint').style.opacity = 1 - clamp((p - 0.15) / 0.1);
    },
  });
  ScrollTrigger.create({
    trigger: '.dossiers',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => ring.setVisible(self.isActive),
  });
}

function onDossierChange(i) {
  lastDossierIdx = i;
  const els = ['#dossName', '#dossMeta', '#dossDetail'].map($);
  if (i < 0) {
    gsap.to(els, { opacity: 0, duration: 0.3 });
    return;
  }
  const d = getData().dossiers[i];
  const L = getData().ui.dossiers;
  gsap.to(els, {
    opacity: 0, y: -8, duration: 0.18, onComplete: () => {
      els[0].textContent = d.name;
      els[1].innerHTML = d.meta.map((m) => `<div>${m}</div>`).join('');
      els[2].innerHTML = `<dl><dt>${L.problem}</dt><dd>${d.problem}</dd><dt>${L.approach}</dt><dd>${d.approach}</dd><dt>${L.result}</dt><dd>${d.result}</dd></dl>`;
      gsap.fromTo(els, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 });
    },
  });
}

function onProjectChange(i) {
  const p = getData().projects[i];
  $('#projName').textContent = p.name;
  $('#projSub').textContent = p.sub;
  $('#projIdx').textContent = `0${i + 1} / 0${getData().projects.length}`;
}

function servicesScroll() {
  gsap.from('.services__title, .services__intro', {
    y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.services', start: 'top 70%' },
  });
  gsap.from('.svc', {
    y: 60, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.services__list', start: 'top 80%' },
  });
}

function contactScroll() {
  gsap.from('.contact__title', {
    yPercent: 60, opacity: 0, filter: 'blur(20px)', ease: 'power3.out',
    scrollTrigger: { trigger: '.contact', start: 'top 85%', end: 'top 25%', scrub: true },
  });
  const title = $('.contact__title');
  title.addEventListener('pointermove', (e) => {
    const r = title.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    title.style.backgroundImage = `radial-gradient(circle at ${x}% 40%, #fff 0%, #f0f0f0 12%, transparent 30%), linear-gradient(180deg, #fff 0%, #d9d9d9 38%, #8c8c8c 52%, #f2f2f2 66%, #9a9a9a 100%)`;
  });
  title.addEventListener('pointerleave', () => (title.style.backgroundImage = ''));
}

function navSpy() {
  const links = [...document.querySelectorAll('.nav__links a')];
  links.forEach((a) => {
    const id = a.getAttribute('href');
    const section = id === '#top' ? $('.hero') : $(id);
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => self.isActive && links.forEach((l) => l.classList.toggle('is-active', l === a)),
    });
  });
}

/* ---------------- boot ---------------- */
async function boot() {
  await Promise.all([
    document.fonts.load('800 100px "Plus Jakarta Sans"'),
    document.fonts.load('600 20px "Plus Jakarta Sans"'),
    document.fonts.load('400 16px "Space Mono"'),
    document.fonts.load('700 16px "Space Mono"'),
  ]).catch(() => {});

  const bootData = getData();
  carouselRef = createCarousel($('#carouselCanvas'), bootData.projects, bootData.ui.textures, onProjectChange);
  ringRef = createRing($('#ringCanvas'), bootData.dossiers, bootData.ui.textures, getLang(), onDossierChange);
  onProjectChange(0);

  gsap.ticker.add((_, dt) => {
    carouselRef.render();
    ringRef.render(dt / 1000);
  });

  heroScroll();
  aboutScroll();
  experienceScroll();
  projectsScroll(carouselRef);
  dossiersScroll(ringRef);
  servicesScroll();
  contactScroll();
  navSpy();
  initEasterEggs(lenis);

  const skip = sessionStorage.getItem('seen-loader');
  if (skip) {
    gsap.set('#loader', { display: 'none' });
  } else {
    await runLoader();
    sessionStorage.setItem('seen-loader', '1');
  }
  heroIntro();
  document.body.classList.remove('is-loading');
  lenis.start();
  ScrollTrigger.refresh();
}

boot();
