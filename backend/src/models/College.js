const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a College Name'],
            unique: true
        },
        address: {
            type: String,
            required: [true, 'Please add an Address'],
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('College', collegeSchema);