const Order = require('../models/Order');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [totalOrders, totalRevenueAgg, totalUsers, activeVendors, activeOrders, todayOrders] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([
                { 
                    $match: { 
                        status: { $in: ['COMPLETED', 'Completed', 'completed'] }
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            User.countDocuments({ role: 'student' }),
            Vendor.countDocuments({ isOpen: true }),
            Order.countDocuments({ 
                status: { $in: ['PENDING', 'PREPARING', 'READY', 'pending', 'preparing', 'ready', 'Pending', 'Preparing', 'Ready'] }
            }),
            Order.countDocuments({ 
                createdAt: { $gte: today, $lt: tomorrow }
            })
        ]);

        res.json({
            totalOrders,
            totalRevenue: totalRevenueAgg[0]?.total || 0,
            totalUsers,
            activeVendors,
            activeOrders,
            todayOrders
        });
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ message: error.message });
    }
};

const getRevenueData = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        
        const revenueByMonth = await Order.aggregate([
            {
                $match: { 
                    status: { $in: ['COMPLETED', 'Completed', 'completed'] },
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1),
                        $lt: new Date(currentYear + 1, 0, 1)
                    }
                }
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
        console.error("Error in getRevenueData:", error);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        res.json(months.map(month => ({ month, revenue: 0 })));
    }
};

const getOrdersPerDay = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        
        const orders = await Order.find({
            createdAt: { $gte: startOfWeek, $lt: endOfWeek }
        });
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = days.map((day, index) => {
            const dayOrders = orders.filter(order => {
                const orderDay = new Date(order.createdAt).getDay();
                return orderDay === index;
            });
            return { day, orders: dayOrders.length };
        });
        
        res.json(result);
    } catch (error) {
        console.error("Error in getOrdersPerDay:", error);
        res.status(500).json({ message: error.message });
    }
};

const getTopVendors = async (req, res) => {
    try {
        const topVendors = await Order.aggregate([
            {
                $match: { 
                    status: { $in: ['COMPLETED', 'Completed', 'completed'] }
                }
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

        res.json(topVendors.length ? topVendors : []);
    } catch (error) {
        console.error("Error in getTopVendors:", error);
        res.json([]);
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
            id: order._id.toString().slice(-8).toUpperCase(),
            student: order.userId?.name || 'Unknown',
            vendor: order.vendorId?.name || 'Unknown',
            items: `${order.items.length} item${order.items.length !== 1 ? 's' : ''}`,
            total: order.totalAmount,
            status: order.status?.toLowerCase() || 'pending',
            time: new Date(order.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error in getRecentOrders:", error);
        res.json([]);
    }
};

module.exports = { 
    getDashboardStats, 
    getRevenueData, 
    getOrdersPerDay, 
    getTopVendors, 
    getRecentOrders 
};