import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './MenuItemCard.css';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const success = addToCart(item, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const spicyIcons = ['', '🌶️', '🌶️🌶️', '🌶️🌶️🌶️'];

  return (
    <div className="menu-item-card">
      <div className="menu-item-image">
        <img src={item.image} alt={item.name} />
        {item.isVegetarian && <span className="veg-badge">🌱</span>}
      </div>
      
      <div className="menu-item-info">
        <div className="menu-item-header">
          <h4>{item.name}</h4>
          <span className="menu-item-price">Rs.{item.price}</span>
        </div>
        
        <p className="menu-item-description">{item.description}</p>
        
        <div className="menu-item-meta">
          <span className="category">{item.category}</span>
          {item.spicyLevel > 0 && (
            <span className="spicy">{spicyIcons[item.spicyLevel]}</span>
          )}
        </div>
        
        {item.isAvailable ? (
          <div className="menu-item-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button 
              className={`add-to-cart-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? ' Added' : 'Add to Cart'}
            </button>
          </div>
        ) : (
          <p className="unavailable">Currently Unavailable</p>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;