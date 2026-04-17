import { useState, useEffect } from "react";
import { ShoppingCart, DollarSign, Users, Store, Zap, CalendarDays, Loader2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import API from "@/services/api";
import { toast } from "sonner";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  activeVendors: number;
  activeOrders: number;
  todayOrders: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface OrderPerDay {
  day: string;
  orders: number;
}

interface TopVendor {
  name: string;
  revenue: number;
  orders: number;
}

interface RecentOrder {
  id: string;
  student: string;
  vendor: string;
  items: string;
  total: number;
  status: string;
  time: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [ordersPerDay, setOrdersPerDay] = useState<OrderPerDay[]>([]);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, revenueRes, ordersPerDayRes, topVendorsRes, recentOrdersRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/dashboard/revenue'),
        API.get('/dashboard/orders-per-day'),
        API.get('/dashboard/top-vendors'),
        API.get('/dashboard/recent-orders')
      ]);

      setStats(statsRes.data);
      setRevenueData(revenueRes.data);
      setOrdersPerDay(ordersPerDayRes.data);
      setTopVendors(topVendorsRes.data);
      setRecentOrders(recentOrdersRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = stats ? [
    { title: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: ShoppingCart, trend: "+12.5% from last month", trendUp: true },
    { title: "Total Revenue", value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, trend: "+8.2% from last month", trendUp: true },
    { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, trend: "+5.1% from last month", trendUp: true },
    { title: "Active Vendors", value: stats.activeVendors.toString(), icon: Store },
    { title: "Active Orders", value: stats.activeOrders.toString(), icon: Zap, trend: "Live", trendUp: true },
    { title: "Today's Orders", value: stats.todayOrders.toString(), icon: CalendarDays, trend: "-3.2% from yesterday", trendUp: false },
  ] : [];

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
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Overview of QuickPick campus food system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(239,84%,67%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(239,84%,67%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,18%)", borderRadius: 8, color: "hsl(213,31%,91%)" }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(239,84%,67%)" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Per Day */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Orders Per Day</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ordersPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis dataKey="day" stroke="hsl(215,20%,55%)" fontSize={12} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,18%)", borderRadius: 8, color: "hsl(213,31%,91%)" }} />
              <Bar dataKey="orders" fill="hsl(250,60%,55%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Vendors */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Top Vendors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topVendors.map((v, i) => (
            <div key={v.name} className="bg-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary">#{i + 1}</span>
                <span className="text-sm font-medium truncate">{v.name}</span>
              </div>
              <p className="text-lg font-bold">₹{(v.revenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">{v.orders} orders</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Order ID</th>
                <th className="text-left py-3 px-2 font-medium">Student</th>
                <th className="text-left py-3 px-2 font-medium">Vendor</th>
                <th className="text-left py-3 px-2 font-medium">Items</th>
                <th className="text-left py-3 px-2 font-medium">Total</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
                <th className="text-left py-3 px-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-2 font-mono text-primary">{o.id.slice(-8)}</td>
                  <td className="py-3 px-2">{o.student}</td>
                  <td className="py-3 px-2">{o.vendor}</td>
                  <td className="py-3 px-2 text-muted-foreground">{o.items}</td>
                  <td className="py-3 px-2 font-medium">₹{o.total}</td>
                  <td className="py-3 px-2"><StatusBadge status={o.status as any} /></td>
                  <td className="py-3 px-2 text-muted-foreground">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// tried changing the tooltipstyle to match the new dark theme and added a loading spinner while the data is being fetched. Also added error handling to show a toast notification if the API call fails. but didnt work as expected, the charts still look a bit off and the loading state is not showing up properly. might need to revisit the API calls and how the data is being set in state.