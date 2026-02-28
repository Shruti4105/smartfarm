import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllProducts, useAddProduct } from '../hooks/useQueries';
import type { Product } from '../backend';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingBag, Plus, ArrowLeft, MapPin, Tag, Package,
  Loader2, AlertCircle, CheckCircle2, Store, TrendingUp
} from 'lucide-react';

export default function SellerProductManagement() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allProducts, isLoading } = useGetAllProducts();
  const addProductMutation = useAddProduct();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!identity) {
    navigate({ to: '/auth' });
    return null;
  }

  // Filter products by current seller
  const myProducts: Product[] = (allProducts || []).filter(
    p => p.seller.toString() === identity.getPrincipal().toString()
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

    if (!name.trim()) { setFormError('Please enter a product name.'); return; }
    if (!description.trim()) { setFormError('Please enter a product description.'); return; }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) { setFormError('Please enter a valid price.'); return; }
    if (!location.trim()) { setFormError('Please enter your location.'); return; }

    try {
      await addProductMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        location: location.trim(),
      });
      setSuccessMsg(`"${name}" listed successfully!`);
      setName('');
      setDescription('');
      setPrice('');
      setShowForm(false);
    } catch {
      setFormError('Failed to add product. Please try again.');
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
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Sell Products</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            List your fertilizers, seeds, pesticides, and farming tools for sale
          </p>
        </div>
        <Button onClick={handleOpenForm} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {successMsg && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <Store className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="font-bold text-2xl text-primary">{myProducts.length}</div>
            <div className="text-xs text-muted-foreground">Products Listed</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-amber-600 mx-auto mb-1" />
            <div className="font-bold text-2xl text-amber-700">
              {myProducts.length > 0
                ? `₹${Math.min(...myProducts.map(p => p.price)).toFixed(0)}`
                : '—'}
            </div>
            <div className="text-xs text-muted-foreground">Lowest Price</div>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <ShoppingBag className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-blue-800">How it works</p>
            <p className="text-xs text-blue-700 mt-0.5">
              List your products here and farmers in your region will be able to find and contact you through the Marketplace. Products are shown to farmers nearest to your location first.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : myProducts.length === 0 ? (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">No products listed yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start selling your farming products to farmers in your region. Add your first product listing now!
            </p>
            <Button onClick={handleOpenForm} className="gap-2">
              <Plus className="h-4 w-4" /> Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {myProducts.map(product => (
            <Card key={product.id} className="shadow-card hover:shadow-card-hover transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base">{product.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />{product.location}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{product.description}</p>
                    <div className="flex items-center gap-1 mt-1 text-primary font-semibold text-sm">
                      <Tag className="h-3.5 w-3.5" /> ₹{product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Marketplace CTA */}
      {myProducts.length > 0 && (
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Store className="h-6 w-6 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Your products are live in the Marketplace!</p>
              <p className="text-xs text-muted-foreground">
                Farmers near your location can find and contact you.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/marketplace' })}
            >
              View Marketplace
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Add Product Listing
            </DialogTitle>
            <DialogDescription>
              List your product for farmers to find in the marketplace.
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
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g. Urea Fertilizer 50kg, Neem Pesticide..."
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={addProductMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                placeholder="Describe your product, quantity available, quality, etc."
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={addProductMutation.isPending}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="productPrice">Price (₹)</Label>
                <Input
                  id="productPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 1200.00"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  disabled={addProductMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productLocation">Location / District</Label>
                <Input
                  id="productLocation"
                  placeholder="e.g. Punjab"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  disabled={addProductMutation.isPending}
                />
              </div>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
                disabled={addProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 font-bold"
                disabled={addProductMutation.isPending}
              >
                {addProductMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Listing...</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> List Product</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
