import { useState } from "react";
import { orders as initialOrders, OrderStatus } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search } from "lucide-react";

const statuses: OrderStatus[] = ["pending", "preparing", "ready", "picked_up", "cancelled"];

export default function OrdersPage() {
  const [orderList, setOrderList] = useState(initialOrders);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = orderList.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.student.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const changeStatus = (id: string, status: OrderStatus) => {
    setOrderList((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-muted-foreground text-sm">Manage all food orders</p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by student or order ID..." className="pl-9 bg-secondary" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-secondary">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vendor</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Items</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-primary">{o.id}</td>
                  <td className="py-3 px-4">{o.student}</td>
                  <td className="py-3 px-4">{o.vendor}</td>
                  <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">{o.items}</td>
                  <td className="py-3 px-4 font-medium">₹{o.total}</td>
                  <td className="py-3 px-4"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-4 text-muted-foreground">{o.time}</td>
                  <td className="py-3 px-4">
                    <Select value={o.status} onValueChange={(v) => changeStatus(o.id, v as OrderStatus)}>
                      <SelectTrigger className="h-8 w-[130px] text-xs bg-secondary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
