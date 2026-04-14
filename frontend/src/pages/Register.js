import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    hostel: '',
    room: '',
    campus: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: {
          hostel: formData.hostel,
          room: formData.room,
          campus: formData.campus
        }
      };

      await register(userData);
      navigate('/restaurants');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page light-theme">
      <div className="auth-split-container">
        
        {/* Left Side Image Overlay */}
        <div className="auth-visual">
          <img src="/images/hero-food.png" alt="Premium Dining Lifestyle" className="auth-bg-img" />
          <div className="auth-visual-content align-bottom">
            <h2>Join the Club.</h2>
            <p>Access exclusive student discounts and the fastest delivery times on campus.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-form-side">
          <div className="auth-form-wrapper scrollable-form">
            <div className="auth-header">
              <span className="auth-emoji">🚀</span>
              <h2>Create an Account</h2>
              <p className="auth-subtitle">Get started with Campus Eats in less than 2 minutes</p>
            </div>
            
            {error && <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>}
            
            <form onSubmit={handleSubmit} className="modern-auth-form">
              
              <div className="form-row">
                <div className="form-group-floating half">
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required placeholder=" " />
                  <label htmlFor="name">Full Name</label>
                </div>
                <div className="form-group-floating half">
                  <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} placeholder=" " />
                  <label htmlFor="phone">Phone Number</label>
                </div>
              </div>

              <div className="form-group-floating">
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required placeholder=" " />
                <label htmlFor="email">Email Address</label>
              </div>

              <div className="form-row">
                <div className="form-group-floating half">
                  <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder=" " />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="form-group-floating half">
                  <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder=" " />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                </div>
              </div>

              <div className="form-divider">Account Type</div>
              
              <div className="role-selector">
                <label className={`role-card ${formData.role === 'student' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} className="hidden-radio" />
                  <span className="role-icon">🧑‍🎓</span>
                  <span className="role-text">Student</span>
                </label>
                
                <label className={`role-card ${formData.role === 'restaurant' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="restaurant" checked={formData.role === 'restaurant'} onChange={handleChange} className="hidden-radio" />
                  <span className="role-icon">🏪</span>
                  <span className="role-text">Restaurant</span>
                </label>
              </div>

              {formData.role === 'student' && (
                <div className="student-details-section">
                  <div className="form-divider">Campus Details</div>
                  <div className="form-group-floating">
                    <input type="text" name="campus" id="campus" value={formData.campus} onChange={handleChange} placeholder=" " />
                    <label htmlFor="campus">Campus</label>
                  </div>
                  <div className="form-row">
                    <div className="form-group-floating half">
                      <input type="text" name="hostel" id="hostel" value={formData.hostel} onChange={handleChange} placeholder=" " />
                      <label htmlFor="hostel">Hostel</label>
                    </div>
                    <div className="form-group-floating half">
                      <input type="text" name="room" id="room" value={formData.room} onChange={handleChange} placeholder=" " />
                      <label htmlFor="room">Room Number</label>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-auth-primary" disabled={loading} style={{marginTop: '1.5rem'}}>
                {loading ? <span className="loader"></span> : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login" className="auth-link-bold">Sign In</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;