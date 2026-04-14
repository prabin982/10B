const { connectDB, sequelize } = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const Team = require('./models/Team');

const products = [
    {
        name: 'Apex Speed Runner',
        description: 'Elite footwear designed for peak performance. Featuring 10B cloud-foam technology.',
        category: 'Shoes',
        price: 18000,
        stock: 50,
        sizes: ['7', '8', '9', '10', '11'],
        featured: true,
        trending: true,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff']
    },
    {
        name: 'Midnight Stealth Jacket',
        description: 'Premium weather-resistant tech-wear for the modern explorer.',
        category: 'Clothing',
        price: 12500,
        stock: 30,
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true,
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea']
    }
];

const teamData = [
    {
        name: "Diwas Adhikari",
        role: "CEO & Founder",
        bio: "Driving the global vision of 10B. A visionary entrepreneur leading the brand strategy and elite market expansion.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diwas",
        order: 1
    },
    {
        name: "Prabin Raj Dhungana",
        role: "CTO & Co-Founder",
        bio: "Technological mastermind from Pulchowk Campus. Engineering the high-performance digital infrastructure of 10B.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prabin",
        order: 2
    },
    {
        name: "Dinesh Subedi",
        role: "Finance & Operations",
        bio: "Strategizing financial growth and supply chain excellence to ensure 10B quality reaches every elite enthusiast.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dinesh",
        order: 3
    },
    {
        name: "Samip Benpal",
        role: "Marketing Head",
        bio: "Crafting the digital narrative of 10B, connecting elite footwear with the modern community through storytelling.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samip",
        order: 4
    }
];

const importData = async () => {
    try {
        await connectDB();
        
        await Product.destroy({ where: {}, truncate: { cascade: true } });
        await Team.destroy({ where: {}, truncate: { cascade: true } });
        
        await Product.bulkCreate(products);
        await Team.bulkCreate(teamData);
        
        console.log('Seeded data successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
