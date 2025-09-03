# Book-Finder-App

The **Book-Finder-Application** is a React-based web application that allows users to search for books by title, author, subject or ISBN.  
It fetches data from the **Open Library API** and displays details such as title, author, year of publication, and cover image.  

---

## Features
 Search books by **title, author, subject or ISBN**
 Display book details (title, author, first published year, etc.)
 Show book cover images using Open Library cover service
 Responsive design with React components

---

## Tech Stack
 **Frontend:** React (JavaScript, JSX, CSS)  
 **API:** [Open Library API](https://openlibrary.org/search.json?title={bookTitle})
 **Build Tool:** Node.js with npm  

---

## Project Structure
```
Book-Finder-App/
client/
│── .gitignore
│── index.html
│── package.json
│── package-lock.json
│── vite.config.js
│── eslint.config.js
│── README.md
│
│── public/
│   └── vite.svg          # Static assets (images, favicon, etc.)
│
├── src/                  # Main source code
│   │── App.css           # Styles
│   │── App.jsx           # Root React component
│   │── main.jsx          # Entry point (Vite + ReactDOM.createRoot)
│
├── assets/
│   └── react.svg
└── node_modules/         # Installed dependencies (auto-generated)

```

## How to Run
```
# Clone the repository
git clone https://github.com/abhisheksingh3008/Book-Finder-App

# Navigate to project folder
cd client

# Install dependencies
npm install

# Start development server
npm run dev

```

