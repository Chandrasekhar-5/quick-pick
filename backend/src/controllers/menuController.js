const MenuItem = require("../models/MenuItem");
const Vendor = require("../models/Vendor");
const Order = require("../models/Order");


const searchItems = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json({ shops: [], items: [] });
        }
        
        const vendors = await Vendor.find({
            collegeId: req.user.college,
            name: { $regex: q, $options: 'i' }
        });
        
        const items = await MenuItem.find({
            name: { $regex: q, $options: 'i' }
        }).populate('vendorId', 'name image');
        
        res.json({ shops: vendors, items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

        const menuItem = await MenuItem.findById(req.params.id);
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

        const trendingItems = await Order.aggregate([
            {
                $match: {
                    vendorId: { $in: vendorIds },
                    status: { $in: ['COMPLETED', 'completed', 'Completed'] }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.menuItem',
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
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
                $lookup: {
                    from: 'vendors',
                    localField: 'itemDetails.vendorId',
                    foreignField: '_id',
                    as: 'vendorDetails'
                }
            },
            { $unwind: '$vendorDetails' },
            {
                $project: {
                    _id: '$itemDetails._id',
                    name: '$itemDetails.name',
                    price: '$itemDetails.price',
                    image: '$itemDetails.image',
                    isVeg: '$itemDetails.isVeg',
                    vendorId: '$vendorDetails._id',
                    vendorName: '$vendorDetails.name',
                    totalSold: '$totalQuantity'
                }
            }
        ]);

        res.status(200).json(trendingItems);
    } catch (error) {
        console.error("Error in getTrendingItems:", error);
        res.status(500).json({ message: error.message });
    }
};

const getAllMenuItemsForAdmin = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().populate('vendorId', 'name');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayOrders = await Order.find({
            status: { $in: ['COMPLETED', 'Completed', 'completed'] },
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        const soldCountMap = new Map();
        todayOrders.forEach(order => {
            order.items.forEach(item => {
                const menuItemId = item.menuItem.toString();
                const currentCount = soldCountMap.get(menuItemId) || 0;
                soldCountMap.set(menuItemId, currentCount + item.quantity);
            });
        });
        
        const allOrders = await Order.find({
            status: { $in: ['COMPLETED', 'Completed', 'completed'] }
        });
        
        const totalSoldMap = new Map();
        allOrders.forEach(order => {
            order.items.forEach(item => {
                const menuItemId = item.menuItem.toString();
                const currentCount = totalSoldMap.get(menuItemId) || 0;
                totalSoldMap.set(menuItemId, currentCount + item.quantity);
            });
        });
        
        const formatted = menuItems.map(item => {
            const soldToday = soldCountMap.get(item._id.toString()) || 0;
            const totalSold = totalSoldMap.get(item._id.toString()) || 0;
            
            let popularity = 'low';
            if (totalSold > 500) popularity = 'top_seller';
            else if (totalSold > 100) popularity = 'popular';
            
            let status = 'active';
            if (!item.isAvailable) status = 'out_of_stock';
            else if (soldToday >= 20) status = 'slot_full';
            
            return {
                id: item._id,
                name: item.name,
                vendor: item.vendorId?.name || 'Unknown',
                price: item.price,
                category: item.category || 'General',
                soldToday,
                totalSold,
                limitPerSlot: 20,
                remaining: Math.max(0, 20 - soldToday),
                status,
                popularity
            };
        });
        
        res.json(formatted);
    } catch (error) {
        console.error("Error in getAllMenuItemsForAdmin:", error);
        res.status(500).json({ message: error.message });
    }
};


const updateMenuItemByAdmin = async (req, res) => {
    try {
        const { status, limitPerSlot, price, name, category, isAvailable } = req.body;
        const item = await MenuItem.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        if (price) item.price = price;
        if (name) item.name = name;
        if (category) item.category = category;
        if (isAvailable !== undefined) item.isAvailable = isAvailable;
        
        await item.save();
        
        res.json({ message: 'Menu item updated', item });
    } catch (error) {
        console.error("Error in updateMenuItemByAdmin:", error);
        res.status(500).json({ message: error.message });
    }
};

const deleteMenuItemByAdmin = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        await item.deleteOne();
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { searchItems, addMenuItem, updateMenuItem, getMenuItemsByVendor, getTrendingItems, deleteMenuItem, getAllMenuItemsForAdmin, updateMenuItemByAdmin, deleteMenuItemByAdmin };