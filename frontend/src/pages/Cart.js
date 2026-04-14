import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal, restaurantId } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    hostel: user?.address?.hostel || '',
    room: user?.address?.room || '',
    campus: user?.address?.campus || '',
    instructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  const deliveryFee = 50;

  const handleAddressChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setCardDetails({ ...cardDetails, [name]: formatted.slice(0, 19) });
    }
    else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.length >= 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` : cleaned;
      setCardDetails({ ...cardDetails, [name]: formatted });
    }
    else if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '');
      setCardDetails({ ...cardDetails, [name]: cleaned.slice(0, 3) });
    }
    else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardName || 
          !cardDetails.expiryDate || !cardDetails.cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    setLoading(true);
    try {
      const orderData = {
        restaurantId,
        items: cart.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotal() + deliveryFee,
        deliveryAddress,
        paymentMethod,
        notes: deliveryAddress.instructions
      };

      const response = await createOrder(orderData);
      clearCart();
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      alert('Failed to place order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page light-theme empty">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is hungry</h2>
          <p>You haven't added any items yet. Let's find you something delicious!</p>
          <button onClick={() => navigate('/restaurants')} className="btn-primary-advanced">
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page light-theme">
      <div className="cart-header-hero">
        <div className="cart-header-content">
          <h1>Complete your order</h1>
          <p>You're just a few steps away from a great meal.</p>
        </div>
      </div>
      
      <div className="cart-layout">
        
        {/* Left Column: Cart Items & Forms */}
        <div className="cart-main-content">
          
          <div className="cart-section">
            <h2 className="section-title">Order Items</h2>
            <div className="cart-items-modern">
              {cart.map(item => (
                <div key={item._id} className="cart-item-card">
                  <div className="item-image">
                    <img src={item.image || '/images/default-food.jpg'} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">Rs.{item.price}</p>
                  </div>
                  
                  <div className="item-actions">
                    <div className="modern-quantity-selector">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    
                    <div className="item-total-price">
                      Rs.{item.price * item.quantity}
                    </div>
                    
                    <button className="btn-icon-remove" onClick={() => removeFromCart(item._id)} title="Remove item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-section">
            <h2 className="section-title">Delivery Details</h2>
            <div className="modern-form-grid">
              <div className="form-group-floating">
                <input type="text" name="campus" id="campus" value={deliveryAddress.campus} onChange={handleAddressChange} required placeholder=" " />
                <label htmlFor="campus">Campus</label>
              </div>
              <div className="form-group-floating">
                <input type="text" name="hostel" id="hostel" value={deliveryAddress.hostel} onChange={handleAddressChange} required placeholder=" " />
                <label htmlFor="hostel">Hostel/Building</label>
              </div>
              <div className="form-group-floating">
                <input type="text" name="room" id="room" value={deliveryAddress.room} onChange={handleAddressChange} required placeholder=" " />
                <label htmlFor="room">Room Number</label>
              </div>
              <div className="form-group-floating full-width">
                <input type="text" name="instructions" id="instructions" value={deliveryAddress.instructions} onChange={handleAddressChange} placeholder=" " />
                <label htmlFor="instructions">Delivery Instructions (Optional)</label>
              </div>
            </div>
          </div>

          <div className="cart-section">
            <h2 className="section-title">Payment Method</h2>
            
            <div className="payment-options">
              <label className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden-radio" />
                <div className="pay-icon">💳</div>
                <span>Credit/Debit Card</span>
              </label>
              
              <label className={`payment-card ${paymentMethod === 'cash' ? 'active' : ''}`}>
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="hidden-radio" />
                <div className="pay-icon">💵</div>
                <span>Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="credit-card-form animate-fade-in">
                <div className="cc-visual">
                  <div className="cc-chip"></div>
                  <div className="cc-number">{cardDetails.cardNumber || '#### #### #### ####'}</div>
                  <div className="cc-meta">
                    <div className="cc-name">{cardDetails.cardName || 'YOUR NAME'}</div>
                    <div className="cc-exp">{cardDetails.expiryDate || 'MM/YY'}</div>
                  </div>
                </div>

                <div className="modern-form-grid">
                  <div className="form-group-floating full-width">
                    <input type="text" name="cardNumber" id="cardNumber" value={cardDetails.cardNumber} onChange={handleCardInputChange} placeholder=" " maxLength="19"/>
                    <label htmlFor="cardNumber">Card Number</label>
                  </div>
                  <div className="form-group-floating full-width">
                    <input type="text" name="cardName" id="cardName" value={cardDetails.cardName} onChange={handleCardInputChange} style={{textTransform: 'uppercase'}} placeholder=" " />
                    <label htmlFor="cardName">Cardholder Name</label>
                  </div>
                  <div className="form-group-floating">
                    <input type="text" name="expiryDate" id="expiryDate" value={cardDetails.expiryDate} onChange={handleCardInputChange} placeholder=" " maxLength="5"/>
                    <label htmlFor="expiryDate">Expiry (MM/YY)</label>
                  </div>
                  <div className="form-group-floating">
                    <input type="password" name="cvv" id="cvv" value={cardDetails.cvv} onChange={handleCardInputChange} placeholder=" " maxLength="3"/>
                    <label htmlFor="cvv">CVV</label>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="cart-sidebar">
          <div className="order-summary-card">
            <h2>Order Summary</h2>
            
            <div className="summary-list">
              <div className="summary-row">
                <span>Subtotal ({cart.length} items)</span>
                <span className="bold">Rs.{getTotal()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className="bold">Rs.{deliveryFee}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span className="bold">Included</span>
              </div>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">Rs.{getTotal() + deliveryFee}</span>
            </div>

            <button 
              className="btn-checkout"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : `Pay Rs.${getTotal() + deliveryFee}`}
            </button>

            <div className="secure-checkout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Secure encrypted checkout
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;