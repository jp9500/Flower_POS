import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaChartBar, FaUser } from 'react-icons/fa';
import '../CSS/footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <nav className="footer-nav">
        <Link to="/master" className="footer-btn">
          <FaHome size={20} />
          <span>Home</span>
        </Link>
        <Link to="/transaction" className="footer-btn">
          <FaExchangeAlt size={20} />
          <span>Transaction</span>
        </Link>
        <Link to="/reports" className="footer-btn">
          <FaChartBar size={20} />
          <span>Reports</span>
        </Link>
        <Link to="/account" className="footer-btn">
          <FaUser size={20} />
          <span>Account</span>
        </Link>
      </nav>
    </footer>
  );
}

export default Footer;
