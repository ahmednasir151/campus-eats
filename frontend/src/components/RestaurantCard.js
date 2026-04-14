import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="restaurant-card-modern">
      <div className="rc-image-container">
        <img src={restaurant.image || '/images/default-restaurant.jpg'} alt={restaurant.name} className="rc-image"/>
        
        {/* Badges overlaid on image */}
        <div className="rc-badges-top">
          {!restaurant.isOpen && <span className="rc-badge closed">Closed</span>}
          {restaurant.rating >= 4.5 && restaurant.isOpen && <span className="rc-badge featured">⭐ Top Rated</span>}
        </div>
        
        <div className="rc-badges-bottom">
          <span className="rc-badge frosted time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {restaurant.deliveryTime}
          </span>
          <span className="rc-badge frosted rating">
            ★ {restaurant.rating.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="rc-info">
        <div className="rc-header">
          <h3 className="rc-title">{restaurant.name}</h3>
        </div>
        
        <p className="rc-cuisine">
          {restaurant.cuisine?.map(c => <span key={c} className="cuisine-tag">{c}</span>) || <span className="cuisine-tag">Various</span>}
        </p>
        
        <div className="rc-footer">
          <span className="rc-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {restaurant.location}
          </span>
          {restaurant.minimumOrder > 0 && (
            <span className="rc-min-order">Min Rs.{restaurant.minimumOrder}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;