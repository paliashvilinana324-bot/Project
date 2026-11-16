/**
 * Laboratory Safety & Ethical Guidelines Modal Controller
 * Aligned with Georgian Lab Safety Standards for High School Chemistry
 */

class SafetyGuideModule {
  constructor() {
    this.modal = document.getElementById('safetyModal');
    this.openBtn = document.getElementById('btnOpenSafetyModal');
    this.closeBtn = document.getElementById('btnCloseSafetyModal');
    this.backdrop = document.getElementById('safetyModalBackdrop');

    this.init();
  }

  init() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
        this.close();
      }
    });
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

window.SafetyGuideModule = SafetyGuideModule;
