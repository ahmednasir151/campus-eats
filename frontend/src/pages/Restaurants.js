import React, { useState, useEffect } from 'react';
import { getRestaurants } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import './Restaurants.css';

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await getRestaurants({ search: searchTerm, cuisine: selectedCuisine });
        setRestaurants(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchRestaurants();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCuisine]);

  const cuisines = ['All', 'Pakistani', 'Chinese', 'Italian', 'Fast Food', 'Desserts', 'Beverages'];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCuisineFilter = (cuisine) => {
    setSelectedCuisine(cuisine === 'All' ? '' : cuisine);
  };

  return (
    <div className="restaurants-page light-theme">
      
      {/* Sleek Hero Header for Restaurants */}
      <div className="restaurants-hero">
        <div className="restaurants-hero-content">
          <h1>Find your flavor.</h1>
          <p>Discover the best food around campus, delivered to your door.</p>
        </div>
      </div>

      {/* Sticky Modern Toolbar */}
      <div className="discovery-toolbar">
        <div className="toolbar-inner">
          <div className="search-bar-modern">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="What are you craving today?"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="cuisine-filters-scrollable">
            {cuisines.map(cuisine => (
              <button
                key={cuisine}
                className={`filter-pill ${selectedCuisine === cuisine || (cuisine === 'All' && !selectedCuisine) ? 'active' : ''}`}
                onClick={() => handleCuisineFilter(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="restaurants-content">
        {isLoading ? (
          <div className="loading-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton-card">
                 <div className="skeleton-img"></div>
                 <div className="skeleton-text title"></div>
                 <div className="skeleton-text"></div>
                 <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">😕</div>
            <h3>Oops, something went wrong</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="restaurants-grid-modern">
            {restaurants && restaurants.length > 0 ? (
              restaurants.map((restaurant, idx) => (
                <div key={restaurant._id} style={{animationDelay: `${idx * 0.05}s`}} className="fade-in-up">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>No restaurants found</h3>
                <p>Try adjusting your filters or searching for something else.</p>
                <button onClick={() => { setSearchTerm(''); setSelectedCuisine(''); }} className="btn-secondary">Clear Filters</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;