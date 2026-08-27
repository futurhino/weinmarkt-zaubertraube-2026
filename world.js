/* Kristall-Weinberg — 3D-Welt der Zaubertraube-Rallye (Three.js) */
(() => {
"use strict";

/* =========================================================================
   STATIONEN-KONFIGURATION
   Hier vor Ort in Schorndorf anpassen (clue = echter Standort am
   Marktplatz, codeword = Wort auf dem Schild dort). challenge bestimmt
   die virtuelle Mini-Herausforderung, bevor der Hinweis erscheint.
   ========================================================================= */
const STATIONS = [
  {
    id:'kicher', name:'Kicherbeere', c1:'#ffb3e6', c2:'#f810b1',
    clue:'Kicherbeere kichert immer dort, wo es nach frisch Gebackenem duftet. Sucht die Stelle, an der der Duft am Marktplatz am stärksten ist – 《Ort: z. B. beim Flammkuchen- oder Waffelstand》.',
    codeword:'KICHER',
    profi:'Profi-Frage: Trauben brauchen viel Sonne, um süß zu werden. Was, glaubt ihr, passiert mit dem Zucker in der Traube, wenn daraus Wein wird?',
    profiFact:'Beim Gären verwandeln winzige Hefepilze den Traubenzucker in Alkohol – ganz ohne Strom oder Computer, ein uralter Bio-Trick.',
    flavor:'Kicherbeere kullert lachend in euren Korb und zieht als funkelndes Element in eure Welt ein.',
    challenge:{ type:'simon', seq:3, label:'Die Kicher-Kristalle', hint:'Merkt euch das Leuchtmuster und tippt es in der gleichen Reihenfolge nach.' }
  },
  {
    id:'glitzer', name:'Glitzerkorn', c1:'#ffe066', c2:'#f810b1',
    clue:'Glitzerkorn liebt alles, was funkelt. Am Marktplatz glitzert nichts so schön wie das Wasser – 《Ort: z. B. am Marktbrunnen》.',
    codeword:'GLITZER',
    profi:'Profi-Frage: Manche moderne Weinberge nutzen kleine Sensoren, um zu messen, wie feucht der Boden ist. Warum könnte das hilfreich sein?',
    profiFact:'So wird nur genau so viel gegossen, wie die Reben wirklich brauchen – das spart Wasser und schont den Boden.',
    flavor:'Glitzerkorn hinterlässt eine funkelnde Spur bis in euren Weinberg-Altar.',
    challenge:{ type:'collect', count:5, elevated:0, label:'Glitzer-Splitter einsammeln', hint:'Lauft mit dem Steuerkreuz zu allen funkelnden Splittern.' }
  },
  {
    id:'nebel', name:'Nebelknospe', c1:'#c9c3ff', c2:'#6f5bd6',
    clue:'Nebelknospe versteckt sich gern im Schatten der ältesten Mauern. Geht dorthin, wo der Marktplatz am ehrwürdigsten wirkt – 《Ort: z. B. an der Stadtkirche》.',
    codeword:'NEBEL',
    profi:'Profi-Frage: Schorndorf feiert seine Weinwochen schon sehr lange. Was, glaubt ihr, hat sich beim Weinmachen in den letzten 100 Jahren am meisten verändert?',
    profiFact:'Früher wurde fast alles von Hand geerntet und geprüft – heute helfen Maschinen und sogar Kameras dabei, reife Trauben zu erkennen.',
    flavor:'Nebelknospe löst sich langsam aus dem Schatten und schwebt hinüber in eure Welt.',
    challenge:{ type:'simon', seq:4, label:'Die Nebel-Glocken', hint:'Merkt euch das Leuchtmuster und tippt es in der gleichen Reihenfolge nach.' }
  },
  {
    id:'brumm', name:'Brummzweig', c1:'#ffcf8a', c2:'#e0672a',
    clue:'Brummzweig summt am liebsten dort, wo Musik oder viele Stimmen zu hören sind. Sucht die Bühne oder den lautesten Platz auf dem Fest – 《Ort: z. B. an der Bühne/Musikfläche》.',
    codeword:'BRUMM',
    profi:'Profi-Frage: Warum feiern Menschen ein Weinfest überhaupt gemeinsam, statt jeder für sich zuhause?',
    profiFact:'Ernte und Wein sind seit Jahrhunderten ein Grund für Gemeinschaft – Feste wie dieses verbinden Nachbarschaft, Handwerk und Genuss.',
    flavor:'Brummzweig brummt aufgeregt, als es merkt, dass es entdeckt wurde – dann fliegt es in euren Altar.',
    challenge:{ type:'collect', count:6, elevated:2, label:'Brummende Kristalltrauben', hint:'Manche Trauben schweben höher – hüpft mit dem Sprung-Knopf hinauf!' }
  },
  {
    id:'mond', name:'Mondperle', c1:'#c7e8ff', c2:'#3a7bd5',
    clue:'Mondperle mag es hoch hinaus. Schaut an eurem eigenen Stand nach oben, dorthin, wo unser Rhino-Maskottchen zu sehen ist – 《Ort: euer Futurhinos-Stand》.',
    codeword:'MOND',
    profi:'Profi-Frage: Unser Rhino-Maskottchen steht für Futurhinos Kids und das Thema Künstliche Intelligenz. Was hat ein Rhino wohl mit KI zu tun?',
    profiFact:'Nichts direkt – aber genau wie ein Rhino auf den ersten Blick unterschätzt wird, steckt hinter KI oft mehr Verständnis, als man beim ersten Mal denkt.',
    flavor:'Mondperle schwebt sanft herab, direkt in euren Altar.',
    challenge:{ type:'climb', steps:5, label:'Den Mondsteig erklimmen', hint:'Springt mit dem Sprung-Knopf von Stein zu Stein nach oben.' }
  },
  {
    id:'kern', name:'Kernwächter', c1:'#f810b1', c2:'#4b0f45',
    clue:'Der Kernwächter ist das Herzstück der Zaubertraube – er versteckt sich nur an eurem eigenen Stand, wo alles begonnen hat. Kommt zurück zu Futurhinos for Kids!',
    codeword:'KERN',
    profi:'Letzte Profi-Frage: Was war für euch das kniffligste Rätsel auf dieser Jagd – und warum?',
    profiFact:'Ihr habt es geschafft, alle fünf Splitter wiederzufinden. Der Kernwächter braucht jetzt nur noch euch, um wieder ganz zu werden.',
    flavor:'Der Kernwächter leuchtet golden auf – und mit einem letzten Fund ist die Zaubertraube endlich wieder vollständig!',
    challenge:{ type:'simon', seq:5, label:'Die Kern-Runen des Traubenmeisters', hint:'Die letzte Prüfung: merkt euch das längste Leuchtmuster!' }
  }
];
const RING_ANGLES = [-100, -35, 35, 100, 165, -165]; // Grad, Ring um den Altar

const STORAGE_KEY = 'ftk_zaubertraube_2026_3d';
let state = loadState();
function loadState(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); if(raw) return JSON.parse(raw); }catch(e){}
  return { team:'', caught:[] };
}
function saveState(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){} }
function getCurrentIndex(){
  for(let i=0;i<STATIONS.length;i++){ if(!state.caught.includes(STATIONS[i].id)) return i; }
  return STATIONS.length;
}
window.FTK = { STATIONS, state, saveState, getCurrentIndex, STORAGE_KEY };

