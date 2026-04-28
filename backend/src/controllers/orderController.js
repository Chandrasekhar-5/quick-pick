const logger = require("../config/logger");

const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Vendor = require('../models/Vendor');

const placeOrder = async (req, res) => {
    try {
        const {vendorId, items } = req.body;
        
        if (!items || items.length === 0) {

            logger.warn({
                message: "Order failed - empty items",
                userId: req.user._id,
                requestId: req.id
            });

            return res.status(400).json({ message: 'No order items provided' });
        }

        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const dbItem = await MenuItem.findById(item.menuItem);

            if (!dbItem) {

                logger.warn({
                    message: "Order failed - menu item not found",
                    menuItemId: item.menuItem,
                    userId: req.user._id,
                    requestId: req.id
                });

                return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
            }

            processedItems.push({
                menuItem: item.menuItem,
                quantity: item.quantity,
                priceAtOrder: dbItem.price,
            });

            totalAmount += dbItem.price * item.quantity;
        }

        const order = await Order.create({
            userId: req.user._id,
            vendorId,
            items: processedItems,
            totalAmount,
        });

        logger.info({
            message: "Order placed successfully",
            orderId: order._id,
            userId: req.user._id,
            vendorId,
            totalAmount,
            requestId: req.id
        });

        res.status(201).json(order);

    } catch (error) {
        throw error;
    }
};

const getMyOrders = async (req, res) => {
    try {
        const order = await Order.find({ userId: req.user._id })
            .populate('vendorId', 'name')
            .populate('items.menuItem', 'name isVeg');
    
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVendorOrders = async (req, res) => {
    try {
        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });

        if (!vendorShop) {
            return res.status(400).json({ message: 'No shop found for this vendor' });
        }

        const limit = req.query.limit ? parseInt(req.query.limit) : 100;
        
        const orders = await Order.find({ vendorId: vendorShop._id })
            .populate('userId', 'name email')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 }) 
            .limit(limit); 

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const vendorShop = await Vendor.findOne({ ownerId: req.user._id });
        const order = await Order.findById(orderId);

        if (!order) {

            logger.warn({
                message: "Update order failed - order not found",
                orderId,
                userId: req.user._id,
                requestId: req.id
            });

            return res.status(400).json({ message: 'Order not found' });
        }

        if (order.vendorId.toString() !== vendorShop._id.toString()) {

            logger.warn({
                message: "Update order failed - unauthorized",
                orderId,
                userId: req.user._id,
                requestId: req.id
            });

            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        logger.info({
            message: "Order status updated",
            orderId,
            status,
            userId: req.user._id,
            requestId: req.id
        });

        res.status(200).json(updatedOrder);

    } catch (error) {
        throw error;
    }
};

const getOrderStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayOrders = await Order.find({
            userId: req.user._id,
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        const readyOrders = await Order.countDocuments({
            userId: req.user._id,
            status: 'READY'
        });
        
        const nextOrder = await Order.findOne({
            userId: req.user._id,
            status: { $in: ['PENDING', 'PREPARING', 'READY'] }
        }).sort({ pickupSlot: 1 });
        
        res.json({
            todayOrders: todayOrders.length,
            readyOrders,
            nextPickup: nextOrder?.pickupSlot || null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { vendorId } = req.params;
        
        const slots = [];
        for (let hour = 12; hour <= 21; hour++) {
            for (let min = 0; min < 60; min += 30) {
                if (hour === 21 && min === 30) break;
                
                const startHour = hour % 12 || 12;
                const startTime = `${startHour}:${min.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
                const endMin = min + 30;
                const endHour = hour + (endMin >= 60 ? 1 : 0);
                const endHourFormatted = endHour % 12 || 12;
                const endMinFormatted = (endMin % 60).toString().padStart(2, '0');
                const endTime = `${endHourFormatted}:${endMinFormatted} ${endHour >= 12 ? 'PM' : 'AM'}`;
                
                const slotTime = `${startTime} - ${endTime}`;
                
                const slotOrders = await Order.countDocuments({
                    vendorId,
                    pickupSlot: slotTime,
                    status: { $nin: ['CANCELLED', 'COMPLETED'] }
                });
                
                slots.push({
                    time: slotTime,
                    capacity: 5,
                    current: slotOrders
                });
            }
        }
        
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('vendorId', 'name phone image')
            .populate('items.menuItem', 'name price image isVeg');
            
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (order.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 50 } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.status = status.toUpperCase();
        }
        
        if (search) {
            query.$or = [
                { _id: { $regex: search, $options: 'i' } },
                { 'userId.name': { $regex: search, $options: 'i' } }
            ];
        }
        
        const orders = await Order.find(query)
            .populate('userId', 'name email')
            .populate('vendorId', 'name')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Order.countDocuments(query);
        
        const formatted = orders.map(order => ({
            id: order._id,
            student: order.userId?.name || 'Unknown',
            vendor: order.vendorId?.name || 'Unknown',
            items: `${order.items.length} items`,
            total: order.totalAmount,
            status: order.status.toLowerCase(),
            time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        res.json({ orders: formatted, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatusByAdmin = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.status = status.toUpperCase();
        await order.save();
        
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { placeOrder, getMyOrders, getVendorOrders, updateOrderStatus, getOrderStats, getAvailableSlots, getSingleOrder, getAllOrders, updateOrderStatusByAdmin };