const mongoose = require('mongoose');
require('dotenv').config();
const MenuItem = require('./models/MenuItem');

const fixSpringRolls = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const rollsResult = await MenuItem.updateOne(
      { name: 'Crispy Spring Rolls' },
      { $set: { image: '/images/spring-rolls.png' } }
    );
    console.log('Fixed Spring Rolls with local image:', rollsResult.modifiedCount);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixSpringRolls();
