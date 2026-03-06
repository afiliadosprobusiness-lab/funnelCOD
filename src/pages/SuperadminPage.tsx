import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { PLAN_DEFINITIONS, PlanType } from "@/lib/plans";
import {
  getUsers,
  isSuperadmin,
  logout,
  updateUserPlan,
  updateUserStatus,
} from "@/store/auth-store";
import { AppUser } from "@/types/auth";
import { useAuthUser } from "@/hooks/use-auth";

export default function SuperadminPage() {
  const navigate = useNavigate();
  const currentUser = useAuthUser();
  const [users, setUsers] = useState<AppUser[]>([]);

  const activeUsers = useMemo(() => users.filter((user) => user.status === "active").length, [users]);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    if (!isSuperadmin(currentUser)) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const reloadUsers = () => setUsers(getUsers());

  const handleStatusChange = (target: AppUser, checked: boolean) => {
    if (!currentUser) return;
    const result = updateUserStatus(currentUser.id, target.id, checked ? "active" : "inactive");
    if (!result.ok) {
      toast({ title: "Cannot update user", description: result.error, variant: "destructive" });
      return;
    }
    reloadUsers();
  };

  const handlePlanChange = (target: AppUser, nextPlan: PlanType) => {
    if (!currentUser) return;
    const result = updateUserPlan(currentUser.id, target.id, nextPlan);
    if (!result.ok) {
      toast({ title: "Cannot change plan", description: result.error, variant: "destructive" });
      return;
    }
    reloadUsers();
    toast({ title: "Plan updated", description: `${target.email} moved to ${PLAN_DEFINITIONS[nextPlan].name}.` });
  };

  if (!currentUser || !isSuperadmin(currentUser)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center gap-3 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-foreground">Superadmin Console</h1>
            <p className="text-xs text-muted-foreground">Manage user status and plans</p>
          </div>
          <Badge className="ml-auto" variant="secondary">
            {activeUsers}/{users.length} active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate("/auth");
            }}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="container px-6 py-8">
        <div className="mb-4 rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium text-foreground">Root protection enabled</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Superadmin user is immutable for deletion/deactivation by policy.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const locked = user.role === "superadmin";
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </TableCell>
                    <TableCell className="capitalize">{user.provider}</TableCell>
                    <TableCell>
                      <Badge variant={locked ? "default" : "secondary"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.plan}
                        onValueChange={(value) => handlePlanChange(user, value as PlanType)}
                        disabled={locked}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          aria-label={`Toggle ${user.email} status`}
                          checked={user.status === "active"}
                          onCheckedChange={(checked) => handleStatusChange(user, checked)}
                          disabled={locked}
                        />
                        <span className="text-xs capitalize text-muted-foreground">{user.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Need public marketing view? <Link to="/" className="underline">Go to landing</Link>.
        </p>
      </main>
    </div>
  );
}
