import { useState, useEffect } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Ban, Trash2, Eye, Loader2 } from "lucide-react";
import API from "@/services/api";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBlock = async (id: string, blocked: boolean) => {
    setUpdatingId(id);
    try {
      await API.put(`/admin/users/${id}/block`);
      toast.success(`User ${blocked ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user block:", error);
      toast.error("Failed to update user status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success(`${name} deleted successfully`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
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
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-primary">{u.id.slice(-8)}</td>
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-4">{u.orders}</td>
                  <td className="py-3 px-4 font-medium">₹{u.spent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-muted-foreground">{u.joined}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      u.blocked ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-success/15 text-success border-success/30"
                    }`}>
                      {u.blocked ? "Blocked" : "Active"}
                    </span>
                   </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("View details coming soon")}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => toggleBlock(u.id, u.blocked)}
                        disabled={updatingId === u.id}
                      >
                        <Ban className={`w-4 h-4 ${u.blocked ? "text-success" : "text-warning"}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive" 
                        onClick={() => deleteUser(u.id, u.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                   </td>
                 </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No users found
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