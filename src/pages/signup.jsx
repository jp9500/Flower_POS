import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
import { signupUser } from '../services/authservice.js';
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 p-6 rounded-2xl shadow-xl backdrop-blur">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Signup
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-green-700 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              placeholder='Enter your Full Name'
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-green-700 font-semibold">Username</label>
            <input
              type="text"
              name="username"
              placeholder='Enter the email or username'
              value={form.username}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-green-700 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder='Enter your password'
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Create Account
          </button>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 hover:underline">
              Login
            </Link>
          </p>
        </form>
        <Link
          to="/ipconfig"
          className="block mt-4 text-center text-green-600 hover:underline"
        >
          Config
        </Link>
      </div>
    </div>
  );
}

export default Signup;
