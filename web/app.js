/**
 * Smart Campus Navigation — Web Simulator & Interactive Portal
 * Implements real-time A* pathfinding, QR localization, 3D Canvas visualizer, and TTS Voice Engine.
 */

// Campus Data Catalogue
const CAMPUS_DATA = {
  buildings: [
    { id: "main_academic", name: "Main Academic Block", code: "MAB" },
    { id: "tech_wing", name: "Science & Tech Complex", code: "STC" }
  ],
  destinations: [
    { id: "dest_main_entrance", name: "Main Campus Entrance", code: "GATE-01", category: "ENTRANCE", buildingId: "main_academic", floor: 0, x: 100, y: 350, qr: "CAMPUS:MAIN:G:ENTRANCE", desc: "Front gate & visitor check-in" },
    { id: "dest_admin_office", name: "Dean & Admin Office", code: "ADM-100", category: "FACULTY_OFFICE", buildingId: "main_academic", floor: 0, x: 250, y: 350, qr: "CAMPUS:MAIN:G:ADMIN", desc: "Student affairs, Dean & accounts" },
    { id: "dest_auditorium", name: "Grand Auditorium", code: "AUD-G", category: "SEMINAR_HALL", buildingId: "main_academic", floor: 0, x: 450, y: 350, qr: "CAMPUS:MAIN:G:AUD", desc: "500-seat conference auditorium" },
    { id: "dest_canteen", name: "Central Cafeteria", code: "CAN-01", category: "CANTEEN", buildingId: "main_academic", floor: 0, x: 100, y: 150, qr: "CAMPUS:MAIN:G:CAFE", desc: "Food court & dining area" },
    { id: "dest_stairs_g", name: "Central Staircase (GF)", code: "STR-G", category: "STAIRCASE", buildingId: "main_academic", floor: 0, x: 300, y: 250, qr: "CAMPUS:MAIN:G:STAIRS", desc: "Stairs to 1st and 2nd Floor" },
    
    // 1st Floor
    { id: "dest_cs_lab1", name: "Computer Science Lab 1", code: "CS-LAB1", category: "LABORATORY", buildingId: "main_academic", floor: 1, x: 120, y: 120, qr: "CAMPUS:MAIN:1:CSLAB1", desc: "AI & Cloud computing workstations (Room 101)" },
    { id: "dest_room102", name: "Lecture Hall 102", code: "LH-102", category: "CLASSROOM", buildingId: "main_academic", floor: 1, x: 260, y: 120, qr: "CAMPUS:MAIN:1:102", desc: "Smart classroom with 4K projector" },
    { id: "dest_room103", name: "Lecture Hall 103", code: "LH-103", category: "CLASSROOM", buildingId: "main_academic", floor: 1, x: 420, y: 120, qr: "CAMPUS:MAIN:1:103", desc: "Interactive departmental classroom" },
    { id: "dest_faculty_cs", name: "CS Faculty Cabin", code: "FAC-CS", category: "FACULTY_OFFICE", buildingId: "main_academic", floor: 1, x: 450, y: 280, qr: "CAMPUS:MAIN:1:FAC", desc: "Professors & HOD Office" },
    { id: "dest_stairs_1", name: "Central Staircase (1F)", code: "STR-1F", category: "STAIRCASE", buildingId: "main_academic", floor: 1, x: 300, y: 250, qr: "CAMPUS:MAIN:1:STAIRS", desc: "Stairs connecting GF, 1F, 2F" },
    { id: "dest_corridor_1", name: "1st Floor Central Junction", code: "COR-1", category: "CORRIDOR", buildingId: "main_academic", floor: 1, x: 300, y: 180, qr: null, desc: "Main hallway connector" },

    // 2nd Floor
    { id: "dest_library", name: "Central Digital Library", code: "LIB-01", category: "LIBRARY", buildingId: "main_academic", floor: 2, x: 150, y: 180, qr: "CAMPUS:TECH:1:LIB", desc: "Digital journals & study cubicles" },
    { id: "dest_robotics", name: "Robotics & IoT Lab", code: "ROB-01", category: "LABORATORY", buildingId: "main_academic", floor: 2, x: 400, y: 180, qr: "CAMPUS:TECH:0:ROBOTICS", desc: "3D printers & automation workspace" },
    { id: "dest_stairs_2", name: "Central Staircase (2F)", code: "STR-2F", category: "STAIRCASE", buildingId: "main_academic", floor: 2, x: 300, y: 250, qr: "CAMPUS:MAIN:2:STAIRS", desc: "Top floor stairhead" },
  ],

  // Navigation Graph Edges (with weights in meters)
  edges: [
    // Ground Floor
    { from: "dest_main_entrance", to: "dest_admin_office", w: 15 },
    { from: "dest_admin_office", to: "dest_stairs_g", w: 10 },
    { from: "dest_stairs_g", to: "dest_auditorium", w: 18 },
    { from: "dest_main_entrance", to: "dest_canteen", w: 22 },
    { from: "dest_canteen", to: "dest_stairs_g", w: 20 },

    // Inter-floor staircase connections
    { from: "dest_stairs_g", to: "dest_stairs_1", w: 8 },
    { from: "dest_stairs_1", to: "dest_stairs_2", w: 8 },

    // 1st Floor
    { from: "dest_stairs_1", to: "dest_corridor_1", w: 7 },
    { from: "dest_corridor_1", to: "dest_cs_lab1", w: 18 },
    { from: "dest_corridor_1", to: "dest_room102", w: 8 },
    { from: "dest_corridor_1", to: "dest_room103", w: 14 },
    { from: "dest_stairs_1", to: "dest_faculty_cs", w: 16 },

    // 2nd Floor
    { from: "dest_stairs_2", to: "dest_library", w: 16 },
    { from: "dest_stairs_2", to: "dest_robotics", w: 12 },
  ]
};

