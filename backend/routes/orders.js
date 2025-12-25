const express = require('express');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { auth, isRestaurant } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.userId
    });
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('restaurantId')
      .populate('items.menuItem');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('restaurantId')
      .populate('items.menuItem')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.get('/restaurant-orders', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orders = await Order.find({ restaurantId: restaurant._id })
      .populate('userId', 'name phone address')
      .populate('items.menuItem')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId')
      .populate('userId', 'name phone address')
      .populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId._id.toString() !== req.userId.toString() && req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

router.patch('/:id/status', auth, isRestaurant, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const restaurant = await Restaurant.findOne({ _id: order.restaurantId, ownerId: req.userId });
    if (!restaurant) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.status = status;
    await order.save();
    
    const updatedOrder = await Order.findById(order._id)
      .populate('restaurantId')
      .populate('items.menuItem');
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
});

module.exports = router;