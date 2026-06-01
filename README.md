# Aetheria - Sensory & Data Canvas

Aetheria is an immersive, multi-page sensory exploration web application designed using modern Semantic HTML5, high-performance Vanilla CSS, and robust Javascript. It merges organic sensory motifs (aromas, sound frequencies, sight, depth) with interactive web technologies to create a "living canvas."

---

## 🌟 Key Features

### 1. Morphing Navigation Tiles
A 2x2 grid of glassmorphic interactive portals on the home page. When hovered, the tiles smoothly morph their layout coordinates and organic `border-radius` to reveal rich secondary menus and links with smooth transitions.

### 2. Dynamic Shape Overlays
A responsive floating vector canvas overlaying the viewport. The nodes drift organically and warp dynamically, drawing soft polygonal connection lines as they are attracted to the user's cursor within a 300px radius.

### 3. Context‑Sensitive Color Themes
A built-in ambient lighting engine that syncs with your device conditions. An absolute timezone monitor dims contrast during late-night hours. Alternatively, users can toggle a slider to simulate and adapt typography HSL weights between low and high ambient values.

### 4. Micro‑Interaction Storyboards
Submitting the feedback forms packages user responses and launches a beautiful looping fullscreen vector storyboard. A high-fidelity paper plane is computed sailing along a complex cubic Bezier curve, banking naturally based on velocity tangents, and culminating in a glowing confirmation panel.

### 5. Layered Depth Scrolling
A dedicated three-dimensional parallax landscape. It layers dot matrices, rotating geometric structures, and crisp glass copy containers at different Z-depths, using optimized scroll displacement listeners to prevent scroll-jank.

### 6. Progressive Reveal Forms
A guided survey that fragments long fields into single bite-sized inputs. As each question is answered, the completed step slides upward, reduces opacity, and blurs gently, while the new step rotates cleanly into the viewport using 3D perspectives.

### 7. Voice‑Assisted UI Highlights
Full integration with the `SpeechRecognition` API. Clicking "Voice Guide" lets users command the interface vocally. Targets flash with a high-visibility neon outline animation and generate absolute-positioned assistance tooltips.

### 8. Adaptive Grid Density
A layout note gallery demonstrating rapid CSS Grid rendering. Users can toggle between **Compact** (4-columns, high density, rapid inspection) and **Spacious** (2-columns, wide margins, high visual detail) views seamlessly.

### 9. Scent‑Inspired UI Motifs
Visual themes mapped directly to olfactory qualities, modifying root HSL parameters:
*   🍋 **Fresh Citrus**: Bright, sunlit yellow gradients with refreshing teal accents.
*   🌲 **Earthy Cedar**: Deep grounding cedar trees, woodland forest greens, and dark timber shadows.
*   🍦 **Cozy Vanilla**: Soft comforting cream palettes with detailed golden texturing.
*   🌊 **Oceanic Breeze**: High-contrast marine cyans, sea salt spray gradients, and clean seafoam glows.

### 10. Live Data Sketchpad
A generative vector graph tracing sensory data clusters. Users can inspect saturation indexes, coordinates, and intensity bounds by hovering over nodes, or click them to modulate frequency coordinates.

---

## 🎙 Voice Command Cheat-Sheet

To use voice controls, click **Voice Guide** in the top bar, accept microphone permissions, and speak clearly:

| Command | Action |
| :--- | :--- |
| `"Citrus Theme"` / `"Orange"` | Shift layout aesthetics to Fresh Citrus |
| `"Cedar Theme"` / `"Wood"` | Shift layout aesthetics to Earthy Cedar |
| `"Vanilla Theme"` / `"Cozy"` | Shift layout aesthetics to Cozy Vanilla |
| `"Breeze Theme"` / `"Ocean"` | Shift layout aesthetics to Oceanic Breeze |
| `"Compact View"` / `"Tight"` | Toggle gallery cards to dense compact layout |
| `"Spacious View"` / `"Large"` | Toggle gallery cards to spacious layout |
| `"Next"` / `"Continue"` | Progress to next form step |
| `"Home"` / `"Portal"` | Navigate back to Nexus Portal |
| `"Dimensions"` / `"Depth"` | Navigate to Layered Parallax page |

---

## 📁 Repository Structure

```
uitable/
├── index.html         # Nexus Portal (Landing Dashboard)
├── sensory.html       # Aromasphere, Grid Density & Live Sketchpad
├── dimensions.html    # Parallax Depth Scrolling Viewport
├── feedback.html      # Progressive Form & Paper Plane Storyboard
├── css/
│   └── style.css      # Design tokens, variables, and typography
└── js/
    └── app.js         # Core visual, interactive, and voice scripting
```

---

## 🚀 Getting Started

Since Aetheria is engineered using pure web primitives and standard Web APIs, **no bundlers, frameworks, or dependencies are required.**

1.  Clone this repository:
    ```bash
    git clone https://github.com/Giridhar-program/aetheria-sensory-canvas.git
    ```
2.  Navigate to the `uitable` directory.
3.  Open `index.html` directly in your browser of choice (Chrome, Safari, Edge, Firefox).

*Note: Voice-assisted highlights require standard browser microphone permissions and function best in Google Chrome or Chromium-based browsers.*
