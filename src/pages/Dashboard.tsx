import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Copy, Trash2, Eye, Edit, Globe, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Funnel } from '@/types/funnel';
import { getFunnels, createFunnel, deleteFunnel, duplicateFunnel, updateFunnel } from '@/store/funnel-store';

const Dashboard = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  useEffect(() => { setFunnels(getFunnels()); }, []);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createFunnel(newName.trim());
    setFunnels(getFunnels());
    setNewName('');
    setShowCreate(false);
  };

  const handleDelete = (id: string) => {
    deleteFunnel(id);
    setFunnels(getFunnels());
  };

  const handleDuplicate = (id: string) => {
    duplicateFunnel(id);
    setFunnels(getFunnels());
  };

  const handleTogglePublish = (funnel: Funnel) => {
    updateFunnel({ ...funnel, published: !funnel.published });
    setFunnels(getFunnels());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">COD Funnel Builder</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>Orders</Button>
            <Button className="btn-gradient" size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-1" /> New Funnel
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Funnels</h2>
            <p className="text-muted-foreground text-sm mt-1">Create and manage your COD funnels</p>
          </div>
        </div>

        {funnels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No funnels yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Create your first COD funnel and start collecting orders
            </p>
            <Button className="btn-gradient" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-1" /> Create Your First Funnel
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {funnels.map((funnel, i) => (
                <motion.div
                  key={funnel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-elevated p-5 group transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{funnel.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {funnel.pages.length} pages · {new Date(funnel.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/editor/${funnel.id}`)}>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/preview/${funnel.id}`)}>
                          <Eye className="w-4 h-4 mr-2" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublish(funnel)}>
                          <Globe className="w-4 h-4 mr-2" /> {funnel.published ? 'Unpublish' : 'Publish'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(funnel.id)}>
                          <Copy className="w-4 h-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(funnel.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={funnel.published ? 'default' : 'secondary'} className="text-xs">
                      {funnel.published ? 'Published' : 'Draft'}
                    </Badge>
                    {funnel.product && (
                      <span className="text-xs text-muted-foreground">
                        {funnel.product.currency}{funnel.product.price}
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
                      <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/preview/${funnel.id}`)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Funnel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g. Sonic Wave Headphones"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button className="btn-gradient" onClick={handleCreate} disabled={!newName.trim()}>Create Funnel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
