# 🧍‍♂️ DeskPosture AI Monitor 🤖  
### Real-Time Posture Correction for Desktop Users

**DeskPosture AI Monitor** is a high-impact, browser-based application developed during a hackathon to combat the common problem of poor posture experienced by remote workers.  
It leverages **Google's TensorFlow.js** and the **MoveNet** model to analyze the user's skeletal alignment via webcam in real time, providing **immediate feedback and alerts** to prevent neck and back strain.

---

## ✨ Key Features

### 🪑 Desk-Optimized Detection
The AI logic is specifically tuned for **seated positions**, calculating the critical **Ear–Shoulder–Elbow** angle instead of the traditional (and often obscured) hip-based angle.

### ⚖️ Bilateral Analysis
Calculates and averages angles for both the **left and right sides** of the body for highly accurate and comprehensive posture assessment.

### 🎯 Performance Gamification
Tracks and displays the user's **"Good Posture Percentage"** over the entire session, encouraging continuous improvement.

### 🔔 Multi-Modal Alerts
Provides immediate feedback through **three channels**:
- 💡 **Visual Alert:** The mascot component slides into view (Tailwind CSS animation).  
- 🔊 **Audio Cue:** Plays a sound alert.  
- 🖥️ **System Notification:** Launches a native OS notification when the browser tab is minimized.

### 🧠 Zero Backend
The entire AI model runs **locally within the browser**, ensuring **fast inference** and **zero cloud cost**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend Framework** | [Next.js](https://nextjs.org/) (React / TypeScript) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Artificial Intelligence** | [TensorFlow.js](https://www.tensorflow.org/js) with [MoveNet](https://www.tensorflow.org/hub/tutorials/movenet) |
| **Core APIs** | Web MediaDevices, Web Notification API |

---

## 🚀 Setup and Installation

Since the AI libraries (**TensorFlow.js**) are large, this project uses **CDN links** for stability, bypassing potential module dependency conflicts (`Maximum update depth exceeded`, `Export Pose not found`).

### 1️⃣ Clone the repository
```bash
git clone [your-repo-link]
cd posture-monitor-ai
```

### 2️⃣ Install dependencies
```bash
npm install
```

> **Note:** The core AI libraries are loaded via CDN, so this only installs Next.js, React, and Tailwind CSS.

### 3️⃣ Configure CDN Links
Ensure your main layout file (usually `src/app/layout.tsx` or similar) includes the required **TensorFlow and Pose Detection CDN scripts** inside the `<head>` tag:

```html
<!-- Example of CDN links needed in your layout file -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection"></script>
```

### 4️⃣ Run the application
```bash
npm run dev
```

---

## 📐 Calibration and Logic

The system is **calibrated for seated desktop use**.

| Parameter | Description |
|:-----------|:-------------|
| **Detection Method** | Calculates the angle formed by **Ear → Shoulder (Vertex) → Elbow** |
| **Good Posture Angle** | Close to **90°** (or slightly wider, ~100°) for a user sitting upright |
| **Alert Threshold (`ENCORVADO_UMBRAL`)** | Set to **75°** – if the average angle drops below this threshold for **10 consecutive frames**, an alert is triggered |

---

## 🧩 Example Use Case
1. Launch the app and allow webcam access.  
2. Sit naturally at your desk.  
3. The model begins detecting your posture in real time.  
4. If you slouch for too long, receive:
   - A **visual warning**,  
   - A **sound notification**, and  
   - A **system alert** if the tab is not active.  

Your **"Good Posture %"** updates continuously, turning posture correction into a small daily challenge. 💪

---

## 🧾 License
This project was developed for **hackathon demonstration purposes** and is open for further improvement and integration.  
Feel free to fork, modify, and contribute!

---

## 🙌 Acknowledgments
- [TensorFlow.js Team](https://www.tensorflow.org/js)
- [Google MoveNet Model](https://www.tensorflow.org/hub/tutorials/movenet)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js Framework](https://nextjs.org/)

