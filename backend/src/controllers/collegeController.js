const College = require("../models/College");

const createCollege = async (req, res) => {
    try {
        const { name, address } = req.body;

        const collegeExists = College.findOne({ name });
        if (collegeExists) {
            return res.status(400).json({ message: "College already exists" });
        }

        const college = new College({
            name,
            address
        });
        await college.save();

        res.status(201).json(college);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}