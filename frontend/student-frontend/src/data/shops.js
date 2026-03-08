export const shops = [
  {
    id: 1,
    name: "Main Canteen",
    rating: 4.2,
    prepTime: "15-20 min",
    isOpen: true,
    image: "https://picsum.photos/seed/canteen/600/400",
    description: "North Indian, South Indian, Chinese",
    location: "Campus Building A",
    categories: ["Breakfast", "Lunch", "Snacks", "Beverages"],
    crowdLevel: "High",
    popularItems: ["Masala Dosa", "Thali Special"],
    phone: "+91 98765 00001"
  },
  {
    id: 2,
    name: "Juice Corner",
    rating: 4.8,
    prepTime: "5-10 min",
    isOpen: true,
    image: "https://picsum.photos/seed/juice/600/400",
    description: "Fresh Juices, Shakes, Smoothies",
    location: "Campus Building B",
    categories: ["Beverages", "Snacks"],
    crowdLevel: "Low",
    popularItems: ["Mango Shake", "Fresh Orange Juice"],
    phone: "+91 98765 00002"
  },
  {
    id: 3,
    name: "Snack Hub",
    rating: 4.5,
    prepTime: "10-15 min",
    isOpen: true,
    image: "https://picsum.photos/seed/snacks/600/400",
    description: "Burgers, Pizzas, Sandwiches",
    location: "Campus Building C",
    categories: ["Snacks", "Beverages"],
    crowdLevel: "Medium",
    popularItems: ["Veg Cheese Burger", "Paneer Pizza"],
    phone: "+91 98765 00003"
  }
];

export const campusLocations = [
  { name: "Campus Building A", lat: 12.9716, lng: 77.5946 },
  { name: "Campus Building B", lat: 12.9720, lng: 77.5950 },
  { name: "Campus Building C", lat: 12.9710, lng: 77.5940 },
  { name: "Library Plaza", lat: 12.9715, lng: 77.5945 },
  { name: "Sports Complex", lat: 12.9725, lng: 77.5955 }
];
