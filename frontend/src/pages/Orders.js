import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import './Orders.css';

const Orders = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => getMyOrders().then(res => res.data)
  });

  const getStatusClass = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'preparing': 'status-preparing',
      'out-for-delivery': 'status-delivery',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  };

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return <div className="loading-page">Loading orders...</div>;
  }

  if (error) {
    return <div className="error-page">Failed to load orders</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>No orders yet</h2>
        <p>Start ordering delicious food!</p>
        <Link to="/restaurants" className="btn btn-primary">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      
      <div className="orders-list">
        {orders.map(order => (
          <Link to={`/orders/${order._id}`} key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>{order.restaurantId.name}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`status-badge ${getStatusClass(order.status)}`}>
                {formatStatus(order.status)}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-summary">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>Rs.{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <span className="order-total">Total: Rs.{order.totalAmount}</span>
              <span className="view-details">View Details →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;