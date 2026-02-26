const Vendor = require("../models/Vendor");

const createVendor = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingShop = await Vendor.findOne({ ownerId: req.user._id});
        if (existingShop) {
            return res.status(400).json({ message: "You already have a shop" });
        }

        const vendor = await Vendor.create({
            name,
            description,
            collegeId: req.user.collegeId,
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
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createVendor, getVendors };