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
        image: {
            type: String,
            required: [true, 'Please add an image']
        },
        category: {
            type: String,
            enum: ['Breakfast', 'Snacks', 'Beverages', 'Main Course', 'Desserts'],
            default: 'Snacks'
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