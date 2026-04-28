import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Store, Loader2 } from "lucide-react";
import API from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Shop {
  id: string;
  name: string;
  vendor: string;
  capacity: number;
  open: boolean;
  location?: string;
  description?: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/vendors');
      const mappedShops = res.data.map((vendor: any) => ({
        id: vendor._id,
        name: vendor.name,
        vendor: vendor.ownerId?.name || vendor.name,
        capacity: 50,
        open: vendor.isOpen,
        location: vendor.address || "Main Campus",
        description: vendor.description
      }));
      setShops(mappedShops);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
      toast.error("Failed to load shops");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShop = async (id: string, open: boolean) => {
    setUpdatingId(id);
    try {
      await API.put(`/vendors/admin/${id}/toggle`);
      toast.success(`Shop ${open ? 'closed' : 'opened'} successfully`);
      fetchShops();
    } catch (error) {
      console.error("Failed to toggle shop:", error);
      toast.error("Failed to update shop status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteShop = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This will also delete all menu items and orders.`)) return;
    
    try {
      await API.delete(`/vendors/admin/${id}`);
      toast.success(`${name} deleted successfully`);
      fetchShops();
    } catch (error) {
      console.error("Failed to delete shop:", error);
      toast.error("Failed to delete shop");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Shops</h2>
          <p className="text-muted-foreground text-sm">Manage campus food shops and their status</p>
        </div>
        <Button className="gap-2" onClick={() => toast.info("Add shop feature coming soon")}>
          <Plus className="w-4 h-4" /> Add Shop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <div key={shop.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{shop.name}</h3>
                  <p className="text-xs text-muted-foreground">Vendor: {shop.vendor}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {shop.description || "No description available"}
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium truncate">{shop.location}</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="text-sm font-medium">{shop.capacity} orders/slot</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={shop.open} 
                  onCheckedChange={() => toggleShop(shop.id, shop.open)}
                  disabled={updatingId === shop.id}
                />
                <span className={cn("text-xs font-medium", shop.open ? "text-success" : "text-muted-foreground")}>
                  {shop.open ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Edit feature coming soon")}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteShop(shop.id, shop.name)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {shops.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No shops found
          </div>
        )}
      </div>
    </div>
  );
}