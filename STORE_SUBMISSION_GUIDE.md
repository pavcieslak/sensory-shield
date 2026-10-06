# 📋 Chrome Web Store Submission Cheat Sheet

Use these exact copy-paste ready answers in your **Chrome Web Store Developer Dashboard** to breeze through the review process without red flags.

---

## 1. Store Listing Tab

### Item Name:
`SensoryShield - AuDHD Visual Filter & Declutter`

### Summary (Short Description - max 132 chars):
`Sensory-friendly visual filter & declutter tool optimized for AuDHD comfort on YouTube & Facebook.`

### Detailed Description:
```markdown
SensoryShield is a client-side visual filter and sensory declutter extension designed specifically for AuDHD (Autism + ADHD) individuals, neurodivergent users, and anyone experiencing visual sensory hyper-reactivity.

🌿 KEY FEATURES:
• Silent Element Collapse: Smoothly and completely hides target clickbait, thumbnails, and overstimulating images without jarring layout shifts or flashing.
• 100% Local & Private: Runs entirely within your browser. Zero tracking, zero telemetry, zero remote servers.
• Sensory Declutter Suite:
  - Hide YouTube Shorts & Facebook Reels to prevent dopamine-trapping micro loops.
  - Mute high-contrast red notification badges.
  - Dim distracting watch page recommendation sidebars.
• Custom Keyword Filter: Easily add or remove custom keywords, topics, and creator channels using an interactive tag manager.
• Low-Stimulation Dark UI: Accessible, low-contrast sage interface designed to prevent cognitive and visual fatigue.
```

### Category:
`Accessibility` (Alternative: `Productivity`)

---

## 2. Privacy Tab (Crucial for Rapid Approval)

### Single Purpose Description:
> "Filters visual stimuli, clickbait thumbnails, and distracting UI elements on YouTube and Facebook to reduce sensory overload for neurodivergent and AuDHD users."

### Permission Justification:
* **`storage`**:
  > "Used solely to persist the user's custom keyword blocklist and UI toggle preferences locally on their device via chrome.storage.local."
* **Host Permissions (`*://*.youtube.com/*`, *://*.facebook.com/*)`**:
  > "Required to inspect DOM element metadata and apply client-side CSS rules that quietly collapse target video cards and feed posts on these specific sites."

### Data Usage Declarations (Radio Buttons):
- **Does this extension collect or transmit user data?** ➔ **NO**
- **Do you sell user data?** ➔ **NO**
- **Do you use or transfer data for purposes unrelated to the item's core functionality?** ➔ **NO**
- **Do you use or transfer data to determine creditworthiness or for lending purposes?** ➔ **NO**

---

## 3. Packaging Command

To create your submission zip file via PowerShell:
```powershell
Compress-Archive -Path manifest.json, background.js, content, popup, icons, LICENSE, README.md, PRIVACY_POLICY.md -DestinationPath sensory-shield-v1.0.0.zip -Force
```
Upload `sensory-shield-v1.0.0.zip` to the Developer Dashboard!
