
GateTrack is a QR-based gate entry & exit tracking system for vehicles and guests.

## Features
- Real camera QR scanning (html5-qrcode)
- Firebase Firestore backend
- Firebase Authentication
- Activity logs & reports
- Web + Android + iOS (Capacitor)

## Setup

```bash
npm install
npm run dev


===========

gate-track/
├─ README.md
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
├─ capacitor.config.ts
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   ├─ firebase.js
   ├─ GateTrackingSystem.jsx
   ├─ scanner/
   │  └─ CameraScanner.jsx
   └─ services/
      ├─ vehicles.js
      ├─ guests.js
      └─ logs.js
