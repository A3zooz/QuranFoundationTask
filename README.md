# Quran Foundation App

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-emerald?style=for-the-badge)](https://qafs-quran-app.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A full-stack web application for reading, listening to, and studying the Holy Quran with Tafsir (exegesis) support. Built with React, TypeScript, and Node.js.

🌐 **Production Link:** [https://qafs-quran-app.netlify.app/](https://qafs-quran-app.netlify.app/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Core Functionality](#-core-functionality)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication
- User registration and login system
- JWT-based authentication
- Protected routes for authenticated users
- Secure password hashing with bcrypt

### 📖 Quran Reading
- Browse all 114 Surahs (chapters) of the Quran
- Page-by-page Quran reader (604 pages)
- High-quality Uthmani script images
- Arabic text display with proper formatting
- Navigation between pages with keyboard support

### 🎧 Audio Recitation
- Listen to complete Surah recitations
- Verse-by-verse audio playback
- Auto-play next verse functionality
- Custom audio player with controls (play, pause, next, previous, mute)
- Audio from Quran.com API

### 📚 Tafsir (Exegesis)
- Access to multiple Tafsir resources:
  - Tafsir Ibn Kathir
  - Tafsir Al-Jalalayn
  - Tafsir Muyassar
- View explanations for each verse
- Navigate between verses within Tafsir view
- Switch between different Tafsir sources

### ⭐ Personalization
- Favorite Surahs
- Bookmark verses (feature implemented in backend)
- Filter to show only favorite Surahs
- User-specific data storage

### 🎨 UI/UX
- Modern, responsive design with Tailwind CSS
- Beautiful gradient backgrounds
- Card-based layout for Surahs
- Loading states and animations
- Mobile-friendly interface

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19.1.1
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** SQLite3
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **Quran Data:** @quranjs/api, Quran.com API

### Development Tools
- ESLint for code linting
- TypeScript for type safety
- dotenv for environment variables

## 📁 Project Structure

```
QuranFoundationTask/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── context/     # React Context (Auth)
│   │   │   └── routes/      # Route components
│   │   ├── pages/           # Page components
│   │   │   ├── Landing.tsx  # Landing page
│   │   │   ├── Login.tsx    # Login page
│   │   │   ├── Signup.tsx   # Registration page
│   │   │   ├── Home.tsx     # Surah list page
│   │   │   ├── Reader.tsx   # Quran page reader
│   │   │   └── Tafsir.tsx   # Tafsir viewer
│   │   ├── lib/             # Utilities
│   │   └── shared/          # Shared constants
│   └── public/
│       └── quran/           # Quran page images (604 pages)
│
├── backend/                  # Node.js Express backend
│   ├── config/              # Configuration files
│   │   ├── db.js           # SQLite database setup
│   │   └── quranapi.js     # Quran API configuration
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── surahController.js
│   │   └── tafsirController.js
│   ├── middleware/          # Express middleware
│   │   └── authMiddleware.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── surahRoutes.js
│   │   └── tafsirRoutes.js
│   ├── utils/               # Utility functions
│   │   └── authUtils.js    # JWT & password utilities
│   ├── validations/         # Input validation
│   │   └── authValidations.js
│   └── index.js            # Server entry point
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/A3zooz/QuranFoundationTask.git
   cd QuranFoundationTask
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   DB_PATH=./database.sqlite
   API_BASE_URL=https://api.quran.com/api/v4
   QURAN_CLIENT_ID=your_quran_api_client_id
   QURAN_CLIENT_SECRET=your_quran_api_secret
   ```

   Start the backend server:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🎯 Core Functionality

### Authentication Flow
1. Users register with email and password
2. Passwords are hashed using bcrypt before storage
3. Login returns a JWT token
4. Token is stored in localStorage and included in subsequent requests
5. Protected routes verify token before granting access

### Quran Reading Experience
- **Home Page**: Displays all 114 Surahs with metadata (name in Arabic/English, revelation place, verse count)
- **Reader**: Shows Quran pages using high-quality images from the Uthmani script
- **Navigation**: Users can navigate using buttons or jump directly to any page (1-604)

### Audio Playback
- Users can listen to complete Surah recitations
- Audio plays verse-by-verse with automatic progression
- Custom player includes controls for navigation and volume
- Audio files fetched from Quran.com API

### Tafsir System
- Access explanations for each verse from multiple scholars
- Switch between different Tafsir sources
- Navigate through verses while reading Tafsir
- Arabic text displayed alongside explanations

### User Personalization
- **Favorites**: Mark Surahs as favorites for quick access
- **Filter**: Toggle to view only favorited Surahs
- **Bookmarks**: Save specific verses for later reference (backend implementation ready)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Surahs
- `GET /api/surah/surahs` - Get all Surahs
- `GET /api/surah/surahs/:surahNumber/audio` - Get audio for Surah
- `POST /api/surah/favorite` - Add Surah to favorites
- `DELETE /api/surah/favorite` - Remove from favorites
- `GET /api/surah/favorites` - Get user's favorite Surahs
- `POST /api/surah/bookmark` - Bookmark a verse
- `DELETE /api/surah/bookmark` - Remove bookmark
- `GET /api/surah/bookmarks` - Get user's bookmarks

### Tafsir
- `GET /api/tafsir/tafsirs` - Get available Tafsir resources
- `GET /api/tafsir/tafsirs/:surahNumber/:verseNumber` - Get Tafsir for specific verse

## 📸 Screenshots

*Screenshots would showcase:*
- Landing page
- Login/Signup pages
- Surah list with favorites
- Quran page reader
- Audio player interface
- Tafsir viewer

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Quran text and audio from [Quran.com](https://quran.com)
- [@quranjs/api](https://github.com/quran/quran-api) for Quran data access
- Radix UI for accessible UI components
- The Muslim community for inspiration

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Note:** This application is designed for educational and personal use. The Quran content is sourced from publicly available APIs and resources. May Allah accept this effort.

**Disclaimer:** This README is generated using AI and may be inaccurate in some details.
