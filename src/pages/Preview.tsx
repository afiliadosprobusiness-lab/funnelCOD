import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Funnel } from '@/types/funnel';
import { getFunnel } from '@/store/funnel-store';
import ElementRenderer from '@/components/editor/ElementRenderer';

const Preview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [activePageId, setActivePageId] = useState('');
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (!id) return;
    const f = getFunnel(id);
    if (f) {
      setFunnel(f);
      if (f.pages.length > 0) setActivePageId(f.pages[0].id);
    }
  }, [id]);

  const activePage = funnel?.pages.find(p => p.id === activePageId);

  if (!funnel || !activePage) return null;

  return (
    <div className="min-h-screen bg-editor-bg">
      <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/editor/${funnel.id}`)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold text-sm">Preview: {funnel.name}</span>
          <Select value={activePageId} onValueChange={setActivePageId}>
            <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {funnel.pages.map(p => (
                <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center bg-muted rounded-lg p-0.5">
          <Button variant={mode === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setMode('desktop')}>
            <Monitor className="w-3.5 h-3.5" />
          </Button>
          <Button variant={mode === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setMode('mobile')}>
            <Smartphone className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      <div className="flex justify-center p-8">
        <div className={`bg-card rounded-xl shadow-lg border border-border transition-all ${
          mode === 'mobile' ? 'w-[375px]' : 'w-full max-w-3xl'
        }`}>
          <div className="p-8 space-y-4">
            {activePage.sections.map(section =>
              section.rows.map(row =>
                row.containers.map(container =>
                  container.elements.map(element => (
                    <ElementRenderer key={element.id} element={element} funnel={funnel} />
                  ))
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
