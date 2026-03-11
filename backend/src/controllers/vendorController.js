const Vendor = require("../models/Vendor");

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

const updateVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this vendor" });
        }

        const updateVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json(updateVendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createVendor, getVendors, getVendorByOwner, getVendorById, updateVendor };