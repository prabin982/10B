const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    orderItems: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    shippingAddress: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'COD',
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    paidAt: {
        type: DataTypes.DATE,
    },
    isDelivered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deliveredAt: {
        type: DataTypes.DATE,
    },
});

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

module.exports = Order;
