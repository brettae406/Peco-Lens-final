/* ============================================================
   PECO LENS — APP.JS
   Technician Command Suite Logic
============================================================ */

/* ============================================================
   GLOBAL STATE
============================================================ */
let currentUser = null;

let users = [
  { username: "brett", passcode: "1214", role: "admin" }
];

let historyLog = [];
let profiles = [];
let messages = [];
let matrixData = [];

/* ============================================================
   LOGIN LOGIC
============================================================ */
function login() {
  const user = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPasscode").value.trim();
  const error = document.getElementById("loginError");

  const match = users.find(u => u.username === user && u.passcode === pass);

  if (!match) {
    error.textContent = "Invalid username or passcode.";
    error.classList.remove("hidden");
    return;
  }

  currentUser = match;
  document.getElementById("loginLayer").classList.add("hidden");
  document.getElementById("appShell").classList.remove("hidden");
}

/* ============================================================
   HIGH CONTRAST MODE
============================================================ */
function toggleHighContrast() {
  document.body.classList.toggle("high-contrast");
}

/* ============================================================
   VERTICAL LAYER NAVIGATION
============================================================ */
let currentLayerIndex = 0;

function goToLayer(index) {
  const track = document.getElementById("layerTrack");
  const layers = document.querySelectorAll(".layer");

  if (index < 0 || index >= layers.length) return;

  currentLayerIndex = index;
  track.scrollTo({
    top: layers[index].offsetTop,
    behavior: "smooth"
  });
}

/* ============================================================
   HORIZONTAL CARD NAVIGATION
============================================================ */
function snapCards() {
  const tracks = document.querySelectorAll(".card-track");

  tracks.forEach(track => {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener("mousedown", e => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener("mouseleave", () => isDown = false);
    track.addEventListener("mouseup", () => isDown = false);

    track.addEventListener("mousemove", e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  });
}

document.addEventListener("DOMContentLoaded", snapCards);

/* ============================================================
   CAMERA + LENS CAPTURE
============================================================ */
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById("cameraFeed");
    if (video) video.srcObject = stream;
  } catch (err) {
    console.error("Camera error:", err);
  }
}

startCamera();

/* ============================================================
   LENS ANALYSIS HANDLER
============================================================ */
async function captureAndAnalyze(lensType) {
  const outputId = {
    ar: "lensAnalysisAR",
    ai: "lensAnalysisAI",
    poultry: "lensAnalysisPoultry",
    megajet: "lensAnalysisMegaJet",
    thermal: "lensAnalysisThermal",
    calibration: "lensAnalysisCalibration",
    vision: "lensAnalysisVision"
  }[lensType];

  const output = document.getElementById(outputId);
  if (!output) return;

  output.innerHTML = `<p class="loading">Analyzing with ${lensType} lens...</p>`;

  // Placeholder AI response
  setTimeout(() => {
    output.innerHTML = `
      <h3>Analysis Complete</h3>
      <p>Lens: <strong>${lensType}</strong></p>
      <p>Findings: (AI logic will be added in Part 4)</p>
    `;
    addToHistory(`Lens analysis completed: ${lensType}`);
  }, 900);
}

/* ============================================================
   HISTORY SYSTEM
============================================================ */
function addToHistory(entry) {
  historyLog.push({
    text: entry,
    time: new Date().toLocaleString()
  });
  renderHistory();
}

function renderHistory() {
  const box = document.getElementById("historyList");
  if (!box) return;

  box.innerHTML = historyLog
    .map(h => `<p><strong>${h.time}</strong><br>${h.text}</p>`)
    .join("");
}