// Application State
let currentFloor = 1;
let selectedStartId = "dest_stairs_1";
let selectedDestId = "dest_cs_lab1";
let activeRoute = null;
let isVoiceActive = true;
let voiceLanguage = "en-US";
let simulationStep = 0;
let simulationInterval = null;

// AR Camera State
let isArCameraMode = false;
let arMediaStream = null;
let currentFacingMode = "environment";
let arAnimationId = null;
let cameraSimAngle = 0;

// UI Elements
const canvas = document.getElementById("campusCanvas");
const ctx = canvas.getContext("2d");
const startSelect = document.getElementById("startSelect");
const destSelect = document.getElementById("destSelect");
const btnFindPath = document.getElementById("btnFindPath");
const btnSimulateWalk = document.getElementById("btnSimulateWalk");
const btnToggleVoice = document.getElementById("btnToggleVoice");
const voiceLangSelect = document.getElementById("voiceLanguage");
const maneuverGlyph = document.getElementById("maneuverGlyph");
const maneuverText = document.getElementById("maneuverText");
const maneuverSub = document.getElementById("maneuverSub");
const destGrid = document.getElementById("destGrid");
const destSearch = document.getElementById("destinationSearch");
const destCount = document.getElementById("destCount");
const qrButtons = document.getElementById("qrButtons");
const hudFloor = document.getElementById("hudFloor");
const btnViewMap = document.getElementById("btnViewMap");
const btnViewAR = document.getElementById("btnViewAR");
const arVideo = document.getElementById("arVideo");
const arHudOverlay = document.getElementById("arHudOverlay");
const arFloatingTarget = document.getElementById("arFloatingTarget");
const arPinTitle = document.getElementById("arPinTitle");
const arPinDistance = document.getElementById("arPinDistance");
const btnSwitchCamera = document.getElementById("btnSwitchCamera");
const btnMarkArWaypoint = document.getElementById("btnMarkArWaypoint");
const arTrackingLabel = document.getElementById("arTrackingLabel");

// Initialize Canvas Sizing
function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  if (!isArCameraMode) renderCanvas();
}
window.addEventListener("resize", resizeCanvas);

// Populate Dropdowns & QR Buttons
function initUI() {
  populateSelects();
  renderDirectory(CAMPUS_DATA.destinations);
  renderQrButtons();
  setupEventListeners();
  resizeCanvas();
  calculateRoute();
}

