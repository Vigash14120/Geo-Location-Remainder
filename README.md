# Geo-Location-Remainder (GLR)

A full-featured React Native & Expo application for smart geofenced reminders with 3D altitude support and time-based triggering.

---

## 📱 Features

- **📍 Interactive Geofencing**: Drop pins on the map, customize geofence radius (50m – 1000m), and visualize proximity circles in real time.
- **🏔️ 3D Geofencing (Altitude Matching)**: Set elevation thresholds with tolerance to trigger reminders only at specific building floors or altitudes.
- **⏰ Time Window Filters**: Constrain reminders to specific active windows (e.g. `09:00` - `17:00`) with overnight interval support.
- **🔔 Background Tracking & Notifications**: Background geofence monitoring via `expo-task-manager` and `expo-location` with high-priority Android notification channels.
- **📏 Live Proximity Distance**: Displays live distance (`150m away`, `2.4km away`) to all upcoming tasks directly on the Active Tasks list.
- **🔄 Task Management & History**:
  - Enable/Disable active tasks on the fly.
  - Automatically moves triggered reminders to History.
  - **Reactivate** completed reminders anytime with a single tap.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54) & [React Native](https://reactnative.dev/) (0.81.5)
- **Language**: TypeScript (~5.9.2)
- **Navigation**: React Navigation (Bottom Tabs & Stack Navigator)
- **Maps**: `react-native-maps`
- **Location & Background Tasks**: `expo-location`, `expo-task-manager`
- **Local Storage**: `@react-native-async-storage/async-storage`
- **Notifications**: `expo-notifications`
- **Icons & Styling**: `lucide-react-native`, `expo-linear-gradient`

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app installed on your physical device (iOS or Android)

### 2. Installation
```bash
git clone https://github.com/Vigash14120/Geo-Location-Remainder.git
cd Geo-Location-Remainder
npm install
```

### 3. Run the Development Server
```bash
npx expo start
```
Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).

---

## 📂 Project Structure

```
├── assets/                  # App icons and splash screens
├── src/
│   ├── navigation/          # Bottom tabs and stack navigators
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Active tasks list & live map
│   │   ├── AddReminderScreen.tsx  # Geofence creation, pin dropping & settings
│   │   └── HistoryScreen.tsx      # Triggered reminders & reactivation
│   ├── services/
│   │   ├── backgroundTasks.ts     # TaskManager background location processor
│   │   ├── notifications.ts       # Android notification channels & dispatcher
│   │   └── storage.ts             # AsyncStorage persistence
│   ├── types/               # TypeScript interfaces (Reminder, GeoPoint)
│   └── utils/               # Haversine distance & time window calculations
├── App.tsx                  # App entry & service initialization
├── app.json                 # Expo permissions, plugins & build config
└── index.ts                 # Root entry with gesture-handler setup
```

---

## 📄 License
MIT License
