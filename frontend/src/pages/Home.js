import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const features = [
    {
      id: '01',
      title: 'Lightning Delivery',
      description: 'Advanced routing algorithms ensure your meal arrives piping hot.',
      icon: 
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    },
    {
      id: '02',
      title: 'Curated Selection',
      description: 'Handpicked culinary experiences from top-tier campus kitchens.',
      icon: 
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
    },
    {
      id: '03',
      title: 'Simple Tracking',
      description: 'Real-time telemetry of your order delivered through a sleek interface.',
      icon: 
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    }
  ];

  return (
    <div className="home-container light-theme">
      
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-layout">
          <div className="hero-content" style={{ transform: `translateY(${scrollY * -0.1}px)` }}>
            <div className="badge-wrapper animate-on-scroll">
              <span className="badge-emoji">✨</span>
              <span className="badge-text">Premium Campus Dining</span>
            </div>

            <h1 className="hero-headline animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
              Fresh food. <br />
              <span className="accent-serif">Fast delivery.</span>
            </h1>

            <p className="hero-subheadline animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
              Experience the perfect intersection of delicious cuisine and seamless technology. Tailored for the modern student.
            </p>

            <div className="hero-actions animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
              <Link to="/restaurants" className="btn-primary-advanced">
                <span className="btn-text">Explore Menus</span>
                <span className="btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </Link>
              
              {!user && (
                <Link to="/register" className="btn-secondary-advanced">
                  Create Account
                </Link>
              )}
            </div>
            
            <div className="trusted-by animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
              <p>Trusted by 5,000+ students across campus</p>
              <div className="avatar-group">
                <div className="avatar">🧑‍🎓</div>
                <div className="avatar">👩‍💻</div>
                <div className="avatar">👨‍🔬</div>
                <div className="avatar">+</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual animate-on-scroll" style={{ transitionDelay: '0.3s', transform: `translateY(${scrollY * 0.15}px)` }}>
            <div className="image-backdrop"></div>
            <img src="/images/hero-food.png" alt="Gourmet Burger and Fries" className="hero-food-image" />
            <div className="floating-card highlight-card top-left">
              <span className="emoji">🔥</span> Hot & Fresh
            </div>
            <div className="floating-card highlight-card bottom-right">
              <span className="emoji">⭐</span> 4.9/5 Rating
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header center animate-on-scroll">
          <h2 className="section-heading">Why Choose Us</h2>
          <p className="section-subheading">Everything you need, nothing you don't. We built Campus Eats from the ground up to perfect your dining experience.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div 
              key={feature.id} 
              className="feature-card-modern animate-on-scroll"
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="showcase-section">
        <div className="showcase-layout">
          <div className="showcase-visual image-visual animate-on-scroll">
            <img src="/images/lifestyle.png" alt="Student enjoying food delivery" className="lifestyle-image" />
            
            {/* Floating element overlapping the image */}
            <div className="floating-status">
              <div className="status-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10ac84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="status-text">
                <span className="status-title">Order Delivered</span>
                <span className="status-time">Just now</span>
              </div>
            </div>
          </div>

          <div className="showcase-text animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <span className="section-label">Seamless Experience</span>
            <h2 className="section-heading">Redefining Convenience</h2>
            <p className="showcase-desc">
              We've stripped away the noise to bring you an interface focused entirely on what matters: finding exceptional food quickly. Our minimalist architecture reduces friction from selection to checkout.
            </p>
            <div className="metrics-container">
              <div className="metric">
                <span className="metric-val">15m</span>
                <span className="metric-label">Avg. Delivery</span>
              </div>
              <div className="metric">
                <span className="metric-val">99%</span>
                <span className="metric-label">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-modern animate-on-scroll">
        <div className="cta-box">
          <h2>Ready to taste the difference?</h2>
          <p>Join the thousands of students already enjoying our platform.</p>
          <Link to="/restaurants" className="btn-primary-advanced">
            Begin your journey
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;