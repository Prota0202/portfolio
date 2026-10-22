import * as THREE from 'three';

const W = 1024;
const H = 640;
const DISPLAY = '"Plus Jakarta Sans", sans-serif';
const MONO = '"Space Mono", monospace';

function makeCanvas() {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  return [c, c.getContext('2d')];
}

function toTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function rand(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

/* Dark typographic poster used by the curved carousel. */
export function posterTexture(p, i) {
  const [c, g] = makeCanvas();
  const r = rand(i * 999 + 7);

  g.fillStyle = '#070707';
  g.fillRect(0, 0, W, H);

  const glow = g.createRadialGradient(W * (0.3 + r() * 0.4), H * 0.55, 10, W * 0.5, H * 0.5, W * 0.7);
  glow.addColorStop(0, p.accent + '55');
  glow.addColorStop(1, 'transparent');
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  g.strokeStyle = 'rgba(255,255,255,0.05)';
  g.lineWidth = 1;
  for (let x = 0; x < W; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y < H; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }

  for (let k = 0; k < 140; k++) {
    g.strokeStyle = `rgba(255,255,255,${0.02 + r() * 0.06})`;
    g.beginPath();
    const y = r() * H;
    g.moveTo(0, y);
    g.bezierCurveTo(W * 0.3, y + (r() - 0.5) * 300, W * 0.6, y + (r() - 0.5) * 300, W, y + (r() - 0.5) * 120);
    g.stroke();
  }

  g.textBaseline = 'middle';
  g.textAlign = 'center';
  let size = 230;
  g.font = `800 ${size}px ${DISPLAY}`;
  while (g.measureText(p.name).width > W * 0.86) {
    size -= 8;
    g.font = `800 ${size}px ${DISPLAY}`;
  }
  g.globalCompositeOperation = 'lighter';
  g.fillStyle = 'rgba(255,40,80,0.75)';
  g.fillText(p.name, W / 2 - 7, H * 0.47);
  g.fillStyle = 'rgba(40,220,255,0.75)';
  g.fillText(p.name, W / 2 + 7, H * 0.47);
  g.globalCompositeOperation = 'source-over';
  g.shadowColor = 'rgba(255,255,255,0.6)';
  g.shadowBlur = 30;
  g.fillStyle = '#f4f4f4';
  g.fillText(p.name, W / 2, H * 0.47);
  g.shadowBlur = 0;

  g.fillStyle = '#070707';
  for (let k = 0; k < 6; k++) {
    g.fillRect(0, H * 0.3 + r() * H * 0.34, W, 2 + r() * 4);
  }

  g.textAlign = 'left';
  g.font = `700 20px ${MONO}`;
  g.fillStyle = '#fff';
  g.fillText(`0${i + 1}`, 40, 46);
  g.fillStyle = p.accent;
  g.fillText(p.kicker, 100, 46);
  g.textAlign = 'right';
  g.fillStyle = 'rgba(255,255,255,0.6)';
  g.fillText('● ● ●', W - 40, 46);

  g.textAlign = 'left';
  g.font = `600 24px ${DISPLAY}`;
  g.fillStyle = '#e8e8e8';
  g.fillText(p.sub, 40, H - 92);
  g.font = `400 17px ${MONO}`;
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.fillText(p.tags.join('  /  ').toUpperCase(), 40, H - 52);

  const bw = 168;
  g.fillStyle = p.accent;
  g.beginPath();
  g.roundRect(W - 40 - bw, H - 76, bw, 44, 22);
  g.fill();
  g.fillStyle = '#000';
  g.font = `700 16px ${MONO}`;
  g.textAlign = 'center';
  g.fillText(p.url ? 'VOIR LE REPO →' : 'SUR DEMANDE', W - 40 - bw / 2, H - 53);

  return toTexture(c);
}

/* Light "case file" sheet used by the dossiers ring. */
export function dossierTexture(d, i) {
  const [c, g] = makeCanvas();
  g.fillStyle = '#fafafa';
  g.fillRect(0, 0, W, H);

  g.fillStyle = '#efefef';
  g.fillRect(0, 0, W, 56);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((col, k) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(30 + k * 24, 28, 7, 0, Math.PI * 2);
    g.fill();
  });
  g.fillStyle = '#fff';
  g.beginPath();
  g.roundRect(W / 2 - 200, 14, 400, 28, 14);
  g.fill();
  g.fillStyle = '#999';
  g.font = `400 14px ${MONO}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(`dossier-0${i + 1}.pdf`, W / 2, 28);

  g.textAlign = 'left';
  g.fillStyle = '#111';
  g.font = `800 46px ${DISPLAY}`;
  g.fillText(d.name.toUpperCase(), 48, 118);
  g.font = `400 15px ${MONO}`;
  g.fillStyle = '#888';
  g.fillText(d.meta.slice(1).join('   ·   ').toUpperCase(), 48, 162);

  g.save();
  g.translate(48, 200);
  drawers[d.kind](g, W - 96, H - 250);
  g.restore();

  return toTexture(c);
}

const ink = '#111';
const grey = '#cfcfcf';

const drawers = {
  orders(g, w) {
    const rows = [
      ['#1042', 'Restaurant Bombay', 'LIVRÉE', '#111'],
      ['#1043', 'Café Marco', 'EN PRÉPA', '#777'],
      ['#1044', 'Brasserie du Parc', 'VALIDÉE', '#aaa'],
      ['#1045', 'Le Petit Sablon', 'EN ROUTE', '#444'],
      ['#1046', 'Chez Fatima', 'RETOUR', '#999'],
    ];
    g.font = `600 22px ${DISPLAY}`;
    rows.forEach((r, k) => {
      const y = k * 62;
      g.fillStyle = k % 2 ? '#fff' : '#f2f2f2';
      g.fillRect(0, y, w, 54);
      g.fillStyle = '#888';
      g.font = `400 18px ${MONO}`;
      g.fillText(r[0], 18, y + 28);
      g.fillStyle = ink;
      g.font = `600 22px ${DISPLAY}`;
      g.fillText(r[1], 110, y + 28);
      g.fillStyle = r[3];
      g.beginPath();
      g.roundRect(w - 330, y + 12, 140, 30, 15);
      g.fill();
      g.fillStyle = '#fff';
      g.font = `700 13px ${MONO}`;
      g.textAlign = 'center';
      g.fillText(r[2], w - 260, y + 28);
      g.textAlign = 'left';
      g.fillStyle = '#bbb';
      g.font = `400 16px ${MONO}`;
      g.fillText(`stock ✓ ${12 - k * 2}`, w - 150, y + 28);
    });
  },
  hand(g, w, h) {
    const pts = [[0, 0], [-60, -40], [-95, -90], [-115, -140], [-130, -180], [-35, -120], [-40, -190], [-42, -235], [-44, -270], [0, -125], [2, -200], [4, -250], [6, -290], [35, -118], [45, -185], [52, -230], [58, -265], [65, -100], [85, -150], [98, -185], [108, -215]];
    const bones = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]];
    g.save();
    g.translate(170, h - 20);
    g.strokeStyle = ink;
    g.lineWidth = 3;
    bones.forEach(([a, b]) => { g.beginPath(); g.moveTo(...pts[a]); g.lineTo(...pts[b]); g.stroke(); });
    g.fillStyle = '#fff';
    pts.forEach((p) => { g.beginPath(); g.arc(p[0], p[1], 7, 0, Math.PI * 2); g.fill(); g.stroke(); });
    g.restore();
    const bars = [['HOLD-OUT', 0.982], ['5 NOUVEAUX SIGNATAIRES', 0.84]];
    bars.forEach(([label, v], k) => {
      const x = 380, y = 40 + k * 120, bw = w - 400;
      g.fillStyle = '#888';
      g.font = `400 16px ${MONO}`;
      g.fillText(label, x, y);
      g.fillStyle = '#eee';
      g.fillRect(x, y + 18, bw, 40);
      g.fillStyle = ink;
      g.fillRect(x, y + 18, bw * v, 40);
      g.fillStyle = '#fff';
      g.font = `800 22px ${DISPLAY}`;
      g.fillText(`${(v * 100).toFixed(1).replace('.', ',')} %`, x + 14, y + 39);
    });
  },
  roc(g, w, h) {
    const s = h - 20, x0 = 30, y0 = h - 10;
    g.strokeStyle = grey;
    g.lineWidth = 2;
    g.strokeRect(x0, y0 - s, s, s);
    g.setLineDash([6, 6]);
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + s, y0 - s); g.stroke();
    g.setLineDash([]);
    const curve = (k, col, lw) => {
      g.strokeStyle = col;
      g.lineWidth = lw;
      g.beginPath();
      for (let t = 0; t <= 1.001; t += 0.02) {
        const y = 1 - Math.pow(1 - t, k);
        g.lineTo(x0 + t * s, y0 - y * s);
      }
      g.stroke();
    };
    curve(2.4, '#999', 3);
    curve(4.2, ink, 4);
    g.font = `400 16px ${MONO}`;
    [['LLM (Mistral)', ink], ['Baseline tabulaire', '#999']].forEach(([l, col], k) => {
      g.fillStyle = col;
      g.fillRect(s + 90, 50 + k * 50, 30, 6);
      g.fillStyle = '#333';
      g.fillText(l, s + 134, 54 + k * 50);
    });
    g.fillStyle = '#888';
    g.fillText('+ coût énergie / carbone suivi', s + 90, 190);
    g.fillText('jeu de test étiqueté à la main', s + 90, 222);
  },
  cluster(g, w, h) {
    const lb = [w / 2, 40];
    const nodes = [[w / 2 - 260, h - 70], [w / 2, h - 70], [w / 2 + 260, h - 70]];
    g.strokeStyle = ink;
    g.lineWidth = 2.5;
    nodes.forEach((n) => { g.beginPath(); g.moveTo(...lb); g.lineTo(...n); g.stroke(); });
    g.setLineDash([8, 8]);
    g.beginPath(); g.moveTo(nodes[0][0], nodes[0][1]); g.lineTo(nodes[2][0], nodes[2][1]); g.stroke();
    g.setLineDash([]);
    const box = (x, y, label, dark) => {
      g.fillStyle = dark ? ink : '#fff';
      g.beginPath(); g.roundRect(x - 100, y - 32, 200, 64, 12); g.fill(); g.stroke();
      g.fillStyle = dark ? '#fff' : ink;
      g.font = `700 16px ${MONO}`;
      g.textAlign = 'center';
      g.fillText(label, x, y + 2);
      g.textAlign = 'left';
    };
    box(lb[0], lb[1], 'LOAD BALANCER', true);
    nodes.forEach((n, k) => box(n[0], n[1], `NŒUD 0${k + 1} ${k === 1 ? '⟳' : '✓'}`, false));
    g.fillStyle = '#888';
    g.font = `400 15px ${MONO}`;
    g.fillText('réplication · failover · plan de reprise', w / 2 - 170, h - 6);
  },
  gantt(g, w) {
    const tasks = [['Cadrage', 0, 0.18], ['Planning', 0.12, 0.3], ['Conception', 0.25, 0.55], ['Réalisation', 0.45, 0.85], ['Revue', 0.8, 0.92], ['Livraison', 0.9, 1]];
    const x0 = 180, ww = w - x0;
    g.strokeStyle = '#eee';
    for (let k = 0; k <= 6; k++) { g.beginPath(); g.moveTo(x0 + (ww * k) / 6, 0); g.lineTo(x0 + (ww * k) / 6, 340); g.stroke(); }
    tasks.forEach(([n, a, b], k) => {
      const y = k * 56 + 6;
      g.fillStyle = '#555';
      g.font = `400 17px ${MONO}`;
      g.fillText(n, 0, y + 20);
      g.fillStyle = k === 5 ? ink : '#bdbdbd';
      g.beginPath(); g.roundRect(x0 + a * ww, y + 4, (b - a) * ww, 32, 8); g.fill();
    });
    g.fillStyle = ink;
    g.beginPath(); g.moveTo(x0 + ww - 4, 0); g.lineTo(x0 + ww + 10, -14); g.lineTo(x0 + ww - 18, -14); g.fill();
  },
  network(g, w, h) {
    const root = [w / 2, 36];
    const mids = [[w * 0.2, 170], [w * 0.5, 170], [w * 0.8, 170]];
    const labels = ['CISCO SW', 'SALLE SERVEUR', 'KNX / ETS'];
    const leaves = ['CAM 01', 'CAM 02', 'NAS', 'UPS', 'ÉCLAIRAGE', 'HVAC'];
    g.strokeStyle = ink;
    g.lineWidth = 2;
    mids.forEach((m, k) => {
      g.beginPath(); g.moveTo(...root); g.lineTo(...m); g.stroke();
      [-1, 1].forEach((s, j) => {
        const l = [m[0] + s * 80, h - 50];
        g.beginPath(); g.moveTo(...m); g.lineTo(...l); g.stroke();
        g.fillStyle = '#fff';
        g.beginPath(); g.roundRect(l[0] - 60, l[1] - 20, 120, 40, 8); g.fill(); g.stroke();
        g.fillStyle = '#333';
        g.font = `400 14px ${MONO}`;
        g.textAlign = 'center';
        g.fillText(leaves[k * 2 + j], l[0], l[1] + 1);
      });
      g.fillStyle = ink;
      g.beginPath(); g.roundRect(m[0] - 95, m[1] - 24, 190, 48, 10); g.fill();
      g.fillStyle = '#fff';
      g.font = `700 15px ${MONO}`;
      g.fillText(labels[k], m[0], m[1] + 1);
    });
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(root[0], root[1], 26, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = ink;
    g.fillText('DOC', root[0], root[1] + 1);
    g.textAlign = 'left';
  },
};
