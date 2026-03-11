import { useState } from "react";
import { shops as initialShops } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Building2, Users, Store } from "lucide-react";
import { toast } from "sonner";

export default function ShopsPage() {
  const [shopList, setShopList] = useState(initialShops);

  const toggleShop = (id: string) => {
    setShopList((prev) => prev.map((s) => (s.id === id ? { ...s, open: !s.open } : s)));
    toast.success("Shop status updated");
  };

  const deleteShop = (id: string) => {
    setShopList((prev) => prev.filter((s) => s.id !== id));
    toast.success("Shop deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Shops</h2>
          <p className="text-muted-foreground text-sm">Manage campus food shops</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Shop</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopList.map((s) => (
          <div key={s.id} className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">{s.id}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Store className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Vendor:</span>
                <span className="font-medium">{s.vendor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Capacity:</span>
                <span className="font-medium">{s.capacity} orders/slot</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Switch checked={s.open} onCheckedChange={() => toggleShop(s.id)} />
                <span className={`text-xs font-medium ${s.open ? "text-success" : "text-destructive"}`}>
                  {s.open ? "Open" : "Closed"}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteShop(s.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
