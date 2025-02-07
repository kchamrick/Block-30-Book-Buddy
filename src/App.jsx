//Synopsis of what's happening on this page of code:
//1. import of all components and styles needed for the application to run
//2. Declaration of API endpoint constant
//3. Route set up for different views 
//The core functionality of this page is managing the auth token and user states, fetching and storing book data, handling user authentication, routing users to other routes, and error handling. Five functions are used: App(), two async functions: fetchBooks() and fetchUserData(), and two hooks: useState and useEffect. 

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Books from "./components/Books";
import SingleBook from "./components/SingleBook";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import './components/styles/App.css'; 

const API_URL = 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api'; //API endpoint constant for ease of use throughout application

function App() { //function for state management of token, user data, and books
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => { //useEffect runs on token changes
    fetchBooks(); //fetches all books
    if (token) { //if there's a token, we know that it corresponds to a specific user
      fetchUserData(); //and so, we are able to fetch that user's data 
    }
  }, [token]); //Dependency array so that the effect only runs when there's a token change -- otherwise we'd end up with an infinite loop

  const fetchBooks = async () => { //async function to fetch all books
    try {
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();
      setBooks(data.books); //updates books state with the data that's returned from the GET request 
    } catch (error) {
      console.error('Error fetching books:', error);
    } //if there's an error fetching the books, an error is thrown to the console for debugging
  };

  const fetchUserData = async () => { //function to fetch users data 
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` //authentication token that corresponds to a specific user
        }
      });
      const data = await response.json(); 
      setUser(data); //updates user state with data returned from the function call to the API above
    } catch (error) { //throws an error to the console for debugging if there's a problem fetching user data
      console.error('Error fetching user data:', error);
      setToken(null); //clear token state -- updates state, causing components to re-render and show logged-out user interface
      localStorage.removeItem('token'); //removes token from local storage
    }
  };

  return ( //Below, added a container and header for styling to display the routes available to users (i.e. Login, Register, Account). Props and token are used with Navigation to determine if a user is logged in and show the correct nav. options. 
    <Router>
      <div className="app-container"> 
        <header className="app-header">
          <Navigation token={token} setToken={setToken} user={user} setUser={setUser} /> 
        </header>
        <Routes>
          <Route path="/" element={<Books books={books} token={token} />} />
          <Route path="/books/:id" element={<SingleBook token={token} API_URL={API_URL} />} />
          <Route path="/login" element={<Login setToken={setToken} API_URL={API_URL} />} />
          <Route path="/register" element={<Register setToken={setToken} API_URL={API_URL} />} />
          <Route path="/account" element={<Account token={token} user={user} API_URL={API_URL} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
