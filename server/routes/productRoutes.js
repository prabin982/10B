const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// Helper for Real-time Updates
const emitProductUpdate = (req, type, data) => {
    const io = req.app.get('socketio');
    // Ensure frontend gets _id
    const transformedData = { ...data, _id: data.id };
    io.emit('product_update', { type, data: transformedData });
};

// @desc    Fetch all products
// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let where = {};

        if (category && category !== 'All') {
            where.category = category;
        }

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        const products = await Product.findAll({ 
            where,
            order: [['createdAt', 'DESC']]
        });
        
        // Transform for frontend _id compatibility
        const transformedProducts = products.map(p => ({
            ...p.toJSON(),
            _id: p.id
        }));

        res.json(transformedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.json({ ...product.toJSON(), _id: product.id });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a product
// @route   POST /api/products
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, price, description, category, sizes, stock, images } = req.body;

        const product = await Product.create({
            name,
            price,
            description,
            category,
            sizes,
            stock,
            images,
        });

        emitProductUpdate(req, 'ADD', product.toJSON());
        res.status(201).json({ ...product.toJSON(), _id: product.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.update(req.body);
            emitProductUpdate(req, 'UPDATE', product.toJSON());
            res.json({ ...product.toJSON(), _id: product.id });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            const productId = product.id;
            await product.destroy();
            emitProductUpdate(req, 'DELETE', { id: productId });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