/* =========================================================================
   THREE.JS GRUNDGERÜST
   ========================================================================= */
const canvas = document.getElementById('c3d');
let renderer, scene, camera;
let player, playerVel = new THREE.Vector3();
let grounded = true;
const HALF = 34;
const clock = new THREE.Clock();
let running = false;

function toonGradient(){
  const c = document.createElement('canvas'); c.width = 4; c.height = 1;
  const g = c.getContext('2d');
  g.fillStyle = '#555'; g.fillRect(0,0,1,1);
  g.fillStyle = '#999'; g.fillRect(1,0,1,1);
  g.fillStyle = '#ccc'; g.fillRect(2,0,1,1);
  g.fillStyle = '#fff'; g.fillRect(3,0,1,1);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.NearestFilter; tex.magFilter = THREE.NearestFilter;
  return tex;
}
let gradMap;
function toonMat(color, opts){
  opts = opts || {};
  const m = new THREE.MeshToonMaterial({ color, gradientMap: gradMap, emissive: opts.emissive || 0x000000, emissiveIntensity: opts.emissiveIntensity || 0 });
  return m;
}

function skyTexture(){
  const c = document.createElement('canvas'); c.width = 2; c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0,0,0,256);
  grd.addColorStop(0, '#a998f0');
  grd.addColorStop(0.45, '#e6a8dd');
  grd.addColorStop(1, '#ffd9c2');
  g.fillStyle = grd; g.fillRect(0,0,2,256);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

