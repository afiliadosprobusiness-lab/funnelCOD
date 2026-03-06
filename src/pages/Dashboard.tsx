import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreVertical,
  Copy,
  Trash2,
  Eye,
  Edit,
  Globe,
  Layers,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Funnel } from "@/types/funnel";
import {
  claimUnownedData,
  countPublishedFunnelsByOwner,
  createFunnel,
  deleteFunnel,
  duplicateFunnel,
  getFunnelsByOwner,
  setFunnelPublishState,
} from "@/store/funnel-store";
import { useAuthUser } from "@/hooks/use-auth";
import { isSuperadmin, logout } from "@/store/auth-store";
import { PLAN_DEFINITIONS } from "@/lib/plans";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();
  const user = useAuthUser();

  const superadmin = isSuperadmin(user);

  const publishedCount = useMemo(() => {
    if (!user || superadmin) return 0;
    return countPublishedFunnelsByOwner(user.id);
  }, [superadmin, user]);

  const refreshFunnels = useCallback(() => {
    if (!user) return;
    setFunnels(getFunnelsByOwner(user.id, superadmin));
  }, [superadmin, user]);

  useEffect(() => {
    if (!user) return;
    claimUnownedData(user.id);
    refreshFunnels();
  }, [refreshFunnels, user]);

  const handleCreate = () => {
    if (!newName.trim() || !user) return;
    createFunnel(newName.trim(), user.id);
    refreshFunnels();
    setNewName("");
    setShowCreate(false);
  };

  const handleDelete = (id: string) => {
    deleteFunnel(id);
    refreshFunnels();
  };

  const handleDuplicate = (id: string) => {
    if (!user) return;
    duplicateFunnel(id, user.id);
    refreshFunnels();
  };

  const handleTogglePublish = (funnel: Funnel) => {
    if (!user) return;
    const result = setFunnelPublishState({
      funnelId: funnel.id,
      nextPublished: !funnel.published,
      ownerId: user.id,
      userPlan: user.plan,
      isSuperadmin: superadmin,
    });

    if (!result.ok) {
      toast({
        title: "Cannot publish funnel",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    refreshFunnels();
  };

  if (!user) {
    return null;
  }

  const planDefinition = PLAN_DEFINITIONS[user.plan];
  const limitText =
    superadmin || planDefinition.publishLimit === null
      ? "Unlimited publish"
      : `${publishedCount}/${planDefinition.publishLimit} published`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-foreground">COD Funnel Builder</h1>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {planDefinition.name} - {limitText}
            </Badge>
            {superadmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/superadmin")}>
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Superadmin
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>Orders</Button>
            <Button className="btn-gradient" size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="mr-1 h-4 w-4" /> New Funnel
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                logout();
                navigate("/auth");
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Funnels</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create, edit and publish according to your plan.</p>
          </div>
          <Badge variant="secondary" className="w-fit sm:hidden">
            {planDefinition.name} - {limitText}
          </Badge>
        </div>

        {funnels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">No funnels yet</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Create your first COD funnel and start collecting orders.
            </p>
            <Button className="btn-gradient" onClick={() => setShowCreate(true)}>
              <Plus className="mr-1 h-4 w-4" /> Create Your First Funnel
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {funnels.map((funnel, index) => (
                <motion.div
                  key={funnel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-elevated group p-5 transition-all"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-foreground">{funnel.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {funnel.pages.length} pages - {new Date(funnel.updatedAt).toLocaleDateString()}
                      </p>
                      {superadmin && funnel.ownerId && (
                        <p className="mt-1 truncate text-[11px] text-muted-foreground">Owner: {funnel.ownerId}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/editor/${funnel.id}`)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/preview/${funnel.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublish(funnel)}>
                          <Globe className="mr-2 h-4 w-4" /> {funnel.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(funnel.id)}>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(funnel.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <Badge variant={funnel.published ? "default" : "secondary"} className="text-xs">
                      {funnel.published ? "Published" : "Draft"}
                    </Badge>
                    {funnel.product && (
                      <span className="text-xs text-muted-foreground">
                        {funnel.product.currency}
                        {funnel.product.price}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/editor/${funnel.id}`)}
                    >
                      <Edit className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/preview/${funnel.id}`)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTogglePublish(funnel)}>
                      <Globe className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Funnel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g. Sonic Wave Headphones"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button className="btn-gradient" onClick={handleCreate} disabled={!newName.trim()}>
              Create Funnel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
