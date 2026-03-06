import { ElementType } from '@/types/funnel';
import {
  Type, AlignLeft, Image, MousePointer, Minus, Play, Clock, DollarSign,
  ShoppingCart, CreditCard, GripVertical, ListChecks, Star, Badge,
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface EditorSidebarProps {
  onAddElement: (type: ElementType) => void;
}

const elementGroups = [
  {
    label: 'Content',
    items: [
      { type: 'headline' as ElementType, label: 'Headline', icon: Type },
      { type: 'paragraph' as ElementType, label: 'Paragraph', icon: AlignLeft },
      { type: 'image' as ElementType, label: 'Image', icon: Image },
      { type: 'button' as ElementType, label: 'Button', icon: MousePointer },
      { type: 'spacer' as ElementType, label: 'Spacer', icon: Minus },
      { type: 'video' as ElementType, label: 'Video', icon: Play },
    ],
  },
  {
    label: 'Product',
    items: [
      { type: 'product-price' as ElementType, label: 'Price', icon: DollarSign },
      { type: 'product-image' as ElementType, label: 'Product Image', icon: Image },
      { type: 'countdown' as ElementType, label: 'Countdown', icon: Clock },
    ],
  },
  {
    label: 'Conversion',
    items: [
      { type: 'order-button' as ElementType, label: 'Order Button', icon: ShoppingCart },
      { type: 'cod-order-form' as ElementType, label: 'COD Form', icon: CreditCard },
      { type: 'trust-badges' as ElementType, label: 'Trust Badges', icon: Badge },
      { type: 'testimonial' as ElementType, label: 'Testimonial', icon: Star },
      { type: 'features-list' as ElementType, label: 'Features List', icon: ListChecks },
    ],
  },
];

function DraggableSidebarItem({ type, label, icon: Icon, onAddElement }: {
  type: ElementType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onAddElement: (type: ElementType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, origin: 'sidebar' },
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 1000,
    opacity: isDragging ? 0.7 : 1,
  } : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onAddElement(type)}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-center group cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-lg ring-2 ring-primary/30 bg-card' : ''}`}
    >
      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-[11px] leading-tight text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </button>
  );
}

const EditorSidebar = ({ onAddElement }: EditorSidebarProps) => {
  return (
    <div className="w-56 bg-card border-r border-border h-full overflow-y-auto flex-shrink-0">
      <div className="p-3">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Components</h3>
        {elementGroups.map(group => (
          <div key={group.label} className="mb-5">
            <h4 className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 px-1">{group.label}</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map(item => (
                <DraggableSidebarItem
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  icon={item.icon}
                  onAddElement={onAddElement}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorSidebar;
