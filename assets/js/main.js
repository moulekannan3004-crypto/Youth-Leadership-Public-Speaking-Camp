/**
 * VoxLeaders - Youth Leadership & Public Speaking Camp
 * Master JavaScript Bundle
 * ThemeForest & Commercial Grade Architecture
 * Includes: Theme Engine (Dark/Light), RTL Engine, Interactive Components
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. THEME ENGINE (Dark / Light Mode)
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('vox_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('vox_theme', theme);
    
    // Update toggle icons
    themeToggles.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill text-primary';
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
    });

    // Swap brand logo if exists (keep logo-white.svg in .vx-header for solid navy background)
    const brandLogos = document.querySelectorAll('.vx-brand-img');
    brandLogos.forEach(logo => {
      if (theme === 'dark' || logo.closest('.vx-header')) {
        logo.src = 'assets/img/brand/logo-white.svg';
      } else {
        logo.src = 'assets/img/brand/logo.svg';
      }
    });
  }

  // Initial theme application
  applyTheme(savedTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });

  // 2. RTL ENGINE (Bidirectional LTR / RTL Switcher)
  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  const savedDir = localStorage.getItem('vox_direction') || 'ltr';

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('vox_direction', dir);

    // Swap Bootstrap CSS link
    const bsLink = document.getElementById('bootstrap-theme-style');
    if (bsLink) {
      if (dir === 'rtl') {
        bsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';
      } else {
        bsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
      }
    }

    // Update RTL button text & pill state
    rtlToggles.forEach(btn => {
      const activeSpan = btn.querySelector('.dir-active');
      const inactiveSpan = btn.querySelector('.dir-inactive');
      if (activeSpan && inactiveSpan) {
        if (dir === 'rtl') {
          btn.innerHTML = `<span class="dir-inactive">LTR</span> <i class="bi bi-arrow-left-right text-muted" style="font-size: 0.7rem;"></i> <span class="dir-active">RTL</span>`;
          btn.setAttribute('title', 'Switch to Left-to-Right layout');
        } else {
          btn.innerHTML = `<span class="dir-active">LTR</span> <i class="bi bi-arrow-left-right text-muted" style="font-size: 0.7rem;"></i> <span class="dir-inactive">RTL</span>`;
          btn.setAttribute('title', 'Switch to Right-to-Left layout');
        }
      } else {
        const textSpan = btn.querySelector('.dir-label') || btn;
        if (dir === 'rtl') {
          textSpan.textContent = 'LTR';
          btn.setAttribute('title', 'Switch to Left-to-Right layout');
        } else {
          textSpan.textContent = 'RTL';
          btn.setAttribute('title', 'Switch to Right-to-Left layout');
        }
      }
    });
  }

  applyDirection(savedDir);

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(nextDir);
    });
  });

  // 3. STICKY NAVBAR
  const navbar = document.querySelector('.vx-navbar');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // 4. ANIMATED STATS COUNTER
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (counterElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter-target'), 10);
          const prefix = el.getAttribute('data-counter-prefix') || '';
          const suffix = el.getAttribute('data-counter-suffix') || '';
          const duration = 1800;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
              clearInterval(timer);
            } else {
              el.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
            }
          }, stepTime);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => observer.observe(el));
  }

  // 5. INTERACTIVE PROGRAM & SERVICE FILTERING
  const filterButtons = document.querySelectorAll('.filter-btn-pill[data-filter]');

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Scope button active state to the same button group
        const parentContainer = btn.parentElement;
        const siblingButtons = parentContainer
          ? parentContainer.querySelectorAll('.filter-btn-pill[data-filter]')
          : filterButtons;
        siblingButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCategory = btn.getAttribute('data-filter');

        // If on programs page with search controller, let performProgramSearch handle both
        if (document.getElementById('programSearchInput')) {
          performProgramSearch();
          return;
        }

        // Scope to cards in the closest section or all [data-category] elements
        const containerSection = btn.closest('section') || document;
        let targetCards = containerSection.querySelectorAll('[data-category]');
        if (targetCards.length === 0) {
          targetCards = document.querySelectorAll('[data-category]');
        }

        targetCards.forEach(card => {
          const rawCategories = card.getAttribute('data-category') || '';
          const categories = rawCategories.trim().split(/\s+/);
          const isMatch = selectedCategory === 'all' || categories.includes(selectedCategory);

          if (isMatch) {
            card.classList.remove('d-none');
            card.style.removeProperty('display');
            card.classList.remove('animate-fade-in-up');
            void card.offsetWidth; // Force reflow to re-trigger smooth entrance animation
            card.classList.add('animate-fade-in-up');
          } else {
            card.classList.add('d-none');
            card.style.setProperty('display', 'none', 'important');
            card.classList.remove('animate-fade-in-up');
          }
        });
      });
    });
  }

  // 6. PROGRAM SEARCH CONTROLLER & LIVE SEARCH
  const programSearchInput = document.getElementById('programSearchInput');
  const programSearchForm = document.getElementById('programSearchForm');
  const programSearchBtn = document.getElementById('programSearchBtn');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const noProgramsFound = document.getElementById('noProgramsFound');
  const noResultsTerm = document.getElementById('noResultsTerm');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  function performProgramSearch() {
    if (!programSearchInput) return;
    const term = programSearchInput.value.toLowerCase().trim();

    // Toggle clear button (✕)
    if (clearSearchBtn) {
      clearSearchBtn.classList.toggle('d-none', term.length === 0);
    }

    // Determine active category filter
    const activeFilterBtn = document.querySelector('.filter-pills-track .filter-btn-pill.active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    const programCards = document.querySelectorAll('#programsGrid [data-category]');
    let matchCount = 0;

    programCards.forEach(card => {
      // Check category match
      const rawCategories = card.getAttribute('data-category') || '';
      const categories = rawCategories.trim().split(/\s+/);
      const matchesCategory = (activeCategory === 'all' || categories.includes(activeCategory));

      // Comprehensive search across all card content:
      // Includes titles, bullets, age tags, instructor, topics, and descriptions
      const cardText = card.textContent.toLowerCase();
      const cardKeywords = (card.getAttribute('data-keywords') || '') + ' ' + rawCategories;
      const combinedText = cardText + ' ' + cardKeywords.toLowerCase();

      let matchesSearch = true;
      if (term.length > 0) {
        // Multi-word / token search (e.g. "debate mun", "stage fright")
        const tokens = term.split(/\s+/).filter(Boolean);
        matchesSearch = tokens.every(token => combinedText.includes(token));
      }

      if (matchesCategory && matchesSearch) {
        card.classList.remove('d-none');
        card.style.removeProperty('display');
        card.classList.remove('animate-fade-in-up');
        void card.offsetWidth;
        card.classList.add('animate-fade-in-up');
        matchCount++;
      } else {
        card.classList.add('d-none');
        card.style.setProperty('display', 'none', 'important');
        card.classList.remove('animate-fade-in-up');
      }
    });

    // Handle No Results Empty State
    if (noProgramsFound) {
      if (matchCount === 0 && (term.length > 0 || activeCategory !== 'all')) {
        noProgramsFound.classList.remove('d-none');
        if (noResultsTerm) {
          noResultsTerm.textContent = term.length > 0 ? term : `Category: ${activeCategory}`;
        }
      } else {
        noProgramsFound.classList.add('d-none');
      }
    }
  }

  if (programSearchInput) {
    // Real-time live search while typing
    programSearchInput.addEventListener('input', performProgramSearch);

    // Form submit or Enter key
    if (programSearchForm) {
      programSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performProgramSearch();
      });
    }

    // Search button click
    if (programSearchBtn) {
      programSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        performProgramSearch();
      });
    }

    // Clear search button (✕)
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        programSearchInput.value = '';
        clearSearchBtn.classList.add('d-none');
        programSearchInput.focus();
        performProgramSearch();
      });
    }

    // Reset button inside "No Programs Found" card
    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        programSearchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.classList.add('d-none');
        const allFilterBtn = document.querySelector('.filter-pills-track .filter-btn-pill[data-filter="all"]');
        if (allFilterBtn) {
          allFilterBtn.click();
        } else {
          performProgramSearch();
        }
      });
    }
  }

  // Live search for dashboard tables/cards
  const dashSearchInputs = document.querySelectorAll('.dashboard-search-input');
  if (dashSearchInputs.length > 0) {
    dashSearchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.dashboard-content [data-category], .dashboard-content .card');
        allCards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (term === '' || text.includes(term)) {
            card.classList.remove('d-none');
            card.style.removeProperty('display');
          } else {
            card.classList.add('d-none');
            card.style.setProperty('display', 'none', 'important');
          }
        });
      });
    });
  }

  // 7. PRICING BILLING CYCLE TOGGLE (Session vs Annual)
  const billingToggle = document.getElementById('billingCycleToggle');
  if (billingToggle) {
    const sessionPrices = document.querySelectorAll('.price-session');
    const annualPrices = document.querySelectorAll('.price-annual');
    const billingLabels = document.querySelectorAll('.billing-cycle-label');

    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;
      sessionPrices.forEach(p => p.classList.toggle('d-none', isAnnual));
      annualPrices.forEach(p => p.classList.toggle('d-none', !isAnnual));
      billingLabels.forEach(lbl => {
        lbl.textContent = isAnnual ? '/ Year' : '/ Camp Session';
      });
    });
  }

  // 7b. STRICT REAL-TIME INPUT RESTRICTIONS
  // Prevent numbers in Name inputs & letters in Phone inputs
  document.addEventListener('input', (e) => {
    const target = e.target;
    if (!target || target.tagName !== 'INPUT') return;

    // 1. Name fields: allow only letters, spaces, hyphens, and apostrophes (block all digits)
    const isNameField = target.classList.contains('input-name-only') ||
      target.name?.toLowerCase().includes('name') ||
      target.id?.toLowerCase().includes('name') ||
      target.placeholder?.toLowerCase().includes('rachel') ||
      target.placeholder?.toLowerCase().includes('adams') ||
      target.closest('div')?.querySelector('label')?.textContent.toLowerCase().includes('name');

    if (isNameField && target.type === 'text') {
      const sanitized = target.value.replace(/[^a-zA-Z\s\-']/g, '');
      if (target.value !== sanitized) {
        target.value = sanitized;
      }
    }

    // 2. Phone fields: allow only numbers, +, -, (, ), and spaces (block all letters)
    const isPhoneField = target.type === 'tel' ||
      target.classList.contains('input-phone-only') ||
      target.name?.toLowerCase().includes('phone') ||
      target.id?.toLowerCase().includes('phone') ||
      target.closest('div')?.querySelector('label')?.textContent.toLowerCase().includes('phone');

    if (isPhoneField) {
      const sanitized = target.value.replace(/[^\d\s\+\-\(\)]/g, '');
      if (target.value !== sanitized) {
        target.value = sanitized;
      }
    }
  });

  // 8. NEW PARENT ACCOUNT REGISTRATION
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!registerForm.checkValidity()) {
        registerForm.classList.add('was-validated');
        return;
      }

      const profile = {
        parentName: document.getElementById('registerParentName').value.trim(),
        childName: document.getElementById('registerChildName').value.trim(),
        childAge: document.getElementById('registerChildAge').value.trim(),
        email: document.getElementById('registerEmail').value.trim()
      };
      localStorage.setItem('vox_parent_profile', JSON.stringify(profile));
      showToast('Account Created!', 'Your parent account has been registered. Opening your dashboard...', 'success');
      setTimeout(() => { window.location.href = 'dashboard-parent.html'; }, 900);
    });
  }

  // 9. FORM VALIDATION & INTERACTIVE TOAST
  const forms = document.querySelectorAll('.needs-validation-vx');
  forms.forEach(form => {
    if (form.id === 'registerForm') return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Processing...`;
        submitBtn.disabled = true;
      }

      // Simulate AJAX success
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
        form.reset();
        form.classList.remove('was-validated');
        showToast('Success!', 'Your inquiry has been submitted. Our Academic Director will reach out within 24 hours.', 'success');
      }, 900);
    });
  });

  // Global Toast Dispatcher
  window.showToast = function(title, message, type = 'info') {
    let toastContainer = document.getElementById('vxToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'vxToastContainer';
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      toastContainer.style.zIndex = '1100';
      document.body.appendChild(toastContainer);
    }

    const toastId = 'toast_' + Date.now();
    const typeBg = 'bg-primary';
    
    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-white ${typeBg} border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${title}</strong>
            <div>${message}</div>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    if (window.bootstrap && bootstrap.Toast) {
      const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
      bsToast.show();
    }
  };

  // 9. COUNTDOWN TIMER (Coming Soon Page)
  const countdownEl = document.getElementById('countdownTimer');
  if (countdownEl) {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 28);

    function updateCountdown() {
      const now = new Date().getTime();
      const diff = launchDate - now;

      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = document.getElementById('timerDays');
      const hEl = document.getElementById('timerHours');
      const mEl = document.getElementById('timerMins');
      const sEl = document.getElementById('timerSecs');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 10. MOBILE SIDEBAR TOGGLER
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const dashboardSidebar = document.querySelector('.dashboard-sidebar');
  if (sidebarToggleBtn && dashboardSidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      dashboardSidebar.classList.toggle('show');
    });
  }
  if (sidebarCloseBtn && dashboardSidebar) {
    sidebarCloseBtn.addEventListener('click', () => {
      dashboardSidebar.classList.remove('show');
    });
  }

  // 11. BLOG INTERACTIVE PAGINATION
  const blogPagination = document.getElementById('blogPagination');
  if (blogPagination) {
    const pagerButtons = blogPagination.querySelectorAll('.blog-pager-btn');
    pagerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.getAttribute('data-page');
        const items = blogPagination.querySelectorAll('.page-item');
        let currentActive = 1;
        items.forEach(it => {
          const b = it.querySelector('[data-page]');
          if (b && it.classList.contains('active')) {
            const num = parseInt(b.getAttribute('data-page'), 10);
            if (!isNaN(num)) currentActive = num;
          }
        });

        let targetPage = currentActive;
        if (action === 'prev') {
          targetPage = Math.max(1, currentActive - 1);
        } else if (action === 'next') {
          targetPage = Math.min(3, currentActive + 1);
        } else {
          targetPage = parseInt(action, 10);
        }

        // Update active class
        items.forEach(it => {
          const b = it.querySelector('[data-page]');
          if (!b) return;
          const p = b.getAttribute('data-page');
          if (p === 'prev') {
            it.classList.toggle('disabled', targetPage === 1);
          } else if (p === 'next') {
            it.classList.toggle('disabled', targetPage === 3);
          } else if (parseInt(p, 10) === targetPage) {
            it.classList.add('active');
          } else {
            it.classList.remove('active');
          }
        });

        window.scrollTo({ top: 350, behavior: 'smooth' });
        showToast('Page ' + targetPage, 'Displaying articles for page ' + targetPage + '.', 'info');
      });
    });
  }

});