function populateSelects() {
  startSelect.innerHTML = "";
  destSelect.innerHTML = "";

  CAMPUS_DATA.destinations.forEach(d => {
    const opt1 = document.createElement("option");
    opt1.value = d.id;
    opt1.textContent = `${d.name} (Floor ${d.floor})`;
    if (d.id === selectedStartId) opt1.selected = true;
    startSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = d.id;
    opt2.textContent = `${d.name} (Floor ${d.floor})`;
    if (d.id === selectedDestId) opt2.selected = true;
    destSelect.appendChild(opt2);
  });
}

function renderQrButtons() {
  qrButtons.innerHTML = "";
  const qrDests = CAMPUS_DATA.destinations.filter(d => d.qr);
  qrDests.forEach(d => {
    const btn = document.createElement("button");
    btn.className = "qr-btn";
    btn.innerHTML = `<span><strong>${d.name}</strong> (${d.code})</span> <span style="font-family: monospace; font-size: 0.7rem;">[QR Scan]</span>`;
    btn.onclick = () => scanQrCheckpoint(d.qr);
    qrButtons.appendChild(btn);
  });
}

function scanQrCheckpoint(payload) {
  const dest = CAMPUS_DATA.destinations.find(d => d.qr === payload);
  if (!dest) return;

  selectedStartId = dest.id;
  currentFloor = dest.floor;
  startSelect.value = dest.id;
  updateFloorButtons();

  speak(`Localized at ${dest.name} on floor ${dest.floor}`);
  setManeuver("QR", `Position Seeded: ${dest.name}`, `Building: Main Block · Floor ${dest.floor}`);
  calculateRoute();
}

function renderDirectory(list) {
  destGrid.innerHTML = "";
  destCount.textContent = list.length;

  list.forEach(d => {
    const card = document.createElement("div");
    card.className = "dest-card";
    card.innerHTML = `
      <div>
        <div class="dest-card-title">${d.name}</div>
        <div class="dest-card-meta">${d.category} · Room ${d.code} · Floor ${d.floor}</div>
        <div class="dest-card-desc">${d.desc}</div>
      </div>
    `;
    card.onclick = () => {
      selectedDestId = d.id;
      destSelect.value = d.id;
      calculateRoute();
    };
    destGrid.appendChild(card);
  });
}

// A* Shortest Pathfinding
function aStar(startId, goalId) {
  if (startId === goalId) return [startId];

  const graph = {};
  CAMPUS_DATA.destinations.forEach(d => graph[d.id] = []);
  CAMPUS_DATA.edges.forEach(e => {
    if (graph[e.from] && graph[e.to]) {
      graph[e.from].push({ node: e.to, weight: e.w });
      graph[e.to].push({ node: e.from, weight: e.w });
    }
  });

  const openSet = [startId];
  const cameFrom = {};
  const gScore = {};
  CAMPUS_DATA.destinations.forEach(d => gScore[d.id] = Infinity);
  gScore[startId] = 0;

  while (openSet.length > 0) {
    let current = openSet.reduce((min, node) => (gScore[node] < gScore[min] ? node : min), openSet[0]);
    if (current === goalId) {
      const path = [current];
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.unshift(current);
      }
      return path;
    }

    openSet.splice(openSet.indexOf(current), 1);
    for (const neighbor of graph[current] || []) {
      const tentative = gScore[current] + neighbor.weight;
      if (tentative < gScore[neighbor.node]) {
        cameFrom[neighbor.node] = current;
        gScore[neighbor.node] = tentative;
        if (!openSet.includes(neighbor.node)) openSet.push(neighbor.node);
      }
    }
  }
  return null;
}

