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
    }

    const order = await Order.create({
        userId: req.user.id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    });

    // Emit real-time notification to admin
    const io = req.app.get('socketio');
    io.emit('new_order', {
        _id: order.id,
        customerName: req.user.name,
        customerEmail: req.user.email,
        customerPhone: req.user.phone,
        totalPrice,
        itemCount: orderItems.length,
        shippingAddress,
        createdAt: order.createdAt
    });

    res.status(201).json({ ...order.toJSON(), _id: order.id });
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
        include: [{ model: User, attributes: ['id', 'name', 'email', 'phone'] }],
        order: [['createdAt', 'DESC']]
    });
    
    const transformedOrders = orders.map(o => ({
        ...o.toJSON(),
        _id: o.id
    }));
    
    res.json(transformedOrders);
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id
router.put('/:id', protect, admin, async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    
    if (order) {
        order.isDelivered = req.body.isDelivered ?? order.isDelivered;
        order.isPaid = req.body.isPaid ?? order.isPaid;
        
        const updated = await order.save();
        res.json({ ...updated.toJSON(), _id: updated.id });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

module.exports = router;
