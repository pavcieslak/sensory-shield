/**
 * SensoryShield - Chrome Extension Background Service Worker
 * Copyright (c) 2026. MIT License (AS IS disclaimer applies).
 * 
 * PRIVACY & ARCHITECTURE:
 * - 100% Local-First Architecture.
 * - Zero telemetry, tracking, or network requests.
 * - Storage is strictly restricted to chrome.storage.local.
 * - Pre-configured interface for Gemini API down-regulation.
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  hideShorts: true,
  muteNotificationBadges: true,
  dimSidebar: false,
  // Sensory & Cognitive Suite
  blockAutoplayHover: true,
  normalizeTitles: true,
  desaturateThumbnails: false,
  hideComments: true,
  timeAnchorEnabled: false,
  timeAnchorMinutes: 30,
  // Custom Filters
  blockedKeywords: [
    "bikini", "lingerie", "haul", "try on", "thirst", "model", "onlyfans",
    "hot girl", "dating advice", "dating coach", "alpha female", "baddie",
    "cosplay babe", "egirl", "nsfw", "cleavage", "feet", "waifu", "kpop idol fancam",
    "sugar baby", "hypergamy", "asmr girlfriend", "pov girlfriend", "boudoir",
    "twerk", "glamour", "swimwear", "shein haul", "micro bikini"
  ],
  customKeywords: [],
  stats: {
    totalHidden: 0
  },
  // Future AI Integration Interface
  aiConfig: {
    provider: "gemini",
    apiKey: "",
    downregulationEnabled: false,
    sensoryAnalysisLevel: "balanced"
  }
};

chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get("sensoryShieldSettings");
  if (!data.sensoryShieldSettings) {
    await chrome.storage.local.set({ sensoryShieldSettings: DEFAULT_SETTINGS });
  } else {
    const updated = { ...DEFAULT_SETTINGS, ...data.sensoryShieldSettings };
    await chrome.storage.local.set({ sensoryShieldSettings: updated });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "INCREMENT_BLOCKED_COUNT") {
    chrome.storage.local.get("sensoryShieldSettings", (data) => {
      const settings = data.sensoryShieldSettings || DEFAULT_SETTINGS;
      settings.stats = settings.stats || { totalHidden: 0 };
      settings.stats.totalHidden += (message.count || 1);
      chrome.storage.local.set({ sensoryShieldSettings: settings });
    });
    sendResponse({ status: "ok" });
  }
  return true;
});