function initScene(){
  renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);

  scene = new THREE.Scene();
  gradMap = toonGradient();

  const skyGeo = new THREE.SphereGeometry(180, 16, 16);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture(), side: THREE.BackSide, fog:false });
  scene.add(new THREE.Mesh(skyGeo, skyMat));
  scene.fog = new THREE.Fog(0xd9b8e8, 40, 110);

  camera = new THREE.PerspectiveCamera(58, window.innerWidth/window.innerHeight, 0.1, 250);

  const sun = new THREE.DirectionalLight(0xfff2e0, 1.15);
  sun.position.set(18, 26, 12);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  scene.add(new THREE.HemisphereLight(0xf3d6ff, 0x6a4a63, 0.22));

  buildGround();
  buildDecor();
  buildAltar();
  buildStationMarkers();
  buildPlayer();

  window.addEventListener('resize', onResize);
  onResize();
}

function onResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function buildGround(){
  const geo = new THREE.CircleGeometry(HALF+6, 40);
  const mat = toonMat(0x7fcf6a);
  const ground = new THREE.Mesh(geo, mat);
  ground.rotation.x = -Math.PI/2;
  scene.add(ground);

  // Sanfte Bodenwellen (rein dekorativ)
  for(let i=0;i<10;i++){
    const r = 1.6 + Math.random()*2.2;
    const bump = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8, 0, Math.PI*2, 0, Math.PI/2), toonMat(0x6bbf59));
    const a = Math.random()*Math.PI*2, d = 10+Math.random()*(HALF-8);
    bump.position.set(Math.cos(a)*d, -r*0.75, Math.sin(a)*d);
    scene.add(bump);
  }
}

function trellisRow(x0,z0,x1,z1){
  const grp = new THREE.Group();
  const postMat = toonMat(0x8a5a3c);
  const n = Math.max(2, Math.round(Math.hypot(x1-x0,z1-z0)/4));
  for(let i=0;i<=n;i++){
    const t = i/n;
    const px_ = x0 + (x1-x0)*t, pz = z0 + (z1-z0)*t;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,2.2,6), postMat);
    post.position.set(px_, 1.1, pz);
    grp.add(post);
    const berry = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32,0), toonMat(0xff8fd6, {emissive:0xff2fb0, emissiveIntensity:0.25}));
    berry.position.set(px_, 1.75, pz);
    grp.add(berry);
  }
  const dir = new THREE.Vector3(x1-x0, 0, z1-z0);
  const wireGeo = new THREE.CylinderGeometry(0.04,0.04, dir.length(), 5);
  const wire = new THREE.Mesh(wireGeo, postMat);
  wire.position.set((x0+x1)/2, 1.9, (z0+z1)/2);
  wire.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir.normalize());
  grp.add(wire);
  scene.add(grp);
}

function buildDecor(){
  // Reben-Reihen im Hintergrund
  for(let i=0;i<4;i++){
    const r = 20 + i*5;
    trellisRow(-r, -r+2, r, -r+2);
    trellisRow(-r, r-2, r, r-2);
  }
  // Kristallformationen verstreut
  const crystalColors = [0xff8fd6, 0x9d8cff, 0x8fd6ff, 0xffd08f];
  for(let i=0;i<16;i++){
    const a = Math.random()*Math.PI*2, d = 6+Math.random()*(HALF-8);
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x,z) < 9) continue;
    const h = 1+Math.random()*2.4;
    const col = crystalColors[i % crystalColors.length];
    const cy = new THREE.Mesh(new THREE.ConeGeometry(0.5+Math.random()*0.4, h, 5), toonMat(col, {emissive:col, emissiveIntensity:0.35}));
    cy.position.set(x, h/2, z);
    cy.rotation.y = Math.random()*Math.PI;
    scene.add(cy);
  }
}

/* Bei jedem gefundenen Traubenwesen wächst irgendwo in der Welt ein neuer
   Rebstock - die Welt wird spürbar reicher und schöner, je weiter man kommt. */
