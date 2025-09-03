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
```bash
Book-Finder-App/
│── public/
│   └── index.html         # Base HTML file
│── src/
│   ├── components/        # Reusable UI components (BookCard, SearchBar, etc.)
│   ├── App.js             # Main application component
│   ├── index.js           # Entry point
│   ├── App.css            # Styles
│   └── api.js             # API call functions
│── package.json           # Dependencies & scripts
│── README.md              # Documentation
│── NOTES.md               # Developer notes
