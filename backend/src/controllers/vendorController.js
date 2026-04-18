const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

const createVendor = async (req, res) => {
    try {
        const { name, description, phone, openingTime, closingTime, logo, address } = req.body;

        const existingShop = await Vendor.findOne({ ownerId: req.user._id});
        if (existingShop) {
            return res.status(400).json({ message: "You already have a shop" });
        }

        const vendor = await Vendor.create({
            name,
            description,
            phone,
            openingTime,
            closingTime,
            logo,
            address,
            collegeId: req.user.college,
            ownerId: req.user._id
        });
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({ collegeId: req.user.college });
        res.status(200).json(vendors);
    } catch (error) {
        console.log("error fetching vendors:", error);
        res.status(500).json({ message: error.message });
    }
};

const getVendorByOwner = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ ownerId: req.params.ownerId });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const vendor = await Vendor.findOne({ ownerId: req.user._id });
        
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor shop not found' });
        }

        vendor.logo = req.file.path;
        await vendor.save();

        res.json({ 
            message: 'Logo uploaded successfully',
            logoUrl: req.file.path 
        });
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findOneAndUpdate({ ownerId: req.user._id }, req.body, { new: true, runValidators: false} );
        
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllVendorsForAdmin = async (req, res) => {
    try {
        const vendors = await Vendor.find()
            .populate('ownerId', 'name email')
            .populate('collegeId', 'name');
        
        const ordersAgg = await Order.aggregate([
            {
                $match: { 
                    status: { $in: ['COMPLETED', 'Completed', 'completed'] }
                }
            },
            {
                $group: {
                    _id: '$vendorId',
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);
        
        const vendorStats = new Map();
        ordersAgg.forEach(stat => {
            vendorStats.set(stat._id.toString(), {
                revenue: stat.totalRevenue,
                orders: stat.totalOrders
            });
        });
        
        const vendorsWithStats = vendors.map(vendor => {
            const stats = vendorStats.get(vendor._id.toString()) || { revenue: 0, orders: 0 };
            return {
                id: vendor._id,
                name: vendor.name,
                shop: vendor.name,
                revenue: stats.revenue,
                orders: stats.orders,
                rating: 4.5,
                enabled: vendor.isOpen,
                owner: vendor.ownerId?.name,
                email: vendor.ownerId?.email
            };
        });
        
        res.json(vendorsWithStats);
    } catch (error) {
        console.error("Error in getAllVendorsForAdmin:", error);
        res.status(500).json({ message: error.message });
    }
};

const toggleVendorStatus = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        
        vendor.isOpen = !vendor.isOpen;
        await vendor.save();
        
        res.json({ message: `Vendor ${vendor.isOpen ? 'enabled' : 'disabled'} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        
        await vendor.deleteOne();
        res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVendorByAdmin = async (req, res) => {
    try {
        const { name, description, ownerId, collegeId, phone, address } = req.body;
        
        const vendor = await Vendor.create({
            name,
            description,
            ownerId,
            collegeId,
            phone,
            address,
            isOpen: true
        });
        
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createVendor, getVendors, getVendorByOwner, getVendorById, updateVendor, uploadLogo, getAllVendorsForAdmin, toggleVendorStatus, deleteVendor, createVendorByAdmin };