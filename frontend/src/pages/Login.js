import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/restaurants');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page light-theme">
      <div className="auth-split-container">
        
        {/* Left Side Image Overlay */}
        <div className="auth-visual">
          <img src="/images/lifestyle.png" alt="Premium Dining Lifestyle" className="auth-bg-img" />
          <div className="auth-visual-content">
            <h2>Welcome Back.</h2>
            <p>Pick up right where you left off. The best campus food is just a tap away.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <span className="auth-emoji">👋</span>
              <h2>Login to Campus Eats</h2>
              <p className="auth-subtitle">Enter your details below to access your account</p>
            </div>
            
            {error && <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>}
            
            <form onSubmit={handleSubmit} className="modern-auth-form">
              <div className="form-group-floating">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="email">Email Address</label>
              </div>

              <div className="form-group-floating">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="password">Password</label>
              </div>

              <div className="forgot-password">
                <Link to="/login">Forgot your password?</Link>
              </div>

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? <span className="loader"></span> : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/register" className="auth-link-bold">Create one</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;