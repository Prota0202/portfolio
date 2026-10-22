import * as THREE from 'three';
import { dossierTexture } from './textures.js';

const CARD_W = 2.1;
const CARD_H = 1.3125;
const RADIUS = 2.55;
const SPACING = 1.75;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

export function createRing(canvas, dossiers, textureUi, locale, onChange) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const shadowTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.35)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();

  const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
  const cards = dossiers.map((d, i) => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ map: dossierTexture(d, i, textureUi, locale), transparent: true, side: THREE.DoubleSide }),
    );
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(CARD_W * 1.5, CARD_H * 1.6),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    shadow.position.set(0.06, -0.12, -0.05);
    group.add(shadow, mesh);
    scene.add(group);
    return group;
  });

  let progress = 0;
  let smooth = 0;
  let visible = false;
  let active = -1;
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? 17 : 11;
    scene.position.y = w < 700 ? 1.1 : 0;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function setProgress(p) { progress = p; }
  function setVisible(v) { visible = v; }

  let time = 0;
  function render(dt = 1 / 60) {
    if (!visible) return;
    time += dt;
    smooth += (progress - smooth) * 0.09;

    // 0 → 0.22 : ring spins · 0.22 → 0.36 : morph into stack · 0.36 → 1 : scroll the stack
    const spin = smooth * 2.2 + time * 0.08;
    const morph = ease(clamp((smooth - 0.22) / 0.14));
    const stackPos = clamp((smooth - 0.36) / 0.6) * (cards.length - 1);

    cards.forEach((g, i) => {
      const a = (i / cards.length) * Math.PI * 2 + spin;
      const ringX = Math.cos(a) * RADIUS;
      const ringY = Math.sin(a) * RADIUS * 0.92;
      const ringRotZ = a - Math.PI / 2;

      const d = i - stackPos;
      const stackX = 0;
      const stackY = -d * SPACING;
      const stackZ = -Math.abs(d) * 0.9;

      const m = ease(clamp(morph * 1.25 - i * 0.04));
      g.position.set(lerp(ringX, stackX, m), lerp(ringY, stackY, m), lerp(0, stackZ, m));
      let rz = ringRotZ % (Math.PI * 2);
      if (rz > Math.PI) rz -= Math.PI * 2;
      g.rotation.set(lerp(0.55, -0.28 - d * 0.08, m), lerp(-0.35, 0, m), lerp(rz, 0, m));
      const s = lerp(0.82, 1.45 - Math.min(Math.abs(d), 1.5) * 0.25, m);
      g.scale.setScalar(s);
      g.children[1].material.opacity = lerp(1, clamp(1.25 - Math.abs(d) * 0.45), m);
    });

    const idx = morph > 0.6 ? Math.round(stackPos) : -1;
    if (idx !== active) {
      active = idx;
      onChange(active, morph);
    }

    scene.rotation.y += (mouseX * 0.12 - scene.rotation.y) * 0.05;
    scene.rotation.x += (mouseY * 0.08 - scene.rotation.x) * 0.05;
    renderer.render(scene, camera);
  }

  let dossierList = dossiers;
  let tex = textureUi;
  let lang = locale;

  function setLocale(nextDossiers, nextTex, nextLocale) {
    dossierList = nextDossiers;
    tex = nextTex;
    lang = nextLocale;
    cards.forEach((g, i) => {
      const mat = g.children[1].material;
      mat.map.dispose();
      mat.map = dossierTexture(dossierList[i], i, tex, lang);
      mat.needsUpdate = true;
    });
    if (active >= 0) onChange(active, 1);
  }

  return { setProgress, setVisible, render, setLocale };
}
