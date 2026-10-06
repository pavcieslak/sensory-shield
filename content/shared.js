/**
 * SensoryShield - Shared Content Script & Interception Engine
 * Copyright (c) 2026. MIT License (AS IS disclaimer applies).
 * Strictly local execution: zero remote tracking, zero eval.
 */

window.SensoryShield = window.SensoryShield || {
  settings: {
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
    customKeywords: []
  },
  compiledRegex: null,
  timeAnchorTimer: null,
  sessionStartTime: Date.now(),

  init(platformHandler) {
    chrome.storage.local.get("sensoryShieldSettings", (data) => {
      if (data && data.sensoryShieldSettings) {
        this.updateSettings(data.sensoryShieldSettings);
      }
      this.applyBodyClasses();
      this.setupTimeAnchor();
      if (platformHandler && typeof platformHandler.init === "function") {
        platformHandler.init();
      }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.sensoryShieldSettings) {
        this.updateSettings(changes.sensoryShieldSettings.newValue);
        this.applyBodyClasses();
        this.setupTimeAnchor();
        if (platformHandler && typeof platformHandler.rescan === "function") {
          platformHandler.rescan();
        }
      }
    });
  },

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.compileKeywords();
  },

  compileKeywords() {
    const allKeywords = [
      ...(this.settings.blockedKeywords || []),
      ...(this.settings.customKeywords || [])
    ]
      .map(k => typeof k === "string" ? k.trim().toLowerCase() : "")
      .filter(k => k.length > 0);

    if (allKeywords.length === 0) {
      this.compiledRegex = null;
      return;
    }

    const escaped = allKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // Match substring occurrence regardless of case (e.g., 'narcis' matches 'Narcissist')
    const pattern = `(${escaped.join('|')})`;
    this.compiledRegex = new RegExp(pattern, 'i');
  },

  applyBodyClasses() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", () => this.applyBodyClasses(), { once: true });
      return;
    }

    const {
      enabled,
      hideShorts,
      muteNotificationBadges,
      dimSidebar,
      blockAutoplayHover,
      desaturateThumbnails,
      hideComments
    } = this.settings;

    document.body.classList.toggle("sensory-shield-enabled", !!enabled);
    document.body.classList.toggle("sensory-shield-hide-shorts", !!(enabled && hideShorts));
    document.body.classList.toggle("sensory-shield-mute-badges", !!(enabled && muteNotificationBadges));
    document.body.classList.toggle("sensory-shield-dim-sidebar", !!(enabled && dimSidebar));
    document.body.classList.toggle("sensory-shield-block-hover-preview", !!(enabled && blockAutoplayHover));
    document.body.classList.toggle("sensory-shield-desaturate", !!(enabled && desaturateThumbnails));
    document.body.classList.toggle("sensory-shield-hide-comments", !!(enabled && hideComments));
  },

  // Title Normalizer: Converts screaming ALL CAPS and shouting clickbait into calm sentence case
  normalizeTitle(rawText) {
    if (!rawText || !this.settings.enabled || !this.settings.normalizeTitles) return rawText;

    let text = rawText.trim();
    if (text.length < 4) return rawText;

    const letters = text.match(/\p{L}/gu) || [];
    if (letters.length >= 3) {
      const upperLetters = text.match(/\p{Lu}/gu) || [];
      const ratio = upperLetters.length / letters.length;

      if (ratio > 0.35) {
        let lower = text.toLowerCase();
        text = lower.replace(/(^\s*|[.!?:\-—|([{]\s*)([\p{Ll}])/gu, (match, p1, p2) => p1 + p2.toUpperCase());
      } else {
        text = text.replace(/[\p{Lu}]{4,}/gu, (shoutWord) => {
          return shoutWord.charAt(0).toUpperCase() + shoutWord.slice(1).toLowerCase();
        });
      }
    }

    text = text.replace(/!{2,}/g, '!').replace(/\?{2,}/g, '?');

    if (text.length > 0) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }

    return text;
  },

  // Subtle Time Anchor (AuDHD Time-Blindness Support)
  setupTimeAnchor() {
    if (this.timeAnchorTimer) {
      clearInterval(this.timeAnchorTimer);
      this.timeAnchorTimer = null;
    }

    if (!this.settings.enabled || !this.settings.timeAnchorEnabled) {
      const existing = document.getElementById("sensory-shield-anchor-pill");
      if (existing) existing.remove();
      return;
    }

    const intervalMs = (this.settings.timeAnchorMinutes || 30) * 60 * 1000;

    this.timeAnchorTimer = setInterval(() => {
      this.showTimeAnchorPill();
    }, intervalMs);
  },

  showTimeAnchorPill() {
    let pill = document.getElementById("sensory-shield-anchor-pill");
    if (!pill) {
      pill = document.createElement("div");
      pill.id = "sensory-shield-anchor-pill";
      pill.className = "sensory-shield-time-anchor";

      const dot = document.createElement("div");
      dot.className = "anchor-dot";

      const text = document.createElement("span");
      const mins = Math.round((Date.now() - this.sessionStartTime) / (60 * 1000));
      text.textContent = `Browsing for ${mins}m • Take a deep breath`;

      const closeBtn = document.createElement("span");
      closeBtn.className = "anchor-close";
      closeBtn.textContent = "×";
      closeBtn.addEventListener("click", () => {
        pill.classList.remove("visible");
      });

      pill.appendChild(dot);
      pill.appendChild(text);
      pill.appendChild(closeBtn);
      document.body.appendChild(pill);
    }

    requestAnimationFrame(() => {
      pill.classList.add("visible");
    });

    setTimeout(() => {
      if (pill && pill.classList.contains("visible")) {
        pill.classList.remove("visible");
      }
    }, 10000);
  },

  shouldBlock(text) {
    if (!this.settings.enabled || !text) return false;
    if (!this.compiledRegex) return false;
    return this.compiledRegex.test(text.toLowerCase());
  },

  collapseElement(element, reason = "") {
    if (!element || element.classList.contains("sensory-shield-collapsed")) return;
    
    element.classList.add("sensory-shield-collapsed");
    element.setAttribute("data-sensory-shield-blocked", reason || "filtered");

    try {
      chrome.runtime.sendMessage({ type: "INCREMENT_BLOCKED_COUNT", count: 1 });
    } catch (e) {
      // Ignored if runtime port closes
    }
  },

  createObserver(rootSelector, itemSelector, checkCallback) {
    let animFrameId = null;

    const runCheckAll = () => {
      if (!this.settings.enabled) return;
      const elements = document.querySelectorAll(itemSelector);
      elements.forEach(el => {
        if (!el.classList.contains("sensory-shield-collapsed")) {
          checkCallback(el);
        }
      });
    };

    const observer = new MutationObserver(() => {
      if (!this.settings.enabled) return;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(runCheckAll);
    });

    const start = () => {
      const target = document.querySelector(rootSelector) || document.body || document.documentElement;
      if (target) {
        observer.observe(target, { childList: true, subtree: true, characterData: true });
        runCheckAll();
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }

    // Also periodic safety sweep to catch asynchronously populated titles during infinite scroll
    setInterval(runCheckAll, 600);
    window.addEventListener("scroll", () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(runCheckAll);
    }, { passive: true });

    return observer;
  }
};
