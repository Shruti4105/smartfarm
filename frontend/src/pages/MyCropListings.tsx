import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllCropListings, useAddCropListing } from '../hooks/useQueries';
import type { CropListing } from '../backend';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sprout, Plus, ArrowLeft, MapPin, Tag, Package,
  Loader2, AlertCircle, CheckCircle2, TrendingUp, Wheat
} from 'lucide-react';

export default function MyCropListings() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allListings, isLoading } = useGetAllCropListings();
  const addListingMutation = useAddCropListing();

  const [showForm, setShowForm] = useState(false);
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [location, setLocation] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!identity) {
    navigate({ to: '/auth' });
    return null;
  }

  // Filter listings by current user
  const myListings: CropListing[] = (allListings || []).filter(
    l => l.farmer.toString() === identity.getPrincipal().toString()
  );

  const handleOpenForm = () => {
    setLocation(userProfile?.location || '');
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!cropName.trim()) { setFormError('Please enter crop name.'); return; }
    const qty = parseFloat(quantity);
    const price = parseFloat(pricePerUnit);
    if (isNaN(qty) || qty <= 0) { setFormError('Please enter a valid quantity.'); return; }
    if (isNaN(price) || price <= 0) { setFormError('Please enter a valid price per unit.'); return; }
    if (!location.trim()) { setFormError('Please enter your location.'); return; }

    try {
      await addListingMutation.mutateAsync({
        cropName: cropName.trim(),
        quantity: qty,
        pricePerUnit: price,
        location: location.trim(),
      });
      setSuccessMsg(`"${cropName}" listed successfully!`);
      setCropName('');
      setQuantity('');
      setPricePerUnit('');
      setShowForm(false);
    } catch {
      setFormError('Failed to add listing. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">My Crop Listings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your crop listings and sell to buyers across the region
          </p>
        </div>
        <Button onClick={handleOpenForm} className="gap-2">
          <Plus className="h-4 w-4" /> Add Listing
        </Button>
      </div>

      {successMsg && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="font-bold text-2xl text-primary">{myListings.length}</div>
            <div className="text-xs text-muted-foreground">Active Listings</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <Package className="h-6 w-6 text-amber-600 mx-auto mb-1" />
            <div className="font-bold text-2xl text-amber-700">
              {myListings.reduce((sum, l) => sum + l.quantity, 0).toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Qty (kg)</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200 col-span-2 md:col-span-1">
          <CardContent className="p-4 text-center">
            <Sprout className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="font-bold text-2xl text-green-700">
              {new Set(myListings.map(l => l.cropName)).size}
            </div>
            <div className="text-xs text-muted-foreground">Crop Varieties</div>
          </CardContent>
        </Card>
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : myListings.length === 0 ? (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="py-16 text-center">
            <Wheat className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start selling your crops and pulses to buyers across the region. Add your first listing now!
            </p>
            <Button onClick={handleOpenForm} className="gap-2">
              <Plus className="h-4 w-4" /> Add Your First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {myListings.map(listing => (
            <Card key={listing.id} className="shadow-card hover:shadow-card-hover transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <Sprout className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base">{listing.cropName}</h3>
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />{listing.location}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" /> {listing.quantity} kg available
                      </span>
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <Tag className="h-3.5 w-3.5" /> ₹{listing.pricePerUnit}/kg
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Public View CTA */}
      {myListings.length > 0 && (
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Sprout className="h-6 w-6 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Your listings are visible to buyers!</p>
              <p className="text-xs text-muted-foreground">
                Buyers can find your crops in the "Buy from Farmers" section.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/buy-from-farmers' })}
            >
              View Public Page
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Listing Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" /> Add Crop Listing
            </DialogTitle>
            <DialogDescription>
              List your crop for sale to buyers across the region.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="cropName">Crop Name</Label>
              <Input
                id="cropName"
                placeholder="e.g. Wheat, Rice, Lentils, Chickpeas..."
                value={cropName}
                onChange={e => setCropName(e.target.value)}
                disabled={addListingMutation.isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 500"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  disabled={addListingMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per kg (₹)</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 25.00"
                  value={pricePerUnit}
                  onChange={e => setPricePerUnit(e.target.value)}
                  disabled={addListingMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listingLocation">Your Location / District</Label>
              <Input
                id="listingLocation"
                placeholder="e.g. Punjab, Haryana, Maharashtra..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                disabled={addListingMutation.isPending}
              />
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
                disabled={addListingMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 font-bold"
                disabled={addListingMutation.isPending}
              >
                {addListingMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Listing...</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> List Crop</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
