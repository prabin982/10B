const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all team members
// @route   GET /api/team
router.get('/', async (req, res) => {
    const team = await Team.findAll({
        order: [['order', 'ASC']]
    });
    res.json(team);
});

// @desc    Update team member
// @route   PUT /api/team/:id
router.put('/:id', protect, admin, async (req, res) => {
    const { name, role, bio, image } = req.body;
    const member = await Team.findByPk(req.params.id);

    if (member) {
        member.name = name || member.name;
        member.role = role || member.role;
        member.bio = bio || member.bio;
        member.image = image || member.image;

        const updatedMember = await member.save();
        res.json(updatedMember);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
});

module.exports = router;
