import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Funnel } from '@/types/funnel';
import { saveOrder } from '@/store/funnel-store';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const orderSchema = z.object({
  fullName: z.string().trim().min(2, 'Name is required').max(100),
  phone: z.string().trim().min(6, 'Phone is required').max(20),
  city: z.string().trim().min(2, 'City is required').max(100),
  address: z.string().trim().min(5, 'Address is required').max(300),
  quantity: z.number().min(1).max(99),
});

interface CODOrderFormProps {
  funnel?: Funnel;
  isEditor?: boolean;
}

export const CODOrderForm = ({ funnel, isEditor }: CODOrderFormProps) => {
  const [form, setForm] = useState({ fullName: '', phone: '', city: '', address: '', quantity: 1 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const price = funnel?.product?.price || 29.99;
  const currency = funnel?.product?.currency || '$';
  const total = price * form.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditor) return;

    const result = orderSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    saveOrder({
      funnelId: funnel?.id || '',
      funnelName: funnel?.name || '',
      customerName: form.fullName,
      phone: form.phone,
      city: form.city,
      address: form.address,
      quantity: form.quantity,
      productName: funnel?.product?.name || 'Product',
      total,
      status: 'new',
    });

    setSubmitted(true);
    toast({ title: 'Order placed!', description: 'We will contact you shortly to confirm.' });
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-xl font-bold text-foreground mb-2">Order Placed Successfully!</h3>
        <p className="text-muted-foreground">We will contact you shortly to confirm your order.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-6 card-elevated">
      <h3 className="text-lg font-bold text-foreground text-center mb-4">Complete Your Order</h3>
      
      <div>
        <Input
          placeholder="Full Name"
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
          disabled={isEditor}
        />
        {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <Input
          placeholder="Phone Number"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          disabled={isEditor}
        />
        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
      </div>

      <div>
        <Input
          placeholder="City"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
          disabled={isEditor}
        />
        {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
      </div>

      <div>
        <Input
          placeholder="Full Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          disabled={isEditor}
        />
        {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Quantity:</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
            disabled={isEditor}
          >-</Button>
          <span className="font-semibold w-8 text-center">{form.quantity}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
            disabled={isEditor}
          >+</Button>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-center">
        <span className="text-muted-foreground">Total:</span>
        <span className="text-2xl font-bold text-foreground">{currency}{total.toFixed(2)}</span>
      </div>

      <Button type="submit" className="w-full btn-gradient py-3 text-base font-bold" disabled={isEditor}>
        Place Order - Cash on Delivery
      </Button>
    </form>
  );
};
