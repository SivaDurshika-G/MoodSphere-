# MoodSphere: Your Personalized Mood Tracker 📊

MoodSphere is an elegant, colorful, and interactive web app designed to help users track their daily moods 🌈. With MoodSphere, you can log your feelings, view emotional history on an interactive calendar, take reflective notes, get daily reminders, and even chat with a mood-based AI assistant for support.

---

## 📌 Table of Contents

* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Installation](#-installation)
* [Usage](#-usage)
* [How It Works](#-how-it-works)
* [Live Demo](#-live-demo)
* [Screenshots](#-screenshots)
* [Contributing](#-contributing)
* [License](#-license)
* [Contact](#-contact)

---

## ✨ Features

* 🎨 **Colorful Mood Selector** – Choose from moods like Happy 😊, Sad 😢, Neutral 😐, and more.
* 📅 **Interactive Calendar** – Visualize your emotional history with a color-coded calendar.
* ✍️ **Personal Notes** – Reflect on your day with optional written notes.
* 💾 **Local Storage & Backend Support** – Store mood data locally or in the backend for persistent tracking.
* ⏰ **Daily Reminders** – Get notifications to log your mood every day.
* 📧 **Email Notifications** – Automatic emails for new user registration, forgotten password, or daily mood reminders.
* 🖥️ **Multi-Page Dashboard** – Includes UK dashboard, contributors page, and calendar page.
* 💬 **AI Chatbot** – Mood-based chatbot to provide support and suggestions to users.
* 🎞️ **Smooth Animations & Backgrounds** – A visually appealing, dynamic UI with animated backgrounds.
* 📱 **Fully Responsive** – Optimized for desktop, tablet, and mobile devices.
* 🔒 **Authentication** – Login and Register securely with JWT-based sessions.
* ⚡ **Fast & Interactive UI** – Enhanced user experience with animated transitions and smooth interactions.

---

## ⚙️ Tech Stack

| Technology        | Purpose                                     |
| ----------------- | ------------------------------------------- |
| React.js (CRA)    | Frontend UI & interactive components        |
| Node.js + Express | Backend API                                 |
| MongoDB           | Database for storing users and moods        |
| JWT               | Authentication & session management         |
| CSS3 + Animations | Styling, animated backgrounds & transitions |
| Nodemailer        | Email notifications                         |

---

## 💻 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/SivaDurshika-G/MoodSphere-.git
cd MoodSphere-
```

2. **Backend Setup**

```bash
cd backend
npm install
```

3. **Frontend Setup**

```bash
cd ../frontend
npm install
npm start
```

---

## 🛠 Usage

1. Open the frontend (`localhost:3000`) in your browser.
2. Register a new account or login with an existing one.
3. Log your daily moods and notes on the interactive calendar.
4. Receive daily reminders and email notifications.
5. Use the AI chatbot for mood support and guidance.

---

## ⚙️ How It Works

* Users authenticate via login/register.
* Mood entries are saved either locally or in the backend.
* Daily reminders are triggered via email notifications.
* Calendar displays mood history with color-coded moods.
* Chatbot suggests actions or advice based on your logged mood.
* Animated backgrounds and transitions enhance engagement.

---

## 🌐 Live Demo

Visit the live site: [MoodSphere Live - https://sphere-rouge.vercel.app](https://sphere-rouge.vercel.app)

---


## 🔧 `.env.example` (Backend)

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
GOOGLE_CLIENT_ID=client_id
GOOGLE_CLIENT_SECRET=client_secret
FRONTEND_URL=http://localhost:3000
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your_session_secret_key
GMAIL_USER=mail_id
GMAIL_PASS=pass
GROQ_API_KEY=api_key
GROQ_MODEL=llama3-8b-8192
GITHUB_TOKEN=token
```

---

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes
4. Commit and push:

```bash
git commit -m "Add your message"
git push origin feature/your-feature-name
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**. See the LICENSE file for full details.

---

## 📬 Contact

* **Created by:** Siva Durshika
* **Email:** [sivadurshika@gmail.com](mailto:sivadurshika@gmail.com)
* **GitHub:** [@SivaDurshika-G](https://github.com/SivaDurshika-G)
