import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar-modern ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="navbar-container-modern">
        <Link to="/" className="navbar-logo-modern">
          <span className="logo-icon">🍔</span> 
          <span className="logo-text">Campus<span className="accent">Eats</span></span>
        </Link>

        <ul className="navbar-menu-modern">
          <li><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link></li>
          <li><Link to="/restaurants" className={`nav-link ${isActive('/restaurants') ? 'active' : ''}`}>Restaurants</Link></li>
          
          {user ? (
            <>
              {user.role === 'restaurant' && (
                <li><Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link></li>
              )}
              {user.role === 'student' && (
                <>
                  <li><Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>My Orders</Link></li>
                  <li>
                    <Link to="/cart" className="cart-link-modern">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      {getItemCount() > 0 && <span className="cart-badge-modern">{getItemCount()}</span>}
                    </Link>
                  </li>
                </>
              )}
              <li className="user-dropdown">
                <div className="user-avatar-modern">{user.name.charAt(0).toUpperCase()}</div>
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="logout-btn-modern">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <div className="auth-buttons-modern">
              <Link to="/login" className="btn-nav-login">Sign In</Link>
              <Link to="/register" className="btn-nav-register">Get Started</Link>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;