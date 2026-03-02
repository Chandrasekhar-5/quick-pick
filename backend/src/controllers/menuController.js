const MenuItem = require("../models/MenuItem");
const Vendor = require("../models/Vendor");

const addMenuItem = async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
};

const getMenuItemsByVendor = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ vendorId: req.params.vendorId });
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addMenuItem, getMenuItemsByVendor };