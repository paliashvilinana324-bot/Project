/**
 * Module 1: დაჯახებათა თეორია და ენერგეტიკული პროფილი
 * Collision Theory & Interactive Energy Diagram
 * Georgian 10th Grade Chemistry Curriculum (ესგ)
 */

class CollisionTheoryModule {
  constructor() {
    this.canvas = document.getElementById('energyDiagramCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.reactionType = 'exothermic'; // 'exothermic' or 'endothermic'
    this.hasCatalyst = false;
    this.progress = 0; // 0 to 1 along reaction coordinate
    this.isAnimating = false;
    this.animationId = null;

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.setupEventListeners();
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.render();
    });
    this.render();
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = Math.max(320, rect.width - 24);
    this.canvas.height = 360;
  }

  setupEventListeners() {
    // Reaction type toggle
    const exoBtn = document.getElementById('btnExothermic');
    const endoBtn = document.getElementById('btnEndothermic');
    const catalystToggle = document.getElementById('diagramCatalystToggle');
    const progressSlider = document.getElementById('reactionCoordSlider');
    const animateBtn = document.getElementById('btnAnimateReaction');
    const orientationSimBtn = document.getElementById('btnTestOrientation');

    if (exoBtn && endoBtn) {
      exoBtn.addEventListener('click', () => {
        this.reactionType = 'exothermic';
        exoBtn.classList.add('bg-sky-600', 'text-white');
        exoBtn.classList.remove('bg-slate-800', 'text-slate-300');
        endoBtn.classList.add('bg-slate-800', 'text-slate-300');
        endoBtn.classList.remove('bg-sky-600', 'text-white');
        this.updateTheoryText();
        this.render();
      });

      endoBtn.addEventListener('click', () => {
        this.reactionType = 'endothermic';
        endoBtn.classList.add('bg-sky-600', 'text-white');
        endoBtn.classList.remove('bg-slate-800', 'text-slate-300');
        exoBtn.classList.add('bg-slate-800', 'text-slate-300');
        exoBtn.classList.remove('bg-sky-600', 'text-white');
        this.updateTheoryText();
        this.render();
      });
    }

    if (catalystToggle) {
      catalystToggle.addEventListener('change', (e) => {
        this.hasCatalyst = e.target.checked;
        this.updateTheoryText();
        this.render();
      });
    }

    if (progressSlider) {
      progressSlider.addEventListener('input', (e) => {
        this.progress = parseFloat(e.target.value);
        this.render();
        this.updateProgressExplanation();
      });
    }

    if (animateBtn) {
      animateBtn.addEventListener('click', () => {
        this.startReactionAnimation();
      });
    }

    if (orientationSimBtn) {
      orientationSimBtn.addEventListener('click', () => {
        this.runOrientationDemo();
      });
    }
  }

  startReactionAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.progress = 0;
    const slider = document.getElementById('reactionCoordSlider');

    const step = () => {
      this.progress += 0.008;
      if (slider) slider.value = this.progress;
      this.updateProgressExplanation();
      this.render();

      if (this.progress < 1) {
        this.animationId = requestAnimationFrame(step);
      } else {
        this.isAnimating = false;
        this.progress = 1;
        if (slider) slider.value = 1;
        this.render();
      }
    };
    step();
  }

  runOrientationDemo() {
    const container = document.getElementById('orientationDemoBox');
    if (!container) return;
    
    // Toggle between correct and incorrect orientations
    const isSuccess = Math.random() > 0.4;
    container.innerHTML = `
      <div class="p-4 rounded-xl ${isSuccess ? 'bg-emerald-950/60 border-emerald-500/40' : 'bg-rose-950/60 border-rose-500/40'} border transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">${isSuccess ? '✅' : '❌'}</span>
          <h4 class="font-bold text-base ${isSuccess ? 'text-emerald-300' : 'text-rose-300'}">
            ${isSuccess ? 'ეფექტური დაჯახება: სწორი ორიენტაცია და საკმარისი ენერგია!' : 'არაეფექტური დაჯახება: არასწორი სივრცითი ორიენტაცია!'}
          </h4>
        </div>
        <p class="text-sm text-slate-300">
          ${isSuccess 
            ? 'მოლეკულები ერთმანეთს შეეჯახნენ აქტიური ატომების მხრიდან საკმარისი კინეტიკური ენერგიით ($E \\ge E_a$). ელექტრონული ღრუბლები გადაიფარა და ჩამოყალიბდა ახალი ქიმიური ბმა!' 
            : 'მოლეკულები შეეჯახნენ ისეთი კუთხით, რომ აქტიური ცენტრები ვერ დაუკავშირდა ერთმანეთს. ნაწილაკები უბრალოდ ელასტიკურად აისხლიტნენ რეაქციის გარეშე.'}
        </p>
      </div>
    `;
  }

  getCurveY(xNorm, isCat) {
    // xNorm is 0 to 1
    // Returns energy Y level in normalized coordinates (0=top/high energy, 1=bottom/low energy)
    const isExo = this.reactionType === 'exothermic';
    
    const yReactants = isExo ? 0.65 : 0.75;
    const yProducts = isExo ? 0.85 : 0.45;
    
    // Peak activated complex
    const yPeakNoCat = isExo ? 0.20 : 0.18;
    const yPeakCat = isExo ? 0.38 : 0.32;
    const yPeak = isCat ? yPeakCat : yPeakNoCat;

    if (xNorm <= 0.2) {
      return yReactants;
    } else if (xNorm >= 0.8) {
      return yProducts;
    } else {
      // Smooth bell curve / cubic hermite
      const t = (xNorm - 0.2) / 0.6; // 0 to 1
      // Quadratic Bezier or Gaussian shape
      const height = Math.sin(t * Math.PI);
      const base = yReactants + (yProducts - yReactants) * t;
      // Peak height relative to base
      const targetPeak = yPeak;
      return base - (base - targetPeak) * Math.sin(t * Math.PI);
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    const padLeft = 70;
    const padRight = 40;
    const padTop = 40;
    const padBottom = 50;

    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    // Draw Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;

    // Y Axis (Energy)
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    // Axis Arrows
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop - 8);
    ctx.lineTo(padLeft - 5, padTop + 2);
    ctx.lineTo(padLeft + 5, padTop + 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(padLeft + plotW + 8, padTop + plotH);
    ctx.lineTo(padLeft + plotW - 2, padTop + plotH - 5);
    ctx.lineTo(padLeft + plotW - 2, padTop + plotH + 5);
    ctx.fill();

    // Axis Labels
    ctx.font = '13px "Noto Sans Georgian", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('პოტენციური ენერგია (E, კჯ/მოლი)', padLeft - 60, padTop - 16);
    ctx.fillText('რეაქციის კოორდინატი (დრო)', padLeft + plotW - 140, padTop + plotH + 34);

    // Compute Y levels
    const getY = (normY) => padTop + normY * plotH;
    const getX = (normX) => padLeft + normX * plotW;

    const isExo = this.reactionType === 'exothermic';
    const yR = getY(isExo ? 0.65 : 0.75);
    const yP = getY(isExo ? 0.85 : 0.45);
    const yPeakNoCat = getY(isExo ? 0.20 : 0.18);
    const yPeakCat = getY(isExo ? 0.38 : 0.32);

    // Draw Dashed reference levels for Reactants & Products
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1;

    // Reactant line across
    ctx.beginPath();
    ctx.moveTo(padLeft, yR);
    ctx.lineTo(padLeft + plotW * 0.55, yR);
    ctx.stroke();

    // Product line across
    ctx.beginPath();
    ctx.moveTo(padLeft + plotW * 0.45, yP);
    ctx.lineTo(padLeft + plotW, yP);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve 1: Without Catalyst (Standard)
    ctx.beginPath();
    ctx.strokeStyle = this.hasCatalyst ? 'rgba(244, 63, 94, 0.45)' : '#f43f5e';
    ctx.lineWidth = this.hasCatalyst ? 2 : 3.5;
    for (let i = 0; i <= 100; i++) {
      const xN = i / 100;
      const x = getX(xN);
      const y = getY(this.getCurveY(xN, false));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Curve 2: With Catalyst
    if (this.hasCatalyst) {
      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      for (let i = 0; i <= 100; i++) {
        const xN = i / 100;
        const x = getX(xN);
        const y = getY(this.getCurveY(xN, true));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Energy Barriers Annotations (Ea, ΔH)
    const midX = getX(0.5);

    // Ea (without catalyst) arrow
    this.drawDimensionArrow(ctx, padLeft + plotW * 0.35, yR, padLeft + plotW * 0.35, yPeakNoCat, 
      this.hasCatalyst ? 'Ea (კატალიზატორის გარეშე)' : 'აქტივაციის ენერგია (Ea)', '#f43f5e');

    // Ea (with catalyst) arrow
    if (this.hasCatalyst) {
      this.drawDimensionArrow(ctx, padLeft + plotW * 0.5, yR, padLeft + plotW * 0.5, yPeakCat, 
        'Ea (კატალიზატორით)', '#10b981');
    }

    // ΔH arrow (Enthalpy difference)
    const deltaHX = padLeft + plotW * 0.88;
    const deltaHLabel = isExo ? 'ΔH < 0 (ეგზოთერმული, გამოიყოფა სითბო)' : 'ΔH > 0 (ენდოთერმული, შთაინთქმება სითბო)';
    this.drawDimensionArrow(ctx, deltaHX, yR, deltaHX, yP, deltaHLabel, isExo ? '#f59e0b' : '#38bdf8');

    // Labels for Reactants and Products
    ctx.font = 'bold 12px "Noto Sans Georgian", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('საწყისი ნივთიერებები (A + B)', padLeft + 10, yR - 12);

    ctx.fillStyle = '#34d399';
    ctx.fillText('პროდუქტები (AB)', padLeft + plotW - 130, yP - 12);

    // Active Complex Peak label
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('აქტივირებული კომპლექსი [A···B]‡', midX - 95, (this.hasCatalyst ? yPeakCat : yPeakNoCat) - 14);

    // Draw Current Moving State Marker on Curve
    const currXNorm = this.progress;
    const currX = getX(currXNorm);
    const currY = getY(this.getCurveY(currXNorm, this.hasCatalyst));

    // Glow ring
    ctx.beginPath();
    ctx.arc(currX, currY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fill();

    // Solid marker
    ctx.beginPath();
    ctx.arc(currX, currY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  drawDimensionArrow(ctx, x1, y1, x2, y2, label, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrows on both ends
    const arrowSize = 5;
    const drawHead = (x, y, dir) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - arrowSize, y - dir * arrowSize);
      ctx.lineTo(x + arrowSize, y - dir * arrowSize);
      ctx.closePath();
      ctx.fill();
    };

    if (y1 > y2) {
      drawHead(x2, y2, -1);
      drawHead(x1, y1, 1);
    } else {
      drawHead(x1, y1, -1);
      drawHead(x2, y2, 1);
    }

    // Label
    ctx.font = '11px "Noto Sans Georgian", sans-serif';
    ctx.textAlign = 'center';
    const midY = (y1 + y2) / 2;
    
    // Background tag for readability
    const textMetrics = ctx.measureText(label);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(x1 - textMetrics.width / 2 - 4, midY - 8, textMetrics.width + 8, 16);

    ctx.fillStyle = color;
    ctx.fillText(label, x1, midY + 4);
    ctx.restore();
  }

  updateTheoryText() {
    const infoContainer = document.getElementById('diagramDynamicExplanation');
    if (!infoContainer) return;

    const isExo = this.reactionType === 'exothermic';
    let text = '';

    if (isExo) {
      text = `
        <div class="space-y-2 text-sm text-slate-300">
          <p><strong class="text-amber-400">ეგზოთერმული რეაქცია ($\Delta H < 0$):</strong> საწყისი ნივთიერებების პოტენციური ენერგია მეტია პროდუქტების ენერგიაზე. რეაქციის შედეგად ჭარბი ენერგია გამოიყოფა გარემოში სითბოს სახით (მაგალითად: წვის, სუნთქვის, განეიტრალების რეაქციები).</p>
          ${this.hasCatalyst ? '<p><strong class="text-emerald-400">კატალიზატორის ეფექტი:</strong> კატალიზატორი ქმნის ალტერნატიულ, დაბალენერგეტიკულ გზას — <em>აქტივაციის ენერგია ($E_a$) მკვეთრად მცირდება</em>, რის გამოც მოლეკულათა ბევრად მეტი წილი ახერხებს ბარიერის გადალახვას. გაითვალისწინეთ: $\Delta H$ (რეაქციის სითბური ეფექტი) უცვლელი რჩება!</p>' : '<p>რეაქციის დასაწყებად მოლეკულებმა უნდა გადალახონ ენერგეტიკული ბარიერი ($E_a$).</p>'}
        </div>
      `;
    } else {
      text = `
        <div class="space-y-2 text-sm text-slate-300">
          <p><strong class="text-sky-400">ენდოთერმული რეაქცია ($\Delta H > 0$):</strong> პროდუქტების ენერგია აღემატება საწყისი ნივთიერებების ენერგიას. სისტემა შთანთქავს სითბოს გარემოდან (მაგალითად: კალციუმის კარბონატის დაშლა, წყლის ელექტროლიზი, ფოტოსინთეზი).</p>
          ${this.hasCatalyst ? '<p><strong class="text-emerald-400">კატალიზატორის როლი:</strong> ამცირებს აქტივაციის ენერგიას ორივე მიმართულებით, თუმცა რეაქციის ენდოთერმულ ბუნებას ($\Delta H$) არ ცვლის.</p>' : '<p>სისტემას სჭირდება მუდმივი ენერგიის მიწოდება, რათა რეაქცია წარიმართოს.</p>'}
        </div>
      `;
    }
    infoContainer.innerHTML = text;
  }

  updateProgressExplanation() {
    const stateLabel = document.getElementById('reactionStateDescription');
    if (!stateLabel) return;

    if (this.progress < 0.25) {
      stateLabel.innerHTML = `<span class="text-sky-400 font-bold">1. საწყისი მდგომარეობა:</span> რეაგენტების მოლეკულები (A და B) მოძრაობენ თავისუფლად და უახლოვდებიან ერთმანეთს.`;
    } else if (this.progress >= 0.25 && this.progress < 0.75) {
      stateLabel.innerHTML = `<span class="text-amber-400 font-bold">2. აქტივირებული კომპლექსი [A···B]‡:</span> მოლეკულები შეეჯახნენ! ძველი ბმები ირღვევა, ახალი ბმები ისახება. სისტემა იმყოფება ენერგიის მაქსიმუმზე.`;
    } else {
      stateLabel.innerHTML = `<span class="text-emerald-400 font-bold">3. პროდუქტის წარმოქმნა (AB):</span> ახალი ქიმიური ბმა სტაბილიზირდა, სისტემამ გაათავისუფლა ჭარბი ენერგია და მიიღო სტაბილური მდგომარეობა.`;
    }
  }
}

window.CollisionTheoryModule = CollisionTheoryModule;
