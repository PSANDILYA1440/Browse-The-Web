# Browse The Web

A blazing-fast, private, and minimal desktop web browser built on a dual-process architecture combining **React**, an independent native **Electron/Chromium** viewport sandbox layer, and a compiled high-performance **C++ Routing Core Engine**. 

Designed specifically with high efficiency in mind, **Browse The Web** utilizes a compiled native companion background service to pre-parse, optimize, and safely route inbound web navigation links and search queries in microseconds, completely isolating web frame memory consumption from the user interface layout thread.

---

## ⚡ Key Architectural Features

* **True Chromium Viewport Engine:** Backed by Electron's native, production-grade Chromium stack (`webviewTag: true`) for flawless rendering, full secure context isolation, and native multi-threaded JavaScript execution loops.
* **C++ Powered Core Optimization:** Outloads heavy query parsing, URL cleansing, and query string routing transformations onto an independent compiled native background companion router service built with Apple Clang 17.
* **Mac Universal Binary Support:** Cross-compiled native machine binary slices mapping both `x86_64` (Intel) and `arm64` (Apple Silicon M-Series) architectures natively inside a single Fat Binary executable container.
* **Premium Frameless Design System:** A modern, distraction-free interface matching deep charcoal design geometries (`#1d1f23`). Employs a fully frameless native window setup (`titleBarStyle: 'hidden'`) with integrated, pixel-anchored native macOS window utility traffic control capsules.
* **Announces macOS Ventura Base Profile:** Built-in network user agent injection protocols to natively spoof a `macOS Ventura (OS X 13_0_0)` profile across all outbound HTTP request streams, bypassing legacy platform support degradation loops.
* **Integrated File Download Monitor:** Real-time event tracking layers connected securely across inter-process messaging contexts to keep dynamic storage registries fully aligned.

---

## 🛠️ Development & Engineering Workspaces

### System Prerequisites
Ensure you have the following toolchains globally accessible in your shell environment profile:
* **Node.js** (v18+ recommended) & **npm**
* **Apple Clang 17.0.0** (Included with macOS Command Line Tools)

### 1. Compile the High-Speed C++ Engine
Before spinning up the application, cross-compile your background link optimizer service into a native, standalone, dependency-free Universal Fat Binary machine application file:

```zsh
cd CPPEngine

# Compile independent architecture objective slices
clang++ -O3 -target x86_64-apple-macos13.0 optimizer.cpp -c -o optimizer_x86.o
clang++ -O3 -target arm64-apple-macos13.0 optimizer.cpp -c -o optimizer_arm.o

# Stitch object slices into a single unified Fat Universal Binary
clang++ optimizer_x86_64.o optimizer_arm64.o -o optimizer

# Clean intermediate artifact trees
rm optimizer_x86.o optimizer_arm.o

cd ..
```

### 2. Install Project Dependencies & Run Local Dev
Wipe away stale application configuration caches and initialize a synchronized, clean package installation matrix:

```zsh
# Purge stale folders and generate absolute lock entries
rm -rf node_modules package-lock.json
npm install

# Start Vite compilation server and launch the desktop framework window
npm start
```

### 3. Generate the Production Universal DMG Installer
To compile your entire project codebase into a production-ready, standalone, and universal `.dmg` installer disk image—complete with a native Applications folder shortcut link alias for drag-and-drop installation—run the automated distribution script:

```zsh
npm run dist:mac
```
The resulting installation asset bundle will be generated instantly within the `/dist` directory path container.

---

## 📂 Project Directory Structure

```text
├── Chromium/
│   ├── main.js         # Main Electron window loop and user agent spoofer
│   └── preload.js      # Secure context isolation download tracking bridge
├── CPPEngine/
│   ├── optimizer.cpp   # C++ Core Query parsing engine logic strings
│   └── optimizer       # Compiled Universal native Fat Binary machine program
├── FONTLICENSES/
│   └── LICENSE.txt     # SIL Open Font License tracking compliance log
├── public/
│   ├── Logo.png        # Brand asset logo emblem file
│   └── fonts/          # Embedded local asset fonts subfolder trees
├── src/
│   ├── App.jsx         # Core React layout interface architecture
│   ├── App.css         # Premium custom styling geometry matrix profiles
│   └── index.css       # Universal typography and base layout controls
├── package.json        # Unified project dependency assembly blueprint maps
└── README.md           # Structural user documentation guide
```

---

## 📜 Typography, Compliance, & Legal Frameworks

### Font Face Specification License
**Browse The Web** utilizes the premium **Adwaita Sans** typography family as its baseline user interface design font, linked natively within the application's root stylesheet layer elements. 

The Adwaita Sans font software is distributed under the official **SIL Open Font License, Version 1.1 (OFL-1.1)**. A complete copy of the text registry certificate mapping all accompanying permissions, embedding conditions, and liability disclaimers is maintained natively on disk inside the project's **`FONTLICENSES/LICENSE.txt`** tracking file node.

### Trademark Notice & Legal Disclaimer
**Browse The Web** is an independent open-source desktop web browser utility application framework project developed independently by [PSANDILYA1440](https://github.com). 

All trademarks, service marks, trade names, product names, system logos, and brand emblems appearing inside this application architecture repository—including but not limited to **Adwaita**, **GNOME**, **macOS**, **Macintosh**, **Ventura**, **Chromium**, **Google Chrome**, **Brave**, **DuckDuckGo**, **GitHub**, **GitHub Copilot**, and **Windsurf**—are the registered properties of their respective trademark holders. 

The use of these names, marks, and design symbols inside this development repository is strictly for contextual reference, hardware architecture target descriptions, and platform software component configuration compatibility logging purposes only. It does not imply, represent, or constitute any form of official endorsement, affiliation, sponsorship, or licensing approval by the corresponding intellectual property or trademark owners.
