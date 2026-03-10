import { useState } from "react";
import { users as initialUsers } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Ban, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [userList, setUserList] = useState(initialUsers);

  const toggleBlock = (id: string) => {
    setUserList((prev) => prev.map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u)));
    toast.success("User status updated");
  };

  const deleteUser = (id: string) => {
    setUserList((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="text-muted-foreground text-sm">Manage registered students</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Spent</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-primary">{u.id}</td>
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-4">{u.orders}</td>
                  <td className="py-3 px-4 font-medium">₹{u.spent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-muted-foreground">{u.joined}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.blocked ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-success/15 text-success border-success/30"}`}>
                      {u.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleBlock(u.id)}>
                        <Ban className={`w-4 h-4 ${u.blocked ? "text-success" : "text-warning"}`} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteUser(u.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
