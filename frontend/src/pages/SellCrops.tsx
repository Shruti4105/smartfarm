import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wheat, ClipboardList, Package, ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function SellCrops() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Wheat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access selling features.
          </p>
          <Button onClick={() => navigate({ to: '/auth' })} className="bg-primary text-primary-foreground">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Wheat className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Sell Your Crops</h1>
              <p className="text-muted-foreground text-sm">Connect with buyers and grow your farming business</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Users, label: 'Active Buyers', value: '2,400+', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
            { icon: TrendingUp, label: 'Avg. Price Increase', value: '23%', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' },
            { icon: DollarSign, label: 'Total Sales This Month', value: '$48K+', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} className="border border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${bg}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Options */}
        <h2 className="text-xl font-bold text-foreground mb-6">Choose How to Sell</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card
            className="border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate({ to: '/my-crop-listings' })}
          >
            <CardContent className="p-8">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                <ClipboardList className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                List Your Crops
              </h3>
              <p className="text-muted-foreground mb-6">
                Create listings for your harvested crops. Set your price, quantity, and location to connect with local buyers.
              </p>
              <div className="flex items-center text-primary font-medium gap-1 group-hover:gap-2 transition-all">
                Manage Crop Listings <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate({ to: '/seller-product-management' })}
          >
            <CardContent className="p-8">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/30 rounded-xl w-fit mb-4">
                <Package className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                Sell Farm Products
              </h3>
              <p className="text-muted-foreground mb-6">
                List farming supplies like fertilizers, seeds, pesticides, and tools in the marketplace for other farmers to buy.
              </p>
              <div className="flex items-center text-primary font-medium gap-1 group-hover:gap-2 transition-all">
                Manage Products <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
