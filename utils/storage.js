// utils/storage.js
const DEFAULT_BLOCKED_SITES = [
  { 
    id: 'reddit', 
    domain: 'reddit.com', 
    enabled: true,
    schedule: {
      days: [1, 2, 3, 4, 5], // Mon-Fri
      startMinutes: 540,      // 9:00 AM
      endMinutes: 1020        // 5:00 PM
    }
  },
  { 
    id: 'linkedin', 
    domain: 'linkedin.com', 
    enabled: true,
    schedule: {
      days: [1, 2, 3, 4, 5], // Mon-Fri
      startMinutes: 540,      // 9:00 AM
      endMinutes: 1020        // 5:00 PM
    }
  }
];

async function getBlockedSites() {
  const result = await chrome.storage.sync.get('blockedSites');
  return result.blockedSites || [];
}

async function setBlockedSites(sites) {
  await chrome.storage.sync.set({ blockedSites: sites });
}

const STANDARD_SCHEDULE = {
  days: [1, 2, 3, 4, 5], // Mon-Fri
  startMinutes: 540,      // 9:00 AM
  endMinutes: 1020        // 5:00 PM
};

async function getDefaultSchedule() {
  const result = await chrome.storage.sync.get('defaultSchedule');
  return result.defaultSchedule || STANDARD_SCHEDULE;
}

async function setDefaultSchedule(schedule) {
  await chrome.storage.sync.set({ defaultSchedule: schedule });
}

function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

function minutesToTimeString(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
