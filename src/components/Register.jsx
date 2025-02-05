import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Auth.css';

const Register = ({ setToken, API_URL }) => { //defines a registration component that takes two props: setToken and the API
  const [formData, setFormData] = useState({ //and then this creates a registration form that is a state object with all the input values (below)
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(''); //state for error messages
  const navigate = useNavigate(); //hook for navigation after registration

  const handleChange = (e) => { //manages the registration form data state in real time by matching name attributes with the formData property
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => { //registration form submission handler
    e.preventDefault(); //prevents default form submission
    try { //sends the user registration data as a POST request in json format
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.token) { //if the registration is a success, an auth token is set
        setToken(data.token);
        localStorage.setItem('token', data.token); //the auth token is then stored locally
        navigate('/'); //and the user is navigated back to the homepage
      } else {
        setError('Registration failed');
      } //otherwise, if the registration is not successful, an error message is thrown
    } catch (error) {
      setError('Error registering');
    }
  };

  return ( //container with the registration form
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Register</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="auth-button">Register</button>
      </form>
    </div>
  );
};

export default Register;