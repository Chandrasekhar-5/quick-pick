const Wallet = require('../models/Wallet');
const User = require('../models/User');

const getAllTransactions = async (req, res) => {
    try {
        const wallets = await Wallet.find().populate('userId', 'name email');
        
        const allTransactions = [];
        wallets.forEach(wallet => {
            wallet.transactions.forEach(t => {
                allTransactions.push({
                    id: t._id,
                    user: wallet.userId?.name || 'Unknown',
                    type: t.type,
                    amount: t.amount,
                    date: t.createdAt,
                    status: 'completed'
                });
            });
        });
        
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        res.json(allTransactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWalletStats = async (req, res) => {
    try {
        const wallets = await Wallet.find();
        
        const totalPayments = wallets.reduce((sum, w) => {
            const payments = w.transactions.filter(t => t.type === 'debit');
            return sum + payments.reduce((s, t) => s + t.amount, 0);
        }, 0);
        
        const totalRefunds = wallets.reduce((sum, w) => {
            const refunds = w.transactions.filter(t => t.description?.includes('refund'));
            return sum + refunds.reduce((s, t) => s + t.amount, 0);
        }, 0);
        
        const totalTopups = wallets.reduce((sum, w) => {
            const topups = w.transactions.filter(t => t.type === 'credit');
            return sum + topups.reduce((s, t) => s + t.amount, 0);
        }, 0);
        
        res.json({ totalPayments, totalRefunds, totalTopups });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllTransactions, getWalletStats };