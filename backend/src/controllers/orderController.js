const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Vendor = require('../models/Vendor');

const placeOrder = async (req, res) => {
    try {
        const {vendorId, items } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
        const dbItem = await MenuItem.findById(item.menuItem);

             if (!dbItem) {
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

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
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

        const orders = await Order.find({ vendorId: vendorShop._id })
               .populate('userId', 'name email')
               .populate('items.menuItem', 'name price')
               .sort({ createdAt: -1 });

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
            return res.status(400).json({ message: 'Order not found' });
        }

        if (order.vendorId.toString() !== vendorShop._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getMyOrders, getVendorOrders, updateOrderStatus };