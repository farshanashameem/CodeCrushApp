# 🎮 CodeCrush

**CodeCrush** is an educational gaming platform designed for children to learn and develop essential skills through fun, interactive games.

The platform provides a child-friendly gaming experience while allowing parents to monitor their children's activities and administrators to manage games, levels, users, contests, and reports.

---

## 🌟 Features

### 👨‍👩‍👧 Parent

* Parent registration and login
* OTP verification
* Forgot and reset password
* Create and manage child profiles
* Update child information
* Block/unblock child accounts
* View children's game activity
* View game statistics and progress
* View game reviews
* Add and update game reviews
* Monitor children's play time and attempts
* Premium subscription support
* Weekly progress reports

### 🧒 Child

* Child-friendly gaming interface
* Child session management
* Multiple educational games
* Game levels and progression
* Score and star tracking
* Play-time tracking
* Game progress tracking
* Contests
* AI-generated games
* Interactive gameplay

### 🛠️ Admin

* Admin authentication
* Dashboard
* User management
* Parent management
* Child management
* Game management
* Level management
* Game reviews management
* Contest management
* Reports
* User blocking and restoring
* Game and level creation

---

## 🎮 Games

CodeCrush includes different educational games designed to improve children's skills.

### 🖱️ Mouse Tracker

Helps children improve:

* Mouse control
* Hand-eye coordination
* Precision
* Motor skills

### 🎨 Colour Sorter Safari

Helps children develop:

* Colour recognition
* Object classification
* Mouse/drag-and-drop skills

### ⌨️ Typing Titans

A typing-based educational game designed to improve:

* Typing skills
* Keyboard familiarity
* Word recognition

> Typing Titans is available as a premium feature.

### 🧩 Picture Puzzler

Helps children improve:

* Visual recognition
* Problem solving
* Concentration
* Pattern recognition

### 🤖 AI Games

CodeCrush also includes AI-powered game generation.

Supported AI game types include:

* Quiz
* Typing
* Memory
* Sorting
* Catch

Children can generate and play games based on dynamically generated game configurations.

---

## 🏆 Contests

CodeCrush supports two types of contests:

### Challenge Contest

Children compete based on game performance such as:

* Score
* Stars
* Levels

### Participation Contest

Children participate by completing a specified number of levels.

---

## 📊 Progress Tracking

CodeCrush tracks children's gameplay progress, including:

* Current level
* High score
* Stars
* Completed levels
* Total attempts
* Best time
* Total play time
* Games played
* Last played time

Parents can use this information to understand their child's learning and gaming activity.

---

## 🤖 AI Game Generation

CodeCrush integrates AI to dynamically generate educational games.

The AI game generation system uses structured validation to ensure generated game configurations follow the required format.

AI-generated games currently support:

```text
QUIZ
TYPING
MEMORY
SORTING
CATCH
```

The generated game can be played directly by the child without permanently storing the complete generated configuration.

---

## 🏗️ Architecture

The backend follows **Clean Architecture** principles.

```text
Backend
│
├── Domain
│   ├── Entities
│   ├── Enums
│   └── Interfaces
│
├── Application
│   ├── DTOs
│   └── Use Cases
│
├── Infrastructure
│   ├── Database
│   ├── Repositories
│   └── External Services
│
└── Presentation
    ├── Controllers
    ├── Routes
    └── Middleware
```

The frontend is organized using a feature-based structure with reusable components and Redux state management.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Zod

### Additional Technologies

* LangChain
* AI integration
* Node Cron
* REST APIs
* Git & GitHub

---

## 🔐 Authentication & Authorization

CodeCrush uses JWT-based authentication with access and refresh tokens.

The platform supports role-based access control for:

```text
Admin
Parent
Child
```

Protected routes prevent unauthorized users from accessing restricted areas.

Child gaming sessions are also managed separately to provide a controlled gaming environment.

---

## 📧 Weekly Progress Reports

CodeCrush provides automated weekly progress reports for parents.

Reports contain information such as:

* Levels played
* Levels completed
* Highest score
* Best time
* Average stars
* Current level
* Total games played
* Total play time

Weekly reports are automatically generated and sent to the parent.

---

## 💳 Premium Features

CodeCrush supports premium subscriptions.

Premium features include:

* Additional game levels
* Typing Titans
* Weekly progress reports
* Subscription-based access

Subscription plans can be provided based on the number of children associated with the parent account.

---

## 📁 Project Structure

### Frontend

```text
src/
├── Constants/
├── Hooks/
├── Lib/
├── Presentation/
│   ├── layouts/
│   ├── pages/
│   │   ├── Admin/
│   │   ├── Parent/
│   │   └── Child/
│   └── SharedComponents/
├── redux/
│   ├── Slices/
│   └── store.ts
├── Types/
└── App.tsx
```

### Backend

```text
src/
├── Domain/
├── Application/
├── Infrastructure/
└── Presentation/
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate to the project

```bash
cd CodeCrush
```

### 3. Install dependencies

For the backend:

```bash
npm install
```

For the frontend:

```bash
cd frontEnd
npm install
```

### 4. Configure environment variables

Create the required `.env` files for the frontend and backend.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Do not commit `.env` files or secret credentials to the repository.

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

```bash
cd frontEnd
npm run dev
```

---

## 🔄 Git Workflow

The project uses feature-based Git branches.

Examples:

```text
main
feature/game-management
feature/game-reviews
feature/payment
feature/report
feature/contest
feature/AIGame
feature/child-crud
```

Changes are developed in feature branches and merged into the main branch after completion and review.

---

## 🚀 Future Improvements

Possible future improvements include:

* More educational games
* Advanced AI-generated games
* More detailed analytics
* Improved parent dashboards
* Gamification and achievements
* Leaderboards
* More subscription plans
* Mobile application
* Improved AI personalization

---

## 🎯 Project Goal

The goal of CodeCrush is to combine **education and gaming** to create an engaging learning environment for children while giving parents useful insights into their children's progress.

---

## 👩‍💻 Author

**Farshana K**

Full Stack MERN Developer

Built as part of my full-stack development journey and project-based learning.

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐.
