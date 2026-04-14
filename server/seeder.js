const { connectDB, sequelize } = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
    {
        name: 'Apex Speed Runner',
        description: 'Engineered for maximum velocity and comfort. Featuring the 10B cloud-foam technology for a weightless experience.',
        category: 'Shoes',
        price: 189.99,
        stock: 50,
        sizes: ['7', '8', '9', '10', '11'],
        featured: true,
        trending: true,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff']
    },
    {
        name: 'Midnight Stealth Jacket',
        description: 'Weather-resistant and incredibly stylish. The perfect companion for urban explorers.',
        category: 'Clothing',
        price: 129.99,
        stock: 30,
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true,
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea']
    },
    {
        name: 'Quantum Knit Tee',
        description: 'Breathable premium cotton with a minimalist 10B logo. Everyday comfort, redefined.',
        category: 'Clothing',
        price: 45.00,
        stock: 100,
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518']
    },
    {
        name: 'Infinity Bound Sneaker',
        description: 'A fusion of basketball heritage and modern street style. Bold, heavy, and iconic.',
        category: 'Shoes',
        price: 210.00,
        stock: 25,
        sizes: ['8', '9', '10', '11', '12'],
        trending: true,
        images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa']
    }
];

const importData = async () => {
    try {
        await connectDB();
        
        // Clear existing products
        await Product.destroy({ where: {}, truncate: { cascade: true } });
        
        await Product.bulkCreate(products);
        
        console.log('Data Imported successfully into PostgreSQL!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
