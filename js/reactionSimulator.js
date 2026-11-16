/**
 * Module 2: რეაქციის სიჩქარის სიმულატორი (Reaction Rate Simulator)
 * HTML5 Canvas 2D Particle Engine with Kinetic Collision Physics
 * Georgian 10th Grade Chemistry Curriculum (ესგ)
 */

class ReactionSimulatorModule {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.chartCanvas = document.getElementById('rateGraphCanvas');
    this.chartCtx = this.chartCanvas ? this.chartCanvas.getContext('2d') : null;

    // Simulation Parameters
    this.concentration = 30; // 10 to 60 per reactant
    this.temperature = 300; // Kelvin (200 - 800)
    this.surfaceAreaMode = 'homogeneous'; // 'homogeneous', 'solid_block', 'solid_powder'
    this.hasCatalyst = false;
    this.isRunning = true;

    // Simulation State
    this.particles = [];
    this.effects = [];
    this.totalCollisions = 0;
    this.effectiveCollisions = 0;
    this.recentEffectiveCollisions = 0;
    this.reactionRate = 0;
    this.historyData = []; // { time, concA, concB, concProduct }
    this.simTime = 0;
    this.lastRateCalcTime = 0;
    this.animationId = null;

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.resizeCanvases();
    window.addEventListener('resize', () => {
      this.resizeCanvases();
    });

