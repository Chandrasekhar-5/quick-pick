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
            default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200'
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