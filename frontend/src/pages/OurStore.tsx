import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetStoreItems } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import PaymentFormDialog from '../components/PaymentFormDialog';
import type { Order, StoreItem } from '../backend';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Store,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  item: StoreItem;
  quantity: number;
}

export default function OurStore() {
  const navigate = useNavigate();
  const { data: storeItems, isLoading } = useGetStoreItems();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const addToCart = (item: StoreItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item.id === itemId ? { ...c, quantity: c.quantity + delta } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const cartCount = cart.reduce((sum, { quantity }) => sum + quantity, 0);

  const handlePaymentSuccess = (order: Order) => {
    setPaymentOpen(false);
    setCart([]);
    navigate({
      to: '/checkout-success',
      search: { confirmationNumber: order.confirmationNumber, total: order.total.toString() },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Our Store</h1>
              <p className="text-muted-foreground text-sm">Premium farming supplies delivered to your door</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Available Products
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(storeItems ?? []).map((item) => {
                  const inCart = cart.find((c) => c.item.id === item.id);
                  return (
                    <Card key={item.id} className="border border-border hover:border-primary/30 hover:shadow-md transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            In Stock: {Number(item.stock)}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-4">${item.price.toFixed(2)}</p>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-semibold text-foreground w-8 text-center">
                              {inCart.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive ml-auto"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-primary text-primary-foreground"
                            onClick={() => addToCart(item)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Your Cart
                  {cartCount > 0 && (
                    <Badge className="ml-auto bg-primary text-primary-foreground">
                      {cartCount}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Your cart is empty</p>
                    <p className="text-muted-foreground text-xs mt-1">Add products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(({ item, quantity }) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${item.price.toFixed(2)} × {quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-primary">
                            ${(item.price * quantity).toFixed(2)}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">${cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full bg-primary text-primary-foreground mt-2"
                      onClick={() => setPaymentOpen(true)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Checkout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentFormDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        cartItems={cart}
        total={cartTotal}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
