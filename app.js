/**
 * Main Application Orchestrator
 * "ქიმიური რეაქციის სიჩქარე და ქიმიური წონასწორობა" (X კლასი)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Tab Navigation
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabPanels = document.querySelectorAll('[data-tab-panel]');

  let collisionTheory = null;
  let reactionSimulator = null;
  let leChatelierLab = null;
  let quizModule = null;
  let safetyGuide = null;

  // Instantiate Modules
  try {
    if (window.CollisionTheoryModule) {
      collisionTheory = new window.CollisionTheoryModule();
    }
    if (window.ReactionSimulatorModule) {
      reactionSimulator = new window.ReactionSimulatorModule();
    }
    if (window.LeChatelierLabModule) {
      leChatelierLab = new window.LeChatelierLabModule();
    }
    if (window.QuizModule) {
      quizModule = new window.QuizModule();
    }
    if (window.SafetyGuideModule) {
      safetyGuide = new window.SafetyGuideModule();
    }
  } catch (err) {
    console.error('Initialization error:', err);
  }

  function switchTab(targetId) {
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab-target') === targetId;
      btn.classList.toggle('active', isTarget);
      btn.classList.toggle('text-slate-400', !isTarget);
      btn.classList.toggle('bg-slate-800/40', !isTarget);
    });

    tabPanels.forEach(panel => {
      const isTarget = panel.getAttribute('data-tab-panel') === targetId;
      panel.classList.toggle('hidden', !isTarget);
    });

    // Handle module redraws on tab show
    setTimeout(() => {
      if (targetId === 'tab-theory' && collisionTheory) {
        collisionTheory.resizeCanvas();
        collisionTheory.render();
      } else if (targetId === 'tab-simulator' && reactionSimulator) {
        reactionSimulator.resizeCanvases();
        reactionSimulator.render();
      } else if (targetId === 'tab-equilibrium' && leChatelierLab) {
        leChatelierLab.resizeCanvas();
        leChatelierLab.render();
      }
    }, 50);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');
      switchTab(targetId);
    });
  });

  // Direct quick action buttons from header or welcome banner
  const quickStartBtn = document.getElementById('btnQuickStartSim');
  if (quickStartBtn) {
    quickStartBtn.addEventListener('click', () => {
      switchTab('tab-simulator');
    });
  }

  const quickStartLabBtn = document.getElementById('btnQuickStartEquil');
  if (quickStartLabBtn) {
    quickStartLabBtn.addEventListener('click', () => {
      switchTab('tab-equilibrium');
    });
  }

  console.log('Chemistry EdTech Application initialized successfully.');
});
