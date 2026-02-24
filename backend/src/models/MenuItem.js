const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add an item name']
        },
        price: {
            type: Number,
            required: [true, 'Please add price']
        },
        description: {
            type: String,
            required: [true, 'Please add description']
        },
        isVeg: {
            type: Boolean,
            default: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);