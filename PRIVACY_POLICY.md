# Privacy Policy for SensoryShield

**Last Updated:** September 2026

**SensoryShield** ("we", "our", or "the extension") is designed with a **strict local-first architecture**. We believe in total user privacy, sensory comfort, and minimal digital footprints.

---

### 1. Data Collection & Transmission
- **Zero Data Collection**: SensoryShield does **not** collect, store, transmit, or sell any personal data, browsing history, keystrokes, or account information.
- **Zero Remote Servers**: The extension operates entirely within your local browser sandbox. It makes no external API calls, tracking requests, or server-side communication.
- **Zero Telemetry & Analytics**: There are no background analytics, third-party SDKs, telemetry beacons, or advertising trackers embedded in the extension.

---

### 2. Local Storage Usage
The extension uses the standard `chrome.storage.local` API strictly on your machine to save your user preferences:
- Filter configuration (toggle states for Shorts, notification badges, and sidebar dimming).
- Your customized keyword blocklist.
- Local count of filtered elements (stored only on your device).

This information never leaves your browser and can be completely erased at any time by uninstalling the extension or clearing extension data.

---

### 3. Permissions Justification
- **`storage`**: Used solely to persist your local sensory filter settings and customized keyword preferences locally in your browser.
- **`host_permissions (*://*.youtube.com/*, *://*.facebook.com/*)`**: Used strictly to apply client-side CSS filtering and element collapse on supported video cards and news feed posts.

---

### 4. Third-Party Disclosures
We do not share, disclose, or monetize any user data with third parties.

---

### 5. Contact
If you have any questions or concerns regarding this privacy policy, please submit an issue on the project's repository.