function clearHistory() {
  historyLog = [];
  renderHistory();/* ============================================================
   TOOLS — DIAGNOSTICS AI
============================================================ */
function runDiagnostics() {
  const input = document.getElementById("diagnosticsInput").value.trim();
  const output = document.getElementById("diagnosticsOutput");

  if (!input) {
    output.innerHTML = "<p>Please describe the issue.</p>";
    return;
  }

  output.innerHTML = `
    <p class="loading">Analyzing symptoms...</p>
  `;

  setTimeout(() => {
    output.innerHTML = `
      <h3>Diagnostics Result</h3>
      <p><strong>Input:</strong> ${input}</p>
      <p><strong>AI Assessment:</strong> (Full AI logic added in Part 4)</p>
    `;
    addToHistory(`Diagnostics run: ${input}`);
  }, 900);
}

/* ============================================================
   TOOLS — GALLERY
============================================================ */
function addToGallery(imageData, label = "Capture") {
  const entry = {
    id: Date.now(),
    label,
    image: imageData,
    time: new Date().toLocaleString()
  };

  gallery.push(entry);
  renderGallery();
}

let gallery = [];

function renderGallery() {
  const box = document.getElementById("galleryList");
  if (!box) return;

  box.innerHTML = gallery
    .map(g => `
      <div class="gallery-item">
        <p><strong>${g.label}</strong> — ${g.time}</p>
      </div>
    `)
    .join("");
}

/* ============================================================
   TOOLS — POULTRY CUTS GALLERY
============================================================ */
let poultryCuts = [];

function addPoultryCut(imageData, grade = "Unclassified") {
  poultryCuts.push({
    id: Date.now(),
    grade,
    image: imageData,
    time: new Date().toLocaleString()
  });
  renderPoultryCuts();
}

function renderPoultryCuts() {
  const box = document.getElementById("poultryGallery");
  if (!box) return;

  box.innerHTML = poultryCuts
    .map(p => `
      <div class="gallery-item">
        <p><strong>${p.grade}</strong> — ${p.time}</p>
      </div>
    `)
    .join("");
}

/* ============================================================
   TOOLS — PARTS LOOKUP
============================================================ */
const partsDatabase = [
  { name: "Nozzle Assembly", system: "MegaJet", component: "Cutter" },
  { name: "Encoder Wheel", system: "Drive Banks", component: "Encoder" },
  { name: "Vision Camera", system: "Vision Systems", component: "Camera" }
];

function searchParts() {
  const query = document.getElementById("partsSearch").value.toLowerCase();
  const results = document.getElementById("partsResults");

  const matches = partsDatabase.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.system.toLowerCase().includes(query) ||
    p.component.toLowerCase().includes(query)
  );

  results.innerHTML = matches.length
    ? matches.map(m => `
        <p><strong>${m.name}</strong><br>
        System: ${m.system}<br>
        Component: ${m.component}</p>
      `).join("")
    : "<p>No parts found.</p>";
}

document.getElementById("partsSearch")?.addEventListener("input", searchParts);

/* ============================================================
   TOOLS — VISION PANEL
============================================================ */
function renderVisionPanel() {
  const box = document.getElementById("visionPanel");
  if (!box) return;

  box.innerHTML = `
    <p><strong>Camera Status:</strong> OK</p>
    <p><strong>Exposure:</strong> Auto</p>
    <p><strong>Focus:</strong> Stable</p>
    <p><strong>Contrast:</strong> Normal</p>
    <p><strong>Diagnostics:</strong> No issues detected</p>
  `;
}

renderVisionPanel();

/* ============================================================
   MAINTENANCE — PM LIST
============================================================ */
let maintenanceTasks = [
  { system: "MegaJet", machine: "Cutter 1", task: "Check nozzle wear", frequency: "Daily" },
  { system: "Grasselli", machine: "Slicer A", task: "Inspect blade tension", frequency: "Weekly" },
  { system: "Drive Banks", machine: "Lane 3", task: "Check encoder alignment", frequency: "Monthly" }
];

