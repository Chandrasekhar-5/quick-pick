import { transactions } from "@/lib/mockData";
import { StatCard } from "@/components/StatCard";
import { DollarSign, ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

export default function WalletPage() {
  const totalPayments = transactions.filter((t) => t.type === "payment").reduce((s, t) => s + t.amount, 0);
  const totalRefunds = transactions.filter((t) => t.type === "refund").reduce((s, t) => s + t.amount, 0);
  const totalTopups = transactions.filter((t) => t.type === "topup").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Wallet / Payments</h2>
        <p className="text-muted-foreground text-sm">Transaction overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Payments" value={`₹${totalPayments.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Total Refunds" value={`₹${totalRefunds.toLocaleString()}`} icon={ArrowDownLeft} />
        <StatCard title="Total Top-ups" value={`₹${totalTopups.toLocaleString()}`} icon={ArrowUpRight} />
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
                  <td className="py-3 px-4 font-mono text-primary">{t.id}</td>
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
                  <td className="py-3 px-4 text-muted-foreground">{t.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      t.status === "completed" ? "bg-success/15 text-success border-success/30" : "bg-warning/15 text-warning border-warning/30"
                    }`}>{t.status}</span>
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
