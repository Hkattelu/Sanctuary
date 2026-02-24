// options/options.js

const addSiteForm = document.getElementById('addSiteForm');
const newSiteDomain = document.getElementById('newSiteDomain');
const sitesContainer = document.getElementById('sitesContainer');
const siteTemplate = document.getElementById('siteTemplate');
const totalBlocksEl = document.getElementById('totalBlocks');
const timeSavedEl = document.getElementById('timeSaved');
const topSiteEl = document.getElementById('topSite');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const defaultScheduleEditor = document.getElementById('defaultScheduleEditor');

const notificationRoot = document.getElementById('notificationRoot');

function showToast(message, type = 'info') {
  if (!notificationRoot) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  notificationRoot.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

async function renderCairn(totalBlocks) {
  const cairnContainer = document.getElementById('cairnContainer');
  if (!cairnContainer) return;
  
  cairnContainer.innerHTML = '';
  // Number of stones: 1 stone per 5 blocks, max 8 stones for visual balance
  const stoneCount = Math.min(Math.floor(totalBlocks / 5) + 1, 8);
  
  for (let i = 0; i < stoneCount; i++) {
    const stone = document.createElement('div');
    stone.className = 'stone';
    // Randomize shape slightly for organic feel
    const width = 100 - (i * 10);
    const height = 40 - (i * 2);
    stone.style.width = `${width}px`;
    stone.style.height = `${height}px`;
    stone.style.animationDelay = `${i * 0.1}s`;
    cairnContainer.appendChild(stone);
  }
}

async function renderStats() {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return `stats_${d.toISOString().slice(0, 10)}`;
  });

  const stats = await chrome.storage.local.get(last7Days);
  let totalBlocks = 0;
  const siteCounts = {};

  Object.values(stats).forEach(day => {
    Object.entries(day).forEach(([domain, count]) => {
      totalBlocks += count;
      siteCounts[domain] = (siteCounts[domain] || 0) + count;
    });
  });

  const topSite = Object.entries(siteCounts).sort((a, b) => b[1] - a[1])[0];
  
  if (totalBlocksEl) totalBlocksEl.textContent = totalBlocks;
  // Assume each block saves ~5 minutes of focus depth
  if (timeSavedEl) timeSavedEl.textContent = `${totalBlocks * 5}m`;
  if (topSiteEl) topSiteEl.textContent = topSite ? topSite[0].split('.')[0] : '-';

  renderCairn(totalBlocks);
}

async function renderSites() {
  const sites = await getBlockedSites();
  if (!sitesContainer) return;
  sitesContainer.innerHTML = '';
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  sites.forEach((site, index) => {
    const clone = siteTemplate.content.cloneNode(true);
    const domainSpan = clone.querySelector('.domain');
    const statusInd = clone.querySelector('.status-indicator');
    const toggleBtn = clone.querySelector('.toggle-btn');
    const scheduleBtn = clone.querySelector('.edit-schedule-btn');
    const deleteBtn = clone.querySelector('.delete-btn');
    const editor = clone.querySelector('.schedule-editor');
    const saveScheduleBtn = clone.querySelector('.save-schedule-btn');
    
    domainSpan.textContent = site.domain;
    
    // Status Logic
    statusInd.className = 'status-indicator';
    if (!site.enabled) {
      statusInd.title = 'Paused';
    } else if (!site.schedule) {
      statusInd.title = 'Always Bound';
      statusInd.classList.add('active');
    } else {
      const { days, startMinutes, endMinutes } = site.schedule;
      const dayMatch = days.includes(currentDay);
      const timeMatch = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      
      if (dayMatch && timeMatch) {
        statusInd.title = 'Active Now';
        statusInd.classList.add('active');
      } else {
        statusInd.title = 'Scheduled (Inactive)';
      }
    }
    
    toggleBtn.textContent = site.enabled ? 'Pause' : 'Resume';
    toggleBtn.onclick = async () => {
      site.enabled = !site.enabled;
      await saveSites(sites);
    };
    
    deleteBtn.onclick = async () => {
      const deletedDomain = site.domain;
      sites.splice(index, 1);
      await saveSites(sites);
      showToast(`${deletedDomain} removed from sanctuary.`, 'info');
    };
    
    scheduleBtn.onclick = () => {
      editor.classList.toggle('hidden');
      if (!editor.classList.contains('hidden')) {
        fillEditor(editor, site.schedule);
      }
    };
    
    saveScheduleBtn.onclick = async () => {
      const schedule = readEditor(editor);
      site.schedule = schedule;
      await saveSites(sites);
    };
    
    sitesContainer.appendChild(clone);
  });
}

