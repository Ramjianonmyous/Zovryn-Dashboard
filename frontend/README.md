# Apex Dashboard Frontend

The frontend of the Apex Dashboard is a modern, reactive single-page admin dashboard application built using **React, Vite, and Tailwind CSS**. It features real-time charts, product CRUD management, user control views, system notifications, interactive theme toggles, and dual-layer security verification.

---

## 🛠️ Tech Stack & Dependencies

* **Library & UI**: React (v19) & React DOM
* **Build Tool & Bundler**: Vite (v8)
* **Styling**: Tailwind CSS (Tailored UI styling, custom gradients, animations, and transitions)
* **Icons**: Iconify (`iconify-icon` custom web components)
* **Charts**: Chart.js (Integrated for rendering revenue sparklines, categorizations, and sales curves)
* **Linter**: ESLint (Code style and validation rules)

---

## 🏗️ Structure & View Architecture

The frontend is designed around a single-page layout within `App.jsx`, utilizing component states for navigation and overlay triggers:

```text
frontend/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Media and logos
│   ├── App.css             # Main stylesheet (Tailwind utilities and theme overrides)
│   ├── App.jsx             # Core Application container (handles views, states, modals, and API syncing)
│   ├── index.css           # Global typography and base setup
│   └── main.jsx            # DOM entrypoint mounting App
├── index.html              # HTML shell loader
└── vite.config.js          # Vite configurations
```

---

## ⚙️ Environment Configuration (`.env`)

To connect the frontend to a specific backend server, define the following variable or use the default local address:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Endpoint of the running Express API | `http://localhost:5000` |

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
Launches the Vite dev server with Hot Module Replacement (HMR) enabled:
```bash
npm run dev
```
* Access the local web client in your browser at `http://localhost:5173`.

### 3. Build for Production
Compiles and minifies assets into the `dist/` directory for Vercel/production hosting:
```bash
npm run build
```

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## ✨ Features Highlight

### 🔐 Secondary Security Prompt
When logging in as an `admin`, a Promise-governed Tailwind modal prompts the user for a secondary `Master Security Phrase`. Users have up to 3 attempts, showing clear warnings on successive failures, before access is blocked.

### 🌓 Live Dark Mode Toggle
Enables seamless light/dark mode transitions via class injection (`dark` class on target HTML documents), adapting the Tailwind color palette automatically.

### 📐 Adaptive Sidebar
The sidebar layout can be expanded or collapsed. Clicking on the **Apex logo** at the top of the sidebar triggers the sidebar expansion states.
