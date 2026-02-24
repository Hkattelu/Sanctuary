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

  // Most blocked site
  const topSite = Object.entries(siteCounts).sort((a, b) => b[1] - a[1])[0];
  
  totalBlocksEl.textContent = totalBlocks;
  timeSavedEl.textContent = `${totalBlocks * 15}m`;
  topSiteEl.textContent = topSite ? topSite[0] : '-';
}

async function renderSites() {
  const sites = await getBlockedSites();
  sitesContainer.innerHTML = '';
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  sites.forEach((site, index) => {
    const clone = siteTemplate.content.cloneNode(true);
    const domainSpan = clone.querySelector('.domain');
    const statusBadge = clone.querySelector('.status-badge');
    const toggleBtn = clone.querySelector('.toggle-btn');
    const scheduleBtn = clone.querySelector('.edit-schedule-btn');
    const deleteBtn = clone.querySelector('.delete-btn');
    const editor = clone.querySelector('.schedule-editor');
    const saveScheduleBtn = clone.querySelector('.save-schedule-btn');
    
    domainSpan.textContent = site.domain;
    
    // Determine status badge
    if (!site.enabled) {
      statusBadge.textContent = 'Disabled';
      statusBadge.className = 'status-badge';
    } else if (!site.schedule) {
      statusBadge.textContent = 'Always Blocked';
      statusBadge.className = 'status-badge active';
    } else {
      const { days, startMinutes, endMinutes } = site.schedule;
      const dayMatch = days.includes(currentDay);
      const timeMatch = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      
      if (dayMatch && timeMatch) {
        statusBadge.textContent = 'Active (Scheduled)';
        statusBadge.className = 'status-badge active';
      } else {
        statusBadge.textContent = 'Inactive (Scheduled)';
        statusBadge.className = 'status-badge scheduled';
      }
    }
    
    toggleBtn.textContent = site.enabled ? 'Disable' : 'Enable';
    toggleBtn.onclick = async () => {
      site.enabled = !site.enabled;
      await saveSites(sites);
    };
    
    deleteBtn.onclick = async () => {
      sites.splice(index, 1);
      await saveSites(sites);
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
  const schedule = await getDefaultSchedule();
  defaultScheduleEditor.innerHTML = `
    <div class="days-selector">
      ${[0, 1, 2, 3, 4, 5, 6].map(d => `
        <label><input type="checkbox" value="${d}" ${schedule.days.includes(d) ? 'checked' : ''}> ${['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]}</label>
      `).join('')}
    </div>
    <div class="time-selector">
      <label>Start: <input type="time" class="start-time" value="${minutesToTimeString(schedule.startMinutes)}"></label>
      <label>End: <input type="time" class="end-time" value="${minutesToTimeString(schedule.endMinutes)}"></label>
    </div>
    <button id="saveDefaultScheduleBtn" style="font-size: 0.7em; margin-top: 5px;">Save Default</button>
  `;

  document.getElementById('saveDefaultScheduleBtn').onclick = async () => {
    const newSchedule = readEditor(defaultScheduleEditor);
    await setDefaultSchedule(newSchedule);
    alert('Default schedule saved.');
  };
}

function fillEditor(editor, schedule = null) {
  const dayCheckboxes = editor.querySelectorAll('.days-selector input');
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
  const dayCheckboxes = editor.querySelectorAll('.days-selector input');
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
    alert(`${domain} is already in your block list.`);
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
}

addSiteForm.onsubmit = async (e) => {
  e.preventDefault();
  const domain = newSiteDomain.value.trim();
  if (domain) {
    await addNewSite(domain);
    newSiteDomain.value = '';
  }
};

// Preset Buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.onclick = () => addNewSite(btn.dataset.domain);
});

// Import/Export
exportBtn.onclick = async () => {
  const settings = await chrome.storage.sync.get(['blockedSites', 'defaultSchedule']);
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `intentional-settings-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

importBtn.onclick = () => importFile.click();

importFile.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const settings = JSON.parse(e.target.result);
      if (confirm('This will overwrite your current settings. Proceed?')) {
        await chrome.storage.sync.set(settings);
        await init();
        alert('Settings imported successfully.');
      }
    } catch (err) {
      alert('Failed to parse settings file.');
    }
  };
  reader.readAsText(file);
};

async function init() {
  await renderStats();
  await renderSites();
  await renderAdvanced();
}

init();
// Update status badges every minute as time passes
setInterval(init, 60000);
