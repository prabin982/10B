const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create new order
// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = await Order.create({
            userId: req.user.id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        res.status(201).json({ ...order.toJSON(), _id: order.id });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
    const orders = await Order.findAll({ 
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
    });
    
    const transformedOrders = orders.map(o => ({
        ...o.toJSON(),
        _id: o.id
    }));
    
    res.json(transformedOrders);
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
router.get('/', protect, admin, async (req, res) => {
    const orders = await Order.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        order: [['createdAt', 'DESC']]
    });
    
    const transformedOrders = orders.map(o => ({
        ...o.toJSON(),
        _id: o.id
    }));
    
    res.json(transformedOrders);
});

module.exports = router;
