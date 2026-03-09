import { useState } from "react";
import { vendors as initialVendors, Vendor } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function VendorsPage() {
  const [vendorList, setVendorList] = useState(initialVendors);

  const toggleVendor = (id: string) => {
    setVendorList((prev) => prev.map((v) => (v.id === id ? { ...v, enabled: !v.enabled } : v)));
    toast.success("Vendor status updated");
  };

  const deleteVendor = (id: string) => {
    setVendorList((prev) => prev.filter((v) => v.id !== id));
    toast.success("Vendor deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Vendors</h2>
          <p className="text-muted-foreground text-sm">Manage food vendors</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendorList.map((v) => (
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
                <Switch checked={v.enabled} onCheckedChange={() => toggleVendor(v.id)} />
                <span className="text-xs text-muted-foreground">{v.enabled ? "Active" : "Disabled"}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteVendor(v.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
