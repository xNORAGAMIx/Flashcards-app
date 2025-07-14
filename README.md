# ⚡ FlashMind - Smart Flashcard App

[![Live Site](https://img.shields.io/badge/Live--Demo-FlashMind-green?style=for-the-badge&logo=vercel)](https://flashmind-six.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/xNORAGAMIx/Flashcards-app)

FlashMind is a sleek, modern flashcard-based revision app designed to make learning engaging, efficient, and fun. Powered by spaced repetition, stats tracking, and a visually immersive UI, FlashMind helps you master topics quickly and effectively.

---

## ✨ Features

- 🔁 **Spaced Repetition** Learning System
- 🧠 **Smart Review Queue** for active recall
- 📊 **Performance Analytics & Stats**
- 📁 **Deck & Flashcard Management**
- 🎙️ **Voice-to-Text Flashcard Input** *(Coming Soon)*
- 📤 **Import / Export (CSV, Anki)**
- 📱 **Mobile Responsive + PWA Support**
- 🧑‍🤝‍🧑 **Friends & Public Sharing** 
- 🔐 **Secure Auth & User Profiles**

---

## 🖼️ Screenshots

<p align="center">
  <img src="frontend/src/assets/Screenshot from 2025-07-14 14-05-03.png" width="80%" alt="Home Page" />
  <br/>
  <img src="frontend/src/assets/Screenshot from 2025-07-14 14-05-17.png" width="80%" alt="Profile Page" />
  <br/>
  <img src="frontend/src/assets/Screenshot from 2025-07-14 14-05-28.png" width="80%" alt="Deck Page" />
  <br/>
  <img src="frontend/src/assets/Screenshot from 2025-07-14 14-05-44.png" width="80%" alt="Cards Page" />
  <br/>
  <img src="frontend/src/assets/Screenshot from 2025-07-14 14-06-10.png" width="80%" alt="Statistics Page" />
</p>

---

## 🛠️ Tech Stack

**Frontend**:
- React + Vite
- Tailwind CSS
- Redux Toolkit
- Chart.js
- Framer Motion
- React Router DOM

**Backend**:
- Node.js, Express
- MongoDB
- Redis
- RabbitMQ
- Docker Microservices Architecture

---

## ⚙️ Local Setup

### 🚀 Backend Setup

> 📁 Backend repo: **Private** or available upon request  
> Folder structure assumed as: `/Expense-Backend` with microservices

```bash
# Clone the backend monorepo
git clone https://github.com/xNORAGAMIx/Expense-Backend.git
cd Expense-Backend

# Start all services using Docker Compose
docker-compose up --build

# (optional) If needed, configure environment variables for each microservice
# Example: user-service/.env
PORT=5001
MONGO_URI=mongodb://localhost:27017/userdb
JWT_SECRET=your_jwt_secret

# Backend will run on different ports:
# - Auth Service:       http://localhost:5000
# - User Service:       http://localhost:5001
# - Deck Service:       http://localhost:5002
# - Flashcard Service:  http://localhost:5003
# - Study Service:      http://localhost:5004
# - Stats Service:      http://localhost:5005
# - Voice/File Upload:  http://localhost:5006+
```

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/xNORAGAMIx/Flashcards-app.git
cd Flashcards-app

# Install dependencies
npm install

# Run the dev server
npm run dev

# Open in browser
http://localhost:5173
```

⭐ Contribute

Contributions, issues and feature requests are welcome!

# Fork the repo
# Create your feature branch
```
git checkout -b feature/amazing-feature
```

# Commit changes
```
git commit -m 'Add some amazing feature'
```
# Push and create PR
```
git push origin feature/amazing-feature
```
