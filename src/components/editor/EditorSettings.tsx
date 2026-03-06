import { FunnelElement } from '@/types/funnel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, X } from 'lucide-react';

interface EditorSettingsProps {
  element: FunnelElement | null;
  onUpdate: (element: FunnelElement) => void;
  onDelete: (elementId: string) => void;
  onClose: () => void;
}

const EditorSettings = ({ element, onUpdate, onDelete, onClose }: EditorSettingsProps) => {
  if (!element) return null;

  const updateProp = (key: string, value: any) => {
    onUpdate({ ...element, props: { ...element.props, [key]: value } });
  };

  const updateContent = (content: string) => {
    onUpdate({ ...element, content });
  };

  return (
    <div className="w-72 bg-card border-l border-border h-full overflow-y-auto animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground capitalize">{element.type.replace('-', ' ')}</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Content field for text elements */}
        {['headline', 'paragraph', 'button', 'order-button'].includes(element.type) && (
          <div>
            <Label className="text-xs">Content</Label>
            {element.type === 'paragraph' ? (
              <Textarea
                value={element.content || ''}
                onChange={e => updateContent(e.target.value)}
                className="mt-1"
                rows={4}
              />
            ) : (
              <Input
                value={element.content || ''}
                onChange={e => updateContent(e.target.value)}
                className="mt-1"
              />
            )}
          </div>
        )}

        {/* Alignment */}
        {['headline', 'paragraph', 'button', 'order-button'].includes(element.type) && (
          <div>
            <Label className="text-xs">Alignment</Label>
            <Select value={element.props?.align || 'left'} onValueChange={v => updateProp('align', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Heading level */}
        {element.type === 'headline' && (
          <div>
            <Label className="text-xs">Heading Level</Label>
            <Select value={element.props?.level || 'h2'} onValueChange={v => updateProp('level', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Image/Product image src */}
        {['image', 'product-image'].includes(element.type) && (
          <>
            <div>
              <Label className="text-xs">Image URL</Label>
              <Input
                value={element.props?.src || ''}
                onChange={e => updateProp('src', e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Alt Text</Label>
              <Input
                value={element.props?.alt || ''}
                onChange={e => updateProp('alt', e.target.value)}
                className="mt-1"
              />
            </div>
          </>
        )}

        {/* Video URL */}
        {element.type === 'video' && (
          <div>
            <Label className="text-xs">Video Embed URL</Label>
            <Input
              value={element.props?.url || ''}
              onChange={e => updateProp('url', e.target.value)}
              placeholder="https://youtube.com/embed/..."
              className="mt-1"
            />
          </div>
        )}

        {/* Spacer height */}
        {element.type === 'spacer' && (
          <div>
            <Label className="text-xs">Height (px)</Label>
            <Input
              type="number"
              value={element.props?.height || 40}
              onChange={e => updateProp('height', parseInt(e.target.value) || 40)}
              className="mt-1"
            />
          </div>
        )}

        {/* Price */}
        {element.type === 'product-price' && (
          <>
            <div>
              <Label className="text-xs">Price</Label>
              <Input
                type="number"
                step="0.01"
                value={element.props?.price || 0}
                onChange={e => updateProp('price', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Original Price</Label>
              <Input
                type="number"
                step="0.01"
                value={element.props?.originalPrice || ''}
                onChange={e => updateProp('originalPrice', parseFloat(e.target.value) || undefined)}
                placeholder="Leave empty for no strikethrough"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Currency</Label>
              <Input
                value={element.props?.currency || '$'}
                onChange={e => updateProp('currency', e.target.value)}
                className="mt-1"
              />
            </div>
          </>
        )}

        {/* Countdown */}
        {element.type === 'countdown' && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Hours</Label>
              <Input type="number" value={element.props?.hours || 0} onChange={e => updateProp('hours', parseInt(e.target.value) || 0)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Min</Label>
              <Input type="number" value={element.props?.minutes || 0} onChange={e => updateProp('minutes', parseInt(e.target.value) || 0)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Sec</Label>
              <Input type="number" value={element.props?.seconds || 0} onChange={e => updateProp('seconds', parseInt(e.target.value) || 0)} className="mt-1" />
            </div>
          </div>
        )}

        {/* Delete button */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(element.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Element
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorSettings;