async function renderAdvanced() {
  if (!defaultScheduleEditor) return;
  const schedule = await getDefaultSchedule();
  const bypassDuration = await getBypassDuration();

  // Handle Bypass Duration UI
  const bypassInput = document.getElementById('bypassDurationInput');
  const saveBypassBtn = document.getElementById('saveBypassDurationBtn');
  
  if (bypassInput) bypassInput.value = bypassDuration;
  if (saveBypassBtn) {
    saveBypassBtn.onclick = async () => {
      const val = parseInt(bypassInput.value);
      if (val > 0) {
        await setBypassDuration(val);
        showToast('Bypass rhythm updated.', 'success');
      }
    };
  }

  defaultScheduleEditor.innerHTML = `
    <div class="editor-inner">
      <div class="days-grid">
        ${[0, 1, 2, 3, 4, 5, 6].map(d => `
          <label><input type="checkbox" value="${d}" ${schedule.days.includes(d) ? 'checked' : ''}> ${['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]}</label>
        `).join('')}
      </div>
      <div class="time-range">
        <div class="time-input">
          <span class="label">From</span>
          <input type="time" class="start-time" value="${minutesToTimeString(schedule.startMinutes)}">
        </div>
        <div class="time-input">
          <span class="label">To</span>
          <input type="time" class="end-time" value="${minutesToTimeString(schedule.endMinutes)}">
        </div>
      </div>
      <button id="saveDefaultScheduleBtn" class="zen-btn primary">Save Default Schedule</button>
    </div>
  `;

  document.getElementById('saveDefaultScheduleBtn').onclick = async () => {
    const newSchedule = readEditor(defaultScheduleEditor);
    await setDefaultSchedule(newSchedule);
    
    // Apply to all existing sites as well
    const sites = await getBlockedSites();
    const updatedSites = sites.map(s => ({ ...s, schedule: newSchedule }));
    await saveSites(updatedSites);
    
    showToast('Default schedule updated and applied to all sites.', 'success');
  };
}

function fillEditor(editor, schedule = null) {
  const dayCheckboxes = editor.querySelectorAll('input[type="checkbox"]');
  const startTimeInput = editor.querySelector('.start-time');
  const endTimeInput = editor.querySelector('.end-time');
  
  if (schedule) {
    dayCheckboxes.forEach(cb => {
      cb.checked = schedule.days.includes(parseInt(cb.value));
    });
    startTimeInput.value = minutesToTimeString(schedule.startMinutes);
    endTimeInput.value = minutesToTimeString(schedule.endMinutes);
  }
}

function readEditor(editor) {
  const dayCheckboxes = editor.querySelectorAll('input[type="checkbox"]');
  const startTimeInput = editor.querySelector('.start-time');
  const endTimeInput = editor.querySelector('.end-time');
  
  const days = Array.from(dayCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => parseInt(cb.value));
    
  const startMinutes = timeStringToMinutes(startTimeInput.value);
  const endMinutes = timeStringToMinutes(endTimeInput.value);
  
  return { days, startMinutes, endMinutes };
}

async function saveSites(sites) {
  await setBlockedSites(sites);
  await renderSites();
}

async function addNewSite(domain) {
  const sites = await getBlockedSites();
  if (sites.some(s => s.domain === domain)) {
    showToast(`${domain} is already in your boundaries.`, 'error');
    return;
  }
  
  const defaultSchedule = await getDefaultSchedule();
  sites.push({
    id: Date.now().toString(),
    domain: domain,
    enabled: true,
    schedule: defaultSchedule
  });
  
  await saveSites(sites);
  showToast(`${domain} boundary defined.`, 'success');
}

if (addSiteForm) {
  addSiteForm.onsubmit = async (e) => {
    e.preventDefault();
    const domain = newSiteDomain.value.trim();
    if (domain) {
      await addNewSite(domain);
      newSiteDomain.value = '';
    }
  };
}

// Preset Buttons (Updated selector)
document.querySelectorAll('.pill').forEach(btn => {
  btn.onclick = () => addNewSite(btn.dataset.domain);
});

// Import/Export
if (exportBtn) {
  exportBtn.onclick = async () => {
    const settings = await chrome.storage.sync.get(['blockedSites', 'defaultSchedule']);
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intentional-sanctuary-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

if (importBtn) {
  importBtn.onclick = () => importFile.click();
}

if (importFile) {
  importFile.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        if (confirm('This will replace your current boundaries. Proceed?')) {
          await chrome.storage.sync.set(settings);
          await init();
          showToast('Sanctuary imported.', 'success');
        }
      } catch (err) {
        showToast('Failed to parse sanctuary file.', 'error');
      }
    };
    reader.readAsText(file);
  };
}

async function init() {
  await renderStats();
  await renderSites();
  await renderAdvanced();
}

init();
setInterval(init, 60000);
