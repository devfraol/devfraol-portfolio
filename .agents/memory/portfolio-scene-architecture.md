---
name: Portfolio scene architecture
description: Durable direction for the Dev Fraol portfolio's cinematic 3D experience.
---

The portfolio should evolve through one persistent React Three Fiber universe. Scroll progress is coordinated by Lenis and GSAP, while a keyed camera rig, state-based lighting, and world objects create section transitions.

**Why:** Separate section canvases or isolated demos break the feeling of traveling through one creative universe and make camera movement feel decorative rather than structural.

**How to apply:** Extend the existing scene and camera timeline for future visual upgrades; keep the HTML sections accessible above the canvas and reduce complexity for mobile, reduced motion, hidden tabs, and low-end devices.