const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['super_admin', 'admin', 'support'],
            default: 'admin'
        },
        permissions: {
            manageUsers: { type: Boolean, default: true },
            manageVendors: { type: Boolean, default: true },
            manageOrders: { type: Boolean, default: true },
            manageSettings: { type: Boolean, default: true },
            viewAnalytics: { type: Boolean, default: true }
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true
        }
    },
    { timestamps: true }
);

adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);