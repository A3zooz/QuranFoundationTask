# Quran App - Implementation Plan

## Project Overview
A modern Quran reading and learning application with two main features:
1. **Reading Mode**: Read Quran with bookmarks, favorites, translations, tafseer, transliteration, and audio
2. **Learning Mode**: Duolingo-style interactive questions with word completion challenges

---

## Tech Stack
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, SQLite
- **Quran Data**: @quranjs/api
- **Authentication**: JWT tokens

---

## Database Schema

### Existing Tables (with fixes needed)

#### `users`
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `bookmarks` (NEEDS FIX)
```sql
-- Current schema has wrong column names (surah/ayah instead of surah_number/verse_number)
CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    surah_number INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, surah_number, verse_number)
);
```

#### `favorites` (NEEDS FIX)
```sql
-- Current schema has ayah column which shouldn't exist for surah favorites
CREATE TABLE favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    surah_number INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, surah_number)
);
```

### New Tables Needed

#### `user_progress`
Tracks user's reading progress and last read position
```sql
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    surah_number INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id)
);
```

#### `quiz_progress`
Tracks user's quiz performance and statistics
```sql
CREATE TABLE quiz_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    surah_number INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    attempts INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    last_attempt_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `user_settings`
Store user preferences for reading experience
```sql
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    font_size TEXT DEFAULT 'medium', -- small, medium, large, xlarge
    translation_language TEXT DEFAULT 'en', -- en, ur, etc.
    preferred_reciter TEXT DEFAULT 'ar.alafasy', -- reciter ID from API
    show_translation BOOLEAN DEFAULT 1,
    show_transliteration BOOLEAN DEFAULT 1,
    theme TEXT DEFAULT 'light', -- light, dark, sepia
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id)
);
```

#### `quiz_sessions`
Track quiz sessions for analytics
```sql
CREATE TABLE quiz_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    score_percentage REAL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Backend Implementation

### Missing Routes & Controllers

#### 1. **Surah Routes** (`routes/surahRoutes.js`)
```javascript
// GET /api/surahs - Get all surahs list
// GET /api/surahs/:number - Get specific surah with verses
// GET /api/surahs/:surahNumber/verses/:verseNumber - Get specific verse
// GET /api/surahs/:surahNumber/verses/:verseNumber/tafseer - Get tafseer
// GET /api/surahs/:surahNumber/verses/:verseNumber/audio - Get audio URL
```

#### 2. **Bookmark & Favorites Routes** (`routes/userContentRoutes.js`)
```javascript
// POST /api/bookmarks - Add bookmark (ALREADY EXISTS in controller)
// GET /api/bookmarks - Get all bookmarks (ALREADY EXISTS in controller)
// DELETE /api/bookmarks - Remove bookmark (ALREADY EXISTS in controller)
// POST /api/favorites - Add favorite (ALREADY EXISTS in controller)
// GET /api/favorites - Get all favorites (ALREADY EXISTS in controller)
// DELETE /api/favorites - Remove favorite (ALREADY EXISTS in controller)
```

#### 3. **Progress Routes** (`routes/progressRoutes.js`)
```javascript
// GET /api/progress - Get user's reading progress
// POST /api/progress - Update reading progress
// GET /api/progress/stats - Get reading statistics
```

#### 4. **Settings Routes** (`routes/settingsRoutes.js`)
```javascript
// GET /api/settings - Get user settings
// PUT /api/settings - Update user settings
```

#### 5. **Quiz Routes** (`routes/quizRoutes.js`)
```javascript
// POST /api/quiz/start - Start a new quiz session
// GET /api/quiz/question - Get a random question
// GET /api/quiz/question/:surahNumber/:verseNumber - Get specific verse question
// POST /api/quiz/answer - Submit answer and get feedback
// POST /api/quiz/complete - Complete quiz session
// GET /api/quiz/stats - Get user quiz statistics
// GET /api/quiz/history - Get quiz history
```

