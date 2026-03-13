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
        const vendor = await Vendor.findOne({ ownerId: req.user._id });
        
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                vendor[key] = updates[key];
            }
        });

        await vendor.save();
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createVendor, getVendors, getVendorByOwner, getVendorById, updateVendor, uploadLogo };