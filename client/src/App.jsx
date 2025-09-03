
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [readBooks, setReadBooks] = useState(new Set(JSON.parse(localStorage.getItem('readBooks') || '[]')));
  const [viewMode, setViewMode] = useState('all'); // 'all', 'read', 'unread'
  const [selectedBook, setSelectedBook] = useState(null);
  const [showReadMode, setShowReadMode] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    yearFrom: '',
    yearTo: '',
    language: '',
    rating: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load default books on component mount
  useEffect(() => {
    loadDefaultBooks();
  }, []);

  // Update filtered books when books or filters change
  useEffect(() => {
    applyFilters();
  }, [books, filters, viewMode, readBooks]);

  const loadDefaultBooks = async () => {
    setLoading(true);
    try {
      // Load some popular books as default
      const response = await fetch('https://openlibrary.org/search.json?q=popular&limit=20');
      const data = await response.json();
      setBooks(data.docs || []);
    } catch (err) {
      setError('Failed to load default books.');
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://openlibrary.org/search.json?${searchType}=${encodeURIComponent(query)}&limit=50`);
      const data = await response.json();
      setBooks(data.docs || []);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...books];

    // Apply view mode filter
    if (viewMode === 'read') {
      filtered = filtered.filter(book => readBooks.has(book.key));
    } else if (viewMode === 'unread') {
      filtered = filtered.filter(book => !readBooks.has(book.key));
    }

    // Apply other filters
    if (filters.genre) {
      filtered = filtered.filter(book =>
        book.subject && book.subject.some(s => s.toLowerCase().includes(filters.genre.toLowerCase()))
      );
    }

    if (filters.yearFrom) {
      filtered = filtered.filter(book =>
        book.first_publish_year && book.first_publish_year >= parseInt(filters.yearFrom)
      );
    }

    if (filters.yearTo) {
      filtered = filtered.filter(book =>
        book.first_publish_year && book.first_publish_year <= parseInt(filters.yearTo)
      );
    }

    if (filters.language) {
      filtered = filtered.filter(book =>
        book.language && book.language.includes(filters.language)
      );
    }

    setFilteredBooks(filtered);
  };

  const toggleReadStatus = (bookKey) => {
    const newReadBooks = new Set(readBooks);
    if (newReadBooks.has(bookKey)) {
      newReadBooks.delete(bookKey);
    } else {
      newReadBooks.add(bookKey);
    }
    setReadBooks(newReadBooks);
    localStorage.setItem('readBooks', JSON.stringify([...newReadBooks]));
  };

  const openReadMode = (book) => {
    setSelectedBook(book);
    setShowReadMode(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooks();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="app">
      <header className="library-header">
        <div className="header-content">
          <h1>📚 Alex's Digital Library</h1>
          <p>Discover, Read, and Track Your Favorite Books</p>
        </div>
      </header>

      <nav className="library-nav">
        <div className="nav-buttons">
          <button
            className={`nav-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            All Books ({books.length})
          </button>
          <button
            className={`nav-btn ${viewMode === 'read' ? 'active' : ''}`}
            onClick={() => setViewMode('read')}
          >
            Read ({readBooks.size})
          </button>
          <button
            className={`nav-btn ${viewMode === 'unread' ? 'active' : ''}`}
            onClick={() => setViewMode('unread')}
          >
            Unread ({books.length - readBooks.size})
          </button>
        </div>
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 Filters {showFilters ? '▲' : '▼'}
        </button>
      </nav>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Genre:</label>
            <input
              type="text"
              placeholder="e.g., fiction, science"
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Year From:</label>
            <input
              type="number"
              placeholder="1900"
              value={filters.yearFrom}
              onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Year To:</label>
            <input
              type="number"
              placeholder="2025"
              value={filters.yearTo}
              onChange={(e) => handleFilterChange('yearTo', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Language:</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">All</option>
              <option value="eng">English</option>
              <option value="spa">Spanish</option>
              <option value="fre">French</option>
              <option value="ger">German</option>
              <option value="ita">Italian</option>
            </select>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="search-form">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="subject">Subject</option>
          <option value="isbn">ISBN</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
        />
        <button type="submit" disabled={loading}>Search</button>
      </form>

      {loading && <p className="loading">Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <div className="books-grid">
        {filteredBooks.map((book, index) => (
          <div key={book.key || index} className={`book-card ${readBooks.has(book.key) ? 'read' : ''}`}>
            {book.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="book-cover"
              />
            )}
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">👤 {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
              <p className="year">📅 {book.first_publish_year || 'N/A'}</p>
              <p className="editions">📚 {book.edition_count || 'N/A'} editions</p>
              {book.subject && book.subject.length > 0 && (
                <p className="genre">🏷️ {book.subject.slice(0, 2).join(', ')}</p>
              )}
            </div>
            <div className="book-actions">
              <button
                className="read-btn"
                onClick={() => toggleReadStatus(book.key)}
              >
                {readBooks.has(book.key) ? '✅ Read' : '📖 Mark as Read'}
              </button>
              <button
                className="details-btn"
                onClick={() => openReadMode(book)}
              >
                📋 Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showReadMode && selectedBook && (
        <div className="read-mode-overlay" onClick={() => setShowReadMode(false)}>
          <div className="read-mode-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBook.title}</h2>
              <button className="close-btn" onClick={() => setShowReadMode(false)}>✕</button>
            </div>
            <div className="modal-content">
              {selectedBook.cover_i && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`}
                  alt={selectedBook.title}
                  className="modal-cover"
                />
              )}
              <div className="modal-details">
                <p><strong>Author:</strong> {selectedBook.author_name ? selectedBook.author_name.join(', ') : 'Unknown'}</p>
                <p><strong>First Published:</strong> {selectedBook.first_publish_year || 'N/A'}</p>
                <p><strong>Edition Count:</strong> {selectedBook.edition_count || 'N/A'}</p>
                <p><strong>Language:</strong> {selectedBook.language ? selectedBook.language.join(', ') : 'N/A'}</p>
                {selectedBook.subject && (
                  <p><strong>Subjects:</strong> {selectedBook.subject.join(', ')}</p>
                )}
                {selectedBook.description && (
                  <div className="description">
                    <strong>Description:</strong>
                    <p>{typeof selectedBook.description === 'string' ? selectedBook.description : selectedBook.description.value}</p>
                  </div>
                )}
                <div className="modal-actions">
                  <button
                    className="read-btn"
                    onClick={() => toggleReadStatus(selectedBook.key)}
                  >
                    {readBooks.has(selectedBook.key) ? '✅ Read' : '📖 Mark as Read'}
                  </button>
                  {selectedBook.isbn && selectedBook.isbn[0] && (
                    <a
                      href={`https://www.worldcat.org/isbn/${selectedBook.isbn[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      🔗 Find in Library
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
