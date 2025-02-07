//Synopsis of what's happening on this page of code:
//1. Sets up Navigation component with conditional rendering of navigation links based on a user's authentication status (whether they have an account and/or are logged in)
//This page handles user state based on their authorization within the application. The following functions are used: Navigation(), useNavigate, and handleLogout. 

import { Link, useNavigate } from 'react-router-dom';
import './styles/Navigation.css';

const Navigation = ({ token, setToken }) => { 
const navigate = useNavigate(); 

const handleLogout = () => { //logout function for logging users out
    setToken(null); //clear token state
    localStorage.removeItem('token'); //removes token from storage
    navigate('/'); //and then reroutes users to the home page of this application
  };

  return ( //container for navigation 
    <nav className="nav-container">
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {token ? ( //if a user is logged in and there's a token, show "My Account" and "Logout" in the navigation
          <>
            <Link to="/account" className="nav-link">My Account</Link>
            <button onClick={handleLogout} className="nav-button">Logout</button>
          </>
        ) : ( //but if they're not logged in show "Login" and "Register" links as options
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;