    this.setupControls();
    this.resetSimulation();
    this.startLoop();
  }

  resizeCanvases() {
    if (this.canvas) {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = Math.max(300, Math.floor(rect.width));
      this.canvas.height = 340;
    }
    if (this.chartCanvas) {
      const chartRect = this.chartCanvas.parentElement.getBoundingClientRect();
      this.chartCanvas.width = Math.max(300, Math.floor(chartRect.width));
      this.chartCanvas.height = 180;
    }
  }

  setupControls() {
    const concSlider = document.getElementById('simConcSlider');
    const concVal = document.getElementById('simConcValue');
    const tempSlider = document.getElementById('simTempSlider');
    const tempVal = document.getElementById('simTempValue');
    const surfaceSelect = document.getElementById('simSurfaceSelect');
    const catalystToggle = document.getElementById('simCatalystToggle');
    const btnPlayPause = document.getElementById('btnSimPlayPause');
    const btnReset = document.getElementById('btnSimReset');

    if (concSlider) {
      concSlider.addEventListener('input', (e) => {
        this.concentration = parseInt(e.target.value, 10);
        if (concVal) concVal.textContent = `${this.concentration} ნაწილაკი`;
        this.resetSimulation();
      });
    }

    if (tempSlider) {
      tempSlider.addEventListener('input', (e) => {
        this.temperature = parseInt(e.target.value, 10);
        if (tempVal) tempVal.textContent = `${this.temperature} K (${this.temperature - 273}°C)`;
        this.updateParticleVelocities();
      });
    }

    if (surfaceSelect) {
      surfaceSelect.addEventListener('change', (e) => {
        this.surfaceAreaMode = e.target.value;
        this.resetSimulation();
      });
    }

    if (catalystToggle) {
      catalystToggle.addEventListener('change', (e) => {
        this.hasCatalyst = e.target.checked;
        const banner = document.getElementById('catalystActiveBadge');
        if (banner) {
          banner.classList.toggle('hidden', !this.hasCatalyst);
        }
      });
    }

    if (btnPlayPause) {
      btnPlayPause.addEventListener('click', () => {
        this.isRunning = !this.isRunning;
        btnPlayPause.innerHTML = this.isRunning 
          ? `<svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> შეჩერება` 
          : `<svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> გაგრძელება`;
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.resetSimulation();
      });
    }
  }

  getSpeedMultiplier() {
    // v proportional to sqrt(T)
    return Math.sqrt(this.temperature / 300);
  }

  updateParticleVelocities() {
    const mult = this.getSpeedMultiplier();
    this.particles.forEach(p => {
      const currentSpeed = Math.hypot(p.vx, p.vy);
      if (currentSpeed > 0) {
        const factor = (p.baseSpeed * mult) / currentSpeed;
        p.vx *= factor;
        p.vy *= factor;
      }
    });
  }

  resetSimulation() {
    this.particles = [];
    this.effects = [];
    this.totalCollisions = 0;
    this.effectiveCollisions = 0;
    this.recentEffectiveCollisions = 0;
    this.reactionRate = 0;
    this.simTime = 0;
    this.lastRateCalcTime = 0;
    this.historyData = [];

    const w = this.canvas.width;
    const h = this.canvas.height;
    const speedMult = this.getSpeedMultiplier();

    if (this.surfaceAreaMode === 'homogeneous') {
      // Spawn particles A (Blue)
      for (let i = 0; i < this.concentration; i++) {
        const baseSpeed = 1.2 + Math.random() * 1.4;
        const angle = Math.random() * Math.PI * 2;
        this.particles.push({
          type: 'A',
          x: 20 + Math.random() * (w - 40),
          y: 20 + Math.random() * (h - 40),
          vx: Math.cos(angle) * baseSpeed * speedMult,
          vy: Math.sin(angle) * baseSpeed * speedMult,
          radius: 6,
          color: '#38bdf8', // Light blue
          baseSpeed: baseSpeed
        });
      }

      // Spawn particles B (Orange/Red)
      for (let i = 0; i < this.concentration; i++) {
        const baseSpeed = 1.2 + Math.random() * 1.4;
        const angle = Math.random() * Math.PI * 2;
        this.particles.push({
          type: 'B',
          x: 20 + Math.random() * (w - 40),
          y: 20 + Math.random() * (h - 40),
          vx: Math.cos(angle) * baseSpeed * speedMult,
          vy: Math.sin(angle) * baseSpeed * speedMult,
          radius: 6,
          color: '#f43f5e', // Rose/Red
          baseSpeed: baseSpeed
        });
      }
    } else if (this.surfaceAreaMode === 'solid_block') {
      // Heterogeneous: Solid block on bottom center
      // Mobile reactant A (Blue) in air
      for (let i = 0; i < this.concentration; i++) {
        const baseSpeed = 1.4 + Math.random() * 1.5;
        const angle = Math.random() * Math.PI * 2;
        this.particles.push({
          type: 'A',
          x: 20 + Math.random() * (w - 40),
          y: 20 + Math.random() * (h - 120),
          vx: Math.cos(angle) * baseSpeed * speedMult,
          vy: Math.sin(angle) * baseSpeed * speedMult,
          radius: 6,
          color: '#38bdf8',
          baseSpeed: baseSpeed
        });
      }

      // Compact solid block of B particles at the bottom center
      const rows = 4;
      const cols = Math.floor(this.concentration / rows);
      const startX = w / 2 - (cols * 14) / 2;
      const startY = h - 60;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isSurface = (r === 0 || c === 0 || c === cols - 1);
          this.particles.push({
            type: 'B',
            x: startX + c * 14,
            y: startY + r * 14,
            vx: 0,
            vy: 0,
            radius: 6,
            color: isSurface ? '#f43f5e' : '#9f1239', // Darker interior (blocked)
            isSolid: true,
            isSurface: isSurface,
            baseSpeed: 0
          });
        }
      }
    } else if (this.surfaceAreaMode === 'solid_powder') {
      // Heterogeneous: Finely powdered solid distributed along bottom
      for (let i = 0; i < this.concentration; i++) {
        const baseSpeed = 1.4 + Math.random() * 1.5;
        const angle = Math.random() * Math.PI * 2;
        this.particles.push({
          type: 'A',
          x: 20 + Math.random() * (w - 40),
          y: 20 + Math.random() * (h - 90),
          vx: Math.cos(angle) * baseSpeed * speedMult,
          vy: Math.sin(angle) * baseSpeed * speedMult,
          radius: 6,
          color: '#38bdf8',
          baseSpeed: baseSpeed
        });
      }

      // Many scattered small clusters (high surface area)
      const countB = this.concentration;
      for (let i = 0; i < countB; i++) {
        const xPos = 25 + (i * ((w - 50) / countB));
        this.particles.push({
          type: 'B',
          x: xPos + (Math.random() * 6 - 3),
          y: h - 25 - (Math.random() * 30),
          vx: 0,
          vy: 0,
          radius: 6,
          color: '#f43f5e',
          isSolid: true,
          isSurface: true, // Almost all are exposed surface sites!
          baseSpeed: 0
        });
      }
    }

    this.recordHistory();
    this.updateStatsDisplay();
  }

  startLoop() {
    const loop = (timestamp) => {
      if (this.isRunning) {
        this.updatePhysics();
      }
      this.render();
      this.renderChart();
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  updatePhysics() {
    this.simTime += 0.016; // approx 60fps
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Energy threshold calculation:
    // Base activation energy barrier (higher at lower temp without catalyst)
    // Catalyst lowers this threshold drastically
    const thresholdFactor = this.hasCatalyst ? 0.35 : 0.72;

    // Update positions & wall collisions
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.isSolid) continue; // solid doesn't move

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x - p.radius < 0) {
        p.x = p.radius;
        p.vx *= -1;
      } else if (p.x + p.radius > w) {
        p.x = w - p.radius;
        p.vx *= -1;
      }

      if (p.y - p.radius < 0) {
        p.y = p.radius;
        p.vy *= -1;
      } else if (p.y + p.radius > h) {
        p.y = h - p.radius;
        p.vy *= -1;
      }
    }

    // Particle-Particle Collisions
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        // Check if both are solid (they don't collide with each other)
        if (p1.isSolid && p2.isSolid) continue;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);
        const minDist = p1.radius + p2.radius;

        if (dist < minDist && dist > 0) {
          this.totalCollisions++;

          // Normal collision vector
          const nx = dx / dist;
          const ny = dy / dist;

          // Relative velocity
          const rvx = p2.vx - p1.vx;
          const rvy = p2.vy - p1.vy;
          const velAlongNormal = rvx * nx + rvy * ny;

          // Chemical reaction check: between Reactant A and Reactant B
          const isReactantsPair = (p1.type === 'A' && p2.type === 'B') || (p1.type === 'B' && p2.type === 'A');

          if (isReactantsPair && velAlongNormal < 0) {
            // Check surface area accessibility if solid
            const solidParticipant = p1.isSolid ? p1 : (p2.isSolid ? p2 : null);
            const isAccessible = !solidParticipant || solidParticipant.isSurface;

            // Kinetic energy proxy: proportional to relative velocity squared and temperature
            const relSpeed = Math.hypot(rvx, rvy);
            const kineticEnergy = (relSpeed * relSpeed) * (this.temperature / 300);
            
            // Random orientation factor (0.2 to 1.0)
            const orientationFactor = 0.3 + Math.random() * 0.7;
            const effectiveEnergy = kineticEnergy * orientationFactor;

            // Reaction occurs if energy exceeds threshold and surface is exposed
            if (isAccessible && (effectiveEnergy > thresholdFactor * 8 || (this.hasCatalyst && Math.random() > 0.45))) {
              // Successful Effective Collision!
              this.effectiveCollisions++;
              this.recentEffectiveCollisions++;

              // Create Product Particle AB at midpoint
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              // Visual Flash Effect
              this.effects.push({
                x: midX,
                y: midY,
                radius: 18,
                alpha: 1.0,
                color: '#34d399'
              });

              // Transform into product AB
              p1.type = 'AB';
              p1.color = '#10b981'; // Emerald Green
              p1.radius = 8;
              p1.isSolid = false;
              p1.vx = (p1.vx + p2.vx) * 0.6;
              p1.vy = (p1.vy + p2.vy) * 0.6;

              // Remove particle p2 from array
              this.particles.splice(j, 1);
              j--;

              // If solid block reacted on surface, expose next neighbor in block
              if (this.surfaceAreaMode === 'solid_block') {
                this.particles.filter(p => p.isSolid && !p.isSurface).slice(0, 1).forEach(p => {
                  p.isSurface = true;
                  p.color = '#f43f5e';
                });
              }

              continue;
            }
          }

          // Elastic bounce
          if (velAlongNormal < 0) {
            const restitution = 0.95;
            const impulse = -(1 + restitution) * velAlongNormal;

            if (!p1.isSolid && !p2.isSolid) {
              p1.vx -= (impulse / 2) * nx;
              p1.vy -= (impulse / 2) * ny;
              p2.vx += (impulse / 2) * nx;
              p2.vy += (impulse / 2) * ny;
            } else if (p1.isSolid && !p2.isSolid) {
              p2.vx += impulse * nx;
              p2.vy += impulse * ny;
            } else if (!p1.isSolid && p2.isSolid) {
              p1.vx -= impulse * nx;
              p1.vy -= impulse * ny;
            }
          }

          // Separate overlapping particles
          const overlap = minDist - dist;
          if (!p1.isSolid && !p2.isSolid) {
            p1.x -= (overlap / 2) * nx;
            p1.y -= (overlap / 2) * ny;
            p2.x += (overlap / 2) * nx;
            p2.y += (overlap / 2) * ny;
          } else if (p1.isSolid && !p2.isSolid) {
            p2.x += overlap * nx;
            p2.y += overlap * ny;
          } else if (!p1.isSolid && p2.isSolid) {
            p1.x -= overlap * nx;
            p1.y -= overlap * ny;
          }
        }
      }
    }

    // Update Visual Effects (flashes)
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const ef = this.effects[i];
      ef.alpha -= 0.05;
      ef.radius += 0.8;
      if (ef.alpha <= 0) {
        this.effects.splice(i, 1);
      }
    }

    // Rate calculations & Graph sample every 0.5s
    if (this.simTime - this.lastRateCalcTime >= 0.5) {
      this.reactionRate = (this.recentEffectiveCollisions / 0.5);
      this.recentEffectiveCollisions = 0;
      this.lastRateCalcTime = this.simTime;
      this.recordHistory();
      this.updateStatsDisplay();
    }
  }

  recordHistory() {
    let countA = 0;
    let countB = 0;
    let countAB = 0;

    this.particles.forEach(p => {
      if (p.type === 'A') countA++;
      else if (p.type === 'B') countB++;
      else if (p.type === 'AB') countAB++;
    });

    this.historyData.push({
      time: Math.round(this.simTime * 10) / 10,
      concA: countA,
      concB: countB,
      concAB: countAB
    });

    if (this.historyData.length > 60) {
      this.historyData.shift();
    }
  }

  updateStatsDisplay() {
    const elTotal = document.getElementById('statTotalCollisions');
    const elEffective = document.getElementById('statEffectiveCollisions');
    const elRatio = document.getElementById('statEfficiencyRate');
    const elRate = document.getElementById('statInstantSpeed');
    const elCountAB = document.getElementById('statProductCount');

    if (elTotal) elTotal.textContent = this.totalCollisions.toLocaleString();
    if (elEffective) elEffective.textContent = this.effectiveCollisions.toLocaleString();
    
    const effPercent = this.totalCollisions > 0 
      ? ((this.effectiveCollisions / this.totalCollisions) * 100).toFixed(1) 
      : '0.0';
    if (elRatio) elRatio.textContent = `${effPercent}%`;
    if (elRate) elRate.textContent = `${this.reactionRate.toFixed(1)} რეაქცია/წმ`;

    let countAB = 0;
    this.particles.forEach(p => { if (p.type === 'AB') countAB++; });
    if (elCountAB) elCountAB.textContent = countAB;
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle grid background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Reaction Vessel Border Glow
    ctx.strokeStyle = this.hasCatalyst ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Heterogeneous boundary indicator
    if (this.surfaceAreaMode !== 'homogeneous') {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.05)';
      ctx.fillRect(0, h - 70, w, 70);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.2)';
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, h - 70);
      ctx.lineTo(w, h - 70);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '10px "Noto Sans Georgian", sans-serif';
      ctx.fillStyle = 'rgba(244, 63, 94, 0.6)';
      ctx.fillText(
        this.surfaceAreaMode === 'solid_block' 
          ? 'მყარი ფაზა (მონოლითური ბლოკი - დაბალი ზედაპირის ფართობი)' 
          : 'მყარი ფაზა (წვრილად დაქუცმაცებული - მაღალი ზედაპირის ფართობი)',
        12, h - 76
      );
    }

    // Render Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();

      // Product glow
      if (p.type === 'AB') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Render Reaction Flash Effects
    for (let i = 0; i < this.effects.length; i++) {
      const ef = this.effects[i];
      ctx.save();
      ctx.globalAlpha = ef.alpha;
      ctx.beginPath();
      ctx.arc(ef.x, ef.y, ef.radius, 0, Math.PI * 2);
      ctx.fillStyle = ef.color;
      ctx.fill();

      // Starburst rays
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(ef.x, ef.y);
        ctx.lineTo(ef.x + Math.cos(a) * ef.radius * 1.5, ef.y + Math.sin(a) * ef.radius * 1.5);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  renderChart() {
    if (!this.chartCtx) return;
    const ctx = this.chartCtx;
    const w = this.chartCanvas.width;
    const h = this.chartCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    // Draw Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    // Axis Labels
    ctx.font = '10px "Noto Sans Georgian", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('კონცენტრაცია (C)', 8, padTop - 6);
    ctx.fillText('დრო (t)', padLeft + plotW - 40, padTop + plotH + 20);

    if (this.historyData.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('მონაცემები იწერება რეალურ დროში...', padLeft + plotW / 2, padTop + plotH / 2);
      return;
    }

    const maxParticles = Math.max(1, this.concentration * 2);
    const getY = (val) => padTop + plotH - (val / maxParticles) * plotH;
    const getX = (idx) => padLeft + (idx / (this.historyData.length - 1)) * plotW;

    // Line 1: Reactant A (Sky blue)
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    this.historyData.forEach((pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.concA);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Line 2: Product AB (Emerald green)
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    this.historyData.forEach((pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.concAB);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Chart Legend
    ctx.textAlign = 'left';
    ctx.font = '10px "Noto Sans Georgian", sans-serif';

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(padLeft + 10, padTop + 6, 12, 3);
    ctx.fillText('რეაგენტი [A]', padLeft + 28, padTop + 10);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(padLeft + 120, padTop + 6, 12, 3);
    ctx.fillText('პროდუქტი [AB]', padLeft + 138, padTop + 10);
  }
}

window.ReactionSimulatorModule = ReactionSimulatorModule;
