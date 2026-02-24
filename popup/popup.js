// popup/popup.js

document.addEventListener('DOMContentLoaded', async () => {
  const statusText = document.getElementById('statusText');
  const dailySaved = document.getElementById('dailySaved');
  const toggleAppBtn = document.getElementById('toggleApp');
  const openOptionsBtn = document.getElementById('openOptions');

  // Load stats
  const dateStr = new Date().toISOString().slice(0, 10);
  const key = `stats_${dateStr}`;
  const result = await chrome.storage.local.get(key);
  const dayStats = result[key] || {};
  
  const totalBlocks = Object.values(dayStats).reduce((a, b) => a + b, 0);
  // Assume each block saves ~2 minutes of mindless browsing
  const minutesSaved = totalBlocks * 2;
  
  if (dailySaved) {
    dailySaved.textContent = minutesSaved;
  }

  if (openOptionsBtn) {
    openOptionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  if (toggleAppBtn) {
    const btnText = toggleAppBtn.querySelector('.btn-text');
    const btnDetail = toggleAppBtn.querySelector('.btn-detail');

    toggleAppBtn.addEventListener('click', () => {
      // Basic interaction for the prompt
      const originalText = btnText.textContent;
      const originalDetail = btnDetail.textContent;
      
      btnText.textContent = "Breathe...";
      btnDetail.textContent = "Entering stillness";
      
      setTimeout(() => {
        btnText.textContent = originalText;
        btnDetail.textContent = originalDetail;
      }, 2000);
    });
  }
});
