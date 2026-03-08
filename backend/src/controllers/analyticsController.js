const Order = require('../models/Order');
const Vendor = require('../models/Vendor');

const getVendorMetrics = async (req, res) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        if (!vendorShop) {
            return res.status(404).json({ message: "No shop found for this vendor" });
        }

        const metrics = await Order.aggregate([
            {
                $match: {
                    vendorId: vendorShop._id,
                    status: "Completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        if (metrics.length === 0) {
            return res.status(200).json({ totalRevenue: 0, totalOrders: 0 });
        }
        res.status(200).json(metrics[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVendorMetrics };