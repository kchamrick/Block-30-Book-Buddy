import { Link, useNavigate } from 'react-router-dom';
import './styles/Navigation.css';

const Navigation = ({ token, setToken, user, setUser }) => { //Defines the navigation component using destructured props for auth state and functions
const navigate = useNavigate(); //calls the function 

const handleLogout = () => { //logout function for logging users out
    setToken(null); //clear token state
    setUser(null); //clear user data state
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