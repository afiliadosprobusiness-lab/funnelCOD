import { ElementType } from '@/types/funnel';
import {
  Type, AlignLeft, Image, MousePointer, Minus, Play, Clock, DollarSign,
  ShoppingCart, CreditCard, FileText,
} from 'lucide-react';

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
    label: 'Order',
    items: [
      { type: 'order-button' as ElementType, label: 'Order Button', icon: ShoppingCart },
      { type: 'cod-order-form' as ElementType, label: 'COD Form', icon: CreditCard },
    ],
  },
];

const EditorSidebar = ({ onAddElement }: EditorSidebarProps) => {
  return (
    <div className="w-60 bg-card border-r border-border h-full overflow-y-auto p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Components</h3>
      {elementGroups.map(group => (
        <div key={group.label} className="mb-6">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">{group.label}</h4>
          <div className="grid grid-cols-2 gap-2">
            {group.items.map(item => (
              <button
                key={item.type}
                onClick={() => onAddElement(item.type)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-center group"
              >
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditorSidebar;
