const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { auth, isRestaurant } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, cuisine } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (cuisine) {
      query.cuisine = cuisine;
    }

    const restaurants = await Restaurant.find(query).populate('ownerId', 'name email').sort('-createdAt');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
  }
});

router.get('/my-restaurant', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.userId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurant', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurant', error: error.message });
  }
});

router.post('/', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = new Restaurant({
      ...req.body,
      ownerId: req.userId
    });
    await restaurant.save();
    
    await User.findByIdAndUpdate(req.userId, { restaurantId: restaurant._id });
    
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create restaurant', error: error.message });
  }
});

router.put('/:id', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, ownerId: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    }

    Object.assign(restaurant, req.body);
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update restaurant', error: error.message });
  }
});

router.delete('/:id', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({ _id: req.params.id, ownerId: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete restaurant', error: error.message });
  }
});

module.exports = router;