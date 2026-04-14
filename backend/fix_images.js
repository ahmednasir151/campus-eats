const mongoose = require('mongoose');
require('dotenv').config();

const MenuItem = require('./models/MenuItem');

const fixImages = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fix Burger
    const burgerResult = await MenuItem.updateOne(
      { name: 'The Classic Double' },
      { $set: { image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' } }
    );
    console.log('Fixed Burger:', burgerResult.modifiedCount);

    // Fix Spring Rolls
    const rollsResult = await MenuItem.updateOne(
      { name: 'Crispy Spring Rolls' },
      { $set: { image: 'https://images.unsplash.com/photo-1544025162-811114bd4b13?auto=format&fit=crop&q=80&w=400' } }
    );
    console.log('Fixed Spring Rolls:', rollsResult.modifiedCount);

    console.log('Finished updating images.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixImages();
