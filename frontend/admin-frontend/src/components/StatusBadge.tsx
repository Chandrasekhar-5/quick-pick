import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/mockData";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  preparing: "bg-info/15 text-info border-info/30",
  ready: "bg-success/15 text-success border-success/30",
  picked_up: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", statusStyles[status])}>
      {status.replace("_", " ")}
    </span>
  );
}
