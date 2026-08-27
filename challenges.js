/* Herausforderungen (Simon-Merk-Rätsel, Sammeln, Klettern) + Fundort-Panel */
(() => {
"use strict";
const { STATIONS, state, saveState, getCurrentIndex } = window.FTK;

window.FTK_startChallenge = function(idx){
  const st = STATIONS[idx];
  document.getElementById('challengeHint').textContent = st.challenge.hint;
  document.getElementById('challengeHint').style.display = 'block';
  if(st.challenge.type === 'simon') startSimon(idx);
  else if(st.challenge.type === 'collect') startCollect(idx);
  else if(st.challenge.type === 'climb') startClimb(idx);
};

function onChallengeSuccess(idx){
  document.getElementById('challengeHint').style.display = 'none';
  window.FTK_world.setMode('hub');
  setTimeout(()=> openCluePanel(idx), 300);
}

/* ---------------- SIMON: Merk-Rätsel ---------------- */
const SIMON_COLORS = ['#ff7fc6', '#ffd166', '#8ecbff', '#b699ff'];
function startSimon(idx){
  const st = STATIONS[idx];
  const overlay = document.getElementById('simonOverlay');
  overlay.classList.add('show');
  document.getElementById('simonTitle').textContent = st.challenge.label;
  const pads = Array.from(document.querySelectorAll('.simon-pad'));
  pads.forEach((p,i)=>{ p.style.background = SIMON_COLORS[i]; p.onclick = null; });
  const status = document.getElementById('simonStatus');

  const seq = [];
  for(let i=0;i<st.challenge.seq;i++) seq.push(Math.floor(Math.random()*4));
  let inputIdx = 0;
  let locked = true;

  function flash(i, dur){
    return new Promise(res=>{
      const pad = pads[i];
      pad.classList.add('lit');
      setTimeout(()=>{ pad.classList.remove('lit'); setTimeout(res, 160); }, dur);
    });
  }
  async function playSequence(){
    locked = true;
    status.textContent = 'Schaut genau hin...';
    await new Promise(r=>setTimeout(r, 500));
    for(const i of seq){ await flash(i, 620); }
    status.textContent = 'Jetzt seid ihr dran!';
    inputIdx = 0;
    locked = false;
  }
  pads.forEach((pad, i)=>{
    pad.onclick = ()=>{
      if(locked) return;
      pad.classList.add('lit'); setTimeout(()=>pad.classList.remove('lit'), 220);
      if(i === seq[inputIdx]){
        inputIdx++;
        if(inputIdx >= seq.length){
          status.textContent = 'Geschafft! ✨';
          locked = true;
          if(navigator.vibrate) navigator.vibrate([30,40,60]);
          setTimeout(()=>{
            overlay.classList.remove('show');
            onChallengeSuccess(idx);
          }, 700);
        }
      }else{
        status.textContent = 'Fast! Noch mal genau hinschauen...';
        if(navigator.vibrate) navigator.vibrate(80);
        locked = true;
        setTimeout(playSequence, 700);
      }
    };
  });
  playSequence();
}

/* ---------------- SAMMELN ---------------- */
function startCollect(idx){
  const st = STATIONS[idx];
  const w = window.FTK_world;
  const grp = w.stationGroups[idx].grp;
  const pickups = [];
  const total = st.challenge.count;
  let collected = 0;

  const hud = document.getElementById('challengeCount');
  hud.style.display = 'block';
  hud.textContent = '0 / ' + total;

  const groundSpots = [];
  for(let i=0;i<total - st.challenge.elevated;i++){
    const a = (Math.random()-0.5)*1.6;
    groundSpots.push(new THREE.Vector3(Math.sin(a)*2.8, 0.9, 2 + Math.random()*3.2));
  }
  const pedestals = grp.userData.pedestals || [];
  for(let i=0;i<st.challenge.elevated;i++){
    const ped = pedestals[i % pedestals.length];
    if(ped) groundSpots.push(new THREE.Vector3(ped.position.x, 2.0, ped.position.z));
  }

  groundSpots.forEach(localPos=>{
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.32,0),
      w.toonMat(0xffd6f3, { emissive:0xf810b1, emissiveIntensity:0.45 })
    );
    mesh.position.copy(localPos);
    grp.add(mesh);
    pickups.push(mesh);
  });

  function frame(dt){
    const t = performance.now()/1000;
    const playerPos = w.player.position;
    pickups.forEach(m=>{
      if(!m.visible) return;
      m.rotation.y = t*2;
      m.position.y += Math.sin(t*3 + m.id)*0.001;
      const wp = new THREE.Vector3(); m.getWorldPosition(wp);
      if(playerPos.distanceTo(wp) < 1.3){
        m.visible = false;
        collected++;
        hud.textContent = collected + ' / ' + total;
        if(navigator.vibrate) navigator.vibrate(25);
        if(collected >= total){
          w.offFrame(frame);
          hud.style.display = 'none';
          pickups.forEach(p=>grp.remove(p));
          onChallengeSuccess(idx);
        }
      }
    });
  }
  w.onFrame(frame);
}

