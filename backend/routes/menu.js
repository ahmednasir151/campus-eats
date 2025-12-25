const express = require('express');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { auth, isRestaurant } = require('../middleware/auth');

const router = express.Router();

router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const items = await MenuItem.find({ 
      restaurantId: req.params.restaurantId,
      isAvailable: true 
    }).sort('category');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurantId');
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu item', error: error.message });
  }
});

router.post('/', auth, isRestaurant, async (req, res) => {
  try {
    const { restaurantId } = req.body;
    
    const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: req.userId });
    if (!restaurant) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create menu item', error: error.message });
  }
});

router.put('/:id', auth, isRestaurant, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findOne({ _id: item.restaurantId, ownerId: req.userId });
    if (!restaurant) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
});

router.delete('/:id', auth, isRestaurant, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findOne({ _id: item.restaurantId, ownerId: req.userId });
    if (!restaurant) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
});

module.exports = router;