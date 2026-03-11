const MenuItem = require("../models/MenuItem");
const Vendor = require("../models/Vendor");

const addMenuItem = async (req, res, next) => {
    try {
        const { name, price, description, isVeg, isAvailable, image } = req.body;
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
            image,
            vendorId: vendorShop._id
        });
        
        res.status(201).json(menuItem);
    } catch (error) {
        next(error);
    }
};

const updateMenuItem = async (req, res, next) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        if (!vendorShop) {
            return res.status(400).json({ message: "No shop found for this vendor." });
        }

        const existingItem = await MenuItem.findById(req.params.id);
        if (!existingItem) {
            return res.status(404).json({ message: "Menu Item not found" });
        }

        if (existingItem.vendorId.toString() !== vendorShop._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this item" });
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: "after" }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        next(error);
    }
};

const deleteMenuItem = async (req, res, next) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        if (!vendorShop) {
            return res.status(400).json({ message: "No shop found for this vendor." });
        }

        const menuItem = await MenuItem.findOne(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        if (menuItem.vendorId.toString() !== vendorShop._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this item" });
        }

        await MenuItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Menu item deleted successfully" });    
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

const getTrendingItems = async (req, res) => {
    try {
        const campusVendors = await Vendor.find({ collegeId: req.user.college }).select('_id');

        const vendorIds = campusVendors.map(vendor => vendor._id);
        const trendingItems = await MenuItem.find({ vendorId: { $in: vendorIds } })
            .populate('vendorId', 'name')
            .limit(8);

        res.status(200).json(trendingItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addMenuItem, updateMenuItem, getMenuItemsByVendor, getTrendingItems, deleteMenuItem };