/**
 * SensoryShield - Facebook Content Script
 * Copyright (c) 2026. MIT License (AS IS disclaimer applies).
 * Zero remote analytics, strictly client-side DOM processing.
 */

(function () {
  "use strict";

  const FacebookHandler = {
    selectors: [
      "div[data-pagelet^='FeedUnit']",
      "div[role='feed'] > div",
      "div[role='article']",
      "div.x1yztbdb"
    ],

    init() {
      const selectorString = this.selectors.join(", ");
      window.SensoryShield.createObserver("div[role='main'], body", selectorString, (element) => {
        this.processElement(element);
      });
    },

    processElement(element) {
      if (!element || element.classList.contains("sensory-shield-collapsed")) return;

      const textCorpus = this.extractTextCorpus(element);

      if (window.SensoryShield.shouldBlock(textCorpus)) {
        window.SensoryShield.collapseElement(element, "Facebook match");
      }
    },

    extractTextCorpus(element) {
      const parts = [];

      const textNodes = element.querySelectorAll("div[dir='auto'], span[dir='auto'], strong");
      textNodes.forEach((node) => {
        if (node && node.textContent) {
          parts.push(node.textContent);
        }
      });

      const images = element.querySelectorAll("img");
      images.forEach((img) => {
        const alt = img.getAttribute("alt");
        const ariaLabel = img.getAttribute("aria-label");
        if (alt) parts.push(alt);
        if (ariaLabel) parts.push(ariaLabel);
      });

      const links = element.querySelectorAll("a[aria-label], a span");
      links.forEach((link) => {
        const ariaLabel = link.getAttribute("aria-label");
        if (ariaLabel) parts.push(ariaLabel);
      });

      return parts.join(" ").toLowerCase();
    },

    rescan() {
      const selectorString = this.selectors.join(", ");
      document.querySelectorAll(selectorString).forEach((element) => {
        const textCorpus = this.extractTextCorpus(element);
        if (window.SensoryShield.shouldBlock(textCorpus)) {
          window.SensoryShield.collapseElement(element, "Facebook rescan match");
        } else {
          if (!window.SensoryShield.settings.enabled) {
            element.classList.remove("sensory-shield-collapsed");
          }
        }
      });
    }
  };

  window.SensoryShield.init(FacebookHandler);
})();
