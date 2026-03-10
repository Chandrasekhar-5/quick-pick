import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Send } from "lucide-react";

export default function SettingsPage() {
  const [systemName, setSystemName] = useState("QuickPick");
  const [maxOrders, setMaxOrders] = useState("200");
  const [slotCapacity, setSlotCapacity] = useState("50");
  const [maintenance, setMaintenance] = useState(false);
  const [notification, setNotification] = useState("");
  const [shopToggles, setShopToggles] = useState({ main: true, juice: true, snack: false });

  const handleSave = () => toast.success("Settings saved successfully");
  const handleSendNotification = () => {
    if (!notification.trim()) return toast.error("Enter a notification message");
    toast.success("Notification sent to all students");
    setNotification("");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground text-sm">System configuration</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h3 className="font-semibold">General</h3>
        <div className="space-y-4">
          <div>
            <Label>System Name</Label>
            <Input className="mt-1.5 bg-secondary" value={systemName} onChange={(e) => setSystemName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max Orders / Day</Label>
              <Input className="mt-1.5 bg-secondary" type="number" value={maxOrders} onChange={(e) => setMaxOrders(e.target.value)} />
            </div>
            <div>
              <Label>Slot Capacity</Label>
              <Input className="mt-1.5 bg-secondary" type="number" value={slotCapacity} onChange={(e) => setSlotCapacity(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-xs text-muted-foreground">Temporarily disable ordering</p>
            </div>
            <Switch checked={maintenance} onCheckedChange={setMaintenance} />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="font-semibold">Notifications</h3>
        <Textarea
          placeholder="Type a notification message to send to all students..."
          className="bg-secondary"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
        />
        <Button className="gap-2" onClick={handleSendNotification}>
          <Send className="w-4 h-4" /> Send Notification
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="font-semibold">Shop Status</h3>
        {[
          { key: "main" as const, label: "Main Canteen" },
          { key: "juice" as const, label: "Juice Corner" },
          { key: "snack" as const, label: "Snack Hub" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between py-2">
            <Label>{label}</Label>
            <Switch checked={shopToggles[key]} onCheckedChange={(v) => setShopToggles((p) => ({ ...p, [key]: v }))} />
          </div>
        ))}
      </div>

      <Button className="gap-2" onClick={handleSave}>
        <Save className="w-4 h-4" /> Save Settings
      </Button>
    </div>
  );
}
