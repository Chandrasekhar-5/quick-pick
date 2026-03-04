import { Edit2, Trash2 } from 'lucide-react';
import { MenuItem } from '../../types.ts';
import ToggleButton from './ToggleButton.tsx';

interface MenuItemCardProps {
  item: MenuItem;
  onToggleAvailability: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export default function MenuItemCard({ item, onToggleAvailability, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-line dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 bg-gray-100 dark:bg-slate-900">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 shadow-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 rounded-full text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
          </div>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{item.price}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Stock Left</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.stock > 20 ? 'bg-emerald-500' : item.stock > 5 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((item.stock / 50) * 100, 100)}%` }}
                />
              </div>
              <span className={`text-xs font-bold ${item.stock <= 5 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                {item.stock}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-md uppercase tracking-wider">
            {item.category}
          </span>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-line dark:border-slate-700">
          <ToggleButton
            isOn={item.isAvailable && item.stock > 0}
            onToggle={() => onToggleAvailability(item.id)}
            label={item.isAvailable && item.stock > 0 ? "Available" : "Unavailable"}
          />
        </div>
      </div>
    </div>
  );
}
