const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const DATA_FILE = path.join(__dirname, 'campus_database.json');

// Default initial data for persistent store
const INITIAL_DATABASE = {
  campus: {
    id: "campus_main",
    name: "Smart University Campus",
    code: "SUC",
    centerGps: { lat: 13.0827, lng: 80.2707, accuracy: 2.0 },
    buildings: [
      { id: "main_academic", name: "Main Academic Block", code: "MAB", floors: [0, 1, 2] },
      { id: "tech_wing", name: "Science & Tech Complex", code: "STC", floors: [0, 1] }
    ]
  },
  blueprints: {},
  destinations: [
    { id: "dest_main_entrance", name: "Main Campus Entrance", code: "GATE-01", category: "ENTRANCE", buildingId: "main_academic", floor: 0, x: 120, y: 340, qr: "CAMPUS:MAIN:G:ENTRANCE", desc: "Front gate & visitor check-in" },
    { id: "dest_admin_office", name: "Dean & Admin Office", code: "ADM-100", category: "FACULTY_OFFICE", buildingId: "main_academic", floor: 0, x: 260, y: 340, qr: "CAMPUS:MAIN:G:ADMIN", desc: "Student affairs, Dean & accounts" },
    { id: "dest_auditorium", name: "Grand Auditorium", code: "AUD-G", category: "SEMINAR_HALL", buildingId: "main_academic", floor: 0, x: 440, y: 340, qr: "CAMPUS:MAIN:G:AUD", desc: "500-seat conference auditorium" },
    { id: "dest_canteen", name: "Central Cafeteria", code: "CAN-01", category: "CANTEEN", buildingId: "main_academic", floor: 0, x: 120, y: 150, qr: "CAMPUS:MAIN:G:CAFE", desc: "Food court & dining area" },
    { id: "dest_stairs_g", name: "Central Staircase (GF)", code: "STR-G", category: "STAIRCASE", buildingId: "main_academic", floor: 0, x: 290, y: 240, qr: "CAMPUS:MAIN:G:STAIRS", desc: "Stairs to 1st and 2nd Floor" },
    
    // 1st Floor
    { id: "dest_cs_lab1", name: "Computer Science Lab 1", code: "CS-LAB1", category: "LABORATORY", buildingId: "main_academic", floor: 1, x: 130, y: 130, qr: "CAMPUS:MAIN:1:CSLAB1", desc: "AI & Cloud computing workstations (Room 101)" },
    { id: "dest_room102", name: "Lecture Hall 102", code: "LH-102", category: "CLASSROOM", buildingId: "main_academic", floor: 1, x: 270, y: 130, qr: "CAMPUS:MAIN:1:102", desc: "Smart classroom with 4K projector" },
    { id: "dest_room103", name: "Lecture Hall 103", code: "LH-103", category: "CLASSROOM", buildingId: "main_academic", floor: 1, x: 430, y: 130, qr: "CAMPUS:MAIN:1:103", desc: "Interactive departmental classroom" },
    { id: "dest_faculty_cs", name: "CS Faculty Cabin", code: "FAC-CS", category: "FACULTY_OFFICE", buildingId: "main_academic", floor: 1, x: 450, y: 280, qr: "CAMPUS:MAIN:1:FAC", desc: "Professors & HOD Office" },
    { id: "dest_stairs_1", name: "Central Staircase (1F)", code: "STR-1F", category: "STAIRCASE", buildingId: "main_academic", floor: 1, x: 290, y: 240, qr: "CAMPUS:MAIN:1:STAIRS", desc: "Stairs connecting GF, 1F, 2F" },
    { id: "dest_corridor_1", name: "1st Floor Central Corridor", code: "COR-1", category: "CORRIDOR", buildingId: "main_academic", floor: 1, x: 290, y: 180, qr: null, desc: "Main architectural corridor" },

    // 2nd Floor
    { id: "dest_library", name: "Central Digital Library", code: "LIB-01", category: "LIBRARY", buildingId: "main_academic", floor: 2, x: 150, y: 180, qr: "CAMPUS:TECH:1:LIB", desc: "Digital journals & study cubicles" },
    { id: "dest_robotics", name: "Robotics & IoT Lab", code: "ROB-01", category: "LABORATORY", buildingId: "main_academic", floor: 2, x: 410, y: 180, qr: "CAMPUS:TECH:0:ROBOTICS", desc: "3D printers & automation workspace" },
    { id: "dest_stairs_2", name: "Central Staircase (2F)", code: "STR-2F", category: "STAIRCASE", buildingId: "main_academic", floor: 2, x: 290, y: 240, qr: "CAMPUS:MAIN:2:STAIRS", desc: "Top floor stairhead" },
  ],
  edges: [
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
  ]
};

function getDatabase() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATABASE, null, 2));
    return INITIAL_DATABASE;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return INITIAL_DATABASE;
  }
}

function saveDatabase(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // REST API Endpoints
  if (pathname.startsWith('/api/')) {
    const db = getDatabase();

    if (pathname === '/api/campus' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: db.campus }));
      return;
    }

    if (pathname === '/api/destinations' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: db.destinations.length, data: db.destinations }));
      return;
    }

    if (pathname === '/api/graph' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, edges: db.edges }));
      return;
    }

    if (pathname === '/api/blueprint/save' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          if (payload.floor !== undefined && payload.blueprintData) {
            db.blueprints[payload.floor] = payload.blueprintData;
            saveDatabase(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: `Blueprint saved for floor ${payload.floor}` }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
          }
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return;
    }

    if (pathname.startsWith('/api/blueprint/') && req.method === 'GET') {
      const floor = pathname.split('/').pop();
      const bp = db.blueprints[floor] || null;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, floor, blueprint: bp }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'API route not found' }));
    return;
  }

  // Static File Serving
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Smart Campus Navigation Full-Stack Portal & API running at: http://localhost:${PORT}/`);
});
