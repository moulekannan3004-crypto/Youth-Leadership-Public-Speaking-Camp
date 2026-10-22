/**
 * VoxLeaders - Dashboard Interactive Script
 * Powers Chart.js Visualizations, Data Filtering, and Interactive Mock Operations
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 0. ACTIVE PARENT PROFILE HYDRATION & MULTI-ACCOUNT SYNC
  function getActiveParentProfile() {
    const stored = localStorage.getItem('vox_parent_profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.parentName) return parsed;
      } catch (e) {}
    }
    return {
      parentName: 'Rachel Adams',
      childName: 'Maya Lin',
      childAge: '14',
      email: 'rachel.adams@example.com'
    };
  }

  function applyActiveDashboardProfile() {
    const profile = getActiveParentProfile();
    const parentName = profile.parentName;
    const childName = profile.childName || `${parentName.split(' ')[0]}'s Child`;
    const childFirstName = childName.split(/\s+/)[0];

    // 1. Direct targeted element replacements for 100% guarantee
    document.querySelectorAll('.status-pill-gold').forEach(pill => {
      pill.innerHTML = `<i class="bi bi-shield-check"></i> PARENT ACCESS: ${parentName.toUpperCase()}`;
    });

    const welcomeH1 = document.querySelector('.dashboard-welcome-card h1');
    if (welcomeH1) {
      welcomeH1.innerHTML = `Good evening, ${parentName} 👋`;
    }

    const welcomeP = document.querySelector('.dashboard-welcome-card p');
    if (welcomeP) {
      welcomeP.innerHTML = welcomeP.innerHTML
        .replace(/Rachel Adams/g, parentName)
        .replace(/Maya Lin/g, childName)
        .replace(/\bMaya\b/g, childFirstName);
    }

    // 2. Active Account Badges in Topbars & Dropdowns
    document.querySelectorAll('.active-account-name-badge').forEach(el => {
      el.textContent = parentName;
    });
    const emailBadge = document.getElementById('activeAccountEmailBadge');
    if (emailBadge && profile.email) {
      emailBadge.textContent = profile.email;
    }

    // 3. TreeWalker text node replacements across the whole DOM
    const textNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      if (node.nodeValue) {
        node.nodeValue = node.nodeValue
          .replace(/RACHEL ADAMS/g, parentName.toUpperCase())
          .replace(/Rachel Adams/g, parentName)
          .replace(/Maya Lin/g, childName)
          .replace(/\bMaya\b/g, childFirstName);
      }
    });

    // 4. Update avatar rings and profile links with interactive account dropdown
    document.querySelectorAll('.user-avatar-ring').forEach(avatar => {
      avatar.alt = parentName;
      const profileLink = avatar.closest('a');
      if (profileLink && !profileLink.classList.contains('account-switcher-init')) {
        profileLink.classList.add('account-switcher-init');
        profileLink.title = `${parentName} Profile (${profile.email || ''})`;
        profileLink.setAttribute('role', 'button');
        profileLink.setAttribute('data-bs-toggle', 'dropdown');
        profileLink.setAttribute('aria-expanded', 'false');
        profileLink.href = 'javascript:void(0);';

        const parentWrapper = profileLink.parentElement;
        if (parentWrapper) {
          const dropdownContainer = document.createElement('div');
          dropdownContainer.className = 'dropdown d-inline-block ms-1';
          parentWrapper.insertBefore(dropdownContainer, profileLink);
          dropdownContainer.appendChild(profileLink);

          const menuHtml = `
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border border-theme p-2" style="min-width: 240px;">
              <li><h6 class="dropdown-header small text-uppercase fw-bold text-muted px-2 py-1">Active Parent Account</h6></li>
              <li class="px-2 py-1.5 mb-2 bg-surface-alt rounded border border-theme">
                <div class="fw-bold small text-heading active-account-name-badge">${parentName}</div>
                <div class="text-muted text-truncate" style="font-size: 0.75rem;" id="activeAccountEmailBadge">${profile.email || 'rachel.adams@example.com'}</div>
              </li>
              <li>
                <a class="dropdown-item small rounded py-1.5" href="auth.html" onclick="localStorage.setItem('vox_auth_intent', 'new');">
                  <i class="bi bi-person-plus text-primary me-2"></i> Register New Account
                </a>
              </li>
              <li>
                <a class="dropdown-item small rounded py-1.5" href="auth.html">
                  <i class="bi bi-arrow-left-right text-info me-2"></i> Switch Account
                </a>
              </li>
              <li><hr class="dropdown-divider my-1"></li>
              <li>
                <a class="dropdown-item small rounded py-1.5 text-danger" href="auth.html" onclick="localStorage.removeItem('vox_parent_profile'); localStorage.removeItem('vox_active_user');">
                  <i class="bi bi-box-arrow-right me-2"></i> Sign Out
                </a>
              </li>
            </ul>
          `;
          dropdownContainer.insertAdjacentHTML('beforeend', menuHtml);
        }
      }
    });

    // 5. Update dashboard search placeholder
    document.querySelectorAll('.dashboard-search-input').forEach(input => {
      input.placeholder = `Global search (e.g. ${childFirstName}, coach, speech syllabus)...`;
    });

    // 6. Safe Sidebar & Topbar Logout Handlers
    document.querySelectorAll('.btn-sidebar-logout').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('vox_parent_profile');
        localStorage.removeItem('vox_active_user');
        if (typeof showToast === 'function') {
          showToast('Logged Out', 'You have been safely signed out. Redirecting to login...', 'info');
        }
        setTimeout(() => { window.location.href = 'auth.html'; }, 600);
      };
    });
  }

  applyActiveDashboardProfile();

  // 1. CHART.JS THEME DETECTOR
  function isDarkMode() {
    return document.documentElement.getAttribute('data-bs-theme') === 'dark';
  }

  const textColor = isDarkMode() ? '#94A3B8' : '#64748B';
  const gridColor = isDarkMode() ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';

  // 2. PARENT PORTAL - SKILL RADAR CHART
  const skillRadarCanvas = document.getElementById('skillRadarChart');
  if (skillRadarCanvas && window.Chart) {
    const radarData = {
      labels: ['Stage Confidence', 'Voice Modulation', 'Body Language', 'Debate Rebuttals', 'Impromptu Fluency', 'Active Listening'],
      datasets: [
        {
          label: 'Current Level (Week 6)',
          data: [92, 88, 85, 94, 80, 90],
          backgroundColor: 'rgba(79, 70, 229, 0.25)',
          borderColor: '#4F46E5',
          borderWidth: 2.5,
          pointBackgroundColor: '#4F46E5',
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#4F46E5'
        },
        {
          label: 'Camp Baseline (Week 1)',
          data: [55, 60, 48, 50, 42, 65],
          backgroundColor: 'rgba(148, 163, 184, 0.15)',
          borderColor: '#94A3B8',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointBackgroundColor: '#94A3B8'
        }
      ]
    };

    const radarChart = new Chart(skillRadarCanvas, {
      type: 'radar',
      data: radarData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: {
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '600' },
              color: textColor
            },
            ticks: { display: false, min: 0, max: 100 }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' }
            }
          }
        }
      }
    });

    // Child switcher event
    const childSelect = document.getElementById('parentChildSelect');
    if (childSelect) {
      childSelect.addEventListener('change', (e) => {
        if (e.target.value === 'child2') {
          radarChart.data.datasets[0].data = [78, 82, 70, 68, 85, 80];
          radarChart.data.datasets[1].data = [40, 45, 38, 35, 50, 52];
        } else {
          radarChart.data.datasets[0].data = [92, 88, 85, 94, 80, 90];
          radarChart.data.datasets[1].data = [55, 60, 48, 50, 42, 65];
        }
        radarChart.update();
      });
    }
  }

  // 3. PARENT PORTAL - WEEKLY GROWTH BAR CHART
  const weeklyGrowthCanvas = document.getElementById('weeklyGrowthChart');
  if (weeklyGrowthCanvas && window.Chart) {
    new Chart(weeklyGrowthCanvas, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Overall Speaking Confidence Score',
          data: [54, 62, 71, 79, 86, 93],
          backgroundColor: 'rgba(79, 70, 229, 0.85)',
          borderRadius: 8,
          hoverBackgroundColor: '#4F46E5'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });
  }

  // 4. ADMIN DASHBOARD - REVENUE & ENROLLMENT CHARTS
  const adminRevenueCanvas = document.getElementById('adminRevenueChart');
  if (adminRevenueCanvas && window.Chart) {
    new Chart(adminRevenueCanvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Camp Revenue ($k)',
            data: [32, 45, 58, 62, 75, 98, 125, 142, 138, 148.2],
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#4F46E5'
          },
          {
            label: 'Students Enrolled',
            data: [120, 160, 210, 240, 280, 350, 420, 460, 470, 485],
            borderColor: '#818CF8',
            borderWidth: 2.5,
            borderDash: [5, 5],
            tension: 0.35,
            pointRadius: 0,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { weight: '600' } }
          }
        },
        scales: {
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, callback: v => '$' + v + 'k' }
          },
          y1: {
            position: 'right',
            grid: { display: false },
            ticks: { color: textColor }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });
  }

  // 5. ADMIN USER MANAGEMENT FILTERING
  const userSearch = document.getElementById('userSearchInput');
  const userRoleFilter = document.getElementById('userRoleFilter');
  const userRows = document.querySelectorAll('.user-table-row');

  function filterUsers() {
    const term = userSearch ? userSearch.value.toLowerCase().trim() : '';
    const role = userRoleFilter ? userRoleFilter.value.toLowerCase() : 'all';

    userRows.forEach(row => {
      const name = row.querySelector('.user-name')?.textContent.toLowerCase() || '';
      const email = row.querySelector('.user-email')?.textContent.toLowerCase() || '';
      const userRole = row.getAttribute('data-role') || '';

      const matchTerm = name.includes(term) || email.includes(term);
      const matchRole = role === 'all' || userRole === role;

      row.style.display = (matchTerm && matchRole) ? '' : 'none';
    });
  }

  if (userSearch) userSearch.addEventListener('input', filterUsers);
  if (userRoleFilter) userRoleFilter.addEventListener('change', filterUsers);

  // 6. INTERACTIVE MESSAGING INBOX
  const threadItems = document.querySelectorAll('.thread-list-item');
  const chatHeaderName = document.getElementById('chatHeaderName');
  const chatHeaderRole = document.getElementById('chatHeaderRole');
  const chatScroll = document.getElementById('chatMessagesScroll');
  const chatInput = document.getElementById('chatMessageInput');
  const chatForm = document.getElementById('chatSendForm');

  if (threadItems.length > 0) {
    threadItems.forEach(item => {
      item.addEventListener('click', () => {
        threadItems.forEach(t => t.classList.remove('active'));
        item.classList.add('active');

        const sender = item.getAttribute('data-sender') || 'Parent';
        const role = item.getAttribute('data-role') || 'Parent of Teen Leader';
        if (chatHeaderName) chatHeaderName.textContent = sender;
        if (chatHeaderRole) chatHeaderRole.textContent = role;
      });
    });
  }

  if (chatForm && chatInput && chatScroll) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const bubbleHtml = `
        <div class="chat-bubble sent">
          <div>${text}</div>
          <small class="d-block text-end mt-1 opacity-75" style="font-size: 0.7rem;">Just now</small>
        </div>
      `;
      chatScroll.insertAdjacentHTML('beforeend', bubbleHtml);
      chatInput.value = '';
      chatScroll.scrollTop = chatScroll.scrollHeight;

      // Simulated auto-reply after 1.5s
      setTimeout(() => {
        const replyHtml = `
          <div class="chat-bubble received">
            <div>Thank you for the update! Coach Marcus and the team will incorporate this into tomorrow's podium session.</div>
            <small class="d-block text-start mt-1 opacity-75" style="font-size: 0.7rem;">Just now</small>
          </div>
        `;
        chatScroll.insertAdjacentHTML('beforeend', replyHtml);
        chatScroll.scrollTop = chatScroll.scrollHeight;
      }, 1500);
    });
  }

  // 7. ENROLLMENT SESSION PICKER & CHECKOUT MODAL
  const sessionSelect = document.getElementById('checkoutSessionSelect');
  const priceDisplay = document.getElementById('checkoutTotalDisplay');
  if (sessionSelect && priceDisplay) {
    sessionSelect.addEventListener('change', (e) => {
      const selected = e.target.options[e.target.selectedIndex];
      const price = selected.getAttribute('data-price') || '$850';
      priceDisplay.textContent = price;
    });
  }

  // 8. MEDIA GALLERY LIGHTBOX MOCK
  const galleryItems = document.querySelectorAll('.media-gallery-item');
  const modalImg = document.getElementById('lightboxModalImg');
  const modalTitle = document.getElementById('lightboxModalTitle');
  if (galleryItems.length > 0 && modalImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const bg = item.getAttribute('data-img-src') || '';
        const title = item.getAttribute('data-img-title') || 'Camp Media';
        modalImg.src = bg;
        if (modalTitle) modalTitle.textContent = title;
      });
    });
  }

});
