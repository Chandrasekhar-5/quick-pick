import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Loader2 } from "lucide-react";
import API from "@/services/api";
import { toast } from "sonner";

const COLORS = ["hsl(239,84%,67%)", "hsl(250,60%,55%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(199,89%,48%)"];
const tooltipStyle = { background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,18%)", borderRadius: 8, color: "hsl(213,31%,91%)" };

interface RevenueData {
  month: string;
  revenue: number;
}

interface OrdersPerShop {
  shop: string;
  orders: number;
}

interface TopItem {
  name: string;
  orders: number;
}

interface VendorPerformance {
  name: string;
  revenue: number;
}

export default function AnalyticsPage() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueData[]>([]);
  const [ordersPerShop, setOrdersPerShop] = useState<OrdersPerShop[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [vendorPerformance, setVendorPerformance] = useState<VendorPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [revenueRes, ordersPerShopRes, topItemsRes, vendorPerfRes] = await Promise.all([
        API.get('/dashboard/revenue'),
        API.get('/analytics/orders-per-shop'),
        API.get('/analytics/top-items'),
        API.get('/analytics/vendor-performance')
      ]);

      setMonthlyRevenue(revenueRes.data);
      setOrdersPerShop(ordersPerShopRes.data);
      setTopItems(topItemsRes.data);
      setVendorPerformance(vendorPerfRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
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
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground text-sm">Insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="aRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(239,84%,67%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(239,84%,67%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(239,84%,67%)" fill="url(#aRevGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Orders Per Shop</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={ordersPerShop} 
                dataKey="orders" 
                nameKey="shop" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                label={({ shop, percent }) => `${shop} ${(percent * 100).toFixed(0)}%`} 
                labelLine={false}
              >
                {ordersPerShop.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Top Items</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis type="number" stroke="hsl(215,20%,55%)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(215,20%,55%)" fontSize={12} width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="orders" fill="hsl(250,60%,55%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Vendor Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={vendorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis dataKey="name" stroke="hsl(215,20%,55%)" fontSize={11} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="revenue" fill="hsl(142,71%,45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}