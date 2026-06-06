import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@remirind.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'Test User',
    email: 'user@test.com',
    password: 'user123',
    isAdmin: false,
  },
];

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    price: 79.99,
    description: 'Premium wireless headphones with noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals.',
    stock: 25,
    featured: true,
  },
  {
    name: 'Slim Fit Cotton T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'Clothing',
    price: 24.99,
    description: 'Classic slim fit cotton t-shirt available in multiple colors. Soft, breathable fabric for all-day comfort.',
    stock: 100,
    featured: true,
  },
  {
    name: 'Stainless Steel Water Bottle',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    category: 'Home & Living',
    price: 34.99,
    description: 'Double-wall insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, 750ml capacity.',
    stock: 60,
    featured: false,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d1c0d78d?w=400',
    category: 'Electronics',
    price: 129.99,
    description: 'RGB mechanical gaming keyboard with Cherry MX switches, programmable keys, and aluminum frame. Built for gamers and typists.',
    stock: 15,
    featured: true,
  },
  {
    name: 'Leather Messenger Bag',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'Accessories',
    price: 89.99,
    description: 'Handcrafted genuine leather messenger bag with padded laptop compartment. Perfect for work or travel, fits up to 15.6" laptops.',
    stock: 20,
    featured: false,
  },
  {
    name: 'Organic Green Tea Set',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    category: 'Food & Drinks',
    price: 29.99,
    description: 'Premium organic green tea collection with 4 varieties. Includes a ceramic teapot and 2 cups. A perfect gift for tea enthusiasts.',
    stock: 40,
    featured: false,
  },
  {
    name: 'Smart Fitness Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics',
    price: 199.99,
    description: 'Advanced fitness smartwatch with heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Water resistant to 50m.',
    stock: 30,
    featured: true,
  },
  {
    name: 'Denim Jacket',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400',
    category: 'Clothing',
    price: 64.99,
    description: 'Classic denim jacket with a modern fit. Features button closure, chest pockets, and adjustable waist tabs. A timeless wardrobe essential.',
    stock: 35,
    featured: false,
  },
  {
    name: 'Scented Soy Candle Set',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'Home & Living',
    price: 39.99,
    description: 'Hand-poured soy candle set with 3 scents: vanilla, lavender, and eucalyptus. Long-burning, eco-friendly, and packaged in reusable glass jars.',
    stock: 50,
    featured: false,
  },
  {
    name: 'Wireless Charging Pad',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400',
    category: 'Electronics',
    price: 19.99,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Slim design with LED indicator and overcharge protection.',
    stock: 80,
    featured: false,
  },
  {
    name: 'Canvas Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: 'Accessories',
    price: 49.99,
    description: 'Durable canvas backpack with multiple compartments, padded straps, and USB charging port. Perfect for daily commute or weekend trips.',
    stock: 45,
    featured: false,
  },
  {
    name: 'Dark Roast Coffee Beans',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400',
    category: 'Food & Drinks',
    price: 18.99,
    description: 'Premium single-origin dark roast coffee beans from Colombia. Rich, bold flavor with notes of chocolate and caramel. 1lb bag, freshly roasted.',
    stock: 70,
    featured: false,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users created`);

    const createdProducts = await Product.create(products);
    console.log(`${createdProducts.length} products created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
