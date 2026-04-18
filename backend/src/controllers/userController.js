const User = require('../models/User');
const Order = require('../models/Order');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        
        const ordersAgg = await Order.aggregate([
            {
                $match: { 
                    status: { $in: ['COMPLETED', 'Completed', 'completed'] }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    totalSpent: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            }
        ]);
        
        const userStats = new Map();
        ordersAgg.forEach(stat => {
            userStats.set(stat._id.toString(), {
                spent: stat.totalSpent,
                orders: stat.orderCount
            });
        });
        
        const usersWithStats = users.map(user => {
            const stats = userStats.get(user._id.toString()) || { spent: 0, orders: 0 };
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                orders: stats.orders,
                spent: stats.spent,
                joined: user.createdAt.toISOString().split('T')[0],
                blocked: user.blocked || false
            };
        });
        
        res.json(usersWithStats);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
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