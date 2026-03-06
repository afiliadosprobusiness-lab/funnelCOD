import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Funnel } from '@/types/funnel';
import { getFunnelBySlug } from '@/store/funnel-store';
import ElementRenderer from '@/components/editor/ElementRenderer';

const PublishedFunnel = () => {
  const { slug } = useParams<{ slug: string }>();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    const f = getFunnelBySlug(slug);
    if (f && f.published) setFunnel(f);
  }, [slug]);

  if (!funnel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Funnel not found</h1>
          <p className="text-muted-foreground">This funnel doesn't exist or isn't published.</p>
        </div>
      </div>
    );
  }

  const activePage = funnel.pages[activePageIndex];
  if (!activePage) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="space-y-4">
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

        {/* Page navigation */}
        {funnel.pages.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {funnel.pages.map((page, i) => (
              <button
                key={page.id}
                onClick={() => setActivePageIndex(i)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  i === activePageIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedFunnel;
