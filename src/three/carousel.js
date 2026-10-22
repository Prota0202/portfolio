import * as THREE from 'three';
import { posterTexture } from './textures.js';

const CARD_W = 3.2;
const CARD_H = 2;
const GAP = 0.32;
const STEP = CARD_W + GAP;

const vertex = /* glsl */ `
  uniform float uBend;
  uniform float uTwist;
  uniform float uVelocity;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    float x = world.x;
    float a = x * uTwist + uVelocity * 0.04 * x;
    float y = world.y;
    world.y = y * cos(a) + sin(x * 0.42) * 0.38;
    world.z += y * sin(a) + uBend * x * x;
    vDepth = world.z;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHover;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vec4 c = texture2D(uMap, vUv);
    float edge = smoothstep(0.0, 0.015, vUv.x) * smoothstep(1.0, 0.985, vUv.x);
    c.rgb *= mix(0.92, 1.0, edge);
    c.rgb += uHover * 0.06;
    gl_FragColor = c;
  }
`;

export function createCarousel(canvas, projects, textureUi, onChange) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.25, 10);

  const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 48, 24);
  const cards = projects.map((p, i) => {
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uMap: { value: posterTexture(p, i, textureUi) },
        uBend: { value: 0.045 },
        uTwist: { value: 0.07 },
        uVelocity: { value: 0 },
        uHover: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { index: i, project: p };
    scene.add(mesh);
    return mesh;
  });

  const total = cards.length * STEP;
  let scrollTarget = 0;
  let dragOffset = 0;
  let current = 0;
  let velocity = 0;
  let active = -1;
  let visible = false;

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 700 ? 55 : 35;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // drag
  let dragging = false;
  let startX = 0;
  let startOffset = 0;
  let moved = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = 0;
    startX = e.clientX;
    startOffset = dragOffset;
  });
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    dragOffset = startOffset - (dx / canvas.clientWidth) * 9;
  });
  window.addEventListener('pointerup', () => { dragging = false; });

  // hover + click
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;
  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(cards)[0];
    hovered = hit ? hit.object : null;
  });
  canvas.addEventListener('mouseleave', () => { hovered = null; });
  canvas.addEventListener('click', () => {
    if (moved > 6 || !hovered) return;
    const url = hovered.userData.project.url;
    if (url) window.open(url, '_blank', 'noopener');
  });

  function setProgress(p) {
    scrollTarget = p * (cards.length - 1) * STEP;
  }

  function setVisible(v) { visible = v; }

  function render() {
    if (!visible) return;
    const target = scrollTarget + dragOffset;
    const prev = current;
    current += (target - current) * 0.08;
    velocity += ((current - prev) * 60 - velocity) * 0.1;

    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((m, i) => {
      let x = i * STEP - current;
      x = ((((x + total / 2) % total) + total) % total) - total / 2;
      m.position.x = x;
      const u = m.material.uniforms;
      u.uVelocity.value = velocity;
      u.uHover.value += ((hovered === m ? 1 : 0) - u.uHover.value) * 0.15;
      if (Math.abs(x) < closestDist) { closestDist = Math.abs(x); closest = i; }
    });
    if (closest !== active) {
      active = closest;
      onChange(active);
    }
    canvas.style.cursor = hovered && hovered.userData.project.url ? 'pointer' : '';
    camera.position.x += (pointer.x * 0.25 - camera.position.x) * 0.05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function setLocale(nextProjects, nextTex) {
    cards.forEach((m, i) => {
      m.material.uniforms.uMap.value.dispose();
      m.material.uniforms.uMap.value = posterTexture(nextProjects[i], i, nextTex);
      m.userData.project = nextProjects[i];
    });
    const idx = active >= 0 ? active : 0;
    onChange(idx);
  }

  return { setProgress, setVisible, render, setLocale };
}
