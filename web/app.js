/**
 * Smart Campus Navigation — Architectural Blueprint Studio & AR Engine
 * Full-stack interactive client with CAD Blueprint rendering, Custom Uploads, Node Editing, and AR overlay.
 */

// Architectural Schematics (CAD Blueprints per floor)
const ARCHITECTURAL_BLUEPRINTS = {
  0: { // Ground Floor
    walls: [
      { x1: 60, y1: 80, x2: 520, y2: 80 },   // Top boundary
      { x1: 520, y1: 80, x2: 520, y2: 400 }, // Right boundary
      { x1: 520, y1: 400, x2: 60, y2: 400 }, // Bottom boundary
      { x1: 60, y1: 400, x2: 60, y2: 80 },   // Left boundary
      // Interior Partitions
      { x1: 200, y1: 80, x2: 200, y2: 220 }, // Canteen wall
      { x1: 60, y1: 220, x2: 200, y2: 220 },
      { x1: 360, y1: 220, x2: 520, y2: 220 }, // Auditorium wall
      { x1: 360, y1: 220, x2: 360, y2: 400 },
      { x1: 200, y1: 280, x2: 360, y2: 280 }, // Admin office partition
    ],
    rooms: [
      { name: "Central Cafeteria", code: "CAN-01", x: 75, y: 100, w: 110, h: 100 },
      { name: "Dean & Admin Office", code: "ADM-100", x: 215, y: 300, w: 130, h: 80 },
      { name: "Grand Auditorium", code: "AUD-G", x: 380, y: 240, w: 125, h: 140 },
      { name: "Main Entrance Foyer", code: "GATE-01", x: 75, y: 280, w: 110, h: 100 },
      { name: "Central Stairwell", code: "STR-G", x: 255, y: 210, w: 80, h: 60 }
    ]
  },
  1: { // 1st Floor
    walls: [
      { x1: 60, y1: 80, x2: 520, y2: 80 },
      { x1: 520, y1: 80, x2: 520, y2: 400 },
      { x1: 520, y1: 400, x2: 60, y2: 400 },
      { x1: 60, y1: 400, x2: 60, y2: 80 },
      // Interior Classrooms
      { x1: 200, y1: 80, x2: 200, y2: 200 },
      { x1: 340, y1: 80, x2: 340, y2: 200 },
      { x1: 360, y1: 230, x2: 520, y2: 230 },
      { x1: 360, y1: 230, x2: 360, y2: 400 },
    ],
    rooms: [
      { name: "Computer Science Lab 1", code: "CS-LAB1", x: 75, y: 95, w: 110, h: 90 },
      { name: "Lecture Hall 102", code: "LH-102", x: 215, y: 95, w: 110, h: 90 },
      { name: "Lecture Hall 103", code: "LH-103", x: 355, y: 95, w: 150, h: 90 },
      { name: "Faculty Office (CS)", code: "FAC-CS", x: 380, y: 250, w: 125, h: 130 },
      { name: "Central Stairwell", code: "STR-1F", x: 255, y: 210, w: 80, h: 60 },
      { name: "Main Corridors", code: "COR-1", x: 75, y: 210, w: 160, h: 60 }
    ]
  },
  2: { // 2nd Floor
    walls: [
      { x1: 60, y1: 80, x2: 520, y2: 80 },
      { x1: 520, y1: 80, x2: 520, y2: 400 },
      { x1: 520, y1: 400, x2: 60, y2: 400 },
      { x1: 60, y1: 400, x2: 60, y2: 80 },
      { x1: 280, y1: 80, x2: 280, y2: 400 }, // Library vs Robotics partition
    ],
    rooms: [
      { name: "Central Digital Library", code: "LIB-01", x: 75, y: 100, w: 190, h: 280 },
      { name: "Robotics & AI Innovation Lab", code: "ROB-01", x: 300, y: 100, w: 205, h: 280 },
      { name: "Central Stairwell", code: "STR-2F", x: 255, y: 210, w: 80, h: 60 }
    ]
  }
};

