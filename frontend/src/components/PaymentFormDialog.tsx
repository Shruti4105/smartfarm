import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, Loader2, ShoppingCart } from 'lucide-react';
import type { StoreItem, PaymentMethod, Order } from '../backend';
import { useCheckout } from '../hooks/useQueries';
import { toast } from 'sonner';

interface CartItem {
  item: StoreItem;
  quantity: number;
}

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  total: number;
  onSuccess: (order: Order) => void;
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export default function PaymentFormDialog({
  open,
  onOpenChange,
  cartItems,
  total,
  onSuccess,
}: PaymentFormDialogProps) {
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkoutMutation = useCheckout();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!cardHolderName.trim()) newErrors.cardHolderName = 'Cardholder name is required';
    const rawCard = cardNumber.replace(/\s/g, '');
    if (!rawCard || rawCard.length < 16) newErrors.cardNumber = 'Enter a valid 16-digit card number';
    if (!expiryDate || expiryDate.length < 5) newErrors.expiryDate = 'Enter a valid expiry date (MM/YY)';
    if (!cvv || cvv.length < 3) newErrors.cvv = 'Enter a valid CVV (3-4 digits)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const paymentMethod: PaymentMethod = {
      cardHolderName: cardHolderName.trim(),
      cardNumber: cardNumber.replace(/\s/g, '').slice(-4).padStart(16, '*'),
      expiryDate,
      cvv: '***',
    };

    const items: StoreItem[] = cartItems.map(({ item, quantity }) => ({
      ...item,
      stock: BigInt(quantity),
    }));

    try {
      const order = await checkoutMutation.mutateAsync({ items, total, paymentMethod });
      toast.success('Payment successful! Order confirmed.');
      onSuccess(order);
      // Reset form
      setCardHolderName('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setErrors({});
    } catch {
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete your purchase securely. All transactions are encrypted.
          </DialogDescription>
        </DialogHeader>

        {/* Order Summary */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Order Summary
          </div>
          {cartItems.map(({ item, quantity }) => (
            <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
              <span>{item.name} × {quantity}</span>
              <span>${(item.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cardHolderName">Cardholder Name</Label>
            <Input
              id="cardHolderName"
              placeholder="John Doe"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className={errors.cardHolderName ? 'border-destructive' : ''}
            />
            {errors.cardHolderName && (
              <p className="text-xs text-destructive">{errors.cardHolderName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className={errors.cardNumber ? 'border-destructive' : ''}
            />
            {errors.cardNumber && (
              <p className="text-xs text-destructive">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                maxLength={5}
                className={errors.expiryDate ? 'border-destructive' : ''}
              />
              {errors.expiryDate && (
                <p className="text-xs text-destructive">{errors.expiryDate}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className={errors.cvv ? 'border-destructive' : ''}
              />
              {errors.cvv && (
                <p className="text-xs text-destructive">{errors.cvv}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Lock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>Your payment information is encrypted and secure. This is a simulated payment.</span>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={checkoutMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={checkoutMutation.isPending}
              className="bg-primary text-primary-foreground"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay ${total.toFixed(2)}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
