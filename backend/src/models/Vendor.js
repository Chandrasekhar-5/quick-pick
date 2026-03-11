const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a vendor name']
        },
        description: {
            type: String
        },
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number']
        },
        openingTime: {
            type: String,
            default: '8:00 AM'
        },
        closingTime: {
            type: String,
            default: '5:00 PM'
        },
        logo: {
            type: String,
            default: 'https://www.freeiconspng.com/uploads/no-image-icon-9.png'
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        isOpen: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);