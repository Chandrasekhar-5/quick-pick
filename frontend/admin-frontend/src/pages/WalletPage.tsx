import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { DollarSign, ArrowDownLeft, ArrowUpRight, Wallet, Loader2 } from "lucide-react";
import API from "@/services/api";
import { toast } from "sonner";

interface Transaction {
  id: string;
  user: string;
  type: 'payment' | 'refund' | 'topup';
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

interface WalletStats {
  totalPayments: number;
  totalRefunds: number;
  totalTopups: number;
}

export default function WalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const [transactionsRes, statsRes] = await Promise.all([
        API.get('/admin/wallet/transactions'),
        API.get('/admin/wallet/stats')
      ]);
      
      setTransactions(transactionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      toast.error("Failed to load wallet data");
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
        <h2 className="text-2xl font-bold">Wallet / Payments</h2>
        <p className="text-muted-foreground text-sm">Transaction overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Payments" value={`₹${stats?.totalPayments.toLocaleString() || 0}`} icon={DollarSign} />
        <StatCard title="Total Refunds" value={`₹${stats?.totalRefunds.toLocaleString() || 0}`} icon={ArrowDownLeft} />
        <StatCard title="Total Top-ups" value={`₹${stats?.totalTopups.toLocaleString() || 0}`} icon={ArrowUpRight} />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-primary">{t.id.slice(-8)}</td>
                  <td className="py-3 px-4">{t.user}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      t.type === "payment" ? "bg-info/15 text-info border-info/30" :
                      t.type === "refund" ? "bg-warning/15 text-warning border-warning/30" :
                      "bg-success/15 text-success border-success/30"
                    }`}>
                      {t.type === "payment" ? <Wallet className="w-3 h-3" /> : t.type === "refund" ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {t.type}
                    </span>
                   </td>
                  <td className="py-3 px-4 font-medium">₹{t.amount}</td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      t.status === "completed" ? "bg-success/15 text-success border-success/30" : "bg-warning/15 text-warning border-warning/30"
                    }`}>
                      {t.status}
                    </span>
                   </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No transactions found
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