### Controllers to Create

#### `progressController.js`
- `getProgress(req, res)` - Get user's last read position
- `updateProgress(req, res)` - Update reading progress
- `getReadingStats(req, res)` - Get statistics (verses read, time spent, etc.)

#### `settingsController.js`
- `getSettings(req, res)` - Get user settings
- `updateSettings(req, res)` - Update settings
- `resetSettings(req, res)` - Reset to defaults

#### `quizController.js`
- `startQuizSession(req, res)` - Create new quiz session
- `generateQuestion(req, res)` - Generate random question with word hidden
- `submitAnswer(req, res)` - Check answer and update stats
- `completeQuizSession(req, res)` - Finalize session and calculate score
- `getQuizStats(req, res)` - Get user's quiz performance
- `getQuizHistory(req, res)` - Get past quiz sessions

### Fixes Needed in Existing Code

#### `config/db.js`
- Fix column names in bookmarks table (surah → surah_number, ayah → verse_number)
- Fix favorites table (remove ayah column)
- Add new tables: user_progress, quiz_progress, user_settings, quiz_sessions
- Add indexes for better performance

#### `controllers/surahController.js`
- Fix db.run → db.get/db.all for SELECT queries
- Add error handling for missing data
- Implement actual Quran data fetching from @quranjs/api

#### `index.js`
- Import and use all route files
- Add error handling middleware
- Add request logging

---

## Frontend Implementation

### Folder Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── Layout.tsx
│   ├── quran/
│   │   ├── SurahList.tsx
│   │   ├── SurahCard.tsx
│   │   ├── VerseCard.tsx
│   │   ├── VerseActions.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── TranslationView.tsx
│   │   ├── TafseerView.tsx
│   │   └── TransliterationView.tsx
│   ├── quiz/
│   │   ├── QuizStart.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── QuizOptions.tsx
│   │   ├── QuizFeedback.tsx
│   │   ├── QuizResults.tsx
│   │   └── QuizStats.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthLayout.tsx
│   ├── settings/
│   │   ├── SettingsPanel.tsx
│   │   ├── ThemeSelector.tsx
│   │   └── FontSizeSelector.tsx
│   └── ui/
│       ├── button.tsx (existing)
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       ├── tabs.tsx
│       ├── toast.tsx
│       └── ... (other shadcn components)
├── pages/
│   ├── Home.tsx
│   ├── SurahReader.tsx
│   ├── Bookmarks.tsx
│   ├── Favorites.tsx
│   ├── Quiz.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useQuran.ts
│   ├── useBookmarks.ts
│   ├── useFavorites.ts
│   ├── useQuiz.ts
│   └── useSettings.ts
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── quran.service.ts
│   ├── bookmark.service.ts
│   ├── quiz.service.ts
│   └── settings.service.ts
├── contexts/
│   ├── AuthContext.tsx
│   ├── QuranContext.tsx
│   └── SettingsContext.tsx
├── types/
│   ├── auth.types.ts
│   ├── quran.types.ts
│   ├── quiz.types.ts
│   └── settings.types.ts
├── utils/
│   ├── arabic.ts
│   ├── storage.ts
│   └── format.ts
└── lib/
    └── utils.ts (existing)
