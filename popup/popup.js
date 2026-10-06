/**
 * SensoryShield - Popup Controller
 * Copyright (c) 2026. MIT License (AS IS disclaimer applies).
 * Strictly secure DOM construction: zero innerHTML, zero eval.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Status & Master
  const statusBadge = document.getElementById("status-badge");
  const toggleMaster = document.getElementById("toggle-master");

  // Tab Buttons & Panes
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.getAttribute("data-tab");
      
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });

  // Sensory Toggles
  const toggleShorts = document.getElementById("toggle-shorts");
  const toggleBadges = document.getElementById("toggle-badges");
  const toggleSidebar = document.getElementById("toggle-sidebar");
  const toggleHoverAutoplay = document.getElementById("toggle-hover-autoplay");
  const toggleCalmTitles = document.getElementById("toggle-calm-titles");
  const toggleDesaturate = document.getElementById("toggle-desaturate");
  const toggleComments = document.getElementById("toggle-comments");
  const toggleTimeAnchor = document.getElementById("toggle-time-anchor");

  // Keyword Elements
  const formAddKeyword = document.getElementById("form-add-keyword");
  const inputKeyword = document.getElementById("input-keyword");
  const keywordChipsContainer = document.getElementById("keyword-chips");
  const btnResetKeywords = document.getElementById("btn-reset-keywords");
  const statCount = document.getElementById("stat-count");

  // Fetch initial settings from chrome.storage.local
  const data = await chrome.storage.local.get("sensoryShieldSettings");
  let settings = data.sensoryShieldSettings || {
    enabled: true,
    hideShorts: true,
    muteNotificationBadges: true,
    dimSidebar: false,
    blockAutoplayHover: true,
    normalizeTitles: true,
    desaturateThumbnails: false,
    hideComments: true,
    timeAnchorEnabled: false,
    timeAnchorMinutes: 30,
    blockedKeywords: [],
    customKeywords: [],
    stats: { totalHidden: 0 }
  };

  function syncUI() {
    toggleMaster.checked = !!settings.enabled;
    toggleShorts.checked = !!settings.hideShorts;
    toggleBadges.checked = !!settings.muteNotificationBadges;
    toggleSidebar.checked = !!settings.dimSidebar;
    toggleHoverAutoplay.checked = !!settings.blockAutoplayHover;
    toggleCalmTitles.checked = !!settings.normalizeTitles;
    toggleDesaturate.checked = !!settings.desaturateThumbnails;
    toggleComments.checked = !!settings.hideComments;
    toggleTimeAnchor.checked = !!settings.timeAnchorEnabled;

    if (settings.enabled) {
      statusBadge.textContent = "Active";
      statusBadge.classList.remove("disabled");
    } else {
      statusBadge.textContent = "Paused";
      statusBadge.classList.add("disabled");
    }

    statCount.textContent = String((settings.stats && settings.stats.totalHidden) ? settings.stats.totalHidden : 0);
    renderChips();
  }

  async function saveSettings() {
    await chrome.storage.local.set({ sensoryShieldSettings: settings });
    syncUI();
  }

  // Pure, secure DOM creation with zero innerHTML
  function renderChips() {
    while (keywordChipsContainer.firstChild) {
      keywordChipsContainer.removeChild(keywordChipsContainer.firstChild);
    }

    const allKeywords = [
      ...(settings.blockedKeywords || []).map(k => ({ text: k, isCustom: false })),
      ...(settings.customKeywords || []).map(k => ({ text: k, isCustom: true }))
    ];

    allKeywords.forEach(({ text, isCustom }) => {
      const chip = document.createElement("div");
      chip.className = isCustom ? "chip custom" : "chip";

      const textSpan = document.createElement("span");
      textSpan.textContent = text;

      const removeBtn = document.createElement("span");
      removeBtn.className = "chip-remove";
      removeBtn.setAttribute("title", "Remove keyword");
      removeBtn.setAttribute("role", "button");
      removeBtn.setAttribute("tabindex", "0");
      removeBtn.textContent = "×";

      removeBtn.addEventListener("click", () => {
        removeKeyword(text, isCustom);
      });

      chip.appendChild(textSpan);
      chip.appendChild(removeBtn);
      keywordChipsContainer.appendChild(chip);
    });
  }

  function removeKeyword(text, isCustom) {
    const textLower = text.toLowerCase().trim();
    if (isCustom) {
      settings.customKeywords = (settings.customKeywords || []).filter(k => k.toLowerCase().trim() !== textLower);
    } else {
      settings.blockedKeywords = (settings.blockedKeywords || []).filter(k => k.toLowerCase().trim() !== textLower);
    }
    saveSettings();
  }

  // Event Listeners for Toggles
  toggleMaster.addEventListener("change", (e) => {
    settings.enabled = e.target.checked;
    saveSettings();
  });

  toggleShorts.addEventListener("change", (e) => {
    settings.hideShorts = e.target.checked;
    saveSettings();
  });

  toggleBadges.addEventListener("change", (e) => {
    settings.muteNotificationBadges = e.target.checked;
    saveSettings();
  });

  toggleSidebar.addEventListener("change", (e) => {
    settings.dimSidebar = e.target.checked;
    saveSettings();
  });

  toggleHoverAutoplay.addEventListener("change", (e) => {
    settings.blockAutoplayHover = e.target.checked;
    saveSettings();
  });

  toggleCalmTitles.addEventListener("change", (e) => {
    settings.normalizeTitles = e.target.checked;
    saveSettings();
  });

  toggleDesaturate.addEventListener("change", (e) => {
    settings.desaturateThumbnails = e.target.checked;
    saveSettings();
  });

  toggleComments.addEventListener("change", (e) => {
    settings.hideComments = e.target.checked;
    saveSettings();
  });

  toggleTimeAnchor.addEventListener("change", (e) => {
    settings.timeAnchorEnabled = e.target.checked;
    saveSettings();
  });

  // Form submit for adding custom keyword (case-insensitive deduplication)
  formAddKeyword.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = inputKeyword.value.trim();
    if (!val) return;

    settings.customKeywords = settings.customKeywords || [];
    const valLower = val.toLowerCase();
    const exists = settings.customKeywords.some(k => k.toLowerCase().trim() === valLower) || 
                   (settings.blockedKeywords || []).some(k => k.toLowerCase().trim() === valLower);

    if (!exists) {
      settings.customKeywords.push(val.toLowerCase());
      inputKeyword.value = "";
      saveSettings();
    }
  });

  // Reset to default keyword list
  btnResetKeywords.addEventListener("click", () => {
    const DEFAULT_KEYWORDS = [
      "bikini", "lingerie", "haul", "try on", "thirst", "model", "onlyfans",
      "hot girl", "dating advice", "dating coach", "alpha female", "baddie",
      "cosplay babe", "egirl", "nsfw", "cleavage", "feet", "waifu", "kpop idol fancam",
      "sugar baby", "hypergamy", "asmr girlfriend", "pov girlfriend", "boudoir",
      "twerk", "glamour", "swimwear", "shein haul", "micro bikini"
    ];
    settings.blockedKeywords = [...DEFAULT_KEYWORDS];
    settings.customKeywords = [];
    saveSettings();
  });

  syncUI();
});
