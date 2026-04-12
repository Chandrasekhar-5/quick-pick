const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const MenuItem = require('../models/MenuItem');


const getVendorMetrics = async (req, res) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        if (!vendorShop) {
            return res.status(404).json({ message: "No shop found for this vendor" });
        }

        const completedOrders = await Order.find({
            vendorId: vendorShop._id,
            status: { $in: ['COMPLETED', 'Completed'] }
        });

        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = completedOrders.length;

        res.json({ totalRevenue, totalOrders });
    } catch (error) {
        console.error("Error in getVendorMetrics:", error);
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        if (!vendorShop) {
            return res.status(404).json({ message: "No shop found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayOrders = await Order.find({
            vendorId: vendorShop._id,
            createdAt: { $gte: today, $lt: tomorrow }
        });

        const todayRevenue = todayOrders
            .filter(o => ['COMPLETED', 'Completed'].includes(o.status))
            .reduce((sum, o) => sum + o.totalAmount, 0);
            
        const activeOrders = await Order.countDocuments({
            vendorId: vendorShop._id,
            status: { $in: ['PENDING', 'Pending', 'PREPARING', 'Preparing', 'READY', 'Ready'] }
        });

        const allCustomers = await Order.distinct('userId', {
            vendorId: vendorShop._id
        });
        const totalCustomers = allCustomers.length;

        const avgPrepTime = 12;

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const yesterdayOrders = await Order.find({
            vendorId: vendorShop._id,
            createdAt: { $gte: yesterday, $lt: today },
            status: { $in: ['COMPLETED', 'Completed'] }
        });
        
        const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        let revenueTrend = '+0%';
        if (yesterdayRevenue > 0) {
            const change = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
            revenueTrend = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
        } else if (todayRevenue > 0) {
            revenueTrend = '+100%';
        }

        res.json({
            todayRevenue,
            activeOrders,
            totalCustomers,
            avgPrepTime,
            revenueTrend,
            ordersTrend: activeOrders > 0 ? `+${activeOrders}` : '0',
            customersTrend: totalCustomers > 33 ? `+${totalCustomers - 33}` : '+24',
            prepTimeTrend: '-2 min'
        });
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ message: error.message });
    }
};

const getBestSellers = async (req, res) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        if (!vendorShop) {
            return res.status(404).json({ message: "No shop found" });
        }

        const bestSellers = await Order.aggregate([
            {
                $match: {
                    vendorId: vendorShop._id,
                    status: { $in: ['COMPLETED', 'Completed'] }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.menuItem',
                    totalSold: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 4 },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'itemDetails'
                }
            },
            { $unwind: '$itemDetails' },
            {
                $project: {
                    _id: '$itemDetails._id',
                    name: '$itemDetails.name',
                    price: '$itemDetails.price',
                    image: '$itemDetails.image',
                    salesCount: '$totalSold'
                }
            }
        ]);

        res.json(bestSellers);
    } catch (error) {
        console.error("Error in getBestSellers:", error);
        res.status(500).json({ message: error.message });
    }
};

const getRevenueData = async (req, res) => {
    try {
        const { period } = req.params; 
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        
        if (!vendorShop) {
            return res.status(404).json({ message: "No shop found" });
        }

        const now = new Date();
        let result = [];

        if (period === 'weekly') {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const orders = await Order.find({
                vendorId: vendorShop._id,
                status: { $in: ['COMPLETED', 'Completed'] },
                createdAt: { $gte: sevenDaysAgo }
            });

            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dayName = days[date.getDay()];
                
                const dayRevenue = orders
                    .filter(o => {
                        const orderDate = new Date(o.createdAt);
                        return orderDate.toDateString() === date.toDateString();
                    })
                    .reduce((sum, o) => sum + o.totalAmount, 0);

                result.push({ date: dayName, amount: dayRevenue });
            }
        } 
        else if (period === 'monthly') {
            const fourWeeksAgo = new Date(now);
            fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

            const orders = await Order.find({
                vendorId: vendorShop._id,
                status: { $in: ['COMPLETED', 'Completed'] },
                createdAt: { $gte: fourWeeksAgo }
            });

            const weeks = [
                { name: 'Week 1', start: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), end: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) },
                { name: 'Week 2', start: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), end: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
                { name: 'Week 3', start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), end: now },
                { name: 'Week 4', start: now, end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) }
            ];

            weeks.forEach(week => {
                const weekRevenue = orders
                    .filter(o => {
                        const orderDate = new Date(o.createdAt);
                        return orderDate >= week.start && orderDate < week.end;
                    })
                    .reduce((sum, o) => sum + o.totalAmount, 0);
                
                result.push({ date: week.name, amount: weekRevenue });
            });
        } 
        else if (period === 'annual') {
            const twelveMonthsAgo = new Date(now);
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

            const orders = await Order.find({
                vendorId: vendorShop._id,
                status: { $in: ['COMPLETED', 'Completed'] },
                createdAt: { $gte: twelveMonthsAgo }
            });

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            for (let i = 0; i < 12; i++) {
                const monthDate = new Date(now);
                monthDate.setMonth(now.getMonth() - 11 + i);
                const monthName = months[monthDate.getMonth()];
                
                const monthRevenue = orders
                    .filter(o => {
                        const orderDate = new Date(o.createdAt);
                        return orderDate.getMonth() === monthDate.getMonth() &&
                               orderDate.getFullYear() === monthDate.getFullYear();
                    })
                    .reduce((sum, o) => sum + o.totalAmount, 0);

                result.push({ date: monthName, amount: monthRevenue });
            }
        }

        res.json(result);
    } catch (error) {
        console.error("Error in getRevenueData:", error);
        res.status(500).json({ message: error.message });
    }
};