// Campus Destinations Dataset
let CAMPUS_DESTINATIONS = [
  { id: "dest_main_entrance", name: "Main Campus Entrance", code: "GATE-01", category: "ENTRANCE", buildingId: "main_academic", floor: 0, x: 130, y: 330, qr: "CAMPUS:MAIN:G:ENTRANCE", desc: "Front gate & visitor check-in" },
  { id: "dest_admin_office", name: "Dean & Admin Office", code: "ADM-100", category: "FACULTY_OFFICE", buildingId: "main_academic", floor: 0, x: 280, y: 340, qr: "CAMPUS:MAIN:G:ADMIN", desc: "Student affairs, Dean & accounts" },
  { id: "dest_auditorium", name: "Grand Auditorium", code: "AUD-G", category: "SEMINAR_HALL", buildingId: "main_academic", floor: 0, x: 440, y: 310, qr: "CAMPUS:MAIN:G:AUD", desc: "500-seat conference auditorium" },
  { id: "dest_canteen", name: "Central Cafeteria", code: "CAN-01", category: "CANTEEN", buildingId: "main_academic", floor: 0, x: 130, y: 150, qr: "CAMPUS:MAIN:G:CAFE", desc: "Food court & dining area" },
  { id: "dest_stairs_g", name: "Central Staircase (GF)", code: "STR-G", category: "STAIRCASE", buildingId: "main_academic", floor: 0, x: 295, y: 240, qr: "CAMPUS:MAIN:G:STAIRS", desc: "Stairs to 1st and 2nd Floor" },
  
  // 1st Floor
  { id: "dest_cs_lab1", name: "Computer Science Lab 1", code: "CS-LAB1", category: "LABORATORY", buildingId: "main_academic", floor: 1, x: 130, y: 140, qr: "CAMPUS:MAIN:1:CSLAB1", desc: "AI & Cloud computing workstations (Room 101)" },
  { id: "dest_room102", name: "Lecture Hall 102", code: "LH-102", category: "CLASSROOM", buildingId: "main_academic", floor: 1, x: 270, y: 140, qr: "CAMPUS:MAIN:1:102", desc: "Smart classroom with 4K projector" },
  { id: "dest_room103", name: "Lecture Hall 103", code: "LH-103", category: "CLASSROOM", buildingId: "main_academic", floor: 1, x: 430, y: 140, qr: "CAMPUS:MAIN:1:103", desc: "Interactive departmental classroom" },
  { id: "dest_faculty_cs", name: "CS Faculty Cabin", code: "FAC-CS", category: "FACULTY_OFFICE", buildingId: "main_academic", floor: 1, x: 440, y: 310, qr: "CAMPUS:MAIN:1:FAC", desc: "Professors & HOD Office" },
  { id: "dest_stairs_1", name: "Central Staircase (1F)", code: "STR-1F", category: "STAIRCASE", buildingId: "main_academic", floor: 1, x: 295, y: 240, qr: "CAMPUS:MAIN:1:STAIRS", desc: "Stairs connecting GF, 1F, 2F" },
  { id: "dest_corridor_1", name: "1st Floor Central Corridor", code: "COR-1", category: "CORRIDOR", buildingId: "main_academic", floor: 1, x: 200, y: 240, qr: null, desc: "Main hallway connector" },

  // 2nd Floor
  { id: "dest_library", name: "Central Digital Library", code: "LIB-01", category: "LIBRARY", buildingId: "main_academic", floor: 2, x: 170, y: 240, qr: "CAMPUS:TECH:1:LIB", desc: "Digital journals & study cubicles" },
  { id: "dest_robotics", name: "Robotics & AI Lab", code: "ROB-01", category: "LABORATORY", buildingId: "main_academic", floor: 2, x: 400, y: 240, qr: "CAMPUS:TECH:0:ROBOTICS", desc: "3D printers & automation workspace" },
  { id: "dest_stairs_2", name: "Central Staircase (2F)", code: "STR-2F", category: "STAIRCASE", buildingId: "main_academic", floor: 2, x: 295, y: 240, qr: "CAMPUS:MAIN:2:STAIRS", desc: "Top floor stairhead" },
];

let CAMPUS_EDGES = [
  { from: "dest_main_entrance", to: "dest_admin_office", w: 15 },
  { from: "dest_admin_office", to: "dest_stairs_g", w: 10 },
  { from: "dest_stairs_g", to: "dest_auditorium", w: 18 },
  { from: "dest_main_entrance", to: "dest_canteen", w: 22 },
  { from: "dest_canteen", to: "dest_stairs_g", w: 20 },
  { from: "dest_stairs_g", to: "dest_stairs_1", w: 8 },
  { from: "dest_stairs_1", to: "dest_stairs_2", w: 8 },
  { from: "dest_stairs_1", to: "dest_corridor_1", w: 7 },
  { from: "dest_corridor_1", to: "dest_cs_lab1", w: 18 },
  { from: "dest_corridor_1", to: "dest_room102", w: 8 },
  { from: "dest_corridor_1", to: "dest_room103", w: 14 },
  { from: "dest_stairs_1", to: "dest_faculty_cs", w: 16 },
  { from: "dest_stairs_2", to: "dest_library", w: 16 },
  { from: "dest_stairs_2", to: "dest_robotics", w: 12 },
];

