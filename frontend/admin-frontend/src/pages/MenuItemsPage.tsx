import { useState, useEffect, useMemo } from "react";
import { MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, UtensilsCrossed, TrendingUp, AlertTriangle, Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import API from "@/services/api";

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Active", class: "bg-success/15 text-success border-success/30" },
  out_of_stock: { label: "Out of Stock", class: "bg-destructive/15 text-destructive border-destructive/30" },
  disabled: { label: "Disabled", class: "bg-muted text-muted-foreground border-border" },
  slot_full: { label: "Slot Full", class: "bg-warning/15 text-warning border-warning/30" },
};

const popularityConfig: Record<string, { label: string; class: string }> = {
  top_seller: { label: "🔥 Top Seller", class: "bg-primary/15 text-primary border-primary/30" },
  popular: { label: "⭐ Popular", class: "bg-info/15 text-info border-info/30" },
  low: { label: "Low", class: "bg-secondary text-muted-foreground border-border" },
};

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [vendorFilter, setVendorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/menu/admin/all');
      setItems(res.data);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  };

  const vendors = useMemo(() => [...new Set(items.map((i) => i.vendor))], [items]);
  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (vendorFilter !== "all" && i.vendor !== vendorFilter) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      return true;
    });
  }, [items, vendorFilter, categoryFilter]);

  const stats = useMemo(() => {
    const active = items.filter((i) => i.status === "active").length;
    const outOfStock = items.filter((i) => i.status === "out_of_stock").length;
    const totalSoldToday = items.reduce((s, i) => s + i.soldToday, 0);
    const slotFull = items.filter((i) => i.status === "slot_full").length;
    return { active, outOfStock, totalSoldToday, slotFull };
  }, [items]);

  const deleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      await API.delete(`/menu/admin/${id}`);
      toast.success(`${name} deleted successfully`);
      fetchMenuItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <p className="text-muted-foreground text-sm">Manage food items, availability & slot limits</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMini icon={UtensilsCrossed} label="Active Items" value={stats.active} accent="text-success" />
        <StatMini icon={TrendingUp} label="Sold Today" value={stats.totalSoldToday} accent="text-primary" />
        <StatMini icon={AlertTriangle} label="Out of Stock" value={stats.outOfStock} accent="text-destructive" />
        <StatMini icon={Ban} label="Slot Full" value={stats.slotFull} accent="text-warning" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={vendorFilter} onValueChange={setVendorFilter}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="All Vendors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {vendors.map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(vendorFilter !== "all" || categoryFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={() => { setVendorFilter("all"); setCategoryFilter("all"); }}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vendor</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Sold Today</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Sold</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Limit/Slot</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Remaining</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const st = statusConfig[item.status];
                const pop = popularityConfig[item.popularity];
                return (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {item.popularity !== "low" && (
                          <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border", pop.class)}>
                            {pop.label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{item.vendor}</td>
                    <td className="py-3 px-4 font-medium">₹{item.price}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{item.soldToday}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{item.totalSold.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{item.limitPerSlot}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn("font-medium", item.remaining <= 3 && item.remaining > 0 ? "text-warning" : item.remaining === 0 ? "text-destructive" : "")}>
                        {item.remaining}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", st.class)}>
                        {st.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Edit feature coming soon")}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteItem(item.id, item.name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-muted-foreground">
                    No items match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatMini({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: number; accent: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
      <div className={cn("w-9 h-9 rounded-lg bg-secondary flex items-center justify-center", accent)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}