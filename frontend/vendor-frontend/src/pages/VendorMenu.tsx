import { useState, useRef } from 'react';
import { Plus, Search, SlidersHorizontal, X, Upload, Loader2, Trash2 } from 'lucide-react';
import { MenuItem } from '../types.ts';
import MenuItemCard from '../components/vendor/MenuItemCard.tsx';
import { motion, AnimatePresence } from "framer-motion";

const MOCK_MENU: MenuItem[] = [
  {
    id: "101",
    name: "Masala Dosa",
    price: 45,
    description: "Crispy rice crepe filled with spiced potato.",
    category: "Breakfast",
    isAvailable: true,
    stock: 40,
    image: "https://vismaifood.com/storage/app/uploads/public/8b4/19e/427/thumb__700_0_0_0_auto.jpg"
  },
  {
    id: "102",
    name: "Chole Bhature",
    price: 60,
    description: "Spicy chickpeas served with fried bread.",
    category: "Breakfast",
    isAvailable: true,
    stock: 35,
    image: "https://static.toiimg.com/thumb/53314156.cms?imgsize=1762111&width=800&height=800"
  },
  {
    id: "103",
    name: "Thali Special",
    price: 120,
    description: "Full meal with rice, dal, 2 sabzi, roti, and curd.",
    category: "Main Course",
    isAvailable: true,
    stock: 20,
    image: "https://www.shutterstock.com/image-photo/veg-thali-traditional-indian-meal-600nw-2652923019.jpg"
  },
  {
    id: "104",
    name: "Veg Biryani",
    price: 90,
    description: "Fragrant basmati rice cooked with vegetables.",
    category: "Main Course",
    isAvailable: true,
    stock: 30,
    image: "https://i.pinimg.com/474x/b6/0c/a5/b60ca58bc5c72d11a9679898d9deb006.jpg"
  },
  {
    id: "105",
    name: "Samosa (2pcs)",
    price: 20,
    description: "Crispy pastry filled with spiced potatoes.",
    category: "Snacks",
    isAvailable: true,
    stock: 60,
    image: "https://doabafoodstracy.com/cdn/shop/files/samoose.png?v=1744281404"
  },
  {
    id: "106",
    name: "Cold Coffee",
    price: 40,
    description: "Chilled creamy coffee with chocolate syrup.",
    category: "Beverages",
    isAvailable: true,
    stock: 50,
    image: "https://i.pinimg.com/564x/cc/cb/00/cccb00473890ed242fff3e0c66d3ff33.jpg"
  },
  {
    id: "201",
    name: "Fresh Orange Juice",
    price: 50,
    description: "Freshly squeezed oranges.",
    category: "Beverages",
    isAvailable: true,
    stock: 25,
    image: "https://i.pinimg.com/474x/60/14/a1/6014a17d82605ce570a784c97d311913.jpg"
  },
  {
    id: "202",
    name: "Mango Shake",
    price: 60,
    description: "Thick mango pulp blended with milk.",
    category: "Beverages",
    isAvailable: true,
    stock: 25,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa1Q0At4X0lc0dd-Z5uV4iXp_spqdEe5rzSA&s"
  },
  {
    id: "203",
    name: "Fruit Salad",
    price: 70,
    description: "Assorted seasonal fresh fruits.",
    category: "Snacks",
    isAvailable: true,
    stock: 20,
    image: "https://static.vecteezy.com/system/resources/thumbnails/031/426/345/small/bowl-of-healthy-fresh-fruit-salad-ai-generated-photo.jpeg"
  },
  {
    id: "204",
    name: "Watermelon Juice",
    price: 40,
    description: "Refreshing watermelon juice.",
    category: "Beverages",
    isAvailable: false,
    stock: 0,
    image: "https://png.pngtree.com/png-vector/20240904/ourlarge/pngtree-realistic-watermelon-fruit-juice-png-image_13749191.png"
  },
  {
    id: "301",
    name: "Veg Cheese Burger",
    price: 80,
    description: "Classic veg patty with extra cheese.",
    category: "Snacks",
    isAvailable: true,
    stock: 30,
    image: "https://i.pinimg.com/736x/75/bb/bb/75bbbb36ed0002e96dcca2475ec48664.jpg"
  },
  {
    id: "302",
    name: "Paneer Pizza",
    price: 150,
    description: "Thin crust pizza topped with paneer.",
    category: "Snacks",
    isAvailable: true,
    stock: 15,
    image: "https://i.pinimg.com/236x/f2/bf/f4/f2bff49a8acfb847aaa0f4490f7e5473.jpg"
  },
  {
    id: "303",
    name: "French Fries",
    price: 60,
    description: "Crispy golden potato fries.",
    category: "Snacks",
    isAvailable: true,
    stock: 40,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6RGdL32iNxIOVb5ZpwEWyVcnxkQGWFqeWyw&s"
  },
  {
    id: "304",
    name: "Coke (500ml)",
    price: 40,
    description: "Chilled Coca-Cola bottle.",
    category: "Beverages",
    isAvailable: true,
    stock: 50,
    image: "https://i.pinimg.com/236x/f2/91/08/f2910804dc5b83b780f21d5d8ecb496d.jpg"
  }
];

const categories = ['All', 'Snacks', 'Beverages', 'Main Course', 'Desserts'];

export default function VendorMenu() {
  const [menu, setMenu] = useState<MenuItem[]>(MOCK_MENU);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    description: '',
    category: 'Snacks',
    isAvailable: true,
    stock: 0,
    image: '',
  });

  const handleToggleAvailability = (id: string) => {
    setMenu(prev => prev.map(item =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        price: 0,
        description: '',
        category: 'Snacks',
        isAvailable: true,
        stock: 0,
        image: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingItem) {
        setMenu(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData } as MenuItem : item));
      } else {
        const newItem: MenuItem = {
          ...formData,
          id: Math.random().toString(36).slice(2, 11),
        } as MenuItem;
        setMenu(prev => [newItem, ...prev]);
      }
      setIsSubmitting(false);
      setIsModalOpen(false);
    }, 800);
  };

  const confirmDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      setMenu(prev => prev.filter(item => item.id !== showDeleteConfirm));
      setShowDeleteConfirm(null);
    }
  };

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm dark:text-white"
            />
          </div>
          <button className="p-3 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-200"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              activeCategory === category
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100"
                : "bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-line dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-500"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMenu.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <MenuItemCard
                item={item}
                onToggleAvailability={handleToggleAvailability}
                onEdit={() => handleOpenModal(item)}
                onDelete={confirmDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-line dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Item Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      placeholder="e.g. Veg Burger"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available Stock</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all resize-none dark:text-white"
                    placeholder="Describe the item..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Item Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 overflow-hidden flex items-center justify-center">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all text-sm font-bold"
                      >
                        Choose Image
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG or WebP. Max 2MB.</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*" 
                      />
                    </div>
                  </div>
                </div>
              </form>

              <div className="p-6 border-t border-line dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    editingItem ? 'Save Changes' : 'Add Item'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Item?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">This action cannot be undone. Are you sure you want to remove this item from your menu?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filteredMenu.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">No items found</h3>
          <p className="dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
