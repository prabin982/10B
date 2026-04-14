const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('Shoes', 'Clothing', 'Accessories'),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sizes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['/uploads/default_product.jpg'],
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    trending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Product;
