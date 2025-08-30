import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import  {loginUser}  from '../services/authservice.js';
import '../CSS/login.css'; 
import { toast } from 'react-toastify';


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(res.data.data));
        login(); // update context
        navigate('/master');
      } else {
        toast.error('Invalid Details');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-input-group">
          <label className="login-label">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="login-input"
          />
        </div>
        <div className="login-input-group">
          <label className="login-label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 10 }}>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default Login;
