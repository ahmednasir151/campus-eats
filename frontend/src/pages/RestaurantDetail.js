import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRestaurant, getMenuItems } from '../services/api';
import MenuItemCard from '../components/MenuItemCard';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurant(id).then(res => res.data)
  });

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', id],
    queryFn: () => getMenuItems(id).then(res => res.data)
  });

  if (restaurantLoading || menuLoading) {
    return <div className="loading-page">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="error-page">Restaurant not found</div>;
  }

  const categories = ['all', ...new Set(menuItems?.map(item => item.category) || [])];
  
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems?.filter(item => item.category === selectedCategory);

  return (
    <div className="restaurant-detail-page">
      <div className="restaurant-banner">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="restaurant-overlay">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
        </div>
      </div>

      <div className="restaurant-info-bar">
        <div className="info-item">
          <span className="icon">⭐</span>
          <span>{restaurant.rating.toFixed(1)} Rating</span>
        </div>
        <div className="info-item">
          <span className="icon">🕐</span>
          <span>{restaurant.deliveryTime}</span>
        </div>
        <div className="info-item">
          <span className="icon">📍</span>
          <span>{restaurant.location}</span>
        </div>
        <div className="info-item">
          <span className="icon">💵</span>
          <span>Min. Rs.{restaurant.minimumOrder}</span>
        </div>
        <div className={`status-badge ${restaurant.isOpen ? 'open' : 'closed'}`}>
          {restaurant.isOpen ? 'Open' : 'Closed'}
        </div>
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <MenuItemCard key={item._id} item={item} />
            ))
          ) : (
            <p className="no-items">No items available in this category</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;