function spawnGrapeCluster(){
  const a = Math.random()*Math.PI*2;
  const r = 7 + Math.random()*(HALF-11);
  const grp = new THREE.Group();
  grp.position.set(Math.cos(a)*r, 0, Math.sin(a)*r);
  grp.rotation.y = Math.random()*Math.PI*2;

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.11,1.7,6), toonMat(0x8a5a3c));
  post.position.y = 0.85;
  grp.add(post);

  const berryColors = [0xff8fd6, 0xf810b1, 0xffe066, 0xc9a4ff];
  const col = berryColors[Math.floor(Math.random()*berryColors.length)];
  for(let i=0;i<5;i++){
    const berry = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22+Math.random()*0.1,0), toonMat(col, {emissive:col, emissiveIntensity:0.3}));
    berry.position.set((Math.random()-0.5)*0.6, 1.05+Math.random()*0.65, (Math.random()-0.5)*0.4);
    grp.add(berry);
  }
  const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.42,0.16,5), toonMat(0x6bbf59));
  leaf.position.y = 1.78;
  leaf.rotation.x = Math.PI;
  grp.add(leaf);

  grp.scale.setScalar(0.01);
  scene.add(grp);
  growingClusters.push({ grp, t:0 });
}
const growingClusters = [];
function updateGrowingClusters(dt){
  for(let i=growingClusters.length-1;i>=0;i--){
    const c = growingClusters[i];
    c.t += dt*1.8;
    c.grp.scale.setScalar(Math.min(1, c.t));
    if(c.t >= 1) growingClusters.splice(i,1);
  }
}

let altarOrb, altarGlow;
function buildAltar(){
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.6,3.2,1.4,8), toonMat(0x9a9a9a));
  base.position.set(0,0.7,0);
  scene.add(base);
  const base2 = new THREE.Mesh(new THREE.CylinderGeometry(1.7,2.2,1,8), toonMat(0x8c8c8c));
  base2.position.set(0,1.9,0);
  scene.add(base2);
  altarOrb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,1), toonMat(0xcfc7bd, {emissive:0xffffff, emissiveIntensity:0.1}));
  altarOrb.position.set(0,3.4,0);
  scene.add(altarOrb);
  altarGlow = new THREE.PointLight(0xff58cf, 0, 14);
  altarGlow.position.set(0,3.4,0);
  scene.add(altarGlow);
}
function updateAltar(){
  const frac = state.caught.length / STATIONS.length;
  const s = 0.7 + frac*0.9;
  altarOrb.scale.setScalar(s);
  const t = clock.getElapsedTime();
  altarOrb.rotation.y = t*0.4;
  altarOrb.position.y = 3.4 + Math.sin(t*1.4)*0.08*(0.3+frac);
  if(frac>0){
    altarOrb.material.color.set(0xf6c9ec);
    altarOrb.material.emissive.set(0xf810b1);
    altarOrb.material.emissiveIntensity = 0.35 + frac*0.5;
    altarGlow.intensity = 1.2 + frac*2.2;
  }
}

const stationGroups = [];
function stationPos(i){
  const ang = RING_ANGLES[i]*Math.PI/180;
  const r = 21;
  return new THREE.Vector3(Math.cos(ang)*r, 0, Math.sin(ang)*r);
}
function markerSpriteTexture(){
  const c = document.createElement('canvas'); c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(255,255,255,0.95)';
  g.beginPath(); g.arc(64,58,40,0,Math.PI*2); g.fill();
  g.fillStyle = '#f810b1';
  g.font = '700 60px Futura, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('!', 64, 62);
  return new THREE.CanvasTexture(c);
}
let markerTex;

function buildStationMarkers(){
  markerTex = markerSpriteTexture();
  STATIONS.forEach((st,i)=>{
    const pos = stationPos(i);
    const grp = new THREE.Group();
    grp.position.copy(pos);
    grp.visible = false;

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.3,0.6,7), toonMat(0x7c4e33));
    base.position.y = 0.3;
    grp.add(base);

    const col1 = new THREE.Color(st.c1), col2 = new THREE.Color(st.c2);
    const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.65,0), toonMat(col2, {emissive:col1, emissiveIntensity:0.4}));
    gem.position.y = 1.35;
    grp.add(gem);

    const light = new THREE.PointLight(col1.getHex(), 1.4, 8);
    light.position.y = 1.6;
    grp.add(light);

    const marker = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, depthTest:false }));
    marker.scale.set(1.1, 1.1, 1);
    marker.position.y = 2.9;
    marker.renderOrder = 10;
    grp.add(marker);

    // Deko der Herausforderungs-Arena um die Station
    buildArenaDecor(grp, st);

    scene.add(grp);
    stationGroups.push({ grp, gem, light, base, marker, st, caught:false });
  });
}