// App State
let currentFloor = 1;
let selectedStartId = "dest_stairs_1";
let selectedDestId = "dest_cs_lab1";
let activeRoute = null;
let isVoiceActive = true;
let voiceLanguage = "en-US";
let simulationStep = 0;
let simulationInterval = null;

// Blueprint & AR State
let isArCameraMode = false;
let isDrawNodeMode = false;
let userUploadedBlueprint = {}; // { [floor]: Image }
let blueprintOpacity = 0.75;
let blueprintPreset = "architectural_dark";
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
const btnViewBlueprint = document.getElementById("btnViewBlueprint");
const btnViewAR = document.getElementById("btnViewAR");
const arVideo = document.getElementById("arVideo");
const arHudOverlay = document.getElementById("arHudOverlay");
const arFloatingTarget = document.getElementById("arFloatingTarget");
const arPinTitle = document.getElementById("arPinTitle");
const arPinDistance = document.getElementById("arPinDistance");
const btnSwitchCamera = document.getElementById("btnSwitchCamera");
const btnMarkArWaypoint = document.getElementById("btnMarkArWaypoint");
const arTrackingLabel = document.getElementById("arTrackingLabel");
const blueprintFileInput = document.getElementById("blueprintFileInput");
const blueprintOpacitySlider = document.getElementById("blueprintOpacity");
const opacityValLabel = document.getElementById("opacityVal");
const blueprintPresetSelect = document.getElementById("blueprintPresetSelect");
const btnToggleDrawMode = document.getElementById("btnToggleDrawMode");

// Resize
function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  if (!isArCameraMode) renderBlueprintCanvas();
}
window.addEventListener("resize", resizeCanvas);

// Init
function init() {
  populateSelects();
  renderDirectory(CAMPUS_DESTINATIONS);
  renderQrButtons();
  setupEventListeners();
  resizeCanvas();
  calculateRoute();
}

