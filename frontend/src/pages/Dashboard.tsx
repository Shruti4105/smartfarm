import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FlaskConical,
  BookOpen,
  ShoppingBag,
  Store,
  Wheat,
  Users,
  ArrowRight,
  Leaf,
  LayoutDashboard,
  ClipboardList,
  Package,
  History,
  Zap,
} from 'lucide-react';

const features = [
  {
    title: 'Soil Analysis',
    description: 'Upload soil images for AI-powered analysis and get crop recommendations tailored to your soil.',
    icon: FlaskConical,
    path: '/soil-analysis',
    color: 'bg-amber-50 dark:bg-amber-950/30',
    iconColor: 'text-amber-600',
    badge: 'AI Powered',
  },
  {
    title: 'Crop Advisory',
    description: 'Enter soil parameters and get smart crop recommendations with sustainable farming practices.',
    icon: BookOpen,
    path: '/crop-advisory',
    color: 'bg-green-50 dark:bg-green-950/30',
    iconColor: 'text-green-600',
    badge: 'Smart Tips',
  },
  {
    title: 'Marketplace',
    description: 'Browse and buy farming products from local sellers in your area.',
    icon: ShoppingBag,
    path: '/marketplace',
    color: 'bg-blue-50 dark:bg-blue-950/30',
    iconColor: 'text-blue-600',
    badge: 'Local Sellers',
  },
  {
    title: 'Our Store',
    description: 'Shop premium fertilizers, seeds, pesticides, and farming tools from our curated store.',
    icon: Store,
    path: '/our-store',
    color: 'bg-purple-50 dark:bg-purple-950/30',
    iconColor: 'text-purple-600',
    badge: 'Premium',
  },
  {
    title: 'Sell Your Crops',
    description: 'List your harvest for sale and connect with buyers looking for fresh local produce.',
    icon: Wheat,
    path: '/sell-crops',
    color: 'bg-orange-50 dark:bg-orange-950/30',
    iconColor: 'text-orange-600',
    badge: 'Earn More',
  },
  {
    title: 'Buy from Farmers',
    description: 'Purchase fresh crops directly from local farmers at fair prices.',
    icon: Users,
    path: '/buy-from-farmers',
    color: 'bg-teal-50 dark:bg-teal-950/30',
    iconColor: 'text-teal-600',
    badge: 'Fresh & Local',
  },
];

const quickAccess = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Soil Analysis', path: '/soil-analysis', icon: FlaskConical },
  { label: 'Crop Advisory', path: '/crop-advisory', icon: BookOpen },
  { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  { label: 'Our Store', path: '/our-store', icon: Store },
  { label: 'Sell Crops', path: '/sell-crops', icon: Wheat },
  { label: 'Buy from Farmers', path: '/buy-from-farmers', icon: Users },
  { label: 'My Listings', path: '/my-crop-listings', icon: ClipboardList },
  { label: 'Seller Mgmt', path: '/seller-product-management', icon: Package },
  { label: 'Order History', path: '/order-history', icon: History },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const greeting = userProfile?.username ? `Welcome back, ${userProfile.username}!` : 'Welcome to FarmSmart!';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/farm-hero-bg.dim_1440x500.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-primary-foreground/80" />
              <span className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">
                Smart Farming Platform
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              {greeting}
            </h1>
            <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">
              Your all-in-one platform for AI-powered soil analysis, smart crop advisory, and a connected farming marketplace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate({ to: '/soil-analysis' })}
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <FlaskConical className="w-4 h-4 mr-2" />
                Analyze Soil
              </Button>
              <Button
                onClick={() => navigate({ to: '/marketplace' })}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Browse Marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Bar */}
      <section className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Access</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickAccess.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate({ to: path })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-sm font-medium text-muted-foreground transition-all duration-200 border border-border hover:border-primary"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Everything You Need to Farm Smarter</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From AI soil analysis to a connected marketplace — all the tools modern farmers need in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ title, description, icon: Icon, path, color, iconColor, badge }) => (
            <Card
              key={path}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30 overflow-hidden"
              onClick={() => navigate({ to: path })}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    {badge}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: '10,000+', label: 'Farmers Served' },
              { value: '50+', label: 'Crop Varieties' },
              { value: '95%', label: 'Analysis Accuracy' },
              { value: '24/7', label: 'Platform Access' },
            ].map(({ value, label }) => (
              <div key={label} className="p-4">
                <div className="text-3xl font-bold text-primary mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join thousands of farmers using FarmSmart to increase yields and reduce costs.
          </p>
          <Button
            onClick={() => navigate({ to: '/auth' })}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </section>
      )}
    </div>
  );
}
