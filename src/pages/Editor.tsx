import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Globe, Save, Monitor, Smartphone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Funnel, FunnelPage, FunnelElement, ElementType, Section, Container, Row } from '@/types/funnel';
import { getFunnel, updateFunnel, createElement } from '@/store/funnel-store';
import EditorSidebar from '@/components/editor/EditorSidebar';
import EditorSettings from '@/components/editor/EditorSettings';
import ElementRenderer from '@/components/editor/ElementRenderer';
import { v4 as uuid } from 'uuid';

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [activePageId, setActivePageId] = useState<string>('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (!id) return;
    const f = getFunnel(id);
    if (f) {
      setFunnel(f);
      if (f.pages.length > 0) setActivePageId(f.pages[0].id);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const activePage = funnel?.pages.find(p => p.id === activePageId);

  const getAllElements = useCallback((): FunnelElement[] => {
    if (!activePage) return [];
    const elements: FunnelElement[] = [];
    activePage.sections.forEach(s => s.rows.forEach(r => r.containers.forEach(c => elements.push(...c.elements))));
    return elements;
  }, [activePage]);

  const selectedElement = selectedElementId ? getAllElements().find(e => e.id === selectedElementId) || null : null;

  const saveFunnel = useCallback((updated: Funnel) => {
    setFunnel(updated);
    updateFunnel(updated);
  }, []);

  const handleAddElement = (type: ElementType) => {
    if (!funnel || !activePage) return;
    const newElement = createElement(type);
    const updatedFunnel = { ...funnel };
    const page = updatedFunnel.pages.find(p => p.id === activePageId)!;

    if (page.sections.length === 0) {
      page.sections.push({
        id: uuid(),
        rows: [{ id: uuid(), containers: [{ id: uuid(), elements: [newElement] }] }],
      });
    } else {
      const lastSection = page.sections[page.sections.length - 1];
      const lastRow = lastSection.rows[lastSection.rows.length - 1];
      const lastContainer = lastRow.containers[lastRow.containers.length - 1];
      lastContainer.elements.push(newElement);
    }

    saveFunnel(updatedFunnel);
    setSelectedElementId(newElement.id);
  };

  const handleUpdateElement = (updated: FunnelElement) => {
    if (!funnel) return;
    const updatedFunnel = JSON.parse(JSON.stringify(funnel)) as Funnel;
    updatedFunnel.pages.forEach(p =>
      p.sections.forEach(s =>
        s.rows.forEach(r =>
          r.containers.forEach(c => {
            c.elements = c.elements.map(e => e.id === updated.id ? updated : e);
          })
        )
      )
    );
    saveFunnel(updatedFunnel);
  };

  const handleDeleteElement = (elementId: string) => {
    if (!funnel) return;
    const updatedFunnel = JSON.parse(JSON.stringify(funnel)) as Funnel;
    updatedFunnel.pages.forEach(p =>
      p.sections.forEach(s =>
        s.rows.forEach(r =>
          r.containers.forEach(c => {
            c.elements = c.elements.filter(e => e.id !== elementId);
          })
        )
      )
    );
    saveFunnel(updatedFunnel);
    setSelectedElementId(null);
  };

  const handleMoveElement = (elementId: string, direction: 'up' | 'down') => {
    if (!funnel || !activePage) return;
    const updatedFunnel = JSON.parse(JSON.stringify(funnel)) as Funnel;
    const page = updatedFunnel.pages.find(p => p.id === activePageId)!;
    
    for (const section of page.sections) {
      for (const row of section.rows) {
        for (const container of row.containers) {
          const idx = container.elements.findIndex(e => e.id === elementId);
          if (idx !== -1) {
            const newIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx >= 0 && newIdx < container.elements.length) {
              [container.elements[idx], container.elements[newIdx]] = [container.elements[newIdx], container.elements[idx]];
              saveFunnel(updatedFunnel);
            }
            return;
          }
        }
      }
    }
  };

  const handlePublish = () => {
    if (!funnel) return;
    saveFunnel({ ...funnel, published: true });
    toast({ title: 'Funnel published!', description: `Available at /f/${funnel.slug}` });
  };

  if (!funnel || !activePage) return null;

  return (
    <div className="h-screen flex flex-col bg-editor-bg">
      {/* Top Bar */}
      <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold text-sm text-foreground truncate max-w-40">{funnel.name}</span>

          {/* Page selector */}
          <Select value={activePageId} onValueChange={setActivePageId}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {funnel.pages.map(p => (
                <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            <Button
              variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate(`/preview/${funnel.id}`)}>
            <Eye className="w-3.5 h-3.5 mr-1" /> Preview
          </Button>
          <Button size="sm" className="h-8 text-xs btn-gradient" onClick={handlePublish}>
            <Globe className="w-3.5 h-3.5 mr-1" /> Publish
          </Button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <EditorSidebar onAddElement={handleAddElement} />

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8 flex justify-center" onClick={() => setSelectedElementId(null)}>
          <div
            className={`bg-editor-canvas rounded-xl shadow-lg border border-border transition-all ${
              previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-3xl'
            }`}
            style={{ minHeight: 600 }}
          >
            <div className="p-8 space-y-4">
              {activePage.sections.map(section =>
                section.rows.map(row =>
                  row.containers.map(container =>
                    container.elements.map(element => (
                      <ElementRenderer
                        key={element.id}
                        element={element}
                        funnel={funnel}
                        isEditor
                        selected={selectedElementId === element.id}
                        onClick={() => setSelectedElementId(element.id)}
                      />
                    ))
                  )
                )
              )}

              {getAllElements().length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                  <p className="text-sm">Click a component from the sidebar to add it</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Settings Panel */}
        <EditorSettings
          element={selectedElement}
          onUpdate={handleUpdateElement}
          onDelete={handleDeleteElement}
          onClose={() => setSelectedElementId(null)}
        />
      </div>
    </div>
  );
};

export default Editor;
