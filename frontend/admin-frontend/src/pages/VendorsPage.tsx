import { useState, useEffect } from "react";
import { Vendor } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import API from "@/services/api";
import { toast } from "sonner";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/vendors/admin/all');
      setVendors(res.data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      toast.error("Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVendor = async (id: string, enabled: boolean) => {
    setUpdatingId(id);
    try {
      await API.put(`/vendors/admin/${id}/toggle`);
      toast.success(`Vendor ${enabled ? 'disabled' : 'enabled'} successfully`);
      fetchVendors();
    } catch (error) {
      console.error("Failed to toggle vendor:", error);
      toast.error("Failed to update vendor status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteVendor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      await API.delete(`/vendors/admin/${id}`);
      toast.success(`${name} deleted successfully`);
      fetchVendors();
    } catch (error) {
      console.error("Failed to delete vendor:", error);
      toast.error("Failed to delete vendor");
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
          <h2 className="text-2xl font-bold">Vendors</h2>
          <p className="text-muted-foreground text-sm">Manage food vendors</p>
        </div>
        <Button className="gap-2" onClick={() => toast.info("Add vendor feature coming soon")}>
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <div key={v.id} className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{v.name}</h3>
                <p className="text-sm text-muted-foreground">{v.shop}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-sm font-medium">{v.rating}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="font-bold">₹{(v.revenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="font-bold">{v.orders.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={v.enabled} 
                  onCheckedChange={() => toggleVendor(v.id, v.enabled)}
                  disabled={updatingId === v.id}
                />
                <span className="text-xs text-muted-foreground">{v.enabled ? "Active" : "Disabled"}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Edit feature coming soon")}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteVendor(v.id, v.name)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No vendors found
          </div>
        )}
      </div>
    </div>
  );
}