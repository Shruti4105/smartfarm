import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCropListingsByLocation, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import PaymentFormDialog from '../components/PaymentFormDialog';
import type { CropListing, Order, StoreItem } from '../backend';
import {
  Users,
  Search,
  MapPin,
  Wheat,
  Scale,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';

export default function BuyFromFarmers() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const location = userProfile?.location ?? '';
  const { data: listings, isLoading } = useGetCropListingsByLocation(location);

  const [search, setSearch] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<CropListing | null>(null);

  const filtered = (listings ?? []).filter((l) =>
    l.cropName.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuyNow = (listing: CropListing) => {
    setSelectedListing(listing);
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = (order: Order) => {
    setPaymentOpen(false);
    setSelectedListing(null);
    navigate({
      to: '/checkout-success',
      search: { confirmationNumber: order.confirmationNumber, total: order.total.toString() },
    });
  };

  const selectedCartItems = selectedListing
    ? [
        {
          item: {
            id: selectedListing.id,
            name: selectedListing.cropName,
            price: selectedListing.pricePerUnit,
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
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Buy from Farmers</h1>
              <p className="text-muted-foreground text-sm">
                Fresh crops directly from local farmers
                {location && ` in ${location}`}
              </p>
            </div>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search crops or location..."
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
            <Wheat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Crop Listings Found</h3>
            <p className="text-muted-foreground mb-6">
              {search
                ? 'No crops match your search. Try different keywords.'
                : location
                ? `No crop listings in ${location} yet.`
                : 'Set your location in your profile to see local crop listings.'}
            </p>
            <Button
              onClick={() => navigate({ to: '/my-crop-listings' })}
              className="bg-primary text-primary-foreground"
            >
              List Your Crops
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filtered.length} listing{filtered.length !== 1 ? 's' : ''}
              {location && ` in ${location}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <Card
                  key={listing.id}
                  className="border border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Wheat className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {listing.location}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-3">{listing.cropName}</h3>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Quantity: {listing.quantity} kg</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Price: ${listing.pricePerUnit.toFixed(2)} / kg</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${listing.pricePerUnit.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/kg</span>
                      </span>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground"
                        onClick={() => handleBuyNow(listing)}
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
        total={selectedListing?.pricePerUnit ?? 0}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
