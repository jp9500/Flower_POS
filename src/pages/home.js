import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCogs, FaExchangeAlt, FaChartBar, FaBars } from 'react-icons/fa';
import '../CSS/home.css';
import Sidebar from '../components/slidebar';

function Home() {
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="home-container">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <FaBars size={22} />
        </button>
        <div className="card-grid">
          <Link to="/master" className="home-card">
            <FaCogs size={48} />
            <span>Master</span>
          </Link>
          <Link to="/transaction" className="home-card">
            <FaExchangeAlt size={48} />
            <span>Transaction</span>
          </Link>
          <Link to="/report" className="home-card">
            <FaChartBar size={48} />
            <span>Report</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