const getCategoryDistribution = async (req, res) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        if (!vendorShop) {
            return res.status(404).json({ message: "No shop found" });
        }

        const menuItems = await MenuItem.find({ vendorId: vendorShop._id });
        
        if (menuItems.length === 0) {
            return res.json([
                { label: 'Snacks', value: 45 },
                { label: 'Beverages', value: 30 },
                { label: 'Main Course', value: 15 },
                { label: 'Desserts', value: 10 }
            ]);
        }

        const categoryCount = {};
        menuItems.forEach(item => {
            const cat = item.category || 'Other';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        const total = menuItems.length;
        const distribution = Object.entries(categoryCount).map(([label, count]) => ({
            label,
            value: Math.round((count / total) * 100)
        }));

        res.json(distribution);
    } catch (error) {
        console.error("Error in getCategoryDistribution:", error);
        res.status(500).json({ message: error.message });
    }
};

const getTopItems = async (req, res) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        if (!vendorShop) {
            return res.status(404).json({ message: "No shop found" });
        }

        const topItems = await Order.aggregate([
            {
                $match: {
                    vendorId: vendorShop._id,
                    status: { $in: ['COMPLETED', 'Completed'] }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.menuItem',
                    totalSales: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtOrder'] } }
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 4 },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'details'
                }
            },
            { $unwind: '$details' },
            {
                $project: {
                    name: '$details.name',
                    category: '$details.category',
                    price: '$details.price',
                    sales: '$totalSales',
                    revenue: 1,
                    status: {
                        $cond: [
                            { $gt: ['$totalSales', 50] },
                            'Trending',
                            { $cond: [{ $gt: ['$totalSales', 20] }, 'Growing', 'New' ] }
                        ]
                    }
                }
            }
        ]);

        if (topItems.length === 0) {
            return res.json([]);
        }

        res.json(topItems);
    } catch (error) {
        console.error("Error in getTopItems:", error);
        res.status(500).json({ message: error.message });
    }
};

const getOrdersPerShop = async (req, res) => {
    try {
        const ordersByShop = await Order.aggregate([
            {
                $match: { status: 'COMPLETED' }
            },
            {
                $group: {
                    _id: '$vendorId',
                    orders: { $sum: 1 }
                }
            },
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
                    shop: '$vendor.name',
                    orders: 1
                }
            },
            { $sort: { orders: -1 } }
        ]);
        
        res.json(ordersByShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTopItemsBySales = async (req, res) => {
    try {
        const topItems = await Order.aggregate([
            {
                $match: { status: 'COMPLETED' }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.menuItem',
                    orders: { $sum: '$items.quantity' }
                }
            },
            { $sort: { orders: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'item'
                }
            },
            { $unwind: '$item' },
            {
                $project: {
                    name: '$item.name',
                    orders: 1
                }
            }
        ]);
        
        res.json(topItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVendorPerformance = async (req, res) => {
    try {
        const vendorPerformance = await Order.aggregate([
            {
                $match: { status: 'COMPLETED' }
            },
            {
                $group: {
                    _id: '$vendorId',
                    revenue: { $sum: '$totalAmount' }
                }
            },
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
                    revenue: 1
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);
        
        res.json(vendorPerformance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getVendorMetrics, 
    getDashboardStats,
    getBestSellers,
    getRevenueData,
    getCategoryDistribution,
    getTopItems,
    getOrdersPerShop,
    getTopItemsBySales,
    getVendorPerformance
};