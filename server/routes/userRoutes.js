const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users (Admin only)
// @route   GET /api/users
router.get('/', protect, admin, async (req, res) => {
    const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'phone', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']]
    });
    
    // Alias ID for frontend
    const transformedUsers = users.map(u => ({
        ...u.toJSON(),
        _id: u.id
    }));
    
    res.json(transformedUsers);
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/users
router.post('/', async (req, res) => {
    const { name, email, phone, password } = req.body;
    
    let userRole = 'user';

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        phone,
        password,
        role: userRole,
    });

    if (user) {
        res.status(201).json({
            _id: user.id, // Aliasing for frontend compatibility
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// @desc    Upgrade user to organizer using secret key
// @route   POST /api/users/upgrade
router.post('/upgrade', protect, async (req, res) => {
    const { secretKey } = req.body;
    
    if (secretKey === 'prabin@1234') {
        const user = await User.findByPk(req.user.id);
        if (user) {
            user.role = 'organizer';
            await user.save();
            res.json({ message: 'Success! You are now an organizer.', role: 'organizer' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } else {
        res.status(401).json({ message: 'Invalid admin secret key' });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
