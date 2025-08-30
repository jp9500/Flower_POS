// ✅ components/Sidebar.js (Improved Design & Icons)
import '../CSS/slidebar.css';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { FaMoon, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);

    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    document.body.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose}></div>}
      <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <div className="sidebar-content">
          <div className="user-info">
            <FaUser className="sidebar-icon" />
            <h3>{username}</h3>
          </div>

          <div className="toggle-switch">
            <input
                type="checkbox"
                id="darkModeToggle"
                checked={darkMode}
                onChange={toggleDarkMode}
            />
            <label className="toggle-slider" htmlFor="darkModeToggle"></label>
            </div>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-icon" /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;