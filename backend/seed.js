const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const sampleData = {
  users: [
    {
      name: 'Ahmed Student',
      email: 'student@campus.com',
      password: 'password123',
      role: 'student',
      phone: '03001234567',
      address: {
        hostel: 'North Hostel',
        room: '301',
        campus: 'Main Campus'
      }
    },
    {
      name: 'Cafe Owner',
      email: 'cafe@campus.com',
      password: 'password123',
      role: 'restaurant',
      phone: '03007654321'
    },
    {
      name: 'Pizza Owner',
      email: 'pizza@campus.com',
      password: 'password123',
      role: 'restaurant',
      phone: '03009876543'
    },
    {
      name: 'Dhaba Owner',
      email: 'dhaba@campus.com',
      password: 'password123',
      role: 'restaurant',
      phone: '03001111111'
    },
    {
      name: 'Chinese Owner',
      email: 'chinese@campus.com',
      password: 'password123',
      role: 'restaurant',
      phone: '03002222222'
    },
    {
      name: 'Dessert Owner',
      email: 'dessert@campus.com',
      password: 'password123',
      role: 'restaurant',
      phone: '03003333333'
    }
  ],
  restaurants: [
    {
      name: 'Campus Cafe',
      description: 'Your favorite campus hangout spot serving fresh food daily',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      cuisine: ['Fast Food', 'Pakistani', 'Beverages'],
      location: 'Main Campus, Near Library',
      rating: 4.5,
      deliveryTime: '20-30 mins',
      minimumOrder: 200,
      isOpen: true
    },
    {
      name: 'Pizza Paradise',
      description: 'Authentic Italian pizzas with the best toppings',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
      cuisine: ['Italian', 'Fast Food'],
      location: 'Main Campus, Food Court',
      rating: 4.7,
      deliveryTime: '30-40 mins',
      minimumOrder: 300,
      isOpen: true
    },
    {
      name: 'Desi Dhaba',
      description: 'Traditional Pakistani cuisine that feels like home',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
      cuisine: ['Pakistani', 'Desi'],
      location: 'North Campus',
      rating: 4.3,
      deliveryTime: '25-35 mins',
      minimumOrder: 250,
      isOpen: true
    },
    {
      name: 'Dragon Wok',
      description: 'Authentic Chinese cuisine with bold flavors',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e',
      cuisine: ['Chinese', 'Asian'],
      location: 'East Campus',
      rating: 4.6,
      deliveryTime: '30-40 mins',
      minimumOrder: 350,
      isOpen: true
    },
    {
      name: 'Sweet Treats',
      description: 'Delicious desserts and sweet delights',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
      cuisine: ['Desserts', 'Bakery'],
      location: 'Main Campus',
      rating: 4.8,
      deliveryTime: '15-25 mins',
      minimumOrder: 150,
      isOpen: true
    }
  ],
  menuItems: [
    {
      name: 'Chicken Burger',
      description: 'Juicy grilled chicken with fresh veggies and special sauce',
      price: 350,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      isVegetarian: false,
      spicyLevel: 1
    },
    {
      name: 'Fries',
      description: 'Crispy golden french fries',
      price: 150,
      category: 'snack',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Chocolate Shake',
      description: 'Rich and creamy chocolate milkshake',
      price: 200,
      category: 'beverage',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Club Sandwich',
      description: 'Triple decker sandwich with chicken, cheese, and bacon',
      price: 400,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
      isVegetarian: false,
      spicyLevel: 0
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 800,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Loaded with pepperoni and extra cheese',
      price: 950,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
      isVegetarian: false,
      spicyLevel: 1
    },
    {
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter and herbs',
      price: 250,
      category: 'appetizer',
      image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice with tender chicken pieces',
      price: 450,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
      isVegetarian: false,
      spicyLevel: 2
    },
    {
      name: 'Chicken Karahi',
      description: 'Spicy chicken cooked in traditional karahi style',
      price: 600,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
      isVegetarian: false,
      spicyLevel: 3
    },
    {
      name: 'Aloo Samosa',
      description: 'crispy fried pastry filled with spiced mashed potatoes',
      price: 40,
      category: 'snack',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Gulab Jamun',
      description: 'Sweet milk-solid dumplings in sugar syrup',
      price: 150,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Chicken Chow Mein',
      description: 'Stir-fried noodles with chicken and vegetables',
      price: 500,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841',
      isVegetarian: false,
      spicyLevel: 2
    },
    {
      name: 'Fried Rice',
      description: 'Egg fried rice with mixed vegetables',
      price: 350,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
      isVegetarian: false,
      spicyLevel: 1
    },
    {
      name: 'Spring Rolls',
      description: 'Crispy vegetable spring rolls with sweet chili sauce',
      price: 250,
      category: 'appetizer',
      image: 'https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Chocolate Cake',
      description: 'Rich chocolate layer cake with ganache',
      price: 400,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake',
      price: 450,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=1000',
      isVegetarian: true,
      spicyLevel: 0
    },
    {
      name: 'Ice Cream Sundae',
      description: 'Three scoops with toppings and sauce',
      price: 300,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
      isVegetarian: true,
      spicyLevel: 0
    }
  ]
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-eats');
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('  Cleared existing data');

    const createdUsers = [];
    for (const userData of sampleData.users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('👥 Created users');

    const createdRestaurants = [];
    const restaurantOwners = createdUsers.filter(u => u.role === 'restaurant');

    for (let i = 0; i < sampleData.restaurants.length; i++) {
      const restaurant = new Restaurant({
        ...sampleData.restaurants[i],
        ownerId: restaurantOwners[i]._id
      });
      await restaurant.save();
      createdRestaurants.push(restaurant);

      await User.findByIdAndUpdate(restaurantOwners[i]._id, {
        restaurantId: restaurant._id
      });
    }
    console.log(' Created restaurants');

    const menuItemsPerRestaurant = [
      [0, 1, 2, 3],
      [4, 5, 6],
      [7, 8, 9, 10],
      [11, 12, 13],
      [14, 15, 16]
    ];

    for (let i = 0; i < menuItemsPerRestaurant.length; i++) {
      const itemIndices = menuItemsPerRestaurant[i];
      for (const idx of itemIndices) {
        const menuItem = new MenuItem({
          ...sampleData.menuItems[idx],
          restaurantId: createdRestaurants[i]._id
        });
        await menuItem.save();
      }
    }
    console.log('Created menu items');

    console.log(' Database seeded successfully!\n');
    console.log(' Login credentials:');
    console.log('   Student: student@campus.com / password123');
    console.log('   Campus Cafe: cafe@campus.com / password123');
    console.log('   Pizza Paradise: pizza@campus.com / password123');
    console.log('   Desi Dhaba: dhaba@campus.com / password123');
    console.log('   Dragon Wok: chinese@campus.com / password123');
    console.log('   Sweet Treats: dessert@campus.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();