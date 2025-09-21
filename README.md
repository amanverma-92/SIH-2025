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

-Member1 - 2022UCD - [Ishaan Gupta](https://github.com/ishaanxgupta)  
-Member2 - 2022UIT3036 - [Pranshu Lakhotia](https://github.com/PranshuLakhotia)  
-Member3 - 2022UCM - [Aman Verma](https://github.com/amanverma-92)  
-Member4 - 2022UCD - [Vivek Gupta](https://github.com/Vivekgupta008)  
-Member5 - 2022UCM - [Ashmita Luthra](https://github.com/ashmita-web)  
-Member6 - 2022UIT3062 - [Shobhit Ranjan](#)  


---

## Project Links  

- **SIH Presentation:** [Final SIH Presentation](URL_TO_PPT_UPLOADED_TO_GITHUB)  
- **Video Demonstration:** [Watch Video](UNLISTED_YOUTUBE_LINK)  
- **Source Code:** [GitHub Repository](https://github.com/PranshuLakhotia/SIH-2025)  

---

## Tech Stack  

- Frontend: NextJS + Vite  
- Mobile App: React Native  
- Backend: FastAPI (Python)  
- Other: Geo-fencing APIs, AI Models, Blockchain-based Digital ID  

---

## Key Features  

- Real-time tourist safety monitoring with AI alerts  
- Geo-fencing for restricted or high-risk zones  
- Blockchain-based digital ID verification  
- Incident reporting and response system  
- Multi-platform support: Mobile App + Web Dashboard  

---
## How to Run Locally  

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

# Backend (FastAPI Server)
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
