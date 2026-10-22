import { getData, onLangChange } from './i18n.js';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function initEasterEggs(lenis) {
  const toastEl = document.getElementById('toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 3200);
  };

  let baseTitle = getData().meta.title;

  const logConsole = () => {
    console.log(
      `%cABDELBADI•%c\n${getData().ui.eggs.console}`,
      'font: 800 28px "Plus Jakarta Sans", sans-serif; color:#111; background:#e9e9e9; padding:6px 10px; border-radius:6px',
      'font: 12px "Space Mono", monospace; color:#666',
    );
  };
  logConsole();

  onLangChange(() => {
    baseTitle = getData().meta.title;
    if (!document.hidden) document.title = baseTitle;
    document.getElementById('bingoClose').textContent = getData().ui.bingo.close;
    document.querySelector('.bingo__foot').firstChild.textContent = `${getData().ui.bingo.foot} `;
  });

  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? getData().meta.hiddenTitle : baseTitle;
  });

  let clicks = 0;
  document.getElementById('logo').addEventListener('click', () => {
    clicks++;
    const lines = getData().ui.eggs.logo;
    const msg = { 3: lines[0], 5: lines[1], 8: lines[2] }[clicks];
    if (msg) toast(msg);
  });

  const bubble = document.getElementById('portraitBubble');
  let bubbleTimer;
  document.getElementById('portrait').addEventListener('click', () => {
    bubble.classList.add('is-on');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('is-on'), 3000);
  });

  const bingo = document.getElementById('bingo');
  const grid = document.getElementById('bingoGrid');
  const open = () => {
    grid.innerHTML = '';
    const { words, win } = getData().ui.bingo;
    [...words].sort(() => Math.random() - 0.5).forEach((w) => {
      const b = document.createElement('button');
      b.textContent = w;
      b.addEventListener('click', () => {
        b.classList.toggle('is-on');
        if (grid.querySelectorAll('.is-on').length === 4) toast(win);
      });
      grid.appendChild(b);
    });
    bingo.hidden = false;
    lenis.stop();
  };
  const close = () => {
    bingo.hidden = true;
    lenis.start();
  };
  document.getElementById('bingoClose').addEventListener('click', close);
  bingo.addEventListener('click', (e) => e.target === bingo && close());

  let seq = [];
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !bingo.hidden) return close();
    seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
    if (seq.join() === KONAMI.join()) open();
  });

  document.querySelector('.contact__egg').addEventListener('click', () => open());
}
