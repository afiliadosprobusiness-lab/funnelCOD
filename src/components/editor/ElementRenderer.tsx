import { useState, useEffect } from 'react';
import { FunnelElement, Funnel } from '@/types/funnel';
import { CODOrderForm } from './CODOrderForm';
import { Shield, Truck, RotateCcw, Star, CheckCircle2 } from 'lucide-react';

interface ElementRendererProps {
  element: FunnelElement;
  funnel?: Funnel;
  isEditor?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const ElementRenderer = ({ element, funnel, isEditor, selected, onClick }: ElementRendererProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditor && onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  const renderElement = () => {
    switch (element.type) {
      case 'headline': {
        const Tag = (element.props?.level || 'h2') as keyof JSX.IntrinsicElements;
        const defaultSizes: Record<string, number> = { h1: 36, h2: 28, h3: 22, h4: 18 };
        const fontSize = element.props?.fontSize || defaultSizes[element.props?.level || 'h2'] || 28;
        return (
          <Tag
            className="font-bold leading-tight"
            style={{
              textAlign: element.props?.align || 'left',
              fontSize: `${fontSize}px`,
              color: element.props?.color || undefined,
            }}
          >
            {element.content || 'Headline'}
          </Tag>
        );
      }

      case 'paragraph':
        return (
          <p
            className="leading-relaxed"
            style={{
              textAlign: element.props?.align || 'left',
              fontSize: element.props?.fontSize ? `${element.props.fontSize}px` : '16px',
              color: element.props?.color || undefined,
            }}
          >
            {element.content || 'Your text here...'}
          </p>
        );

      case 'image':
        return element.props?.src ? (
          <img
            src={element.props.src}
            alt={element.props?.alt || ''}
            className="max-w-full rounded-lg mx-auto"
            style={{
              width: element.props?.width || '100%',
              borderRadius: element.props?.borderRadius ? `${element.props.borderRadius}px` : undefined,
            }}
          />
        ) : (
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border">
            📷 Click to add image URL
          </div>
        );

      case 'button':
        return (
          <div style={{ textAlign: element.props?.align || 'center' }}>
            <button
              className="px-8 py-3 text-lg rounded-xl font-semibold transition-all hover:opacity-90 shadow-md"
              style={{
                backgroundColor: element.props?.bgColor || 'hsl(var(--primary))',
                color: element.props?.textColor || '#ffffff',
                borderRadius: element.props?.borderRadius ? `${element.props.borderRadius}px` : '12px',
              }}
            >
              {element.content || 'Click Me'}
            </button>
          </div>
        );

      case 'spacer':
        return (
          <div
            style={{ height: element.props?.height || 40 }}
            className={isEditor ? 'border border-dashed border-border/50 rounded bg-muted/20' : ''}
          />
        );

      case 'video':
        return element.props?.url ? (
          <div className="aspect-video rounded-xl overflow-hidden bg-muted shadow-sm">
            <iframe
              src={element.props.url}
              className="w-full h-full"
              allowFullScreen
              title="Video"
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border">
            ▶️ Add video embed URL
          </div>
        );

      case 'countdown':
        return <CountdownTimer element={element} />;

      case 'product-price': {
        const { price = 29.99, currency = '$', originalPrice } = element.props || {};
        return (
          <div className="text-center py-3">
            {originalPrice && (
              <span className="text-muted-foreground line-through text-xl mr-3">
                {currency}{originalPrice}
              </span>
            )}
            <span className="text-4xl font-extrabold" style={{ color: element.props?.color || undefined }}>
              {currency}{price}
            </span>
            {originalPrice && (
              <span className="ml-3 inline-block bg-red-100 text-red-700 text-sm font-bold px-2 py-0.5 rounded-full">
                -{Math.round((1 - price / originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
        );
      }

      case 'product-image':
        return element.props?.src ? (
          <img
            src={element.props.src}
            alt={element.props?.alt || 'Product'}
            className="max-w-full rounded-xl mx-auto shadow-sm"
            style={{ maxHeight: 400 }}
          />
        ) : (
          <div className="w-full max-w-md mx-auto h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border">
            🖼️ Product image
          </div>
        );

      case 'order-button':
        return (
          <div style={{ textAlign: element.props?.align || 'center' }}>
            <button
              className="px-12 py-4 text-lg rounded-xl font-bold tracking-wide transition-all hover:opacity-90 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: element.props?.bgColor || '#2563eb',
                color: element.props?.textColor || '#ffffff',
                width: element.props?.fullWidth ? '100%' : undefined,
              }}
            >
              {element.content || '🛒 Order Now - Cash on Delivery'}
            </button>
          </div>
        );

      case 'cod-order-form':
        return <CODOrderForm funnel={funnel} isEditor={isEditor} />;

      case 'trust-badges':
        return (
          <div className="flex flex-wrap justify-center gap-6 py-4">
            {[
              { icon: Shield, label: 'Secure Payment' },
              { icon: Truck, label: 'Fast Delivery' },
              { icon: RotateCcw, label: '30-Day Returns' },
              { icon: CheckCircle2, label: 'Quality Guarantee' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        );

      case 'testimonial': {
        const { name = 'Customer', text = 'Great product!', rating = 5 } = element.props || {};
        return (
          <div className="max-w-md mx-auto p-5 bg-muted/30 rounded-xl border border-border">
            <div className="flex gap-1 mb-2">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-foreground/80 text-sm italic mb-3">"{text}"</p>
            <p className="text-sm font-semibold text-foreground">— {name}</p>
          </div>
        );
      }

      case 'features-list': {
        const items = element.props?.items || ['Feature 1', 'Feature 2', 'Feature 3'];
        return (
          <div className="max-w-md mx-auto space-y-2 py-2">
            {items.map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-foreground/80">
                <span className="text-base">{item}</span>
              </div>
            ))}
          </div>
        );
      }

      default:
        return <div className="p-4 bg-muted rounded text-sm text-muted-foreground">Unknown element: {element.type}</div>;
    }
  };

  return (
    <div onClick={handleClick}>
      {renderElement()}
    </div>
  );
};

// Live countdown timer
function CountdownTimer({ element }: { element: FunnelElement }) {
  const { hours: initH = 2, minutes: initM = 0, seconds: initS = 0 } = element.props || {};
  const [totalSeconds, setTotalSeconds] = useState(initH * 3600 + initM * 60 + initS);

  useEffect(() => {
    setTotalSeconds(initH * 3600 + initM * 60 + initS);
  }, [initH, initM, initS]);

  useEffect(() => {
    if (totalSeconds <= 0) return;
    const timer = setInterval(() => setTotalSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [totalSeconds]);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    <div className="flex justify-center gap-3 py-4">
      {[
        { label: 'Hours', value: h },
        { label: 'Minutes', value: m },
        { label: 'Seconds', value: s },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="text-2xl font-bold bg-foreground text-background rounded-lg w-14 h-14 flex items-center justify-center tabular-nums">
            {String(value).padStart(2, '0')}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default ElementRenderer;