/* ---------------- KLETTERN ---------------- */
function startClimb(idx){
  const st = STATIONS[idx];
  const w = window.FTK_world;
  const grp = w.stationGroups[idx].grp;
  const stones = grp.userData.climbStones || [];
  const startPos = w.player.position.clone();

  const groundFn = (x,z) => {
    let best = 0;
    stones.forEach(stone=>{
      const wp = new THREE.Vector3(); stone.getWorldPosition(wp);
      const d = Math.hypot(x-wp.x, z-wp.z);
      if(d < 1.35){ const top = wp.y + 0.25; if(top > best) best = top; }
    });
    return best;
  };
  w.setMode('challenge', {
    groundFn,
    fallY: -4,
    onFall(){
      w.player.position.copy(startPos);
    },
    tick(){
      const last = stones[stones.length-1];
      if(!last) return;
      const wp = new THREE.Vector3(); last.getWorldPosition(wp);
      if(w.player.position.distanceTo(wp) < 1.4 && w.player.position.y > wp.y){
        w.setMode('hub');
        onChallengeSuccess(idx);
      }
    }
  });
}

/* ---------------- FUNDORT-PANEL (Hinweis + Codewort) ---------------- */
let activeStationIdx = null;
function openCluePanel(i){
  activeStationIdx = i;
  const st = STATIONS[i];
  document.getElementById('modalCount').textContent = 'Traubenwesen ' + (i+1) + ' von ' + STATIONS.length;
  document.getElementById('modalTitle').textContent = 'Herausforderung gemeistert! ' + st.name + ' ist ganz in der Nähe...';
  document.getElementById('modalClue').textContent = st.clue;
  document.getElementById('modalProfi').textContent = st.profi + ' ' + st.profiFact;
  document.getElementById('codeInput').value = '';
  document.getElementById('codeFeedback').textContent = '';
  document.getElementById('codeFeedback').className = 'feedback';
  document.getElementById('profiBox').open = false;
  document.getElementById('modalBackdrop').classList.add('show');
  setTimeout(()=> document.getElementById('codeInput').focus(), 350);
}
window.FTK_checkCode = function(){
  const input = document.getElementById('codeInput');
  const fb = document.getElementById('codeFeedback');
  const val = input.value.trim().toUpperCase();
  const st = STATIONS[activeStationIdx];
  if(!val){
    input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
    return;
  }
  if(val === st.codeword){
    fb.textContent = 'Gefunden! ' + st.name + ' zieht in eure Welt ein...';
    fb.className = 'feedback ok';
    state.caught.push(st.id);
    saveState();
    setTimeout(()=>{
      document.getElementById('modalBackdrop').classList.remove('show');
      window.FTK_world.markCaughtVisual(activeStationIdx);
      window.FTK_world.revealNext();
      showToast(st);
      renderHud();
      if(navigator.vibrate) navigator.vibrate([30,40,30,40,80]);
      if(state.caught.length >= STATIONS.length){
        setTimeout(showFinale, 1300);
      }
    }, 700);
  }else{
    fb.textContent = 'Noch nicht ganz richtig – schaut euch nochmal genau um.';
    fb.className = 'feedback err';
    input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
  }
};

function showToast(st){
  const el = document.getElementById('catchToast');
  document.getElementById('catchToastName').textContent = st.name;
  document.getElementById('catchToastSub').textContent = 'ist eurer Welt beigetreten';
  el.classList.add('show');
  setTimeout(()=> el.classList.remove('show'), 2600);
}
function renderHud(){
  document.getElementById('worldTeamLabel').textContent = 'Team ' + state.team;
  const wrap = document.getElementById('worldDots');
  wrap.innerHTML = '';
  STATIONS.forEach(st=>{
    const d = document.createElement('div');
    const caught = state.caught.includes(st.id);
    d.className = 'world-dot' + (caught ? ' found' : '');
    d.style.setProperty('--c1', st.c1);
    d.style.setProperty('--c2', st.c2);
    d.textContent = caught ? '🍇' : '';
    wrap.appendChild(d);
  });
}
function showFinale(){
  document.getElementById('finaleTeam').textContent = 'Team ' + state.team + ' hat alle ' + STATIONS.length + ' Traubenwesen gefunden.';
  document.getElementById('finaleBackdrop').classList.add('show');
}
window.FTK_renderHud = renderHud;
window.FTK_showFinale = showFinale;
})();