```

### Required shadcn/ui Components
Install these components:
```bash
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add progress
npx shadcn@latest add scroll-area
```

### Additional Dependencies
```bash
npm install react-router-dom axios zustand react-howler @tanstack/react-query
```

### Pages & Routes

#### 1. **Authentication Pages**
- `/login` - Login page
- `/register` - Registration page
- Protected routes wrapper

#### 2. **Main App Pages**
- `/` - Home (Dashboard with progress, recent bookmarks, quiz stats)
- `/surahs` - List of all surahs
- `/surah/:number` - Read specific surah
- `/bookmarks` - View all bookmarked verses
- `/favorites` - View favorite surahs
- `/quiz` - Quiz mode landing page
- `/quiz/play` - Active quiz session
- `/settings` - User settings

---

## User Journeys

### Journey 1: Reading Quran
1. **Entry**: User logs in and lands on home dashboard
2. **Dashboard shows**:
   - Continue reading from last position
   - Quick stats (verses read today, total bookmarks)
   - Favorite surahs quick access
   - Recent bookmarks
3. **User selects**: "Browse Surahs" or clicks on a favorite
4. **Surah List**: Beautiful grid/list of all 114 surahs with:
   - Arabic name
   - English transliteration
   - Number of verses
   - Revelation location (Makkah/Madinah)
   - Favorite star icon
5. **User clicks** on a surah
6. **Surah Reader View**:
   - Header: Surah name, bismillah (except Surah 9)
   - Verses displayed in cards
   - Each verse card shows:
     - Arabic text (large, beautiful font)
     - Verse number badge
     - Translation (collapsible)
     - Transliteration (collapsible)
     - Action buttons: Bookmark, Play audio, View Tafseer
7. **User interactions**:
   - Click bookmark icon → verse saved to bookmarks
   - Click play → audio plays with highlighting
   - Click tafseer → dialog opens with detailed explanation
   - Scroll → auto-save reading progress
   - Click favorite (header) → add surah to favorites
8. **Settings accessible via**:
   - Font size adjustment
   - Theme (light/dark/sepia)
   - Translation language
   - Show/hide translation/transliteration
   - Preferred reciter

### Journey 2: Quiz Mode (Duolingo Style)
1. **Entry**: User clicks "Quiz" from navigation
2. **Quiz Landing Page**:
   - Total quiz sessions completed
   - Average score
   - Streak counter
   - "Start New Quiz" button
   - Past quiz history
3. **User clicks** "Start New Quiz"
4. **Quiz Configuration** (optional):
   - Select specific surah or random
   - Number of questions (5, 10, 15, 20)
   - Difficulty level (could be based on verse length)
5. **Quiz Session Starts**:
   - Progress bar (Question 3/10)
   - Question card showing:
     - Arabic verse with ONE word replaced by "___"
     - 4 multiple choice options
     - Timer (optional)
6. **User selects** an answer
7. **Instant Feedback**:
   - ✅ Correct: Green highlight, encouraging message
   - ❌ Wrong: Red highlight, show correct answer
   - Display full verse with translation
   - "Next" button appears
8. **After all questions**:
   - Results screen:
     - Score (7/10 correct)
     - Percentage
     - XP earned (gamification)
     - Wrong answers review
     - "Review Mistakes" or "Try Again"
9. **Progress saved** to database

### Journey 3: Bookmarks & Favorites
1. **User navigates** to Bookmarks page
2. **Bookmarks View**:
   - List of all bookmarked verses
   - Each shows: Surah name, verse number, snippet
   - Click to jump to verse in reader
   - Remove bookmark option
3. **User navigates** to Favorites page
4. **Favorites View**:
   - Grid of favorite surahs
   - Quick access to read
   - Remove from favorites option

---

## UI/UX Design & Feel

### Design Philosophy
- **Clean & Minimal**: Focus on the Quran text
- **Respectful**: Beautiful Arabic typography
- **Modern**: Smooth animations and transitions
- **Accessible**: WCAG compliant, keyboard navigation

### Color Scheme

#### Light Theme (Default)
- Background: Cream/Ivory (#FDFBF7)
- Text: Dark Green (#1A4D2E)
- Primary: Emerald Green (#10B981)
- Accent: Gold (#F59E0B)
- Card: White with subtle shadow

#### Dark Theme
- Background: Deep Navy (#0F172A)
- Text: Light Cream (#F8F6F0)
- Primary: Soft Green (#34D399)
- Accent: Warm Gold (#FBBF24)
- Card: Dark with border

#### Sepia Theme (Easy on eyes)
- Background: Light Sepia (#F4E8D8)
- Text: Dark Brown (#3E2723)
- Primary: Olive Green (#6B8E23)
- Accent: Bronze (#CD7F32)

### Typography
- **Arabic Text**: 
  - Font: "Amiri Quran" or "KFGQPC Uthmanic Script HAFS"
  - Sizes: 24px (mobile), 32px (tablet), 40px (desktop)
  - Line height: 2.5 for readability
- **English Translation**: 
  - Font: "Inter" or "Poppins"
  - Size: 16px
  - Weight: 400
- **Headings**: 
  - Font: "Poppins"
  - Weight: 600-700

### Layout Components

#### Header/Navbar
```
[Logo] [Search] [Home] [Surahs] [Quiz] [Bookmarks] [Theme Toggle] [Avatar Menu]
```

#### Mobile Bottom Navigation
```
[Home Icon] [Surahs Icon] [Quiz Icon] [Bookmarks Icon] [Settings Icon]
```

#### Verse Card Layout
```
┌─────────────────────────────────────────────┐
│ [Verse Number Badge]    [Bookmark] [Audio]  │
│                                             │
│           ‎ا‎لْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ           │
│                                             │
│ ▼ Translation                              │
│   Praise be to Allah, Lord of the worlds   │
│                                             │
│ ▼ Transliteration                          │
│   Alhamdu lillahi rabbil 'aalameen         │
│                                             │
│ [View Tafseer]                             │
└─────────────────────────────────────────────┘
```

#### Quiz Question Card
```
┌─────────────────────────────────────────────┐
│        Question 5/10          ⏱️ 0:45       │
│                                             │
│   Complete the verse:                       │
│                                             │
│        ‎قُلْ ___ اللَّهُ أَحَدٌ                  │
│                                             │
│   ○ هُوَ                                    │
│   ○ مِنَ                                    │
│   ○ إِنَّ                                   │
│   ○ لَمْ                                    │
│                                             │
│            [Submit Answer]                  │
└─────────────────────────────────────────────┘
```

### Animations & Interactions
- **Page transitions**: Smooth fade-in (300ms)
- **Card hover**: Subtle lift with shadow
- **Audio playing**: Pulse animation on verse
- **Bookmark click**: Heart fill animation
- **Quiz answer**: Color morph (green/red)
- **Loading**: Skeleton screens for content
- **Scroll**: Smooth scroll with progress indicator

### Responsive Design
- **Mobile**: Single column, bottom nav, swipe gestures
- **Tablet**: Two columns for verse list, side drawer
- **Desktop**: Full layout with sidebar, multi-column options

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Backend**:
- ✅ Fix database schema issues
- ✅ Create missing tables
- ✅ Implement surah routes and controller
- ✅ Fix existing controller bugs
- ✅ Add all routes to index.js

**Frontend**:
- ✅ Set up routing (react-router-dom)
- ✅ Create auth pages and context
- ✅ Install required shadcn components
- ✅ Set up API service layer
- ✅ Create basic layout components

### Phase 2: Reading Feature (Week 2)
**Backend**:
- ✅ Implement progress routes and controller
- ✅ Implement settings routes and controller
- ✅ Add audio URL endpoints
- ✅ Add tafseer endpoints

**Frontend**:
- ✅ Create Surah List page
- ✅ Create Surah Reader page
- ✅ Implement verse cards with all features
- ✅ Add audio player component
- ✅ Create bookmarks and favorites pages
- ✅ Implement settings panel
- ✅ Add theme switching

### Phase 3: Quiz Feature (Week 3)
**Backend**:
- ✅ Implement quiz routes and controller
- ✅ Create question generation algorithm
- ✅ Implement answer validation
- ✅ Add quiz statistics endpoints

**Frontend**:
- ✅ Create quiz landing page
- ✅ Implement quiz session flow
- ✅ Create question component
- ✅ Add feedback and results screens
- ✅ Implement quiz statistics dashboard
- ✅ Add gamification elements

### Phase 4: Polish & Enhancement (Week 4)
**Backend**:
- ✅ Add comprehensive error handling
- ✅ Implement rate limiting
- ✅ Add logging
- ✅ Performance optimization
- ✅ API documentation

**Frontend**:
- ✅ UI/UX polish
- ✅ Add loading states and skeletons
- ✅ Implement error boundaries
- ✅ Add toast notifications
- ✅ Performance optimization (lazy loading, memoization)
- ✅ Accessibility audit
- ✅ Mobile responsive refinement
- ✅ PWA features (optional)

### Phase 5: Testing & Deployment (Week 5)
- ✅ Unit tests for critical functions
- ✅ Integration tests
- ✅ E2E tests for main user flows
- ✅ Cross-browser testing
- ✅ Performance testing
- ✅ Deploy backend
- ✅ Deploy frontend
- ✅ Set up CI/CD

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Quran Content
- `GET /api/surahs` - Get all surahs
- `GET /api/surahs/:number` - Get surah with verses
- `GET /api/surahs/:surahNumber/verses/:verseNumber` - Get specific verse
- `GET /api/surahs/:surahNumber/verses/:verseNumber/tafseer` - Get tafseer
- `GET /api/surahs/:surahNumber/verses/:verseNumber/audio` - Get audio URL

### User Content
- `POST /api/bookmarks` - Add bookmark
- `GET /api/bookmarks` - Get user bookmarks
- `DELETE /api/bookmarks` - Remove bookmark
- `POST /api/favorites` - Add favorite surah
- `GET /api/favorites` - Get favorite surahs
- `DELETE /api/favorites` - Remove favorite

### Progress
- `GET /api/progress` - Get reading progress
- `POST /api/progress` - Update reading progress
- `GET /api/progress/stats` - Get reading statistics

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

### Quiz
- `POST /api/quiz/start` - Start quiz session
- `GET /api/quiz/question` - Get random question
- `POST /api/quiz/answer` - Submit answer
- `POST /api/quiz/complete` - Complete session
- `GET /api/quiz/stats` - Get quiz statistics
- `GET /api/quiz/history` - Get quiz history

---

## Key Features Checklist

### Reading Features
- ✅ Browse all 114 surahs
- ✅ Read verses with beautiful Arabic typography
- ✅ View translations (multiple languages)
- ✅ View transliteration
- ✅ View tafseer (detailed explanation)
- ✅ Listen to verse audio (with reciter selection)
- ✅ Bookmark specific verses
- ✅ Favorite surahs for quick access
- ✅ Continue from last read position
- ✅ Customizable reading settings (font, theme, etc.)

### Quiz Features
- ✅ Duolingo-style word completion questions
- ✅ Multiple choice answers
- ✅ Instant feedback
- ✅ Score tracking
- ✅ Quiz history
- ✅ Performance statistics
- ✅ Review wrong answers

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light/Sepia themes
- ✅ Smooth animations
- ✅ Offline support (PWA - optional)
- ✅ Fast performance
- ✅ Accessible (keyboard navigation, screen readers)

---

## Notes & Considerations

### Performance
- Implement pagination for long surahs
- Lazy load audio files
- Cache frequently accessed data
- Optimize Arabic font loading

### Security
- Sanitize all user inputs
- Rate limit API endpoints
- Secure JWT implementation
- HTTPS only in production

### Scalability
- Consider moving to PostgreSQL for production
- Implement Redis caching
- CDN for static assets
- Separate API and frontend deployments

### Future Enhancements
- Social features (share verses)
- Reading streaks and achievements
- Advanced quiz modes (listening, translation)
- Taraweeh schedule during Ramadan
- Prayer times integration
- Qibla direction
- Daily verse notifications
- Community features (study groups)

---

**Let's build this beautiful Quran app! 📖✨**
