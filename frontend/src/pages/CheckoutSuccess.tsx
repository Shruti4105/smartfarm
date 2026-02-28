import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Package,
  Clock,
  ArrowRight,
  History,
  Home,
  Truck,
} from 'lucide-react';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { confirmationNumber?: string; total?: string };

  const confirmationNumber = search.confirmationNumber ?? 'CONFIRM_ORDER';
  const total = parseFloat(search.total ?? '0');

  const estimatedDelivery = (() => {
    const start = new Date();
    start.setDate(start.getDate() + 3);
    const end = new Date();
    end.setDate(end.getDate() + 5);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  })();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-950/30 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="border border-border mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Package className="w-4 h-4 text-primary" />
              Order Details
            </div>
            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Confirmation Number</span>
                <span className="text-sm font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {confirmationNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order Total</span>
                <span className="text-sm font-bold text-foreground">${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirmed
                </span>
              </div>
            </div>

            <Separator />

            {/* Delivery Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Truck className="w-4 h-4 text-primary" />
                Estimated Delivery
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{estimatedDelivery}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                3–5 business days. You will receive a confirmation email with tracking details.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate({ to: '/order-history' })}
          >
            <History className="w-4 h-4 mr-2" />
            View Order History
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