function buildArenaDecor(grp, st){
  if(st.challenge.type === 'climb'){
    grp.userData.climbStones = [];
    for(let i=0;i<st.challenge.steps;i++){
      const stone = new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,0.5,8), toonMat(0xc7e8ff, {emissive:0x3a7bd5, emissiveIntensity:0.15}));
      const a = (i/(st.challenge.steps-1) - 0.5) * 1.1;
      stone.position.set(Math.sin(a)*2.6, 0.4 + i*1.15, 3.5 + Math.cos(a)*2.6 - 2.6);
      grp.add(stone);
      grp.userData.climbStones.push(stone);
    }
  }else if(st.challenge.type === 'collect' && st.challenge.elevated>0){
    grp.userData.pedestals = [];
    for(let i=0;i<2;i++){
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.6,1.4,6), toonMat(0xa89f8f));
      ped.position.set(-2.4+i*4.8, 0.7, 3.2);
      grp.add(ped);
      grp.userData.pedestals.push(ped);
    }
  }
}

function revealNext(){
  const idx = getCurrentIndex();
  stationGroups.forEach((s,i)=>{ if(i<=idx && !s.grp.visible){ s.grp.visible = true; s.grp.scale.setScalar(0.01); s._pop = 1; } });
}
function markCaughtVisual(idx){
  const s = stationGroups[idx];
  if(s.caught) return;
  s.caught = true;
  s.marker.visible = false;
  s.gem.material.color.set(s.st.c2);
  s.gem.material.emissive.set(s.st.c1);
  s.gem.material.emissiveIntensity = 0.6;
  const eyeMat = new THREE.MeshBasicMaterial({ color:0xffffff });
  [-1,1].forEach(sgn=>{
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.09,6,6), eyeMat);
    eye.position.set(sgn*0.22, 1.55, 0.5);
    s.grp.add(eye);
  });
}

function buildPlayer(){
  const grp = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.6,14,12), toonMat(0xf810b1));
  body.scale.set(1,1.05,1);
  grp.add(body);
  const eyeMat = new THREE.MeshBasicMaterial({ color:0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color:0x1a1a1a });
  [-1,1].forEach(sgn=>{
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.14,8,8), eyeMat);
    eye.position.set(sgn*0.24, 0.15, 0.5);
    grp.add(eye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.07,8,8), pupilMat);
    pupil.position.set(sgn*0.24, 0.15, 0.62);
    grp.add(pupil);
  });
  grp.position.set(0, 0.6, 14);
  scene.add(grp);
  player = grp;
  player.userData.yaw = Math.PI;
}

/* =========================================================================
   STEUERUNG (Touch-Joystick + Sprung)
   ========================================================================= */
const joyBase = document.getElementById('joyBase');
const joyNub = document.getElementById('joyNub');
const jumpBtn = document.getElementById('jumpBtn');
let joyVec = {x:0,y:0};
let joyActive = false, joyId = null;
const JOY_R = 46;

function joyStart(e){
  joyActive = true; joyId = e.pointerId;
  joyBase.setPointerCapture(e.pointerId);
  joyMove(e);
}
function joyMove(e){
  if(!joyActive || e.pointerId !== joyId) return;
  const rect = joyBase.getBoundingClientRect();
  const cx = rect.left+rect.width/2, cy = rect.top+rect.height/2;
  let dx = e.clientX-cx, dy = e.clientY-cy;
  const d = Math.hypot(dx,dy);
  if(d > JOY_R){ dx = dx/d*JOY_R; dy = dy/d*JOY_R; }
  joyNub.style.transform = `translate(${dx}px, ${dy}px)`;
  joyVec.x = dx/JOY_R; joyVec.y = dy/JOY_R;
}
function joyEnd(e){
  if(e.pointerId !== joyId) return;
  joyActive = false; joyId = null;
  joyNub.style.transform = 'translate(0,0)';
  joyVec.x = 0; joyVec.y = 0;
}
joyBase.addEventListener('pointerdown', joyStart);
joyBase.addEventListener('pointermove', joyMove);
joyBase.addEventListener('pointerup', joyEnd);
joyBase.addEventListener('pointercancel', joyEnd);

let jumpRequested = false;
jumpBtn.addEventListener('pointerdown', e => { e.preventDefault(); jumpRequested = true; });

