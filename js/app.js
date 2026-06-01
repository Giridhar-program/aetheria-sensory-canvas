/**
 * Aetheria Core Engine - app.js
 * Implements interactive canvas overlays, real-time parallax scrolling,
 * Speech Recognition commands, context scent themes, custom data sketchpad plotting,
 * progressive forms, and paper-plane flight storyboard micro-interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE SYSTEM ---
  const state = {
    currentScent: localStorage.getItem("aetheria-scent") || "vanilla",
    lightDensity: "normal",
    voiceActive: false,
    gridDensity: "spacious",
    formStep: 0,
    sketchpadNodes: [],
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 }
  };

  // Set initial scent theme
  document.documentElement.setAttribute("data-scent", state.currentScent);

  // --- INITIALIZE ALL SUBSYSTEMS ---
  initNavigation();
  initAmbientSync();
  initBackgroundCanvas();
  initVoiceCommands();
  initDataSketchpad();
  initParallaxScroll();
  initProgressiveForm();
  syncScentSelectors();
});

// --- NAVIGATION & DOM LINK HELPER ---
function initNavigation() {
  const links = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname;
  links.forEach(link => {
    const href = link.getAttribute("href");
    if (currentPath.includes(href) && href !== "#") {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// --- FEATURE 2: DYNAMIC DELAUNAY SHAPE OVERLAYS ---
function initBackgroundCanvas() {
  const canvas = document.getElementById("overlayCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Floating shape nodes
  const nodes = [];
  const totalNodes = 32;

  for (let i = 0; i < totalNodes; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 6 + 2,
      baseRadius: Math.random() * 6 + 2,
      phase: Math.random() * Math.PI * 2
    });
  }

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Get color accents from CSS
    const computedStyles = getComputedStyle(document.documentElement);
    const accentColor = computedStyles.getPropertyValue("--color-accent").trim();
    const primaryColor = computedStyles.getPropertyValue("--color-primary").trim();

    // Node updates & attraction to cursor
    nodes.forEach(node => {
      node.phase += 0.01;
      node.radius = node.baseRadius + Math.sin(node.phase) * 1.5;

      // Mouse proximity factor
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 300) {
        const force = (300 - dist) / 300;
        node.x += (dx / dist) * force * 0.5;
        node.y += (dy / dist) * force * 0.5;
      }

      // Physics drift boundaries
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0) node.x = width;
      if (node.x > width) node.x = 0;
      if (node.y < 0) node.y = height;
      if (node.y > height) node.y = 0;

      // Render floating point
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.baseRadius > 5 ? accentColor : primaryColor;
      ctx.globalAlpha = 0.08;
      ctx.fill();
    });

    // Draw connection polygonal lines (custom proximity Delaunay structure)
    ctx.lineWidth = 0.6;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = accentColor;
          // Fade connection lines cleanly based on distance
          ctx.globalAlpha = (1 - dist / 130) * 0.08;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// --- FEATURE 3: CONTEXT-SENSITIVE LIGHT/TIME SYNC ---
function initAmbientSync() {
  const lightSlider = document.getElementById("ambientSlider");
  const timeDisplay = document.getElementById("timeDisplay");

  // Sync Slider changes to view filter modes
  if (lightSlider) {
    lightSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      let level = "normal";
      if (val < 0.3) level = "low";
      if (val > 0.7) level = "high";

      document.documentElement.setAttribute("data-light", level);
      const levelSpan = document.querySelector(".ambient-slider-panel span");
      if (levelSpan) {
        levelSpan.textContent = level.charAt(0).toUpperCase() + level.slice(1);
      }
    });
  }

  // Display simulated timezone time
  if (timeDisplay) {
    const updateTime = () => {
      const now = new Date();
      timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Automatically shift into deep low-contrast cozy night mode if past 8 PM
      if (now.getHours() >= 20 || now.getHours() < 6) {
        document.documentElement.setAttribute("data-light", "low");
        if (lightSlider) lightSlider.value = 0.15;
        const levelSpan = document.querySelector(".ambient-slider-panel span");
        if (levelSpan) levelSpan.textContent = "Low (Auto)";
      }
    };
    updateTime();
    setInterval(updateTime, 60000);
  }
}

// --- SENSORY SCENT SWITCHER ---
function setScentTheme(scent) {
  state.currentScent = scent;
  localStorage.setItem("aetheria-scent", scent);
  document.documentElement.setAttribute("data-scent", scent);
  syncScentSelectors();

  // Create subtle audio feedback or custom visual notifications
  console.log(`Ambient aroma profile transitioned to: ${scent}`);
}

function syncScentSelectors() {
  const options = document.querySelectorAll(".scent-card-option");
  options.forEach(opt => {
    if (opt.getAttribute("data-scent-select") === state.currentScent) {
      opt.classList.add("active");
    } else {
      opt.classList.remove("active");
    }
  });
}

// --- FEATURE 7: VOICE-ASSISTED UI HIGHLIGHT SYSTEM ---
function initVoiceCommands() {
  const voiceBtn = document.getElementById("voiceTrigger");
  if (!voiceBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.querySelector("span").textContent = "Voice Offline";
    voiceBtn.style.opacity = 0.5;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    if (!state.voiceActive) {
      voiceBtn.classList.add("listening");
      voiceBtn.querySelector("span").textContent = "Listening...";
      state.voiceActive = true;
      recognition.start();
    } else {
      stopVoice();
    }
  });

  recognition.onend = () => {
    stopVoice();
  };

  recognition.onerror = () => {
    stopVoice();
  };

  recognition.onresult = (e) => {
    const command = e.results[0][0].transcript.toLowerCase().trim();
    console.log(`Received Voice Command: "${command}"`);
    parseVoiceCommand(command);
  };

  function stopVoice() {
    voiceBtn.classList.remove("listening");
    voiceBtn.querySelector("span").textContent = "Voice Guide";
    state.voiceActive = false;
    try {
      recognition.stop();
    } catch(err) {}
  }
}

// Voice Command Routing & Visual Highlighter
function parseVoiceCommand(cmd) {
  // Scent theme adjustments
  if (cmd.includes("citrus") || cmd.includes("orange")) {
    setScentTheme("citrus");
    triggerSpeechFeedback("Citrus Aroma Profile Enabled.");
    highlightSelector('[data-scent-select="citrus"]');
    return;
  }
  if (cmd.includes("cedar") || cmd.includes("wood")) {
    setScentTheme("cedar");
    triggerSpeechFeedback("Earthy Cedar Profile Enabled.");
    highlightSelector('[data-scent-select="cedar"]');
    return;
  }
  if (cmd.includes("vanilla") || cmd.includes("cozy")) {
    setScentTheme("vanilla");
    triggerSpeechFeedback("Cozy Vanilla Profile Enabled.");
    highlightSelector('[data-scent-select="vanilla"]');
    return;
  }
  if (cmd.includes("breeze") || cmd.includes("ocean")) {
    setScentTheme("breeze");
    triggerSpeechFeedback("Oceanic Breeze Profile Enabled.");
    highlightSelector('[data-scent-select="breeze"]');
    return;
  }

  // Density modifications
  if (cmd.includes("compact") || cmd.includes("tight")) {
    const compactBtn = document.querySelector('[data-density="compact"]');
    if (compactBtn) {
      compactBtn.click();
      triggerSpeechFeedback("Switched to Compact Layout.");
      highlightSelector('[data-density="compact"]');
    }
    return;
  }
  if (cmd.includes("spacious") || cmd.includes("large")) {
    const spaciousBtn = document.querySelector('[data-density="spacious"]');
    if (spaciousBtn) {
      spaciousBtn.click();
      triggerSpeechFeedback("Switched to Spacious Layout.");
      highlightSelector('[data-density="spacious"]');
    }
    return;
  }

  // Routing and highlights
  if (cmd.includes("home") || cmd.includes("portal") || cmd.includes("main")) {
    window.location.href = "index.html";
    return;
  }
  if (cmd.includes("scent") || cmd.includes("sketchpad") || cmd.includes("gallery")) {
    window.location.href = "sensory.html";
    return;
  }
  if (cmd.includes("depth") || cmd.includes("dimension")) {
    window.location.href = "dimensions.html";
    return;
  }
  if (cmd.includes("feedback") || cmd.includes("survey") || cmd.includes("form")) {
    window.location.href = "feedback.html";
    return;
  }

  // Next progressive field trigger
  if (cmd.includes("next") || cmd.includes("continue") || cmd.includes("submit")) {
    const nextBtn = document.querySelector(".form-step.active .form-btn-next");
    if (nextBtn) {
      nextBtn.click();
      triggerSpeechFeedback("Navigated to next question.");
    }
    return;
  }

  // Default fallback highlight home card if matched
  triggerSpeechFeedback(`Sorry, I couldn't match the command "${cmd}".`);
}

function highlightSelector(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  // Add highly visible premium voice highlight class
  el.classList.add("voice-highlight-active");
  
  // Render floating absolute tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "voice-tooltip";
  tooltip.textContent = "Voice Target Found";
  document.body.appendChild(tooltip);

  const rect = el.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX + rect.width/2 - tooltip.offsetWidth/2}px`;
  tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 12}px`;

  setTimeout(() => {
    el.classList.remove("voice-highlight-active");
    tooltip.style.transition = "opacity 0.4s ease";
    tooltip.style.opacity = 0;
    setTimeout(() => tooltip.remove(), 400);
  }, 2200);
}

function triggerSpeechFeedback(message) {
  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.volume = 0.8;
    speech.rate = 1.05;
    window.speechSynthesis.speak(speech);
  }
}

// --- FEATURE 10: LIVE DATA SKETCHPAD ---
function initDataSketchpad() {
  const canvas = document.getElementById("sketchpadCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener("resize", () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
  });

  // Generative sensory data nodes
  const nodes = [];
  const nodeCount = 8;
  const labels = ["Citrus Density", "Woodland Pine", "Amber Warmth", "Humid Seafoam", "Cozy Orchid", "Bergamot", "Jasmine", "Moss"];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: 100 + Math.random() * (width - 200),
      y: 100 + Math.random() * (height - 200),
      label: labels[i % labels.length],
      value: Math.floor(Math.random() * 100),
      intensity: (Math.random() * 4 + 1.2).toFixed(1),
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 12
    });
  }

  state.sketchpadNodes = nodes;

  let activeNode = null;
  const inspector = document.getElementById("nodeInspector");

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    activeNode = null;
    nodes.forEach(node => {
      const dx = node.x - mx;
      const dy = node.y - my;
      if (Math.sqrt(dx*dx + dy*dy) < node.radius + 6) {
        activeNode = node;
      }
    });

    if (activeNode && inspector) {
      inspector.classList.add("active");
      inspector.querySelector(".inspector-title").textContent = activeNode.label;
      inspector.querySelector('[data-val="intensity"]').textContent = `${activeNode.intensity} ml`;
      inspector.querySelector('[data-val="index"]').textContent = `${activeNode.value}%`;
      inspector.querySelector('[data-val="coord"]').textContent = `X: ${Math.floor(activeNode.x)}, Y: ${Math.floor(activeNode.y)}`;
    } else if (inspector) {
      inspector.classList.remove("active");
    }
  });

  // Randomize values when clicked
  canvas.addEventListener("click", (e) => {
    if (activeNode) {
      activeNode.value = Math.floor(Math.random() * 100);
      activeNode.intensity = (Math.random() * 4 + 1.2).toFixed(1);
      activeNode.vx = (Math.random() - 0.5) * 1.5;
      activeNode.vy = (Math.random() - 0.5) * 1.5;
      triggerSpeechFeedback(`${activeNode.label} sensory node modulated.`);
    }
  });

  function drawSketch() {
    ctx.clearRect(0, 0, width, height);

    const computedStyles = getComputedStyle(document.documentElement);
    const accentColor = computedStyles.getPropertyValue("--color-accent").trim();
    const secondaryColor = computedStyles.getPropertyValue("--color-secondary").trim();

    // Draw connecting geometry lines between all nodes
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // Draw active connections with glowing highlight lines
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 40 || node.x > width - 40) node.vx *= -1;
      if (node.y < 40 || node.y > height - 40) node.vy *= -1;

      const isHovered = activeNode === node;
      
      // Node halo glow ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + (isHovered ? 8 : 4), 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = isHovered ? 0.6 : 0.2;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node core solid fill
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius - 4, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? "#ffffff" : accentColor;
      ctx.globalAlpha = 0.85;
      ctx.fill();

      // Data Text indicators
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 11px Inter";
      ctx.globalAlpha = isHovered ? 1.0 : 0.6;
      ctx.fillText(node.label, node.x + 18, node.y + 4);
    });

    requestAnimationFrame(drawSketch);
  }

  drawSketch();
}

// --- FEATURE 5: PARALLAX 3D LAYER SCROLLING ---
function initParallaxScroll() {
  const scrollFar = document.querySelector(".layer-depth-far");
  const scrollMid = document.querySelector(".layer-depth-mid");
  const scrollFront = document.querySelector(".layer-depth-front");

  if (!scrollFront) return; // Parallax elements not present on this page

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Apply hardware-accelerated translations based on depth coefficients
    // Depth layer calculations
    if (scrollFar) {
      scrollFar.style.transform = `translate3d(0, ${scrollY * 0.6}px, -300px) scale(2)`;
    }
    if (scrollMid) {
      scrollMid.style.transform = `translate3d(0, ${scrollY * 0.3}px, -150px) scale(1.5)`;
    }
    // Foreground flows normally, custom blur/fade effects can trigger at specific markers
    const opacityFactor = Math.max(0, 1 - scrollY / 800);
    const heroBox = document.querySelector(".parallax-hero-box");
    if (heroBox) {
      heroBox.style.opacity = opacityFactor;
      heroBox.style.filter = `blur(${scrollY * 0.015}px)`;
    }
  });
}

// --- FEATURE 6: PROGRESSIVE REVEAL FORM & STORYBOARD ---
function initProgressiveForm() {
  const steps = document.querySelectorAll(".form-step");
  const nextBtns = document.querySelectorAll(".form-btn-next");
  const progressForm = document.getElementById("sensorySurvey");

  if (!progressForm) return;

  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentStepEl = steps[state.formStep];
      const input = currentStepEl.querySelector("input, select, textarea");

      // Verify simple input completion
      if (input && input.value.trim() === "") {
        input.style.borderColor = "red";
        setTimeout(() => input.style.borderColor = "", 1500);
        triggerSpeechFeedback("Please complete this field first.");
        return;
      }

      // Progressively update steps
      currentStepEl.classList.remove("active");
      currentStepEl.classList.add("completed");

      state.formStep++;

      if (state.formStep < steps.length) {
        steps[state.formStep].classList.add("active");
        triggerSpeechFeedback("Question loaded.");
      } else {
        // Complete workflow - trigger Flight Storyboard!
        triggerPaperPlaneStoryboard();
      }
    });
  });
}

// Micro-Interaction Storyboard Flight
function triggerPaperPlaneStoryboard() {
  const overlay = document.getElementById("storyboardOverlay");
  if (!overlay) return;

  overlay.classList.add("visible");
  triggerSpeechFeedback("Form submitted successfully. Initiating sensory delivery.");

  const path = document.getElementById("flightPath");
  const plane = document.getElementById("flyingPlane");
  const successMsg = document.getElementById("successMessage");

  if (!path || !plane || !successMsg) return;

  const pathLength = path.getTotalLength();
  plane.style.opacity = 1;

  let progress = 0;
  const duration = 2800; // 2.8 seconds
  const start = performance.now();

  function animatePlane(time) {
    const elapsed = time - start;
    progress = Math.min(elapsed / duration, 1);

    // Get exact path coordinate vectors
    const point = path.getPointAtLength(progress * pathLength);
    // Find derivative/tangent for flight rotation angle
    const lookAheadPoint = path.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));

    const dx = lookAheadPoint.x - point.x;
    const dy = lookAheadPoint.y - point.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45; // adjustment offset

    plane.style.left = `${point.x}px`;
    plane.style.top = `${point.y}px`;
    plane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animatePlane);
    } else {
      // Complete flight path! Hide plane, fade in success details
      plane.style.transition = "opacity 0.4s ease";
      plane.style.opacity = 0;
      successMsg.classList.add("visible");
      triggerSpeechFeedback("Sensory delivery completed! Your responses are preserved.");
    }
  }

  requestAnimationFrame(animatePlane);
}

// --- FEATURE 8: ADAPTIVE GRID DENSITY TOGGLE ---
window.toggleDensity = function(density) {
  const grid = document.getElementById("adaptiveGrid");
  const spaciousBtn = document.getElementById("densitySpacious");
  const compactBtn = document.getElementById("densityCompact");

  if (!grid) return;

  if (density === "spacious") {
    grid.className = "adaptive-grid spacious";
    if (spaciousBtn) spaciousBtn.classList.add("active");
    if (compactBtn) compactBtn.classList.remove("active");
    state.gridDensity = "spacious";
  } else {
    grid.className = "adaptive-grid compact";
    if (spaciousBtn) spaciousBtn.classList.remove("active");
    if (compactBtn) compactBtn.classList.add("active");
    state.gridDensity = "compact";
  }
};
