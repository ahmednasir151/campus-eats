import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrder, cancelOrder } from '../services/api';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id).then(res => res.data)
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', id]);
      queryClient.invalidateQueries(['myOrders']);
    }
  });

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelMutation.mutate();
    }
  };

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusProgress = (status) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    return ((currentIndex + 1) / statuses.length) * 100;
  };

  if (isLoading) {
    return <div className="loading-page">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error-page">Order not found</div>;
  }

  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="order-detail-page">
      <button onClick={() => navigate('/orders')} className="back-btn">
        ← Back to Orders
      </button>

      <div className="order-detail-container">
        <div className="order-detail-header">
          <h1>Order Details</h1>
          <p className="order-id">Order ID: {order._id}</p>
        </div>

        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <div className="order-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getStatusProgress(order.status)}%` }}
              />
            </div>
            <div className="progress-steps">
              <div className={`step ${['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'].indexOf(order.status) >= 0 ? 'active' : ''}`}>
                Pending
              </div>
              <div className={`step ${['confirmed', 'preparing', 'out-for-delivery', 'delivered'].indexOf(order.status) >= 0 ? 'active' : ''}`}>
                Confirmed
              </div>
              <div className={`step ${['preparing', 'out-for-delivery', 'delivered'].indexOf(order.status) >= 0 ? 'active' : ''}`}>
                Preparing
              </div>
              <div className={`step ${['out-for-delivery', 'delivered'].indexOf(order.status) >= 0 ? 'active' : ''}`}>
                Out for Delivery
              </div>
              <div className={`step ${order.status === 'delivered' ? 'active' : ''}`}>
                Delivered
              </div>
            </div>
          </div>
        )}

        <div className="order-status-card">
          <h2>Status: <span className={`status-text status-${order.status}`}>
            {formatStatus(order.status)}
          </span></h2>
          <p className="order-time">
            Ordered on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="order-restaurant">
          <h3>From: {order.restaurantId.name}</h3>
          <p>📍 {order.restaurantId.location}</p>
        </div>

        <div className="order-items-section">
          <h3>Order Items</h3>
          {order.items.map((item, index) => (
            <div key={index} className="order-item-detail">
              <img src={item.menuItem.image} alt={item.menuItem.name} />
              <div className="item-info">
                <h4>{item.menuItem.name}</h4>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className="item-price">
                Rs.{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="order-delivery-info">
          <h3>Delivery Address</h3>
          <p>{order.deliveryAddress.hostel}, Room {order.deliveryAddress.room}</p>
          <p>{order.deliveryAddress.campus}</p>
          {order.deliveryAddress.instructions && (
            <p className="instructions">
              <strong>Instructions:</strong> {order.deliveryAddress.instructions}
            </p>
          )}
        </div>

        <div className="order-payment-info">
          <h3>Payment</h3>
          <p>Method: {order.paymentMethod.toUpperCase()}</p>
          <p>Status: {formatStatus(order.paymentStatus)}</p>
        </div>

        <div className="order-total-section">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>Rs.{order.totalAmount - 50}</span>
          </div>
          <div className="total-row">
            <span>Delivery Fee:</span>
            <span>Rs.50</span>
          </div>
          <div className="total-row grand-total">
            <span>Total:</span>
            <span>Rs.{order.totalAmount}</span>
          </div>
        </div>

        {canCancel && (
          <button 
            onClick={handleCancelOrder} 
            className="btn btn-danger"
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;