/* --- Pfeiltasten-Kreuz (Alternative zum Joystick) --- */
const dpad = document.getElementById('dpad');
const dpadState = {up:false, down:false, left:false, right:false};
function recomputeDpadVec(){
  let x=0, y=0;
  if(dpadState.left) x -= 1;
  if(dpadState.right) x += 1;
  if(dpadState.up) y -= 1;
  if(dpadState.down) y += 1;
  const len = Math.hypot(x,y);
  if(len > 0){ x/=len; y/=len; }
  joyVec.x = x; joyVec.y = y;
}
['up','down','left','right'].forEach(dir=>{
  const btn = document.getElementById('dpad-'+dir);
  const setDir = (v)=>{ dpadState[dir] = v; btn.classList.toggle('active', v); recomputeDpadVec(); };
  btn.addEventListener('pointerdown', e => { e.preventDefault(); btn.setPointerCapture(e.pointerId); setDir(true); });
  btn.addEventListener('pointerup', () => setDir(false));
  btn.addEventListener('pointercancel', () => setDir(false));
  btn.addEventListener('pointerleave', () => setDir(false));
});

/* --- Umschalter Joystick <-> Pfeiltasten --- */
const CONTROL_KEY = 'ftk_control_mode';
let controlMode = 'dpad';
try{ controlMode = localStorage.getItem(CONTROL_KEY) || 'dpad'; }catch(e){}
const controlToggle = document.getElementById('controlToggle');
function applyControlMode(){
  joyBase.style.display = controlMode === 'joystick' ? 'block' : 'none';
  dpad.style.display = controlMode === 'dpad' ? 'grid' : 'none';
  joyVec.x = 0; joyVec.y = 0;
  Object.keys(dpadState).forEach(k => dpadState[k] = false);
  if(controlToggle) controlToggle.textContent = controlMode === 'dpad'
    ? '🕹️ Zu Steuerkreuz wechseln'
    : '⬅️➡️ Zu Pfeiltasten wechseln';
}
if(controlToggle){
  controlToggle.addEventListener('click', ()=>{
    controlMode = controlMode === 'dpad' ? 'joystick' : 'dpad';
    try{ localStorage.setItem(CONTROL_KEY, controlMode); }catch(e){}
    applyControlMode();
  });
}
applyControlMode();

/* =========================================================================
   SPIEL-MODUS: HUB vs. HERAUSFORDERUNG
   ========================================================================= */
let mode = 'hub'; // 'hub' | 'challenge'
let challengeCtx = null;
let frameCallbacks = [];

function playerGroundY(){
  if(mode === 'challenge' && challengeCtx && challengeCtx.groundFn){
    return challengeCtx.groundFn(player.position.x, player.position.z);
  }
  return 0;
}

function updatePlayer(dt){
  // Direkte Richtungssteuerung: hoch/runter/links/rechts bewegen die Figur
  // exakt in diese Bildschirmrichtung. Die Kamera hat einen festen Blickwinkel
  // (siehe updateCamera) und dreht sich nie mit - dadurch bleiben die Pfeile
  // immer gleich, egal wohin die Figur gerade schaut.
  const speed = 8.5;
  const moveVec = new THREE.Vector3(joyVec.x, 0, joyVec.y);
  if(moveVec.lengthSq() > 0.0004){
    if(moveVec.length() > 1) moveVec.normalize();
    player.position.addScaledVector(moveVec, speed*dt);
    const targetYaw = Math.atan2(moveVec.x, moveVec.z);
    let dy = targetYaw - player.userData.yaw;
    while(dy > Math.PI) dy -= Math.PI*2;
    while(dy < -Math.PI) dy += Math.PI*2;
    player.userData.yaw += dy*Math.min(1, dt*14);
    player.rotation.y = player.userData.yaw;
    player.userData.bob = (player.userData.bob||0) + dt*10;
  }
  player.position.x = Math.max(-HALF, Math.min(HALF, player.position.x));
  player.position.z = Math.max(-HALF, Math.min(HALF, player.position.z));
  const ALTAR_R = 3.6;
  const distXZ = Math.hypot(player.position.x, player.position.z);
  if(distXZ < ALTAR_R){
    const k = ALTAR_R / (distXZ || 0.001);
    player.position.x *= k; player.position.z *= k;
  }

  if(jumpRequested){
    if(grounded){ playerVel.y = 7.2; grounded = false; }
    jumpRequested = false;
  }
  playerVel.y -= 18*dt;
  player.position.y += playerVel.y*dt;
  const gy = playerGroundY() + 0.6;
  if(player.position.y <= gy){
    player.position.y = gy; playerVel.y = 0; grounded = true;
  }
  const bobY = (!grounded) ? 0 : Math.abs(Math.sin(player.userData.bob||0))*0.08;
  player.children[0] && (player.children[0].position.y = bobY);

  if(mode === 'challenge' && challengeCtx && challengeCtx.fallY !== undefined && player.position.y < challengeCtx.fallY){
    challengeCtx.onFall && challengeCtx.onFall();
  }
}

