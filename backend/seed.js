const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let owner = await User.findOne({ role: 'restaurant' });
    if (!owner) {
      // Create a dummy owner if doesn't exist
      owner = new User({
        name: 'Jane Doe',
        email: 'jane@restaurants.com',
        password: 'password123', // Doesn't matter, just seeding
        role: 'restaurant'
      });
      await owner.save();
    }
    const ownerId = owner._id;

    console.log('Using Owner ID:', ownerId);

    // Restaurant 1: The Artisan Burger
    const burgerPlace = new Restaurant({
      name: 'The Artisan Burger Co.',
      description: 'Gourmet burgers crafted with premium ingredients and our signature sauce.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
      cuisine: ['Fast Food', 'American', 'Burgers'],
      location: 'West Campus Student Center',
      rating: 4.8,
      deliveryTime: '20-30 mins',
      minimumOrder: 500,
      isOpen: true,
      ownerId
    });
    await burgerPlace.save();
    console.log('Added Restaurant:', burgerPlace.name);

    // Items for Burger Place
    const burgerItems = [
      {
        name: 'The Classic Double',
        description: 'Two smashed beef patties with American cheese, pickles, and our signature spread.',
        price: 850,
        category: 'main',
        restaurantId: burgerPlace._id,
        image: 'https://images.unsplash.com/photo-1594212691516-436f8f6e9750?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Truffle Parmesan Fries',
        description: 'Crispy shoestring fries tossed in white truffle oil and fresh parmesan cheese.',
        price: 450,
        category: 'snack',
        restaurantId: burgerPlace._id,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=400'
      }
    ];
    await MenuItem.insertMany(burgerItems);
    console.log('Added items for The Artisan Burger Co.');

    // Restaurant 2: Wok & Roll
    const wokPlace = new Restaurant({
      name: 'Wok & Roll Authentic',
      description: 'Fast, fresh, and fiery Asian fusion bowls.',
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
      cuisine: ['Chinese', 'Asian Fusion'],
      location: 'East Wing Dining Hall',
      rating: 4.6,
      deliveryTime: '15-25 mins',
      minimumOrder: 400,
      isOpen: true,
      ownerId
    });
    await wokPlace.save();
    console.log('Added Restaurant:', wokPlace.name);

    // Items for Wok Place
    const wokItems = [
      {
        name: 'Spicy Kung Pao Chicken',
        description: 'Classic Sichuan dish with chicken breast, peanuts, vegetables, and chili peppers.',
        price: 750,
        category: 'main',
        restaurantId: wokPlace._id,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400',
        spicyLevel: 2
      },
      {
        name: 'Crispy Spring Rolls',
        description: 'Four pieces of handmade vegetable spring rolls with sweet chili sauce.',
        price: 350,
        category: 'appetizer',
        restaurantId: wokPlace._id,
        image: 'https://images.unsplash.com/photo-1601602758169-d4193551db77?auto=format&fit=crop&q=80&w=400',
        isVegetarian: true
      }
    ];
    await MenuItem.insertMany(wokItems);
    console.log('Added items for Wok & Roll Authentic');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();