function renderMaintenanceList() {
  const sys = document.getElementById("maintFilterSystem").value.toLowerCase();
  const mach = document.getElementById("maintFilterMachine").value.toLowerCase();
  const box = document.getElementById("maintenanceList");

  const filtered = maintenanceTasks.filter(t =>
    t.system.toLowerCase().includes(sys) &&
    t.machine.toLowerCase().includes(mach)
  );

  box.innerHTML = filtered
    .map(t => `
      <p><strong>${t.task}</strong><br>
      System: ${t.system}<br>
      Machine: ${t.machine}<br>
      Frequency: ${t.frequency}</p>
    `)
    .join("");
}

document.getElementById("maintFilterSystem")?.addEventListener("input", renderMaintenanceList);
document.getElementById("maintFilterMachine")?.addEventListener("input", renderMaintenanceList);

renderMaintenanceList();

/* ============================================================
   MAINTENANCE — INSPECTION GUIDES
============================================================ */
let inspectionGuides = [
  { title: "Nozzle Alignment", steps: ["Remove guard", "Check alignment", "Adjust screws", "Verify cut"] },
  { title: "Encoder Cleaning", steps: ["Power off", "Remove cover", "Clean wheel", "Reinstall"] }
];

function renderInspectionGuides() {
  const box = document.getElementById("inspectionGuides");
  if (!box) return;

  box.innerHTML = inspectionGuides
    .map(g => `
      <div class="guide-block">
        <h3>${g.title}</h3>
        <ul>${g.steps.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>
    `)
    .join("");
}

renderInspectionGuides();

/* ============================================================
   MAINTENANCE — FAILURE ANALYSIS
============================================================ */
let failureModes = [
  { mode: "Nozzle Wear", cause: "High pressure erosion", action: "Replace nozzle" },
  { mode: "Encoder Slip", cause: "Contamination", action: "Clean encoder wheel" }
];

function renderFailureAnalysis() {
  const box = document.getElementById("failureAnalysis");
  if (!box) return;

  box.innerHTML = failureModes
    .map(f => `
      <p><strong>${f.mode}</strong><br>
      Cause: ${f.cause}<br>
      Action: ${f.action}</p>
    `)
    .join("");
}

renderFailureAnalysis();

/* ============================================================
   PM ENGINE
============================================================ */
function renderPMEngine() {
  const sys = document.getElementById("pmFilterSystem").value.toLowerCase();
  const mach = document.getElementById("pmFilterMachine").value.toLowerCase();
  const freq = document.getElementById("pmFilterFrequency").value.toLowerCase();
  const sev = document.getElementById("pmFilterSeverity").value.toLowerCase();

  const box = document.getElementById("pmList");

  const filtered = matrixData.filter(m =>
    m.system.toLowerCase().includes(sys) &&
    m.machine.toLowerCase().includes(mach) &&
    m.frequency.toLowerCase().includes(freq) &&
    m.severity.toLowerCase().includes(sev)
  );

  box.innerHTML = filtered.length
    ? filtered.map(m => `
        <p><strong>${m.pm}</strong><br>
        System: ${m.system}<br>
        Machine: ${m.machine}<br>
        Frequency: ${m.frequency}<br>
        Severity: ${m.severity}</p>
      `).join("")
    : "<p>No PM tasks match filters.</p>";
}

document.getElementById("pmFilterSystem")?.addEventListener("input", renderPMEngine);
document.getElementById("pmFilterMachine")?.addEventListener("input", renderPMEngine);
document.getElementById("pmFilterFrequency")?.addEventListener("input", renderPMEngine);
document.getElementById("pmFilterSeverity")?.addEventListener("input", renderPMEngine);
}/* ============================================================
   MATRIX LOG — LOAD + RENDER
============================================================ */
async function loadMatrix() {
  try {
    const response = await fetch("matrix.json");
    matrixData = await response.json();
    renderMatrixLog();
    renderPMEngine();
  } catch (err) {
    console.error("Matrix load error:", err);
  }
}

