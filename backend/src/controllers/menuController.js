const MenuItem = require("../models/MenuItem");
const Vendor = require("../models/Vendor");

const addMenuItem = async (req, res, next) => {
    try {
        const { name, price, description, isVeg, isAvailable } = req.body;
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });

        if (!vendorShop) {
            return res.status(400).json({ message: "No shop found for this vendor. Please create a shop first" });
        }

        const menuItem = await MenuItem.create({
            name,
            price,
            description,
            isVeg,
            isAvailable,
            vendorId: vendorShop._id
        });
        
        res.status(201).json(menuItem);
    } catch (error) {
        next(error);
    }
};

const getMenuItemsByVendor = async (req, res, next) => {
    try {
        const vendorId = req.params.vendorId;
        
        if (!vendorId.match(/^[0-9a-fA-F]{24}$/)) {
            const error = new Error('Invalid vendor ID format');
            error.name = 'CastError';
            error.kind = 'ObjectId';
            throw error;
        }

        const menuItems = await MenuItem.find({ vendorId: req.params.vendorId });
        res.status(200).json(menuItems);
    } catch (error) {
        next(error);
    }
};

module.exports = { addMenuItem, getMenuItemsByVendor };