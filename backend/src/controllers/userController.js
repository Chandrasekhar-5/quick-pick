const User = require('../models/User');
const Order = require('../models/Order');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const orders = await Order.find({ userId: user._id });
            const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
            
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                orders: orders.length,
                spent: totalSpent,
                joined: user.createdAt.toISOString().split('T')[0],
                blocked: user.blocked || false
            };
        }));
        
        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleUserBlock = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.blocked = !user.blocked;
        await user.save();
        
        res.json({ message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, toggleUserBlock, deleteUser };