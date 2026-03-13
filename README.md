<div align="center">
  <img src="https://raw.githubusercontent.com/AkankshaMishra2/LLMForge/main/frontend/public/vite.svg" alt="LLMForge Logo" width="120" />
</div>

<h1 align="center">LLMForge: The Ultimate AI Synthesis Platform</h1>

<p align="center">
  <strong>Compare responses from top-tier models like Gemini Flash and Groq's Llama 3 concurrently.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a>
</p>

---

## ⚡ Overview

LLMForge is a modern, high-performance web application designed to accelerate AI-driven workflows. Stop switching between tabs—LLMForge lets you query **Google Gemini 2.5 Flash** and **Groq Llama 3** _at the exact same time_. Get instant, side-by-side responses and a unified AI-generated conclusion summarizing the best of both worlds. 

Featuring a sleek, glassmorphic UI, full Dark Mode support, and continuous multi-turn chat sessions!

## ✨ Features

- **Concurrent Generation:** Fire off a single prompt and receive instant answers from Gemini and Groq simultaneously.
- **Smart Synthesis:** An intelligent summarizer creates a final conclusion based on the combined output of all tested models.
- **Continuous Chat Sessions:** Maintain context! The platform remembers your entire conversation history, just like ChatGPT, allowing for rich multi-turn dialogues.
- **History Tracking:** All your past sessions are securely saved to MongoDB. Revisit old chats, read past conclusions, or seamlessly delete them.
- **Premium UI/UX:** Built with beautiful CSS "glassmorphism", modern typography, smooth micro-animations, and full responsiveness across all devices.
- **Dark/Light Mode:** First-class support for whatever theme you prefer.

## 🛠️ Tech Stack

LLMForge is built using the robust **MERN** stack:

- **Frontend:** React, Vite, React Router DOM, Axios, standard CSS variables
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **APIs Integrated:** Groq API (Llama 3.1 8B), Google Gemini API (2.5 Flash)

## 🚀 Installation

Follow these steps to run LLMForge locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/AkankshaMishra2/LLMForge.git
cd comparellms
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add your credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder to point to the backend:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
# Client will run on http://localhost:5173
```

## 💻 Usage

1. **Sign Up / Login:** Create an account to start saving your chat history.
2. **Start a New Chat:** Type your prompt into the QueryBox on the Dashboard.
3. **Compare & Analyze:** Watch as Groq and Gemini respond concurrently. Read the generated summary to quickly grasp the consensus.
4. **Keep Chatting:** Send follow-up messages! The models will remember your previous turns in the session.
5. **Manage History:** Use the sidebar to browse your past sessions or click the trash icon to delete them.

---

<p align="center">
  Built with ❤️ by an AI Enthusiast.
</p>