function calculateRoute() {
  selectedStartId = startSelect.value;
  selectedDestId = destSelect.value;

  const path = aStar(selectedStartId, selectedDestId);
  activeRoute = path;
  simulationStep = 0;
  clearInterval(simulationInterval);
  btnSimulateWalk.disabled = !path || path.length < 2;

  if (path) {
    const startObj = CAMPUS_DATA.destinations.find(d => d.id === selectedStartId);
    const destObj = CAMPUS_DATA.destinations.find(d => d.id === selectedDestId);
    
    let floorTransition = "";
    if (startObj && destObj && startObj.floor !== destObj.floor) {
      floorTransition = ` · Take stairs to Floor ${destObj.floor}`;
    }

    setManeuver("GO", `Proceed to ${destObj ? destObj.name : "Destination"}`, `${path.length} Waypoints${floorTransition}`);
    speak(`Route calculated to ${destObj ? destObj.name : "Destination"}. Follow the highlighted AR path.`);
  } else {
    setManeuver("?", "No walkable path found between chosen points", "Try linking closer checkpoints");
  }

  if (!isArCameraMode) renderCanvas();
}

function setManeuver(glyph, text, sub) {
  maneuverGlyph.textContent = glyph;
  maneuverText.textContent = text;
  maneuverSub.textContent = sub;
}

