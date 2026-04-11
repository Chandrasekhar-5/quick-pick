const Order = require('../models/Order');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [totalOrders, totalRevenue, totalUsers, activeVendors, activeOrders, todayOrders] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
            User.countDocuments({ role: 'student' }),
            Vendor.countDocuments({ isOpen: true }),
            Order.countDocuments({ status: { $in: ['PENDING', 'PREPARING', 'READY'] } }),
            Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } })
        ]);

        res.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalUsers,
            activeVendors,
            activeOrders,
            todayOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRevenueData = async (req, res) => {
    try {
        const revenueByMonth = await Order.aggregate([
            {
                $match: { status: 'COMPLETED' }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const result = months.map((month, index) => ({
            month,
            revenue: revenueByMonth.find(r => r._id === index + 1)?.revenue || 0
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrdersPerDay = async (req, res) => {
    try {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = days.map(day => ({ day, orders: 0 }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTopVendors = async (req, res) => {
    try {
        const topVendors = await Order.aggregate([
            {
                $match: { status: 'COMPLETED' }
            },
            {
                $group: {
                    _id: '$vendorId',
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'vendors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'vendor'
                }
            },
            { $unwind: '$vendor' },
            {
                $project: {
                    name: '$vendor.name',
                    revenue: 1,
                    orders: 1
                }
            }
        ]);

        res.json(topVendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .populate('userId', 'name')
            .populate('vendorId', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        const formatted = recentOrders.map(order => ({
            id: order._id,
            student: order.userId?.name || 'Unknown',
            vendor: order.vendorId?.name || 'Unknown',
            items: `${order.items.length} items`,
            total: order.totalAmount,
            status: order.status.toLowerCase(),
            time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getRevenueData, getOrdersPerDay, getTopVendors, getRecentOrders };