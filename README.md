# PS 25002 – Smart Tourist Safety Monitoring & Incident Response System

This README provides an overview of the project, including team details, relevant links, tasks completed, tech stack, key features, and steps to run the project locally.

---

## Problem Statement  
**ID:** 25002  
**Title:** Smart Tourist Safety Monitoring & Incident Response System using AI, Geo-Fencing, and Blockchain-based Digital ID  

---

## Team Details  

**Team Name:** **Issavibles**

**Team Leader:** Ishaan Gupta

**Team Members:**  

-Member1 - 2022UCD2130 - [Ishaan Gupta](https://github.com/ishaanxgupta)  
-Member2 - 2022UIT3036 - [Pranshu Lakhotia](https://github.com/PranshuLakhotia)  
-Member3 - 2022UCM2351 - [Aman Verma](https://github.com/amanverma-92)  
-Member4 - 2022UCD2129 - [Vivek Gupta](https://github.com/Vivekgupta008)  
-Member5 - 2022UCM2347 - [Ashmita Luthra](https://github.com/ashmita-web)  
-Member6 - 2022UIT3062 - [Shobhit Ranjan](#)  


---

## Project Links  

- **SIH Presentation:** [Final SIH Presentation](URL_TO_PPT_UPLOADED_TO_GITHUB)  
- **Video Demonstration:** [Watch Video](UNLISTED_YOUTUBE_LINK)  
- **Source Code:** [GitHub Repository](https://github.com/PranshuLakhotia/SIH-2025)  

---

## Tasks Accomplished  

- Task 1: Implemented real-time tourist monitoring with AI-based risk detection  
- Task 2: Integrated geo-fencing alerts for high-risk zones  
- Task 3: Developed blockchain-based digital ID verification system  
- Task 4: Created incident reporting and response system  
- Task 5: Built web dashboard and mobile app integration  

---

## Tech Stack  

- Frontend (Mobile App) → React Native (cross-platform)
- Backend / APIs → FastAPI
- Blockchain → Hyperledger Fabric / Polygon (for Digital ID)
- Database → SQL (tourist & itinerary data)
- AI/ML → Python (Scikit-learn, TensorFlow, anomaly detection models)
- Geo-Fencing & Maps → Google Maps API / Mapbox SDK
- Dashboards → Next.js, TypeScript
- Security → End-to-end encryption

---

## Key Features  

- *Real-time Risk Monitoring:* Monitors tourist locations and alerts users of potential risks  
- *Geo-fencing Alerts:* Notifies users when entering restricted or high-risk areas  
- *Blockchain-based Digital ID:* Ensures secure identification and authentication of tourists  
- *Incident Reporting System:* Enables reporting and management of incidents through the app  
- *Multi-platform Support:* Works on both web dashboard and mobile applications  

---


## How to Run Locally  

### Clone the Repository
```bash
git clone https://github.com/PranshuLakhotia/SIH-2025.git
cd SIH-2025
```

# Mobile App
```bash
cd app
npm install
npx react-native run-android
```

# Frontend (Police Safety Dashboard)
```bash
cd frontend
npm install
npm run dev
```

# Backend (FastAPI)

macOS
```bash
cd backend
python -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

```

Windows
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

```
