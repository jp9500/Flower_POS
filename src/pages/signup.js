import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {signupUser} from '../services/authservice.js';
import '../CSS/signup.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser(form);
      if (res.ok) {
        toast.success('Signup successful');
      localStorage.setItem('user', JSON.stringify(res.data));
        login();
        navigate('/master');
      } else {
        const resp = await res.json();
        toast.error(resp.message || 'Signup failed');
      }
    } catch (err) {
      toast.error('Error connecting to server');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="signup-input-group">
          <label className="signup-label">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <div className="signup-input-group">
          <label className="signup-label">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <div className="signup-input-group">
          <label className="signup-label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <button type="submit" className="signup-button">Create Account</button>
        <p style={{ marginTop: 15, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
