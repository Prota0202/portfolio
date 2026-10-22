import fr from './locales/fr.js';
import en from './locales/en.js';

const locales = { fr, en };
const STORAGE = 'portfolio-lang';

/** @type {'fr'|'en'} */
let lang = 'fr';
const listeners = new Set();

function detect() {
  const saved = localStorage.getItem(STORAGE);
  if (saved && locales[saved]) return /** @type {'fr'|'en'} */ (saved);
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('fr') ? 'fr' : 'en';
}

export function initLang() {
  lang = detect();
}

export function getLang() {
  return lang;
}

export function getData() {
  return locales[lang];
}

export function setLang(next) {
  if (!locales[next] || next === lang) return;
  lang = next;
  localStorage.setItem(STORAGE, lang);
  listeners.forEach((fn) => fn(lang));
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