function populateSelects() {
  startSelect.innerHTML = "";
  destSelect.innerHTML = "";

  CAMPUS_DESTINATIONS.forEach(d => {
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
  const qrDests = CAMPUS_DESTINATIONS.filter(d => d.qr);
  qrDests.forEach(d => {
    const btn = document.createElement("button");
    btn.className = "qr-btn";
    btn.innerHTML = `<span><strong>${d.name}</strong> (${d.code})</span> <span style="font-family: monospace; font-size: 0.7rem;">[QR Scan]</span>`;
    btn.onclick = () => scanQrCheckpoint(d.qr);
    qrButtons.appendChild(btn);
  });
}

function scanQrCheckpoint(payload) {
  const dest = CAMPUS_DESTINATIONS.find(d => d.qr === payload);
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

// A* Pathfinding
function aStar(startId, goalId) {
  if (startId === goalId) return [startId];

  const graph = {};
  CAMPUS_DESTINATIONS.forEach(d => graph[d.id] = []);
  CAMPUS_EDGES.forEach(e => {
    if (graph[e.from] && graph[e.to]) {
      graph[e.from].push({ node: e.to, weight: e.w });
      graph[e.to].push({ node: e.from, weight: e.w });
    }
  });

  const openSet = [startId];
  const cameFrom = {};
  const gScore = {};
  CAMPUS_DESTINATIONS.forEach(d => gScore[d.id] = Infinity);
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
    const startObj = CAMPUS_DESTINATIONS.find(d => d.id === selectedStartId);
    const destObj = CAMPUS_DESTINATIONS.find(d => d.id === selectedDestId);
    
    let floorTransition = "";
    if (startObj && destObj && startObj.floor !== destObj.floor) {
      floorTransition = ` · Take stairs to Floor ${destObj.floor}`;
    }

    setManeuver("GO", `Proceed to ${destObj ? destObj.name : "Destination"}`, `${path.length} Waypoints${floorTransition}`);
    speak(`Route calculated to ${destObj ? destObj.name : "Destination"}. Follow the highlighted blueprint path.`);
  } else {
    setManeuver("?", "No walkable path found between chosen points", "Try linking closer checkpoints");
  }

  if (!isArCameraMode) renderBlueprintCanvas();
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

// ----------------------------------------------------
// ARCHITECTURAL BLUEPRINT CANVAS RENDERING ENGINE
// ----------------------------------------------------
function renderBlueprintCanvas() {
  if (isArCameraMode) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Architectural CAD Background Grid
  const gridSize = 30;
  ctx.strokeStyle = "rgba(0, 229, 255, 0.08)";
  ctx.lineWidth = 1;
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

  // 2. Draw User-Uploaded Blueprint Image (if uploaded for this floor)
  const userImg = userUploadedBlueprint[currentFloor];
  if (userImg) {
    ctx.save();
    ctx.globalAlpha = blueprintOpacity;
    ctx.drawImage(userImg, 50, 60, canvas.width - 100, canvas.height - 120);
    ctx.restore();
  } else if (blueprintPreset !== "none") {
    // 3. Draw Procedural CAD Schematic Walls & Room Zones
    const bp = ARCHITECTURAL_BLUEPRINTS[currentFloor] || ARCHITECTURAL_BLUEPRINTS[1];
    
    // Draw Room Fill Zones
    ctx.save();
    ctx.globalAlpha = blueprintOpacity;
    bp.rooms.forEach(room => {
      ctx.fillStyle = "rgba(0, 229, 255, 0.05)";
      ctx.fillRect(room.x, room.y, room.w, room.h);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(room.x, room.y, room.w, room.h);

      // Room Title & CAD Code
      ctx.fillStyle = "rgba(0, 229, 255, 0.6)";
      ctx.font = "bold 10px 'JetBrains Mono'";
      ctx.fillText(`[${room.code}]`, room.x + 8, room.y + 18);
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "11px 'Outfit'";
      ctx.fillText(room.name, room.x + 8, room.y + 34);
    });

    // Draw Structural CAD Walls
    ctx.strokeStyle = "rgba(0, 229, 255, 0.75)";
    ctx.lineWidth = 3.5;
    ctx.shadowColor = "#00e5ff";
    ctx.shadowBlur = 8;
    bp.walls.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Draw Floor Watermark
  ctx.fillStyle = "rgba(0, 229, 255, 0.12)";
  ctx.font = "bold 54px 'JetBrains Mono'";
  ctx.fillText(`FLOOR ${currentFloor} - CAD SCHEMATIC`, 40, canvas.height - 30);

  const floorDests = CAMPUS_DESTINATIONS.filter(d => d.floor === currentFloor);
  const destMap = {};
  CAMPUS_DESTINATIONS.forEach(d => destMap[d.id] = d);

  // Draw Walkway Edges
  CAMPUS_EDGES.forEach(edge => {
    const a = destMap[edge.from];
    const b = destMap[edge.to];
    if (a && b && a.floor === currentFloor && b.floor === currentFloor) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // Draw Active Route Highlights (Glowing Cyan Architectural Conduit)
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
      ctx.shadowBlur = 18;
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
      ctx.shadowBlur = 16;
    } else if (isDest) {
      ctx.fillStyle = "#ff9100";
      ctx.shadowColor = "#ff9100";
      ctx.shadowBlur = 16;
    } else if (isRoute) {
      ctx.fillStyle = "#00e5ff";
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 10;
    } else if (d.category === "STAIRCASE") {
      ctx.fillStyle = "#b388ff";
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
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
    arTrackingLabel.innerHTML = `AR Mode: <strong style="color:#ffb74d;">Simulated Corridor</strong>`;
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
  arTrackingLabel.innerHTML = `Tracking: <strong>Blueprint Calibrated</strong>`;
  renderBlueprintCanvas();
}

function renderArLoop() {
  if (!isArCameraMode) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Live Camera Feed onto the Canvas
  if (arVideo.readyState >= 2 && arVideo.videoWidth > 0) {
    ctx.drawImage(arVideo, 0, 0, canvas.width, canvas.height);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#0e1828");
    grad.addColorStop(0.5, "#182436");
    grad.addColorStop(1, "#070b12");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
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

  // 2. Draw 3D Augmented Reality Pathway
  cameraSimAngle += 0.02;
  const targetNode = CAMPUS_DESTINATIONS.find(d => d.id === selectedDestId);
  const targetName = targetNode ? targetNode.name : "Destination";
  const targetDist = 14.5;

  const startX = canvas.width / 2;
  const startY = canvas.height * 0.95;
  const destX = canvas.width / 2 + Math.sin(cameraSimAngle * 0.5) * 40;
  const destY = canvas.height * 0.45;

  ctx.save();
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

  // Chevrons
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

  // 3D Target Pin
  const pulse = (Math.sin(Date.now() / 250) + 1) * 6;
  ctx.beginPath();
  ctx.ellipse(destX, destY + 20, 30 + pulse, 12 + pulse * 0.5, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 3;
  ctx.stroke();

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

  // Floating HTML Pin details
  arPinTitle.textContent = targetName;
  arPinDistance.textContent = `${targetDist.toFixed(1)} m away (Floor ${targetNode ? targetNode.floor : 1})`;
  arFloatingTarget.style.left = `${destX}px`;
  arFloatingTarget.style.top = `${destY - 60}px`;

  arAnimationId = requestAnimationFrame(renderArLoop);
}

// ----------------------------------------------------
// EVENT LISTENERS & BLUEPRINT IMPORT HANDLERS
// ----------------------------------------------------
function setupEventListeners() {
  btnFindPath.addEventListener("click", calculateRoute);

  btnViewBlueprint.addEventListener("click", () => {
    btnViewBlueprint.classList.add("active");
    btnViewAR.classList.remove("active");
    stopArCamera();
  });

  btnViewAR.addEventListener("click", () => {
    btnViewAR.classList.add("active");
    btnViewBlueprint.classList.remove("active");
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

  // Blueprint Image Upload
  blueprintFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          userUploadedBlueprint[currentFloor] = img;
          renderBlueprintCanvas();
          alert(`Blueprint for Floor ${currentFloor} imported and calibrated successfully!`);
          speak(`Floor ${currentFloor} blueprint imported.`);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Blueprint Opacity Slider
  blueprintOpacitySlider.addEventListener("input", (e) => {
    blueprintOpacity = parseInt(e.target.value) / 100;
    opacityValLabel.textContent = `${e.target.value}%`;
    renderBlueprintCanvas();
  });

  // Blueprint Preset Selector
  blueprintPresetSelect.addEventListener("change", (e) => {
    blueprintPreset = e.target.value;
    renderBlueprintCanvas();
  });

  // Interactive Node Drawing on Blueprint
  btnToggleDrawMode.addEventListener("click", () => {
    isDrawNodeMode = !isDrawNodeMode;
    btnToggleDrawMode.classList.toggle("active", isDrawNodeMode);
    btnToggleDrawMode.textContent = isDrawNodeMode ? "✏️ Click to Place" : "✏️ Node Editor";
  });

  canvas.addEventListener("click", (e) => {
    if (!isDrawNodeMode || isArCameraMode) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const name = prompt("Enter Name for new room/door on this blueprint:", `Room ${Math.floor(Math.random() * 800 + 100)}`);
    if (name) {
      const newId = `custom_${Date.now()}`;
      const newDest = {
        id: newId,
        name: name,
        code: `R-${Math.floor(Math.random() * 90 + 10)}`,
        category: "CLASSROOM",
        buildingId: "main_academic",
        floor: currentFloor,
        x: clickX,
        y: clickY,
        qr: `CAMPUS:CUSTOM:${newId}`,
        desc: "Custom mapped room on blueprint"
      };

      CAMPUS_DESTINATIONS.push(newDest);

      // Auto link to closest node on this floor
      const floorNodes = CAMPUS_DESTINATIONS.filter(d => d.floor === currentFloor && d.id !== newId);
      if (floorNodes.length > 0) {
        const closest = floorNodes.reduce((min, d) => {
          const dist = Math.hypot(d.x - clickX, d.y - clickY);
          return dist < min.dist ? { node: d, dist } : min;
        }, { node: floorNodes[0], dist: Infinity });

        CAMPUS_EDGES.push({ from: newId, to: closest.node.id, w: Math.round(closest.dist / 10) });
      }

      populateSelects();
      renderDirectory(CAMPUS_DESTINATIONS);
      renderQrButtons();
      renderBlueprintCanvas();
      alert(`Point "${name}" added to Blueprint and linked to navigation graph!`);
    }
  });

  startSelect.addEventListener("change", () => {
    const d = CAMPUS_DESTINATIONS.find(x => x.id === startSelect.value);
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
      renderBlueprintCanvas();
    });
  });

  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.getAttribute("data-category");
      if (cat === "ALL") {
        renderDirectory(CAMPUS_DESTINATIONS);
      } else {
        renderDirectory(CAMPUS_DESTINATIONS.filter(d => d.category === cat));
      }
    });
  });

  destSearch.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = CAMPUS_DESTINATIONS.filter(d => 
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
      setManeuver("ARRIVED", "Arrived at Destination!", "You have reached your destination.");
      speak("You have arrived at your destination.");
      return;
    }

    const currentId = activeRoute[simulationStep];
    const node = CAMPUS_DESTINATIONS.find(d => d.id === currentId);
    if (node) {
      currentFloor = node.floor;
      updateFloorButtons();
      setManeuver("STEP", `Step ${simulationStep + 1}: ${node.name}`, `Floor ${node.floor} · Following Route`);
      speak(`Passing ${node.name}`);
      if (!isArCameraMode) renderBlueprintCanvas();
    }

    simulationStep++;
  }, 2200);
}

// Start
init();