function updateCamera(dt){
  const backDist = 9, height = 5.2;
  const desired = new THREE.Vector3(
    player.position.x,
    player.position.y + height,
    player.position.z + backDist
  );
  camera.position.lerp(desired, Math.min(1, dt*4));
  const lookAt = new THREE.Vector3(player.position.x, player.position.y+1, player.position.z);
  camera._lookAt = camera._lookAt || lookAt.clone();
  camera._lookAt.lerp(lookAt, Math.min(1, dt*6));
  camera.lookAt(camera._lookAt);
}

/* =========================================================================
   STATIONS-INTERAKTION (Annäherung im Hub)
   ========================================================================= */
const roamHint = document.getElementById('roamHint');
const ARRIVE_RANGE = 5.5;

function updateProximity(){
  // Marker-Sprite (schwebendes "!") nur über der aktuell aktiven Station zeigen und sanft schweben lassen
  const t = performance.now()/1000;
  const activeIdx = getCurrentIndex();
  stationGroups.forEach((s,i)=>{
    if(!s.marker) return;
    s.marker.visible = (i === activeIdx && s.grp.visible && !s.caught);
    if(s.marker.visible) s.marker.position.y = 2.9 + Math.sin(t*2.4)*0.15;
  });

  if(mode !== 'hub'){ roamHint.style.display = 'none'; return; }
  if(activeIdx >= STATIONS.length){ roamHint.style.display = 'none'; return; }
  const s = stationGroups[activeIdx];
  if(!s.grp.visible || s.caught || s.triggered){ roamHint.style.display = 'none'; return; }
  const d = player.position.distanceTo(s.grp.position);
  if(d < ARRIVE_RANGE){
    s.triggered = true;
    roamHint.style.display = 'none';
    window.FTK_startChallenge(activeIdx);
  }else{
    roamHint.style.display = 'block';
  }
}

/* Popup-Animation für neu erschienene Stationen */
function updateReveals(dt){
  stationGroups.forEach(s=>{
    if(s._pop !== undefined){
      s._pop -= dt*2.4;
      const t = Math.max(0, Math.min(1, 1-s._pop));
      const bounce = t<1 ? (1 - Math.pow(1-t,3)) * (1 + Math.sin(t*10)*0.06*(1-t)) : 1;
      s.grp.scale.setScalar(Math.min(1, bounce));
      if(s._pop <= 0) delete s._pop;
    }
  });
}

/* =========================================================================
   MAIN LOOP
   ========================================================================= */
function tick(){
  requestAnimationFrame(tick);
  if(!running) return;
  const dt = Math.min(0.05, clock.getDelta());
  updatePlayer(dt);
  updateCamera(dt);
  updateAltar();
  updateProximity();
  updateReveals(dt);
  updateGrowingClusters(dt);
  if(mode === 'challenge' && challengeCtx && challengeCtx.tick) challengeCtx.tick(dt);
  frameCallbacks.forEach(fn => fn(dt));
  renderer.render(scene, camera);
}

function start(){
  initScene();
  revealNext();
  running = true;
  tick();
}
window.FTK_world = {
  start,
  get scene(){ return scene; },
  get toonMat(){ return toonMat; },
  get player(){ return player; },
  get stationGroups(){ return stationGroups; },
  get HALF(){ return HALF; },
  setMode(m, ctx){ mode = m; challengeCtx = ctx || null; },
  revealNext, markCaughtVisual,
  growWorld(n){ for(let i=0;i<n;i++) spawnGrapeCluster(); },
  onFrame(fn){ frameCallbacks.push(fn); },
  offFrame(fn){ frameCallbacks = frameCallbacks.filter(f => f !== fn); },
  stationWorldPos(i){ const v = new THREE.Vector3(); stationGroups[i].grp.getWorldPosition(v); return v; },
};
})();
