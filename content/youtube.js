/**
 * SensoryShield - YouTube Content Script
 * Copyright (c) 2026. MIT License (AS IS disclaimer applies).
 * Zero remote analytics, strictly client-side DOM processing.
 */

(function () {
  "use strict";

  const YouTubeHandler = {
    selectors: [
      "ytd-rich-item-renderer",
      "ytd-rich-grid-row",
      "ytd-video-renderer",
      "ytd-compact-video-renderer",
      "ytd-grid-video-renderer",
      "ytd-reel-item-renderer",
      "ytd-playlist-renderer",
      "ytd-watch-metadata"
    ],

    init() {
      const selectorString = this.selectors.join(", ");
      window.SensoryShield.createObserver("ytd-app, #content, body", selectorString, (element) => {
        this.processElement(element);
      });

      this.observeWatchTitle();

      // Hook YouTube client-side SPA navigation events
      window.addEventListener("yt-navigate-finish", () => this.rescan());
      window.addEventListener("yt-page-data-updated", () => this.rescan());
      window.addEventListener("spfdone", () => this.rescan());
    },

    processElement(element) {
      if (!element || element.classList.contains("sensory-shield-collapsed")) return;

      // 1. Check metadata for filtering match
      const textCorpus = this.extractTextCorpus(element);
      if (!textCorpus) return; // Wait until YouTube populates content into the card

      if (window.SensoryShield.shouldBlock(textCorpus)) {
        window.SensoryShield.collapseElement(element, "YouTube match");
        return;
      }

      // 2. Normalize titles if Calm Titles is active
      this.calmTitle(element);
    },

    calmTitle(container) {
      if (!window.SensoryShield.settings.enabled || !window.SensoryShield.settings.normalizeTitles) return;

      const titleElements = container.querySelectorAll(
        "#video-title, #video-title-link, yt-formatted-string#video-title, h1.ytd-watch-metadata yt-formatted-string, ytd-watch-metadata #title yt-formatted-string, #title yt-formatted-string"
      );

      titleElements.forEach((titleEl) => {
        const rawText = titleEl.textContent || titleEl.getAttribute("title") || "";
        if (!rawText || rawText.length < 4) return;

        const normalized = window.SensoryShield.normalizeTitle(rawText);
        if (normalized && normalized !== rawText) {
          if (titleEl.childNodes.length === 1 && titleEl.childNodes[0].nodeType === Node.TEXT_NODE) {
            titleEl.childNodes[0].nodeValue = normalized;
          } else {
            titleEl.textContent = normalized;
          }
          titleEl.setAttribute("title", normalized);
        }
      });
    },

    observeWatchTitle() {
      const watchObserver = new MutationObserver(() => {
        const mainWatchTitle = document.querySelector("h1.ytd-watch-metadata yt-formatted-string, ytd-watch-metadata #title yt-formatted-string");
        if (mainWatchTitle) {
          this.calmTitle(mainWatchTitle.parentElement || mainWatchTitle);
        }
      });

      const startWatch = () => {
        const target = document.querySelector("ytd-watch-metadata") || document.body;
        if (target) {
          watchObserver.observe(target, { childList: true, subtree: true, characterData: true });
        }
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startWatch, { once: true });
      } else {
        startWatch();
      }
    },

    extractTextCorpus(element) {
      if (!element) return "";

      const parts = [];

      // 1. Entire visible text within the card (title, creator, badges, etc.)
      const innerText = element.innerText || "";
      if (innerText) parts.push(innerText);

      const textContent = element.textContent || "";
      if (textContent) parts.push(textContent);

      // 2. Specific title elements and attributes
      const titleEl = element.querySelector("#video-title, #video-title-link, .title-and-badge, #title, yt-formatted-string");
      if (titleEl) {
        const titleText = titleEl.textContent || titleEl.getAttribute("title") || titleEl.getAttribute("aria-label") || "";
        if (titleText) parts.push(titleText);
      }

      // 3. Thumbnail image alt/title
      const imgEls = element.querySelectorAll("img");
      imgEls.forEach((img) => {
        const alt = img.getAttribute("alt");
        const title = img.getAttribute("title");
        const ariaLabel = img.getAttribute("aria-label");
        if (alt) parts.push(alt);
        if (title) parts.push(title);
        if (ariaLabel) parts.push(ariaLabel);
      });

      return parts.join(" ").toLowerCase();
    },

    rescan() {
      const selectorString = this.selectors.join(", ");
      document.querySelectorAll(selectorString).forEach((element) => {
        const textCorpus = this.extractTextCorpus(element);
        if (window.SensoryShield.shouldBlock(textCorpus)) {
          window.SensoryShield.collapseElement(element, "YouTube rescan match");
        } else {
          if (!window.SensoryShield.settings.enabled) {
            element.classList.remove("sensory-shield-collapsed");
          } else {
            this.calmTitle(element);
          }
        }
      });
    }
  };

  window.SensoryShield.init(YouTubeHandler);
})();
