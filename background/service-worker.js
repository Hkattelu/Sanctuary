// background/service-worker.js
importScripts('../utils/storage.js');

chrome.runtime.onInstalled.addListener(async () => {
  const sites = await getBlockedSites();
  if (sites.length === 0) {
    await setBlockedSites(DEFAULT_BLOCKED_SITES);
  }
  
  // Set up the heartbeat alarm
  await chrome.alarms.create('checkSchedule', {
    periodInMinutes: 1
  });
  
  await syncRules();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkSchedule') {
    await syncRules();
  } else if (alarm.name.startsWith('bypass_')) {
    const domain = alarm.name.replace('bypass_', '');
    await removeBypassRule(domain);
  }
});

chrome.storage.onChanged.addListener(async (changes) => {
  if (changes.blockedSites) {
    await syncRules();
  }
});

// Message listener for block events and bypasses
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.type === 'BLOCK_EVENT') {
      logBlockEvent(message.domain).catch(console.error);
    } else if (message.type === 'BYPASS_SITE') {
      handleBypass(message.domain)
        .then(() => sendResponse({ status: 'success' }))
        .catch((err) => {
          console.error('[Intentional] Bypass error:', err);
          sendResponse({ status: 'error', message: err.message });
        });
      return true; // Keep channel open for async response
    }
  } catch (err) {
    console.error('[Intentional] Message handling error:', err);
  }
});

async function logBlockEvent(domain) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const key = `stats_${dateStr}`; // daily bucket
  const result = await chrome.storage.local.get(key);
  const day = result[key] || {};
  day[domain] = (day[domain] || 0) + 1;
  await chrome.storage.local.set({ [key]: day });
}

async function handleBypass(domain) {
  // Use a deterministic but high-range ID based on domain hash or just track it
  const { bypassRules = {} } = await chrome.storage.local.get('bypassRules');
  
  // If already bypassed, clear the old one first to reset the timer
  if (bypassRules[domain]) {
    await removeBypassRule(domain);
  }

  const ruleId = 1000 + Math.floor(Math.random() * 9000); 
  
  const bypassRule = {
    id: ruleId,
    priority: 10, 
    action: { type: 'allow' },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: ['main_frame']
    }
  };

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [bypassRule]
  });

  // Schedule removal after configured minutes
  const duration = await getBypassDuration();
  const alarmName = `bypass_${domain}`;
  await chrome.alarms.create(alarmName, { delayInMinutes: duration });
  
  bypassRules[domain] = ruleId;
  await chrome.storage.local.set({ bypassRules });
}

async function removeBypassRule(domain) {
  const { bypassRules = {} } = await chrome.storage.local.get('bypassRules');
  const ruleId = bypassRules[domain];
  
  if (ruleId) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [ruleId]
    });
    delete bypassRules[domain];
    await chrome.storage.local.set({ bypassRules });
  }
}

async function syncRules() {
  const blockedSites = await getBlockedSites();
  const now = new Date();
  const currentDay = now.getDay(); // 0 (Sun) - 6 (Sat)
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const activeSites = blockedSites.filter(site => {
    if (!site.enabled) return false;
    
    // If no schedule exists, assume always blocked
    if (!site.schedule) return true;
    
    const { days, startMinutes, endMinutes } = site.schedule;
    const dayMatch = days.includes(currentDay);
    const timeMatch = currentMinutes >= startMinutes && currentMinutes < endMinutes;
    
    return dayMatch && timeMatch;
  });

  const rules = activeSites.map((site, index) => {
    const id = index + 1;
    const redirectUrl = chrome.runtime.getURL(`blocked/blocked.html?site=${encodeURIComponent(site.domain)}`);
    
    return {
      id,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { url: redirectUrl }
      },
      condition: {
        urlFilter: `||${site.domain}^`,
        resourceTypes: ['main_frame']
      }
    };
  });

  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  // Only remove rules in our standard range (1-999)
  const removeRuleIds = existingRules
    .map(rule => rule.id)
    .filter(id => id < 1000);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules: rules
  });
}
