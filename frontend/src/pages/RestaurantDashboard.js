import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyRestaurant, getRestaurantOrders, updateOrderStatus, getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import './RestaurantDashboard.css';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('orders');
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    isVegetarian: false,
    spicyLevel: 0,
    image: ''
  });

  const { data: myRestaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['myRestaurant'],
    queryFn: () => getMyRestaurant().then(res => res.data),
    onError: (error) => {
      console.error('Error fetching restaurant:', error);
    }
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['restaurantOrders'],
    queryFn: () => getRestaurantOrders().then(res => res.data),
    enabled: !!myRestaurant
  });

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['restaurantMenu', myRestaurant?._id],
    queryFn: () => getMenuItems(myRestaurant._id).then(res => res.data),
    enabled: !!myRestaurant
  });

  useEffect(() => {
    console.log('User:', user);
    console.log('My Restaurant:', myRestaurant);
    console.log('Orders:', orders);
    console.log('Menu Items:', menuItems);
  }, [user, myRestaurant, orders, menuItems]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurantOrders']);
    }
  });

  const createMenuMutation = useMutation({
    mutationFn: (data) => createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurantMenu']);
      resetMenuForm();
    }
  });

  const updateMenuMutation = useMutation({
    mutationFn: ({ id, data }) => updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurantMenu']);
      resetMenuForm();
    }
  });

  const deleteMenuMutation = useMutation({
    mutationFn: (id) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurantMenu']);
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const resetMenuForm = () => {
    setMenuForm({
      name: '',
      description: '',
      price: '',
      category: 'main',
      isVegetarian: false,
      spicyLevel: 0,
      image: ''
    });
    setEditingItem(null);
    setShowMenuForm(false);
  };

  const handleMenuSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...menuForm,
      restaurantId: myRestaurant._id,
      price: parseFloat(menuForm.price)
    };

    if (editingItem) {
      updateMenuMutation.mutate({ id: editingItem._id, data });
    } else {
      createMenuMutation.mutate(data);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVegetarian: item.isVegetarian,
      spicyLevel: item.spicyLevel,
      image: item.image
    });
    setShowMenuForm(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuMutation.mutate(id);
    }
  };

  if (restaurantLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!myRestaurant) {
    return (
      <div className="dashboard-page">
        <div className="no-restaurant">
          <h2>No Restaurant Found</h2>
          <p>You need to create a restaurant first or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>{myRestaurant.name} Dashboard</h1>
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={activeTab === 'menu' ? 'active' : ''}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>Incoming Orders</h2>
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orders && orders.length > 0 ? (
            <div className="dashboard-orders">
              {orders.map(order => (
                <div key={order._id} className="dashboard-order-card">
                  <div className="order-card-header">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.userId?.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> {order.userId?.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> {order.deliveryAddress?.hostel}, Room {order.deliveryAddress?.room}</p>
                  </div>

                  <div className="order-items-list">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span>{item.quantity}x {item.menuItem?.name || 'Unknown'}</span>
                        <span>Rs.{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <strong>Total: Rs.{order.totalAmount}</strong>
                  </div>

                  <div className="order-actions">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={order.status === 'delivered' || order.status === 'cancelled'}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders yet</p>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="menu-section">
          <div className="menu-header">
            <h2>Menu Items</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowMenuForm(!showMenuForm)}
            >
              {showMenuForm ? 'Cancel' : '+ Add Item'}
            </button>
          </div>

          {showMenuForm && (
            <form className="menu-form" onSubmit={handleMenuSubmit}>
              <h3>{editingItem ? 'Edit' : 'Add'} Menu Item</h3>
              
              <input
                type="text"
                placeholder="Item Name"
                value={menuForm.name}
                onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                required
              />
              
              <textarea
                placeholder="Description"
                value={menuForm.description}
                onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                rows="3"
              />
              
              <input
                type="number"
                placeholder="Price"
                value={menuForm.price}
                onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                required
                step="0.01"
              />
              
              <select
                value={menuForm.category}
                onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
              >
                <option value="appetizer">Appetizer</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
                <option value="snack">Snack</option>
              </select>
              
              <label>
                <input
                  type="checkbox"
                  checked={menuForm.isVegetarian}
                  onChange={(e) => setMenuForm({...menuForm, isVegetarian: e.target.checked})}
                />
                Vegetarian
              </label>
              
              <label>
                Spicy Level:
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={menuForm.spicyLevel}
                  onChange={(e) => setMenuForm({...menuForm, spicyLevel: parseInt(e.target.value)})}
                />
              </label>
              
              <ImageUpload
                currentImage={menuForm.image}
                onUploadSuccess={(imageUrl) => setMenuForm({...menuForm, image: imageUrl})}
              />
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
                <button type="button" onClick={resetMenuForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {menuLoading ? (
            <p>Loading menu...</p>
          ) : menuItems && menuItems.length > 0 ? (
            <div className="menu-items-grid">
              {menuItems.map(item => (
                <div key={item._id} className="menu-item-dashboard">
                  <img src={item.image} alt={item.name} />
                  <h4>{item.name}</h4>
                  <p>Rs.{item.price}</p>
                  <p className="item-category">{item.category}</p>
                  <div className="item-actions">
                    <button onClick={() => handleEditItem(item)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteItem(item._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No menu items yet. Add your first item!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;