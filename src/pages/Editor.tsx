import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Globe, Monitor, Smartphone, Plus, GripVertical, Undo2, Redo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Funnel, FunnelElement, ElementType } from '@/types/funnel';
import { createElement, getFunnel, setFunnelPublishState, updateFunnel } from '@/store/funnel-store';
import EditorSidebar from '@/components/editor/EditorSidebar';
import EditorSettings from '@/components/editor/EditorSettings';
import ElementRenderer from '@/components/editor/ElementRenderer';
import { v4 as uuid } from 'uuid';
import { useAuthUser } from '@/hooks/use-auth';
import { isSuperadmin } from '@/store/auth-store';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  closestCenter,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable element wrapper on canvas
function SortableElement({
  element,
  funnel,
  selected,
  onClick,
}: {
  element: FunnelElement;
  funnel: Funnel;
  selected: boolean;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg transition-all ${
        selected
          ? 'ring-2 ring-primary shadow-md shadow-primary/10'
          : 'hover:ring-1 hover:ring-primary/30'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-card border border-border rounded-md flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm hover:bg-muted"
      >
        <GripVertical className="w-3 h-3 text-muted-foreground" />
      </div>

      {/* Element type label */}
      {selected && (
        <div className="absolute -top-3 left-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold z-10 capitalize">
          {element.type.replace(/-/g, ' ')}
        </div>
      )}

      <div className="p-3">
        <ElementRenderer element={element} funnel={funnel} isEditor selected={selected} />
      </div>
    </div>
  );
}

// Canvas drop zone
function CanvasDropZone({ children, id }: { children: React.ReactNode; id: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] transition-colors ${isOver ? 'bg-primary/5' : ''}`}
    >
      {children}
    </div>
  );
}

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthUser();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [activePageId, setActivePageId] = useState<string>('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (!id || !user) return;
    const f = getFunnel(id);
    if (f && (isSuperadmin(user) || f.ownerId === user.id)) {
      setFunnel(f);
      if (f.pages.length > 0) setActivePageId(f.pages[0].id);
      // Init history
      setHistory([JSON.stringify(f)]);
      setHistoryIndex(0);
    } else {
      navigate('/dashboard');
    }
  }, [id, navigate, user]);

  const activePage = funnel?.pages.find(p => p.id === activePageId);

  const getAllElements = useCallback((): FunnelElement[] => {
    if (!activePage) return [];
    const elements: FunnelElement[] = [];
    activePage.sections.forEach(s => s.rows.forEach(r => r.containers.forEach(c => elements.push(...c.elements))));
    return elements;
  }, [activePage]);

  const selectedElement = selectedElementId ? getAllElements().find(e => e.id === selectedElementId) || null : null;

  const saveFunnel = useCallback((updated: Funnel, addToHistory = true) => {
    setFunnel(updated);
    updateFunnel(updated);
    if (addToHistory) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(JSON.stringify(updated));
        if (newHistory.length > 50) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, 49));
    }
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const restored = JSON.parse(history[newIndex]) as Funnel;
      setFunnel(restored);
      updateFunnel(restored);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const restored = JSON.parse(history[newIndex]) as Funnel;
      setFunnel(restored);
      updateFunnel(restored);
    }
  };

  const getElementsArray = (): FunnelElement[] => {
    if (!funnel || !activePage) return [];
    const page = funnel.pages.find(p => p.id === activePageId);
    if (!page || page.sections.length === 0) return [];
    return page.sections[0]?.rows[0]?.containers[0]?.elements || [];
  };

  const setElementsArray = (elements: FunnelElement[]) => {
    if (!funnel) return;
    const updated = JSON.parse(JSON.stringify(funnel)) as Funnel;
    const page = updated.pages.find(p => p.id === activePageId);
    if (!page) return;
    if (page.sections.length === 0) {
      page.sections.push({
        id: uuid(),
        rows: [{ id: uuid(), containers: [{ id: uuid(), elements }] }],
      });
    } else {
      if (!page.sections[0].rows[0]) {
        page.sections[0].rows.push({ id: uuid(), containers: [{ id: uuid(), elements }] });
      } else if (!page.sections[0].rows[0].containers[0]) {
        page.sections[0].rows[0].containers.push({ id: uuid(), elements });
      } else {
        page.sections[0].rows[0].containers[0].elements = elements;
      }
    }
    saveFunnel(updated);
  };

  const handleAddElement = (type: ElementType) => {
    const newElement = createElement(type);
    const elements = [...getElementsArray(), newElement];
    setElementsArray(elements);
    setSelectedElementId(newElement.id);
  };

  const handleUpdateElement = (updated: FunnelElement) => {
    const elements = getElementsArray().map(e => e.id === updated.id ? updated : e);
    setElementsArray(elements);
  };

  const handleDeleteElement = (elementId: string) => {
    const elements = getElementsArray().filter(e => e.id !== elementId);
    setElementsArray(elements);
    setSelectedElementId(null);
  };

  const handleDuplicateElement = (elementId: string) => {
    const elements = getElementsArray();
    const idx = elements.findIndex(e => e.id === elementId);
    if (idx === -1) return;
    const clone: FunnelElement = { ...JSON.parse(JSON.stringify(elements[idx])), id: uuid() };
    elements.splice(idx + 1, 0, clone);
    setElementsArray(elements);
    setSelectedElementId(clone.id);
  };

  const handleMoveElement = (elementId: string, direction: 'up' | 'down') => {
    const elements = [...getElementsArray()];
    const idx = elements.findIndex(e => e.id === elementId);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= elements.length) return;
    [elements[idx], elements[newIdx]] = [elements[newIdx], elements[idx]];
    setElementsArray(elements);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDragActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDragActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data?.current;

    // Drag from sidebar → add new element
    if (activeData?.origin === 'sidebar') {
      const type = activeData.type as ElementType;
      const newElement = createElement(type);
      const elements = [...getElementsArray()];

      // Find drop position
      const overIdx = elements.findIndex(e => e.id === over.id);
      if (overIdx !== -1) {
        elements.splice(overIdx, 0, newElement);
      } else {
        elements.push(newElement);
      }
      setElementsArray(elements);
      setSelectedElementId(newElement.id);
      return;
    }

    // Reorder existing elements
    if (active.id !== over.id) {
      const elements = getElementsArray();
      const oldIndex = elements.findIndex(e => e.id === active.id);
      const newIndex = elements.findIndex(e => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setElementsArray(arrayMove(elements, oldIndex, newIndex));
      }
    }
  };

  const handlePublish = () => {
    if (!funnel || !user) return;
    const result = setFunnelPublishState({
      funnelId: funnel.id,
      nextPublished: true,
      ownerId: user.id,
      userPlan: user.plan,
      isSuperadmin: isSuperadmin(user),
    });

    if (!result.ok || !result.funnel) {
      toast({ title: 'Cannot publish funnel', description: result.error, variant: 'destructive' });
      return;
    }

    setFunnel(result.funnel);
    toast({ title: 'Funnel published!', description: `Available at /f/${result.funnel.slug}` });
  };

  if (!funnel || !activePage) return null;

  const elements = getElementsArray();
  const elementIds = elements.map(e => e.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-editor-bg overflow-hidden">
        {/* Top Bar */}
        <header className="h-12 bg-card border-b border-border flex items-center justify-between px-3 shrink-0 z-50">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-sm text-foreground truncate max-w-32">{funnel.name}</span>
            <Select value={activePageId} onValueChange={id => { setActivePageId(id); setSelectedElementId(null); }}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {funnel.pages.map(p => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Undo/Redo */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={historyIndex <= 0} title="Undo">
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo">
              <Redo2 className="w-3.5 h-3.5" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Viewport */}
            <div className="flex items-center bg-muted rounded-lg p-0.5">
              <Button variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setPreviewMode('desktop')}>
                <Monitor className="w-3.5 h-3.5" />
              </Button>
              <Button variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setPreviewMode('mobile')}>
                <Smartphone className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

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
          <div
            className="flex-1 overflow-auto p-6 flex justify-center"
            onClick={() => setSelectedElementId(null)}
          >
            <div
              className={`bg-editor-canvas rounded-xl shadow-lg border border-border transition-all ${
                previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-3xl'
              }`}
              style={{ minHeight: 500 }}
            >
              <CanvasDropZone id="canvas-drop">
                <SortableContext items={elementIds} strategy={verticalListSortingStrategy}>
                  <div className="p-6 space-y-2">
                    {elements.map(element => (
                      <SortableElement
                        key={element.id}
                        element={element}
                        funnel={funnel}
                        selected={selectedElementId === element.id}
                        onClick={() => setSelectedElementId(element.id)}
                      />
                    ))}

                    {elements.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                        <Plus className="w-10 h-10 mb-3 text-border" />
                        <p className="text-sm font-medium">Drag components here</p>
                        <p className="text-xs mt-1">or click a component from the sidebar</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </CanvasDropZone>
            </div>
          </div>

          {/* Right Settings Panel */}
          <EditorSettings
            element={selectedElement}
            onUpdate={handleUpdateElement}
            onDelete={handleDeleteElement}
            onDuplicate={handleDuplicateElement}
            onMove={handleMoveElement}
            onClose={() => setSelectedElementId(null)}
          />
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {dragActiveId && (
          <div className="bg-card border border-primary/30 rounded-lg p-3 shadow-xl opacity-80 max-w-xs">
            <p className="text-xs text-primary font-semibold capitalize">
              {dragActiveId.replace('sidebar-', '').replace(/-/g, ' ')}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Editor;

