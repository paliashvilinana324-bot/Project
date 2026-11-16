/**
 * Module 3: ქიმიური წონასწორობა და ლე შატელიეს პრინციპი
 * Le Chatelier's Principle Virtual Equilibrium Lab
 * Georgian 10th Grade Chemistry Curriculum (ესგ)
 */

class LeChatelierLabModule {
  constructor() {
    this.selectedReaction = 'no2'; // 'no2' or 'haber'
    
    // Equilibrium State Variables
    this.temperature = 25; // °C (0 to 100)
    this.pressure = 1.0; // atm (0.5 to 3.0)
    this.reactantExtra = 0; // -1 to 1
    this.productExtra = 0; // -1 to 1

    // Dynamic Equilibrium Position (0: 100% reactants, 1: 100% products)
    this.equilibriumPosition = 0.5; // default 50%
    this.targetPosition = 0.5;
    this.balanceTilt = 0; // degrees (-15 to +15)
    this.targetBalanceTilt = 0;

    // Canvas & Animation
    this.canvas = document.getElementById('equilibriumVesselCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.animationId = null;

    // Molecule visual particles inside syringe
    this.molecules = [];

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });

    this.setupEventListeners();
    this.calculateEquilibrium();
    this.generateMolecules();
    this.startAnimationLoop();
  }

  resizeCanvas() {
    if (this.canvas) {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = Math.max(300, Math.floor(rect.width));
      this.canvas.height = 360;
    }
  }

  setupEventListeners() {
    // Reaction Selector
    const selReaction = document.getElementById('leChatelierReactionSelect');
    if (selReaction) {
      selReaction.addEventListener('change', (e) => {
        this.selectedReaction = e.target.value;
        this.resetConditions();
      });
    }

    // Temperature Buttons
    const btnHeat = document.getElementById('btnEquilHeat');
    const btnCool = document.getElementById('btnEquilCool');
    const btnResetT = document.getElementById('btnEquilResetTemp');

    if (btnHeat) {
      btnHeat.addEventListener('click', () => {
        this.temperature = Math.min(100, this.temperature + 25);
        this.applyPerturbation('temperature_up');
      });
    }
    if (btnCool) {
      btnCool.addEventListener('click', () => {
        this.temperature = Math.max(0, this.temperature - 25);
        this.applyPerturbation('temperature_down');
      });
    }
    if (btnResetT) {
      btnResetT.addEventListener('click', () => {
        this.temperature = 25;
        this.applyPerturbation('temperature_reset');
      });
    }

    // Pressure Controls (Piston)
    const btnIncP = document.getElementById('btnEquilIncPressure');
    const btnDecP = document.getElementById('btnEquilDecPressure');
    const btnResetP = document.getElementById('btnEquilResetPressure');

    if (btnIncP) {
      btnIncP.addEventListener('click', () => {
        this.pressure = Math.min(3.0, Math.round((this.pressure + 0.5) * 10) / 10);
        this.applyPerturbation('pressure_up');
      });
    }
    if (btnDecP) {
      btnDecP.addEventListener('click', () => {
        this.pressure = Math.max(0.5, Math.round((this.pressure - 0.5) * 10) / 10);
        this.applyPerturbation('pressure_down');
      });
    }
    if (btnResetP) {
      btnResetP.addEventListener('click', () => {
        this.pressure = 1.0;
        this.applyPerturbation('pressure_reset');
      });
    }

    // Concentration Buttons
    const btnAddReactant = document.getElementById('btnEquilAddReactant');
    const btnRemoveReactant = document.getElementById('btnEquilRemoveReactant');
    const btnAddProduct = document.getElementById('btnEquilAddProduct');
    const btnRemoveProduct = document.getElementById('btnEquilRemoveProduct');

    if (btnAddReactant) {
      btnAddReactant.addEventListener('click', () => {
        this.reactantExtra = Math.min(1, this.reactantExtra + 0.4);
        this.applyPerturbation('add_reactant');
      });
    }
    if (btnRemoveReactant) {
      btnRemoveReactant.addEventListener('click', () => {
        this.reactantExtra = Math.max(-0.6, this.reactantExtra - 0.4);
        this.applyPerturbation('remove_reactant');
      });
    }
    if (btnAddProduct) {
      btnAddProduct.addEventListener('click', () => {
        this.productExtra = Math.min(1, this.productExtra + 0.4);
        this.applyPerturbation('add_product');
      });
    }
    if (btnRemoveProduct) {
      btnRemoveProduct.addEventListener('click', () => {
        this.productExtra = Math.max(-0.6, this.productExtra - 0.4);
        this.applyPerturbation('remove_product');
      });
    }

    // Catalyst Button
    const btnAddCat = document.getElementById('btnEquilAddCatalyst');
    if (btnAddCat) {
      btnAddCat.addEventListener('click', () => {
        this.applyPerturbation('add_catalyst');
      });
    }

    // Overall Reset
    const btnMasterReset = document.getElementById('btnEquilMasterReset');
    if (btnMasterReset) {
      btnMasterReset.addEventListener('click', () => {
        this.resetConditions();
      });
    }
  }

  resetConditions() {
    this.temperature = 25;
    this.pressure = 1.0;
    this.reactantExtra = 0;
    this.productExtra = 0;
    this.targetPosition = 0.5;
    this.equilibriumPosition = 0.5;
    this.targetBalanceTilt = 0;
    this.balanceTilt = 0;
    this.calculateEquilibrium();
    this.generateMolecules();
    this.updateUIValues();
    this.showExplanation('reset', 'სისტემა დაუბრუნდა საწყის სტანდარტულ წონასწორობას (25°C, 1 ატმ).');
  }

  calculateEquilibrium() {
    // Both default reactions are Exothermic in the forward direction:
    // 1) 2NO2 (g, brown) <=> N2O4 (g, colorless) + 57.2 kJ (2 moles gas -> 1 mole gas)
    // 2) N2 + 3H2 <=> 2NH3 + 92.4 kJ (4 moles gas -> 2 moles gas)
    
    // Higher temp => shifts towards endothermic direction (left / reactants)
    // T = 0°C -> shift towards products (0.85)
    // T = 100°C -> shift towards reactants (0.15)
    const tempEffect = (25 - this.temperature) * 0.005;

    // Higher pressure => shifts towards fewer moles (right / products)
    // P = 0.5 atm -> shift left (-0.2)
    // P = 3.0 atm -> shift right (+0.35)
    const pressureEffect = (this.pressure - 1.0) * 0.18;

    // Concentration effects
    const concEffect = (this.reactantExtra * 0.25) - (this.productExtra * 0.25);

    // Compute target position (0 to 1)
    let pos = 0.5 + tempEffect + pressureEffect + concEffect;
    pos = Math.max(0.08, Math.min(0.92, pos));
    this.targetPosition = pos;
  }

  applyPerturbation(action) {
    this.calculateEquilibrium();
    this.updateUIValues();

    let explanationTitle = '';
    let explanationBody = '';
    let tiltDirection = 0;

    const isNO2 = this.selectedReaction === 'no2';
    const rxnName = isNO2 
      ? '2NO₂ (მურა) ⇌ N₂O₄ (უფერო) + 57.2 კჯ' 
      : 'N₂ + 3H₂ ⇌ 2NH₃ + 92.4 კჯ';

    switch (action) {
      case 'temperature_up':
        tiltDirection = -12; // tilt towards reverse
        explanationTitle = '🔥 ტემპერატურის გაზრდა (გათბობა)';
        explanationBody = `
          <strong>ლე შატელიეს პრინციპი:</strong> პირდაპირი რეაქცია ეგზოთერმულია (სითბო გამოიყოფა, $\\Delta H < 0$). როდესაც სისტემას ვაცხელებთ, ის ცდილობს ჭარბი სითბოს გაბათილებას და <em>წონასწორობა გადაიხრება ენდოთერმული (შებრუნებული) რეაქციის მიმართულებით</em> (მარცხნივ).<br>
          <span class="text-amber-400">შედეგი:</span> ${isNO2 ? 'იზრდება მურა ფერის $NO_2$-ის წილი — ჭურჭელში აირის შეფერილობა საგრძნობლად მუქდება!' : 'ამიაკის გამოსავლიანობა მცირდება, იზრდება $N_2$-ისა და $H_2$-ის კონცენტრაცია.'}
        `;
        break;

      case 'temperature_down':
        tiltDirection = 12; // tilt towards forward
        explanationTitle = '❄️ ტემპერატურის შემცირება (გაცივება / ყინული)';
        explanationBody = `
          <strong>ლე შატელიეს პრინციპი:</strong> სისტემის გაცივებისას წონასწორობა გადაიხრება იმ მიმართულებით, სადაც სითბო გამოიყოფა (ეგზოთერმული რეაქცია, მარჯვნივ), რათა შეასუსტოს ტემპერატურის კლება.<br>
          <span class="text-emerald-400">შედეგი:</span> ${isNO2 ? 'წარმოიქმნება მეტი უფერო $N_2O_4$ — ჭურჭელში აირი უფერულდება და ხდება გამჭვირვალე!' : 'იზრდება პროდუქტის ($NH_3$) წარმოქმნა.'}
        `;
        break;

      case 'pressure_up':
        tiltDirection = 10;
        explanationTitle = '⬇️ წნევის გაზრდა (დგუშის ჩაწევა / მოცულობის შემცირება)';
        explanationBody = `
          <strong>ლე შატელიეს პრინციპი:</strong> როდესაც ვზრდით წნევას, სისტემა ცდილობს წნევის შემცირებას და <em>გადაიხრება აირთა მოლეკულების (მოცულობის) შემცირების მხარეს</em>.<br>
          ${isNO2 ? 'მარცხნივ გვაქვს 2 მოლი აირი ($2NO_2$), ხოლო მარჯვნივ — 1 მოლი ($N_2O_4$). 2 მოლიდან 1 მოლისკენ გადახრა ამცირებს საერთო წნევას!' : 'მარცხნივ გვაქვს 4 მოლი ($1 N_2 + 3 H_2$), მარჯვნივ — 2 მოლი ($2 NH_3$). წონასწორობა გადაიხრება მარჯვნივ!'}<br>
          <span class="text-emerald-400">შედეგი:</span> წონასწორობა გადაიხარა პროდუქტების წარმოქმნისკენ.
        `;
        break;

      case 'pressure_down':
        tiltDirection = -10;
        explanationTitle = '⬆️ წნევის შემცირება (დგუშის აწევა / მოცულობის გაზრდა)';
        explanationBody = `
          <strong>ლე შატელიეს პრინციპი:</strong> წნევის შემცირებისას სისტემა ცდილობს წნევის აღდგენას და გადაიხრება აირთა მოლეკულების მეტი რაოდენობის მიმართულებით.<br>
          ${isNO2 ? '1 მოლიდან 2 მოლისკენ ($N_2O_4 \\rightarrow 2NO_2$), წონასწორობა გადაიხრება მარცხნივ!' : '2 მოლიდან 4 მოლისკენ, წონასწორობა გადაიხრება მარცხნივ, საწყისებისკენ.'}<br>
          <span class="text-rose-400">შედეგი:</span> რეაგენტების წილი გაიზარდა.
        `;
        break;

      case 'add_reactant':
        tiltDirection = 12;
        explanationTitle = '➕ საწყისი ნივთიერების დამატება';
        explanationBody = `
          <strong>ლე შატელიეს პრინციპი:</strong> საწყისი ნივთიერების კონცენტრაციის გაზრდისას სისტემა ცდილობს მის დახარჯვას. წონასწორობა გადაიხრება პირდაპირი რეაქციის მიმართულებით (მარჯვნივ), რათა წარმოიქმნას მეტი პროდუქტი.
        `;
        break;

      case 'remove_reactant':
        tiltDirection = -12;
        explanationTitle = '➖ საწყისი ნივთიერების ამოღება';
        explanationBody = `
          <strong>ლე შატელიეს პრინციპი:</strong> საწყისი ნივთიერების მოცილებისას სისტემა ცდილობს მის შევსებას, ამიტომ წონასწორობა გადაიხრება მარცხნივ (შებრუნებული რეაქციისკენ).
        `;
        break;

      case 'add_product':
        tiltDirection = -12;
        explanationTitle = '➕ პროდუქტის დამატება';
        explanationBody = `
          <strong>ლე შატელიეს პრინციპი:</strong> პროდუქტის კონცენტრაციის გაზრდისას სისტემა ცდილობს მის დახარჯვას — წონასწორობა გადაიხრება მარცხნივ, საწყისი ნივთიერებების წარმოქმნისკენ.
        `;
        break;

      case 'remove_product':
        tiltDirection = 12;
        explanationTitle = '➖ პროდუქტის მოცილება (კონდენსაცია)';
        explanationBody = `
          <strong>ლე შატელიეს პრინციპი:</strong> მრეწველობაში (მაგ. ჰაბერის პროცესში) ამიაკს გამუდმებით ათხევადებენ და აცილებენ სისტემას. სისტემა ცდილობს დანაკლისის შევსებას და წონასწორობა მუდმივად მარჯვნივ გადაიხრება, რაც ზრდის საბოლოო გამოსავლიანობას!
        `;
        break;

      case 'add_catalyst':
        tiltDirection = 0;
        explanationTitle = '⚡ კატალიზატორის დამატება';
        explanationBody = `
          <strong>ფუნდამენტური კანონი:</strong> <span class="text-amber-400 font-bold">კატალიზატორი არ ცვლის ქიმიური წონასწორობის მდგომარეობას!</span><br>
          ის თანაბრად ამცირებს აქტივაციის ენერგიას და თანაბრად აჩქარებს როგორც პირდაპირ ($v_1$), ისე შებრუნებულ ($v_2$) რეაქციას. შედეგად, სისტემა <em>მხოლოდ უფრო სწრაფად აღწევს წონასწორობას</em>, ხოლო პროდუქტებისა და რეაგენტების თანაფარდობა უცვლელი რჩება!
        `;
        break;

      default:
        break;
    }

    this.targetBalanceTilt = tiltDirection;
    // Slowly ease tilt back to 0 (equilibrium restored)
    setTimeout(() => {
      this.targetBalanceTilt = 0;
    }, 2400);

    this.showExplanation(explanationTitle, explanationBody);
  }

  showExplanation(title, body) {
    const elTitle = document.getElementById('leChatelierExplTitle');
    const elBody = document.getElementById('leChatelierExplBody');
    if (elTitle) elTitle.innerHTML = title;
    if (elBody) elBody.innerHTML = body;
  }

  updateUIValues() {
    const tVal = document.getElementById('dispEquilTemp');
    const pVal = document.getElementById('dispEquilPressure');
    const shiftBadge = document.getElementById('dispEquilShiftBadge');

    if (tVal) tVal.textContent = `${this.temperature}°C`;
    if (pVal) pVal.textContent = `${this.pressure.toFixed(1)} ატმ`;

    if (shiftBadge) {
      if (Math.abs(this.targetPosition - 0.5) < 0.05) {
        shiftBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-200 border border-slate-600';
        shiftBadge.textContent = 'წონასწორობა ცენტრშია (50:50)';
      } else if (this.targetPosition > 0.5) {
        shiftBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/70 text-emerald-300 border border-emerald-500/50';
        shiftBadge.textContent = `გადახრილია მარჯვნივ → პროდუქტებისკენ (${Math.round(this.targetPosition * 100)}%)`;
      } else {
        shiftBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-amber-900/70 text-amber-300 border border-amber-500/50';
        shiftBadge.textContent = `გადახრილია მარცხნივ ← რეაგენტებისკენ (${Math.round((1 - this.targetPosition) * 100)}%)`;
      }
    }

    // Dynamic Balance Scale update
    const beam = document.getElementById('balanceBeamElem');
    if (beam) {
      beam.style.transform = `rotate(${this.balanceTilt}deg)`;
    }
  }

  generateMolecules() {
    this.molecules = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      this.molecules.push({
        x: 0.15 + Math.random() * 0.7,
        y: 0.15 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003
      });
    }
  }

  startAnimationLoop() {
    const loop = () => {
      // Smooth interpolation for equilibrium position
      this.equilibriumPosition += (this.targetPosition - this.equilibriumPosition) * 0.04;
      this.balanceTilt += (this.targetBalanceTilt - this.balanceTilt) * 0.05;

      const beam = document.getElementById('balanceBeamElem');
      if (beam) {
        beam.style.transform = `rotate(${this.balanceTilt}deg)`;
      }

      this.render();
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Cylinder Geometry
    const cylX = w * 0.15;
    const cylW = w * 0.70;
    const cylTopY = 40;
    const cylBottomY = h - 40;
    const cylMaxHeight = cylBottomY - cylTopY;

    // Piston position based on pressure
    // Higher pressure = smaller volume = piston pushed down
    // Pressure 0.5 atm => piston at 10% from top
    // Pressure 3.0 atm => piston at 55% from top
    const pistonFraction = 0.05 + ((this.pressure - 0.5) / 2.5) * 0.45;
    const pistonY = cylTopY + cylMaxHeight * pistonFraction;
    const gasHeight = cylBottomY - pistonY;

    // Determine Gas Color inside Cylinder
    // For NO2 <=> N2O4:
    // NO2 is brown (amber/reddish-brown), N2O4 is colorless.
    // Low product ratio (high reactants/NO2) = deep brown!
    // High product ratio (mostly N2O4) = almost completely clear!
    let gasR = 180, gasG = 83, gasB = 9, gasAlpha = 0.75;

    if (this.selectedReaction === 'no2') {
      const brownIntensity = (1 - this.equilibriumPosition); // 0 (clear) to 1 (deep dark brown)
      gasAlpha = 0.08 + brownIntensity * 0.75;
      gasR = Math.floor(160 + brownIntensity * 40);
      gasG = Math.floor(70 + (1 - brownIntensity) * 80);
      gasB = Math.floor(10 + (1 - brownIntensity) * 50);
    } else {
      // Haber process: Subtle cyan/indigo hue indicating gas density
      gasAlpha = 0.15 + (this.pressure / 3.0) * 0.35;
      gasR = 56;
      gasG = 189;
      gasB = 248;
    }

    // Draw Gas Body inside Cylinder
    ctx.fillStyle = `rgba(${gasR}, ${gasG}, ${gasB}, ${gasAlpha})`;
    ctx.fillRect(cylX, pistonY, cylW, gasHeight);

    // Subtle thermal aura (if heated or cooled)
    if (this.temperature > 50) {
      // Reddish heat gradient on bottom
      const heatGrad = ctx.createLinearGradient(cylX, cylBottomY, cylX, cylBottomY - 50);
      heatGrad.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
      heatGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = heatGrad;
      ctx.fillRect(cylX, cylBottomY - 50, cylW, 50);
    } else if (this.temperature < 20) {
      // Frosty ice blue aura on bottom
      const coolGrad = ctx.createLinearGradient(cylX, cylBottomY, cylX, cylBottomY - 50);
      coolGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      coolGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = coolGrad;
      ctx.fillRect(cylX, cylBottomY - 50, cylW, 50);
    }

    // Draw Gas Molecules inside Syringe Chamber
    const numProductMolecules = Math.round(this.molecules.length * this.equilibriumPosition);
    for (let i = 0; i < this.molecules.length; i++) {
      const m = this.molecules[i];
      const isProduct = i < numProductMolecules;

      // Update position
      m.x += m.vx;
      m.y += m.vy;

      if (m.x < 0.05 || m.x > 0.95) m.vx *= -1;
      if (m.y < 0.05 || m.y > 0.95) m.vy *= -1;

      const px = cylX + m.x * cylW;
      const py = pistonY + m.y * gasHeight;

      if (this.selectedReaction === 'no2') {
        if (!isProduct) {
          // NO2: Reddish-brown small molecule pair
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#b45309';
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // N2O4: Larger dimer (colorless/pale cyan outline)
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(224, 242, 254, 0.25)';
          ctx.fill();
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      } else {
        // Haber: N2/H2 vs NH3
        ctx.beginPath();
        ctx.arc(px, py, isProduct ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isProduct ? '#10b981' : '#38bdf8';
        ctx.fill();
      }
    }

    // Draw Glass Cylinder Container Walls
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Left wall
    ctx.moveTo(cylX, cylTopY);
    ctx.lineTo(cylX, cylBottomY);
    // Bottom wall
    ctx.lineTo(cylX + cylW, cylBottomY);
    // Right wall
    ctx.lineTo(cylX + cylW, cylTopY);
    ctx.stroke();

    // Measurement scale marks on cylinder wall
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    for (let y = cylTopY + 20; y < cylBottomY; y += 25) {
      ctx.beginPath();
      ctx.moveTo(cylX, y);
      ctx.lineTo(cylX + 8, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cylX + cylW - 8, y);
      ctx.lineTo(cylX + cylW, y);
      ctx.stroke();
    }

    // Draw Piston Head
    ctx.fillStyle = '#475569';
    ctx.fillRect(cylX - 2, pistonY - 14, cylW + 4, 14);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cylX - 2, pistonY - 14, cylW + 4, 14);

    // Piston Shaft
    const shaftW = 20;
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cylX + cylW / 2 - shaftW / 2, 10, shaftW, pistonY - 14);

    // Piston Handle
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cylX + cylW / 2 - 40, 10, 80, 8);

    // Labels on Canvas
    ctx.font = 'bold 12px "Noto Sans Georgian", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`მოცულობა V = ${(gasHeight / cylMaxHeight).toFixed(2)} ერთ.`, cylX + cylW / 2, cylBottomY + 24);

    // Temperature indicator flame or ice under cylinder
    if (this.temperature > 40) {
      ctx.font = '20px sans-serif';
      ctx.fillText('🔥🔥🔥', cylX + cylW / 2, cylBottomY + 36);
    } else if (this.temperature < 20) {
      ctx.font = '20px sans-serif';
      ctx.fillText('🧊🧊🧊', cylX + cylW / 2, cylBottomY + 36);
    }
  }
}

window.LeChatelierLabModule = LeChatelierLabModule;
