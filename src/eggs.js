const BINGO = [
  'On se fait un point ?', 'Quick win', 'Je partage mon écran', 'Tu m’entends ?',
  'On prend ça offline', 'C’est dans le scope ?', 'Pour hier', 'Alignement',
  'On boucle par mail', 'Synergie', 'Next steps', 'ASAP',
  'Tu es sur mute', 'Low-hanging fruit', 'On a 5 min de retard', 'Deep dive',
];

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const LOGO_LINES = [
  'Clic n°3 : vous testez l’interface. Approuvé.',
  'Clic n°5 : vous êtes du genre recette exhaustive, non ?',
  'Clic n°8 : ticket créé — « le logo ne fait rien ». Statut : won’t fix.',
];

export function initEasterEggs(lenis) {
  const toastEl = document.getElementById('toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 3200);
  };

  console.log(
    '%cABDELBADI•%c\nVous inspectez le code ? Bon réflexe d’analyste.\nLe vrai cahier des charges : Abdelbadi1@protonmail.com\nIndice : ↑ ↑ ↓ ↓ ← → ← → B A',
    'font: 800 28px "Plus Jakarta Sans", sans-serif; color:#111; background:#e9e9e9; padding:6px 10px; border-radius:6px',
    'font: 12px "Space Mono", monospace; color:#666',
  );

  const baseTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'Revenez, la réunion n’est pas finie.' : baseTitle;
  });

  let clicks = 0;
  document.getElementById('logo').addEventListener('click', () => {
    clicks++;
    const msg = { 3: LOGO_LINES[0], 5: LOGO_LINES[1], 8: LOGO_LINES[2] }[clicks];
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
    [...BINGO].sort(() => Math.random() - 0.5).forEach((w) => {
      const b = document.createElement('button');
      b.textContent = w;
      b.addEventListener('click', () => {
        b.classList.toggle('is-on');
        if (grid.querySelectorAll('.is-on').length === 4) toast('BINGO. Je propose qu’on fixe une action et un responsable.');
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
