import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './styles/Account.css';

const Account = ({ token, user, API_URL }) => { //variable defines the account component, setting up state for a user's checked out book(s). Destructuring is used to extract three props: authentication token, user data, and the API. 
  const [checkedOutBooks, setCheckedOutBooks] = useState([]); //state for a users checked out books -- setter function setCheckedOutBooks updates the state
  const [error, setError] = useState(''); //checks for errors 

  useEffect(() => {
    if (token) { //useEffect runs if a user is logged in
      fetchCheckedOutBooks(); //function call to get user's books
    }
  }, [token, API_URL]); //dependency – useEffect runs if token or API URL changes

  const fetchCheckedOutBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations/users/me`, { //makes a request to the reservations endpoint
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } //token ensures that the correct reservations are returned
      });

      if (!response.ok) {
        throw new Error('Failed to fetch checked out books');
      } //if there's an error in fetching the checked out books associated with a user, an error message is thrown

      const data = await response.json();
      setCheckedOutBooks(data.reservation || []); // updates state with book reservations or an empty array if there are none
    } catch (error) {
      setError('Error fetching checked out books');
      console.error('Fetch error:', error);
    }
  }; //throws an error if there's a problem setting the checked out books data

  const handleReturn = async (reservationId) => { //function to return a book
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, { //fetches a specific reservation from the API
        method: 'DELETE', //and makes a delete request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` //token is required to ensure the user is authorized to return books
        }
      });

      if (!response.ok) {
        throw new Error('Failed to return book');
      } //if there's no response, an error is thrown

      fetchCheckedOutBooks(); //function runs to refresh the list of checked out books
    } catch (error) {
      setError('Error returning book');
      console.error('Return error:', error);
    } //if there's an error fetching the list, an error message is thrown and logged to the console
  };

  if (!token) return <Navigate to="/login" />;
//if there's no token, the user is redirected to the login page -- this protects unauthorized users from accessing protected routes 

  return ( //container for a user's logged in account that shows their book status...includes conditional rendering with a welcome message but only if the user exists
    <div className="account-container">
      <div className="account-header">
        <h2 className="account-welcome">My Account</h2>
        {user && <p>Welcome, {user.firstname} {user.lastname}</p>} 
      </div>
      <h3>Checked Out Books</h3>
      {error && <p className="error-message">{error}</p>}
      {checkedOutBooks.length === 0 ? (
        <p>No books checked out</p>
      ) : ( //conditional rendering based on books array – if no books, "no books checked out" displays, otherwise, we map over the books array and show the book listing
        <div className="checked-out-books">
          {checkedOutBooks.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.coverimage} alt={book.title} className="book-card-image" />
              <div className="book-card-content">
                <h4 className="book-card-title">{book.title}</h4>
                <p className="book-card-author">{book.author}</p>
                <button 
                  onClick={() => handleReturn(book.id)} //event handler that calls the return function
                  className="return-button"
                >
                  Return Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Account;