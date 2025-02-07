//Synopsis of what's happening on this page of code:
//1. Sets up SingleBook component with state management for book details -- allowing users to view a specific book's details
//2. Manages book checkout functionality
//This page handles book details retrieval and display, book check out functionality, and user authentication for checking out and returning books. The following functions are used: SingleBook(), fetchBookDetails(), handleCheckout(), useState, useEffect, useParams, and useNavigate. 

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/SingleBook.css';

const SingleBook = ({ token, API_URL }) => {
  const [book, setBook] = useState(null); 
  const [error, setError] = useState(''); 
  const { id } = useParams(); 

  const navigate = useNavigate(); 

  useEffect(() => {
    if (id) { //useEffect runs if book id exists
      fetchBookDetails(); 
    }
  }, [id]); //re-runs useEffect if the id chanages

  const fetchBookDetails = async () => { //function to get book data
    try {
      const response = await fetch(`${API_URL}/books/${id}`);
      if (!response.ok) { //if there's no response from the API when fetching the books, an error message is thrown
        throw new Error('Failed to fetch book details');
      }
      const data = await response.json();
      setBook(data.book); 
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('Error fetching book details');
    }
  };

  const handleCheckout = async (bookId) => { 
    if (!token) { //if there's no token, the user is redirected to the log in page
      navigate('/login');
      return;
    }

    try { //Makes the checkout request
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'PATCH', //updates book availability - different than post and used instead bc post would create a new resource
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) { //if there's no response when trying to check out the book, an error message is thrown 
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check out book');
      }
      //redirects user to homepage after successful checkout
      await fetchBookDetails(); // Refresh the book details
      navigate('/account'); // Navigate to account page

      //if there's an error, an error message is thrown
    } catch (error) { 
      console.error('Checkout error:', error);
      setError(error.message || 'Error checking out book');
    }
  };

  if (!book) { //if there's no book loaded yet, this message displays
    return (
      <div className="single-book-container">
        <p>Loading book details...</p>
      </div>
    );
  }

  return ( //container for each of the books 
    <div className="single-book-container">
      <div className="single-book-content">
        <img src={book.coverimage} alt={book.title} className="single-book-image" />
        <div className="single-book-details">
          <h2 className="single-book-title">{book.title}</h2>
          <h3 className="single-book-author">{book.author}</h3>
          <p className="single-book-description">{book.description}</p>
          {error && <p className="error-message">{error}</p>}
          {book.available && token && (
            <button onClick={()=> handleCheckout(book.id)} className="checkout-button">
              Check Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;