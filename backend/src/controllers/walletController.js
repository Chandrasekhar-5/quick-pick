const Wallet = require('../models/Wallet');

const getWallet = async (req, res) => {
    try {
        let wallet = await Wallet.findOne({ userId: req.user._id });
        
        if (!wallet) {
            wallet = await Wallet.create({
                userId: req.user._id,
                balance: 0,
                transactions: []
            });
        }
        
        res.json({
            balance: wallet.balance,
            transactions: wallet.transactions.sort((a, b) => b.createdAt - a.createdAt)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        
        let wallet = await Wallet.findOne({ userId: req.user._id });
        
        if (!wallet) {
            wallet = await Wallet.create({
                userId: req.user._id,
                balance: 0,
                transactions: []
            });
        }
        
        wallet.balance += amount;
        wallet.transactions.push({
            type: 'credit',
            amount,
            description: `Added funds to wallet`
        });
        
        await wallet.save();
        
        res.json({
            balance: wallet.balance,
            message: 'Funds added successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deductFunds = async (req, res) => {
    try {
        const { amount, orderId, description } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        
        let wallet = await Wallet.findOne({ userId: req.user._id });
        
        if (!wallet) {
            return res.status(400).json({ message: 'Wallet not found' });
        }
        
        if (wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        
        wallet.balance -= amount;
        wallet.transactions.push({
            type: 'debit',
            amount,
            description: description || 'Payment for order',
            orderId: orderId
        });
        
        await wallet.save();
        
        res.json({
            balance: wallet.balance,
            message: 'Payment successful'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWallet, addFunds, deductFunds };