// Voice Text-to-Speech
function speak(text) {
  if (!isVoiceActive || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  let textToSpeak = text;
  if (voiceLanguage === "ta-IN") {
    if (text.includes("Route calculated")) textToSpeak = "பாதை கணக்கிடப்பட்டது. வழியைப் பின்பற்றவும்.";
    else if (text.includes("Localized at")) textToSpeak = "நீங்கள் அடையாளம் காணப்பட்டீர்கள்: " + text.replace("Localized at", "");
    else if (text.includes("Arrived")) textToSpeak = "நீங்கள் இலக்கை அடைந்துவிட்டீர்கள்.";
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = voiceLanguage;
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

// Canvas Drawing & 3D Isometric View (Floor Map Mode)
function renderCanvas() {
  if (isArCameraMode) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Grid Background
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw Floor Label
  ctx.fillStyle = "rgba(0, 229, 255, 0.15)";
  ctx.font = "bold 48px 'Outfit'";
  ctx.fillText(`FLOOR ${currentFloor}`, 30, 70);

  const floorDests = CAMPUS_DATA.destinations.filter(d => d.floor === currentFloor);
  const destMap = {};
  CAMPUS_DATA.destinations.forEach(d => destMap[d.id] = d);

  // Draw Walkway Edges
  CAMPUS_DATA.edges.forEach(edge => {
    const a = destMap[edge.from];
    const b = destMap[edge.to];
    if (a && b && a.floor === currentFloor && b.floor === currentFloor) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  });

  // Draw Active Route Highlights
  if (activeRoute && activeRoute.length > 1) {
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < activeRoute.length; i++) {
      const node = destMap[activeRoute[i]];
      if (node && node.floor === currentFloor) {
        if (!started) {
          ctx.moveTo(node.x, node.y);
          started = true;
        } else {
          ctx.lineTo(node.x, node.y);
        }
      }
    }
    if (started) {
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // Draw Destination Nodes
  floorDests.forEach(d => {
    const isStart = d.id === selectedStartId;
    const isDest = d.id === selectedDestId;
    const isRoute = activeRoute && activeRoute.includes(d.id);

    ctx.beginPath();
    ctx.arc(d.x, d.y, isStart || isDest ? 14 : 9, 0, Math.PI * 2);

    if (isStart) {
      ctx.fillStyle = "#00e676";
      ctx.shadowColor = "#00e676";
      ctx.shadowBlur = 14;
    } else if (isDest) {
      ctx.fillStyle = "#ff9100";
      ctx.shadowColor = "#ff9100";
      ctx.shadowBlur = 14;
    } else if (isRoute) {
      ctx.fillStyle = "#00e5ff";
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 8;
    } else if (d.category === "STAIRCASE") {
      ctx.fillStyle = "#b388ff";
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.shadowBlur = 0;
    }

    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Node Label
    ctx.fillStyle = "#ffffff";
    ctx.font = isStart || isDest ? "bold 13px 'Outfit'" : "11px 'Outfit'";
    ctx.fillText(d.name, d.x + 16, d.y + 4);
  });
}

// ----------------------------------------------------
// LIVE CAMERA AUGMENTED REALITY (AR) RENDERING ENGINE
// ----------------------------------------------------
async function startArCamera() {
  try {
    if (arMediaStream) {
      arMediaStream.getTracks().forEach(track => track.stop());
    }

    arMediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    arVideo.srcObject = arMediaStream;
    await arVideo.play();
    arTrackingLabel.innerHTML = `AR Camera: <strong style="color:#00e676;">Live Stream</strong>`;
  } catch (err) {
    console.warn("Camera access denied or unavailable; fallback to simulated camera room", err);
    arTrackingLabel.innerHTML = `AR Mode: <strong style="color:#ffb74d;">Simulated Camera</strong>`;
  }

  isArCameraMode = true;
  arHudOverlay.style.display = "flex";
  document.querySelector(".floor-selector").style.display = "none";
  renderArLoop();
}

function stopArCamera() {
  isArCameraMode = false;
  if (arMediaStream) {
    arMediaStream.getTracks().forEach(track => track.stop());
    arMediaStream = null;
  }
  if (arAnimationId) {
    cancelAnimationFrame(arAnimationId);
    arAnimationId = null;
  }
  arHudOverlay.style.display = "none";
  document.querySelector(".floor-selector").style.display = "flex";
  arTrackingLabel.innerHTML = `AR Tracking: <strong>Active</strong>`;
  renderCanvas();
}

function renderArLoop() {
  if (!isArCameraMode) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Live Camera Feed onto the Canvas
  if (arVideo.readyState >= 2 && arVideo.videoWidth > 0) {
    ctx.drawImage(arVideo, 0, 0, canvas.width, canvas.height);
  } else {
    // Simulated live camera corridor view with hallway lighting & floor
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#121b28");
    grad.addColorStop(0.5, "#1e293b");
    grad.addColorStop(1, "#0a0e17");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simulated indoor corridor walls & ceiling lights
    ctx.strokeStyle = "rgba(0, 229, 255, 0.1)";
    ctx.lineWidth = 2;
    const midX = canvas.width / 2;
    const midY = canvas.height * 0.45;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(midX - 80, midY);
    ctx.moveTo(canvas.width, 0); ctx.lineTo(midX + 80, midY);
    ctx.moveTo(0, canvas.height); ctx.lineTo(midX - 80, midY);
    ctx.moveTo(canvas.width, canvas.height); ctx.lineTo(midX + 80, midY);
    ctx.stroke();
  }

  // 2. Draw 3D Augmented Reality Plane & Ground Grid
  cameraSimAngle += 0.02;
  const targetNode = CAMPUS_DATA.destinations.find(d => d.id === selectedDestId);
  const targetName = targetNode ? targetNode.name : "Destination";
  const targetDist = 14.5; // meters

  // Render 3D Perspective AR Pathway on the Floor
  const startX = canvas.width / 2;
  const startY = canvas.height * 0.95;
  const destX = canvas.width / 2 + Math.sin(cameraSimAngle * 0.5) * 40;
  const destY = canvas.height * 0.45;

  ctx.save();
  // Glowing AR Walkway Line
  const pathGrad = ctx.createLinearGradient(startX, startY, destX, destY);
  pathGrad.addColorStop(0, "rgba(0, 229, 255, 0.9)");
  pathGrad.addColorStop(1, "rgba(0, 230, 118, 0.4)");
  ctx.strokeStyle = pathGrad;
  ctx.lineWidth = 14;
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(startX + 30, (startY + destY) / 2, destX, destY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 3. Draw AR 3D Directional Floating Chevrons (Navigation Arrows)
  for (let t = 0.2; t <= 0.85; t += 0.2) {
    const cx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * (startX + 30) + t * t * destX;
    const cy = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ((startY + destY) / 2) + t * t * destY;
    const scale = (1 - t) * 1.0 + 0.3;

    ctx.beginPath();
    ctx.moveTo(cx - 20 * scale, cy + 10 * scale);
    ctx.lineTo(cx, cy - 10 * scale);
    ctx.lineTo(cx + 20 * scale, cy + 10 * scale);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4 * scale;
    ctx.stroke();
  }

  // 4. Draw 3D Floating Target Pin & Pulsing Ground Ring
  const pulse = (Math.sin(Date.now() / 250) + 1) * 6;
  ctx.beginPath();
  ctx.ellipse(destX, destY + 20, 30 + pulse, 12 + pulse * 0.5, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Floating AR Pin Sphere
  ctx.beginPath();
  ctx.arc(destX, destY - 20, 16, 0, Math.PI * 2);
  ctx.fillStyle = "#ff9100";
  ctx.shadowColor = "#ff9100";
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.restore();

  // Update Floating HTML Badge Coordinates
  arPinTitle.textContent = targetName;
  arPinDistance.textContent = `${targetDist.toFixed(1)} m away (Floor ${targetNode ? targetNode.floor : 1})`;
  arFloatingTarget.style.left = `${destX}px`;
  arFloatingTarget.style.top = `${destY - 60}px`;

  arAnimationId = requestAnimationFrame(renderArLoop);
}

// Setup Event Listeners
function setupEventListeners() {
  btnFindPath.addEventListener("click", calculateRoute);

  btnViewMap.addEventListener("click", () => {
    btnViewMap.classList.add("active");
    btnViewAR.classList.remove("active");
    stopArCamera();
  });

  btnViewAR.addEventListener("click", () => {
    btnViewAR.classList.add("active");
    btnViewMap.classList.remove("active");
    startArCamera();
  });

  btnSwitchCamera.addEventListener("click", () => {
    currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
    startArCamera();
  });

  btnMarkArWaypoint.addEventListener("click", () => {
    const name = prompt("Enter marker name:", "Water Dispenser");
    if (name) {
      alert(`AR Marker "${name}" anchored to real camera coordinate plane!`);
      speak(`Saved AR Marker: ${name}`);
    }
  });

  startSelect.addEventListener("change", () => {
    const d = CAMPUS_DATA.destinations.find(x => x.id === startSelect.value);
    if (d) {
      currentFloor = d.floor;
      updateFloorButtons();
    }
    calculateRoute();
  });

  destSelect.addEventListener("change", calculateRoute);

  document.querySelectorAll(".floor-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFloor = parseInt(btn.getAttribute("data-floor"));
      updateFloorButtons();
      renderCanvas();
    });
  });

  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.getAttribute("data-category");
      if (cat === "ALL") {
        renderDirectory(CAMPUS_DATA.destinations);
      } else {
        renderDirectory(CAMPUS_DATA.destinations.filter(d => d.category === cat));
      }
    });
  });

  destSearch.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = CAMPUS_DATA.destinations.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.desc.toLowerCase().includes(q)
    );
    renderDirectory(filtered);
  });

  btnToggleVoice.addEventListener("click", () => {
    isVoiceActive = !isVoiceActive;
    btnToggleVoice.classList.toggle("active", isVoiceActive);
    document.getElementById("voiceIcon").textContent = isVoiceActive ? "🔊" : "🔇";
  });

  voiceLangSelect.addEventListener("change", (e) => {
    voiceLanguage = e.target.value;
  });

  btnSimulateWalk.addEventListener("click", simulateWalk);
}

function updateFloorButtons() {
  document.querySelectorAll(".floor-btn").forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.getAttribute("data-floor")) === currentFloor);
  });
  hudFloor.textContent = `Floor ${currentFloor}`;
}

function simulateWalk() {
  if (!activeRoute || activeRoute.length < 2) return;
  simulationStep = 0;
  clearInterval(simulationInterval);

  simulationInterval = setInterval(() => {
    if (simulationStep >= activeRoute.length) {
      clearInterval(simulationInterval);
      setManeuver("ARRIVED", "Arrived at Destination!", "You have reached your goal.");
      speak("You have arrived at your destination.");
      return;
    }

    const currentId = activeRoute[simulationStep];
    const node = CAMPUS_DATA.destinations.find(d => d.id === currentId);
    if (node) {
      currentFloor = node.floor;
      updateFloorButtons();
      setManeuver("STEP", `Step ${simulationStep + 1}: ${node.name}`, `Floor ${node.floor} · Following Route`);
      speak(`Passing ${node.name}`);
      if (!isArCameraMode) renderCanvas();
    }

    simulationStep++;
  }, 2200);
}

// Start
initUI();

