import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetProductsByLocation } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import PaymentFormDialog from '../components/PaymentFormDialog';
import type { Order, Product, StoreItem } from '../backend';
import {
  ShoppingBag,
  Search,
  MapPin,
  User,
  Tag,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Marketplace() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const location = userProfile?.location ?? '';
  const { data: products, isLoading } = useGetProductsByLocation(location);

  const [search, setSearch] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = (products ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = (order: Order) => {
    setPaymentOpen(false);
    setSelectedProduct(null);
    navigate({
      to: '/checkout-success',
      search: { confirmationNumber: order.confirmationNumber, total: order.total.toString() },
    });
  };

  const selectedCartItems = selectedProduct
    ? [
        {
          item: {
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            stock: BigInt(1),
          } as StoreItem,
          quantity: 1,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Marketplace</h1>
              <p className="text-muted-foreground text-sm">
                Browse farming products from local sellers
                {location && ` in ${location}`}
              </p>
            </div>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-6">
              {search
                ? 'No products match your search. Try different keywords.'
                : location
                ? `No products listed in ${location} yet.`
                : 'Set your location in your profile to see local products.'}
            </p>
            <Button
              onClick={() => navigate({ to: '/seller-product-management' })}
              className="bg-primary text-primary-foreground"
            >
              List Your Products
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              {location && ` in ${location}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <Card
                  key={product.id}
                  className="border border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Tag className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {product.location}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <User className="w-3 h-3" />
                      <span className="truncate">{product.seller.toString().slice(0, 12)}...</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground"
                        onClick={() => handleBuyNow(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <PaymentFormDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        cartItems={selectedCartItems}
        total={selectedProduct?.price ?? 0}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