function renderMatrixLog() {
  const body = document.getElementById("matrixLogBody");
  if (!body) return;

  body.innerHTML = matrixData
    .map(row => `
      <tr>
        <td>${row.id}</td>
        <td>${row.system}</td>
        <td>${row.machine}</td>
        <td>${row.lane}</td>
        <td>${row.cutter}</td>
        <td>${row.subasm}</td>
        <td>${row.component}</td>
        <td>${row.pm}</td>
        <td>${row.frequency}</td>
        <td>${row.severity}</td>
        <td>${row.notes}</td>
      </tr>
    `)
    .join("");
}

loadMatrix();

/* ============================================================
   TRAINING MODULE GENERATOR
============================================================ */
function generateTrainingModule() {
  const system = document.getElementById("trainingSystem").value;
  const topic = document.getElementById("trainingTopic").value.trim();
  const box = document.getElementById("trainingContent");

  if (!topic) {
    box.innerHTML = "<p>Please enter a training topic.</p>";
    return;
  }

  box.innerHTML = `
    <p class="loading">Generating training module...</p>
  `;

  setTimeout(() => {
    box.innerHTML = `
      <h3>${system} — ${topic}</h3>
      <p>(Full AI training content will be added in Part 4)</p>
      <ul>
        <li>Step 1: Preparation</li>
        <li>Step 2: Inspection</li>
        <li>Step 3: Adjustment</li>
        <li>Step 4: Verification</li>
      </ul>
    `;
    addToHistory(`Training module generated: ${system} — ${topic}`);
  }, 900);
}

/* ============================================================
   MESSAGING SYSTEM
============================================================ */
function sendUserMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  messages.push({
    user: currentUser.username,
    text,
    time: new Date().toLocaleTimeString()
  });

  input.value = "";
  renderMessages();
  addToHistory(`Message sent: ${text}`);
}

function renderMessages() {
  const box = document.getElementById("chatLog");
  if (!box) return;

  box.innerHTML = messages
    .map(m => `
      <p><strong>${m.user}</strong> (${m.time})<br>${m.text}</p>
    `)
    .join("");

  box.scrollTop = box.scrollHeight;
}

/* ============================================================
   PROFILES SYSTEM
============================================================ */
function saveProfile() {
  const name = document.getElementById("profileName").value.trim();
  const location = document.getElementById("profileLocation").value.trim();
  const notes = document.getElementById("profileNotes").value.trim();

  if (!name) return;

  profiles.push({
    id: Date.now(),
    name,
    location,
    notes
  });

  renderProfiles();
  addToHistory(`Profile saved: ${name}`);
}

function renderProfiles() {
  const box = document.getElementById("profilesList");
  if (!box) return;

  box.innerHTML = profiles
    .map(p => `
      <div class="profile-block">
        <h3>${p.name}</h3>
        <p><strong>Location:</strong> ${p.location || "N/A"}</p>
        <p>${p.notes || ""}</p>
      </div>
    `)
    .join("");
}

function clearProfiles() {
  profiles = [];
  renderProfiles();
}

/* ============================================================
   SETTINGS — USER MANAGER
============================================================ */
function addUser() {
  const name = document.getElementById("newUserName").value.trim();
  const pass = document.getElementById("newUserPass").value.trim();

  if (!name || !pass) return;

  users.push({ username: name, passcode: pass, role: "tech" });
  renderUserList();
  addToHistory(`User added: ${name}`);
}

function removeUser() {
  const name = document.getElementById("newUserName").value.trim();
  if (!name) return;

  users = users.filter(u => u.username !== name);
  renderUserList();
  addToHistory(`User removed: ${name}`);
}

function renderUserList() {
  const box = document.getElementById("userList");
  if (!box) return;

  box.innerHTML = users
    .map(u => `
      <p><strong>${u.username}</strong> — ${u.role}</p>
    `)
    .join("");
}

renderUserList();

/* ============================================================
   PWA INSTALL HANDLER
============================================================ */
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
});

function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt = null;
  5
}
