import { FunnelElement } from '@/types/funnel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Trash2, X, Copy, ChevronUp, ChevronDown } from 'lucide-react';

interface EditorSettingsProps {
  element: FunnelElement | null;
  onUpdate: (element: FunnelElement) => void;
  onDelete: (elementId: string) => void;
  onDuplicate: (elementId: string) => void;
  onMove: (elementId: string, direction: 'up' | 'down') => void;
  onClose: () => void;
}

const EditorSettings = ({ element, onUpdate, onDelete, onDuplicate, onMove, onClose }: EditorSettingsProps) => {
  if (!element) {
    return (
      <div className="w-72 bg-card border-l border-border h-full flex items-center justify-center p-6 flex-shrink-0">
        <p className="text-sm text-muted-foreground text-center">Select an element on the canvas to edit its properties</p>
      </div>
    );
  }

  const updateProp = (key: string, value: any) => {
    onUpdate({ ...element, props: { ...element.props, [key]: value } });
  };

  const updateContent = (content: string) => {
    onUpdate({ ...element, content });
  };

  const typeLabels: Record<string, string> = {
    'headline': 'Headline',
    'paragraph': 'Paragraph',
    'image': 'Image',
    'button': 'Button',
    'spacer': 'Spacer',
    'video': 'Video',
    'countdown': 'Countdown Timer',
    'product-price': 'Product Price',
    'product-image': 'Product Image',
    'order-button': 'Order Button',
    'cod-order-form': 'COD Order Form',
    'trust-badges': 'Trust Badges',
    'testimonial': 'Testimonial',
    'features-list': 'Features List',
  };

  return (
    <div className="w-72 bg-card border-l border-border h-full overflow-y-auto animate-slide-in-right flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{typeLabels[element.type] || element.type}</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 p-3 border-b border-border">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMove(element.id, 'up')} title="Move up">
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMove(element.id, 'down')} title="Move down">
          <ChevronDown className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDuplicate(element.id)} title="Duplicate">
          <Copy className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => onDelete(element.id)} title="Delete">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3 space-y-4">
        {/* Content field */}
        {['headline', 'paragraph', 'button', 'order-button'].includes(element.type) && (
          <SettingsGroup label="Content">
            {element.type === 'paragraph' ? (
              <Textarea value={element.content || ''} onChange={e => updateContent(e.target.value)} rows={4} className="text-sm" />
            ) : (
              <Input value={element.content || ''} onChange={e => updateContent(e.target.value)} className="text-sm" />
            )}
          </SettingsGroup>
        )}

        {/* Alignment */}
        {['headline', 'paragraph', 'button', 'order-button'].includes(element.type) && (
          <SettingsGroup label="Alignment">
            <div className="flex gap-1">
              {['left', 'center', 'right'].map(a => (
                <Button
                  key={a}
                  variant={element.props?.align === a ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 h-8 text-xs capitalize"
                  onClick={() => updateProp('align', a)}
                >
                  {a}
                </Button>
              ))}
            </div>
          </SettingsGroup>
        )}

        {/* Font size */}
        {['headline', 'paragraph'].includes(element.type) && (
          <SettingsGroup label={`Font Size: ${element.props?.fontSize || 16}px`}>
            <Slider
              value={[element.props?.fontSize || (element.type === 'headline' ? 28 : 16)]}
              onValueChange={([v]) => updateProp('fontSize', v)}
              min={10}
              max={72}
              step={1}
            />
          </SettingsGroup>
        )}

        {/* Text color */}
        {['headline', 'paragraph', 'product-price'].includes(element.type) && (
          <SettingsGroup label="Text Color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.props?.color || '#000000'}
                onChange={e => updateProp('color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-border"
              />
              <Input
                value={element.props?.color || ''}
                onChange={e => updateProp('color', e.target.value)}
                placeholder="Auto"
                className="flex-1 text-sm h-8"
              />
              {element.props?.color && (
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => updateProp('color', undefined)}>
                  Reset
                </Button>
              )}
            </div>
          </SettingsGroup>
        )}

        {/* Heading level */}
        {element.type === 'headline' && (
          <SettingsGroup label="Heading Level">
            <div className="flex gap-1">
              {['h1', 'h2', 'h3', 'h4'].map(l => (
                <Button
                  key={l}
                  variant={element.props?.level === l ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 h-8 text-xs uppercase"
                  onClick={() => updateProp('level', l)}
                >
                  {l}
                </Button>
              ))}
            </div>
          </SettingsGroup>
        )}

        {/* Button/Order button styles */}
        {['button', 'order-button'].includes(element.type) && (
          <>
            <SettingsGroup label="Button Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={element.props?.bgColor || '#2563eb'}
                  onChange={e => updateProp('bgColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-border"
                />
                <Input value={element.props?.bgColor || '#2563eb'} onChange={e => updateProp('bgColor', e.target.value)} className="flex-1 text-sm h-8" />
              </div>
            </SettingsGroup>
            <SettingsGroup label="Text Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={element.props?.textColor || '#ffffff'}
                  onChange={e => updateProp('textColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-border"
                />
                <Input value={element.props?.textColor || '#ffffff'} onChange={e => updateProp('textColor', e.target.value)} className="flex-1 text-sm h-8" />
              </div>
            </SettingsGroup>
            {element.type === 'order-button' && (
              <SettingsGroup label="Full Width">
                <Switch
                  checked={element.props?.fullWidth || false}
                  onCheckedChange={v => updateProp('fullWidth', v)}
                />
              </SettingsGroup>
            )}
          </>
        )}

        {/* Image/Product image src */}
        {['image', 'product-image'].includes(element.type) && (
          <>
            <SettingsGroup label="Image URL">
              <Input value={element.props?.src || ''} onChange={e => updateProp('src', e.target.value)} placeholder="https://..." className="text-sm" />
            </SettingsGroup>
            <SettingsGroup label="Alt Text">
              <Input value={element.props?.alt || ''} onChange={e => updateProp('alt', e.target.value)} className="text-sm" />
            </SettingsGroup>
            <SettingsGroup label={`Border Radius: ${element.props?.borderRadius || 12}px`}>
              <Slider
                value={[element.props?.borderRadius || 12]}
                onValueChange={([v]) => updateProp('borderRadius', v)}
                min={0} max={50} step={1}
              />
            </SettingsGroup>
          </>
        )}

        {/* Video URL */}
        {element.type === 'video' && (
          <SettingsGroup label="Video Embed URL">
            <Input value={element.props?.url || ''} onChange={e => updateProp('url', e.target.value)} placeholder="https://youtube.com/embed/..." className="text-sm" />
          </SettingsGroup>
        )}

        {/* Spacer height */}
        {element.type === 'spacer' && (
          <SettingsGroup label={`Height: ${element.props?.height || 40}px`}>
            <Slider
              value={[element.props?.height || 40]}
              onValueChange={([v]) => updateProp('height', v)}
              min={8} max={200} step={4}
            />
          </SettingsGroup>
        )}

        {/* Price */}
        {element.type === 'product-price' && (
          <>
            <SettingsGroup label="Price">
              <Input type="number" step="0.01" value={element.props?.price || 0} onChange={e => updateProp('price', parseFloat(e.target.value) || 0)} className="text-sm" />
            </SettingsGroup>
            <SettingsGroup label="Original Price (strikethrough)">
              <Input type="number" step="0.01" value={element.props?.originalPrice || ''} onChange={e => updateProp('originalPrice', parseFloat(e.target.value) || undefined)} placeholder="Leave empty for none" className="text-sm" />
            </SettingsGroup>
            <SettingsGroup label="Currency Symbol">
              <Input value={element.props?.currency || '$'} onChange={e => updateProp('currency', e.target.value)} className="text-sm" />
            </SettingsGroup>
          </>
        )}

        {/* Countdown */}
        {element.type === 'countdown' && (
          <SettingsGroup label="Time">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-[10px]">Hours</Label>
                <Input type="number" value={element.props?.hours || 0} onChange={e => updateProp('hours', parseInt(e.target.value) || 0)} className="text-sm mt-1" />
              </div>
              <div>
                <Label className="text-[10px]">Min</Label>
                <Input type="number" value={element.props?.minutes || 0} onChange={e => updateProp('minutes', parseInt(e.target.value) || 0)} className="text-sm mt-1" />
              </div>
              <div>
                <Label className="text-[10px]">Sec</Label>
                <Input type="number" value={element.props?.seconds || 0} onChange={e => updateProp('seconds', parseInt(e.target.value) || 0)} className="text-sm mt-1" />
              </div>
            </div>
          </SettingsGroup>
        )}

        {/* Testimonial */}
        {element.type === 'testimonial' && (
          <>
            <SettingsGroup label="Customer Name">
              <Input value={element.props?.name || ''} onChange={e => updateProp('name', e.target.value)} className="text-sm" />
            </SettingsGroup>
            <SettingsGroup label="Review Text">
              <Textarea value={element.props?.text || ''} onChange={e => updateProp('text', e.target.value)} rows={3} className="text-sm" />
            </SettingsGroup>
            <SettingsGroup label={`Rating: ${element.props?.rating || 5}`}>
              <Slider value={[element.props?.rating || 5]} onValueChange={([v]) => updateProp('rating', v)} min={1} max={5} step={1} />
            </SettingsGroup>
          </>
        )}

        {/* Features list */}
        {element.type === 'features-list' && (
          <SettingsGroup label="Features (one per line)">
            <Textarea
              value={(element.props?.items || []).join('\n')}
              onChange={e => updateProp('items', e.target.value.split('\n'))}
              rows={6}
              className="text-sm"
              placeholder="✅ Feature 1&#10;✅ Feature 2"
            />
          </SettingsGroup>
        )}
      </div>
    </div>
  );
};

function SettingsGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default EditorSettings;
