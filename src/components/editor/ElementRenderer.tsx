import { FunnelElement, Funnel } from '@/types/funnel';
import { CODOrderForm } from './CODOrderForm';

interface ElementRendererProps {
  element: FunnelElement;
  funnel?: Funnel;
  isEditor?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const ElementRenderer = ({ element, funnel, isEditor, selected, onClick }: ElementRendererProps) => {
  const wrapperClass = isEditor
    ? `element-draggable ${selected ? 'selected' : ''} p-2`
    : '';

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
        const sizes: Record<string, string> = { h1: 'text-4xl', h2: 'text-3xl', h3: 'text-2xl', h4: 'text-xl' };
        return (
          <Tag
            className={`font-bold ${sizes[element.props?.level || 'h2'] || 'text-3xl'} text-foreground`}
            style={{ textAlign: element.props?.align || 'left' }}
          >
            {element.content || 'Headline'}
          </Tag>
        );
      }

      case 'paragraph':
        return (
          <p
            className="text-foreground/80 leading-relaxed"
            style={{ textAlign: element.props?.align || 'left' }}
          >
            {element.content || 'Your text here...'}
          </p>
        );

      case 'image':
        return element.props?.src ? (
          <img
            src={element.props.src}
            alt={element.props?.alt || ''}
            className="max-w-full rounded-lg"
            style={{ width: element.props?.width || '100%' }}
          />
        ) : (
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
            Image placeholder
          </div>
        );

      case 'button':
        return (
          <div style={{ textAlign: element.props?.align || 'center' }}>
            <button className="btn-gradient px-8 py-3 text-lg rounded-xl font-semibold">
              {element.content || 'Click Me'}
            </button>
          </div>
        );

      case 'spacer':
        return <div style={{ height: element.props?.height || 40 }} />;

      case 'video':
        return element.props?.url ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              src={element.props.url}
              className="w-full h-full"
              allowFullScreen
              title="Video"
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
            Video placeholder
          </div>
        );

      case 'countdown': {
        const { hours = 2, minutes = 0, seconds = 0 } = element.props || {};
        return (
          <div className="flex justify-center gap-4 py-4">
            {[
              { label: 'Hours', value: hours },
              { label: 'Minutes', value: minutes },
              { label: 'Seconds', value: seconds },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-foreground bg-muted rounded-lg w-16 h-16 flex items-center justify-center">
                  {String(value).padStart(2, '0')}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{label}</span>
              </div>
            ))}
          </div>
        );
      }

      case 'product-price': {
        const { price = 29.99, currency = '$', originalPrice } = element.props || {};
        return (
          <div className="text-center py-2">
            {originalPrice && (
              <span className="text-muted-foreground line-through text-lg mr-2">
                {currency}{originalPrice}
              </span>
            )}
            <span className="text-3xl font-bold text-foreground">
              {currency}{price}
            </span>
          </div>
        );
      }

      case 'product-image':
        return element.props?.src ? (
          <img
            src={element.props.src}
            alt={element.props?.alt || 'Product'}
            className="max-w-full rounded-xl mx-auto"
            style={{ maxHeight: 400 }}
          />
        ) : (
          <div className="w-full max-w-md mx-auto h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm">
            Product image
          </div>
        );

      case 'order-button':
        return (
          <div style={{ textAlign: element.props?.align || 'center' }}>
            <button className="btn-gradient px-10 py-4 text-lg rounded-xl font-bold tracking-wide">
              {element.content || 'Order Now - Cash on Delivery'}
            </button>
          </div>
        );

      case 'cod-order-form':
        return <CODOrderForm funnel={funnel} isEditor={isEditor} />;

      default:
        return <div className="p-4 bg-muted rounded text-sm text-muted-foreground">Unknown element: {element.type}</div>;
    }
  };

  return (
    <div className={wrapperClass} onClick={handleClick}>
      {renderElement()}
    </div>
  );
};

export default ElementRenderer;
