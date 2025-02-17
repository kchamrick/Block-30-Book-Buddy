//Synopsis of what's happening on this page of code:
//1. Set up of Books component with props for books array and authentication token
//2. search functionality for book filtering is added
//3. Allows users to view book details and availability for check out
//This page makes it possible for users to view books, their details, their availability, and to search for specific books using the search bar on the application. Two functions are used: Books(), a useState hook, and a filter function: filteredBooks.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Books.css';

const Books = ({ books }) => { 
  const [searchTerm, setSearchTerm] = useState(''); //manages the state for book searches -- begins with an empty array

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  ); //allows users to filter using title or author and the "toLowerCase" improves the search by removing the need for things to be case sensitive

  return (
    <div className="books-container">
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} //event handler that updates search state
        className="books-search"
      />
      <div className="books-grid">
        {filteredBooks.map(book => ( //maps through the array of filtered books to display them -- if the book is available, the user sees "available," otherwise they see "checked out" as the book's status
          <div key={book.id} className="book-card">
            <img src={book.coverimage} alt={book.title} className="book-card-image" />
            <div className="book-card-content">
              <h3 className="book-card-title">{book.title}</h3>
              <p className="book-card-author">{book.author}</p>
              <p className={`book-card-status ${!book.available ? 'unavailable' : ''}`}>
                Status: {book.available ? 'Available' : 'Checked Out'}
              </p>
              <Link //links to the book details
                to={`/books/${book.id}`} 
                className="book-card-link">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;