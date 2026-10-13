
# 🎯 Fling

Fling is a casual browser-based puzzle game built with React. Players aim and launch characters to overcome obstacles, destroy structures, and reach targets. The game focuses on simple controls while encouraging experimentation, precision, and problem-solving.

## ✨ Features

- **User Authentication:** Sign up and log in using Firebase Authentication.
- **Protected Routes:** Restrict access to the game to authenticated users.
- **Interactive Gameplay:** Aim and launch a character using a slingshot mechanic.
- **Puzzle Challenges:** Overcome obstacles and reach targets across multiple levels.
- **Responsive UI:** Interface styled with Tailwind CSS.
- **Form Validation:** Validate user input on login and signup forms.
- **Firebase Integration:** Firebase Authentication and Cloud Firestore setup

## 🛠️ Technologies Used

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Firebase Authentication
- Cloud Firestore
- Lucide React

## 📁 Project Structure

```text
fling/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── AuthLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Games.jsx
│   ├── services/
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
└── README.md
```


## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- A Firebase account

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd fling
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).

Register a web app and enable **Email/Password** under Authentication → Sign-in method.

Create a `.env` file in the project root and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with the configuration from your Firebase web app.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal to play Fling.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run lint` | Run code linting |
| `npm run preview` | Preview the production build |

## 🔐 Authentication

Fling uses Firebase Authentication to support account registration and login. Protected routes ensure that only authenticated users can access the game.

Cloud Firestore is configured for storing user-related data.

## 🎮 How to Play

1. Create an account or log in.
2. Enter the game.
3. Aim the character using the slingshot.
4. Adjust your aim and launch with the appropriate force.
5. Overcome obstacles and reach the target to complete each level.

## 🗺️ Future Improvements

- Save player progress across sessions.
- Add more levels and increasingly challenging obstacles.
- Introduce score tracking and a leaderboard.
- Improve animations, sound effects, and gameplay feedback.
- Add additional authentication options.

## 👩‍💻 Author

Created as a React web development project.

## 📄 License

This project is currently for educational and demonstration purposes.
