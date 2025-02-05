import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Auth.css';

const Login = ({ setToken, API_URL }) => { //variable set for login with a setToken function 
  const [email, setEmail] = useState(''); //sets state for email input -- starts with an empty array
  const [password, setPassword] = useState(''); //sets state for password input -- starts with an empty array
  const [error, setError] = useState(''); //state for error messages
  const navigate = useNavigate(); //hook for navigation after a user logs in

  const handleSubmit = async (e) => { //login form submission handler
    e.preventDefault(); //prevents default form submission
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.token) { //if the login is successful, update the token state
        setToken(data.token);
        localStorage.setItem('token', data.token); //saves the token in local storage
        navigate('/');
      } else {
        setError(data.message || 'Incorrect username or password, please try again.');
      } //if there's an error when a user signs in, this message is thrown. 
    } catch (error) {
      setError('Error logging in');
    } //if there's an error logging in, an error message is thrown. 
  };

  return ( //Login form 
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Login</h2>
        {error && <p className="error-message">{error}</p>} 
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} //event handler that updates state with the email that a user enters
            required
            className="form-input"
          /> 
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} //event handler that updates state with the password that a user enters
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="auth-button">Login</button>
      </form>
    </div>
  );
};

export default Login;