export const orderData = [
  {
    id: "ORD-7241",
    date: "2024-03-01",
    time: "12:30 PM",
    items: [
      { name: "Classic Chicken Burger", quantity: 1, price: 8.50 },
      { name: "Iced Caramel Macchiato", quantity: 1, price: 4.25 }
    ],
    total: 12.75,
    status: "picked_up",
    pickupSlot: "12:45 PM - 01:00 PM",
    paymentMethod: "Wallet"
  },
  {
    id: "ORD-8102",
    date: "2024-03-01",
    time: "08:15 AM",
    items: [
      { name: "Belgian Waffles", quantity: 1, price: 7.00 }
    ],
    total: 7.00,
    status: "ready",
    pickupSlot: "08:30 AM - 08:45 AM",
    paymentMethod: "Wallet"
  },
  {
    id: "ORD-9055",
    date: "2024-02-28",
    time: "04:20 PM",
    items: [
      { name: "Paneer Tikka Wrap", quantity: 2, price: 6.50 }
    ],
    total: 13.00,
    status: "picked_up",
    pickupSlot: "04:45 PM - 05:00 PM",
    paymentMethod: "Cash"
  }
];

export const walletTransactions = [
  { id: "TXN-001", type: "debit", amount: 12.75, date: "2024-03-01", description: "Order #ORD-7241" },
  { id: "TXN-002", type: "credit", amount: 50.00, date: "2024-02-29", description: "Added via UPI" },
  { id: "TXN-003", type: "debit", amount: 13.00, date: "2024-02-28", description: "Order #ORD-9055" }
];
