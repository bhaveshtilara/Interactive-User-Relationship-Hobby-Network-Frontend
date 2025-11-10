# Interactive User Network Frontend (React + TypeScript)

This repository contains the frontend for the Interactive User Relationship and Hobby Network application. It provides an interactive visualization layer for user and hobby relationships powered by a FastAPI backend.

## 1. Live Application

* **Web App:** [https://social-network-graph-app.vercel.app/](https://social-network-graph-app.vercel.app/)

## 2. Overview

The frontend visualizes social connections and hobbies in a graph structure. Users, friendships, and hobby assignments are reflected in real time based on backend data. The interface allows users to create and manage both profiles and relationships directly through an interactive canvas.

## 3. Key Features

* **Graph Visualization:** Displays users and their relationships using React Flow.
* **Interactive Linking:** Create friendships by dragging connections between nodes.
* **Hobby Assignment:** Drag hobbies from the sidebar onto user nodes.
* **Dynamic Node Styling:** Node appearance reflects popularity score thresholds.
* **User Management Panel:** Enables adding, editing, and removing users.
* **State Management:** Centralized via React Context with `useReducer`.
* **Action Feedback:** Informative notifications using `react-hot-toast`.

## 4. Technology Stack

| Component     | Technology            |
| ------------- | --------------------- |
| Framework     | React 18 (TypeScript) |
| Build Tool    | Vite                  |
| Graph Engine  | React Flow            |
| API Client    | Axios                 |
| Forms         | React Hook Form       |
| Notifications | React Hot Toast       |

## 5. Local Setup Instructions

### Prerequisite

Ensure the backend is running locally. Default backend address:

```
http://localhost:8000
```

### Frontend Installation

1. **Clone the repository:**

```
git clone <repository-url>
cd frontend
```

2. **Install dependencies:**

```
npm install
```

3. **Environment Configuration:**
   Copy `.env.example` to `.env` and update:

```
VITE_API_BASE_URL=http://localhost:8000
```

4. **Run the application:**

```
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

## 6. Deployment Notes

* Ensure `VITE_API_BASE_URL` points to the deployed backend endpoint when deploying.
* Handle API availability and CORS settings as required during integration.

---
