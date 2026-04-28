const User = require("../models/User");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    try {
        const {name, email, password, role, college} = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            logger.warn({
                message: "Register failed - user already exists",
                email,
                requestId: req.id
            });
             return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            college
        });

        if (user) {
            logger.info({
                message: "User registered successfully",
                userId: user._id,
                email,
                requestId: req.id
            });
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            logger.warn({
                message: "Register failed - invalid data",
                email,
                requestId: req.id
            });
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        throw error;
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            logger.info({
                message: "Login success",
                userId: user._id,
                email,
                requestId: req.id
            });
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            logger.warn({
                message: "Login failed - invalid credentials",
                email,
                requestId: req.id
            });
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        throw error;
    }
};

const getMe = async (req, res) => {
    res.status(200).json(req.user);
}

const updateProfile = async (req, res) => {
    try {
        const { name, phone, department, hostel } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            logger.warn({
                message: "Update profile failed - user not found",
                userId: req.user._id,
                requestId: req.id
            });
            return res.status(404).json({ message: "User not found" });
        }
        
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (department) user.department = department;
        if (hostel) user.hostel = hostel;
        
        await user.save();

        logger.info({
            message: "Profile updated",
            userId: user._id,
            requestId: req.id
        });

         res.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                department: user.department,
                hostel: user.hostel
            }
        });
    } catch (error) {
        throw error;
    }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };