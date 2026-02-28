import { useNavigate } from '@tanstack/react-router';
import { Leaf, FlaskConical, BookOpen, ShoppingBag, Store, Wheat, Users, LayoutDashboard, Heart, ClipboardList, Package, History } from 'lucide-react';

const quickLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Soil Analysis', path: '/soil-analysis', icon: FlaskConical },
  { label: 'Crop Advisory', path: '/crop-advisory', icon: BookOpen },
  { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
];

const farmerLinks = [
  { label: 'Our Store', path: '/our-store', icon: Store },
  { label: 'Sell Crops', path: '/sell-crops', icon: Wheat },
  { label: 'Buy from Farmers', path: '/buy-from-farmers', icon: Users },
  { label: 'My Crop Listings', path: '/my-crop-listings', icon: ClipboardList },
  { label: 'Seller Management', path: '/seller-product-management', icon: Package },
  { label: 'Order History', path: '/order-history', icon: History },
];

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'farmsmart-app');

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/assets/generated/app-logo.dim_128x128.png" alt="FarmSmart" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-xl text-primary">FarmSmart</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering farmers with AI-driven soil analysis, smart crop advisory, and a connected marketplace for sustainable agriculture.
            </p>
            <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
              <Leaf className="w-3 h-3 text-primary" />
              <span>Sustainable farming for a better tomorrow</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <button
                    onClick={() => navigate({ to: path })}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Icon className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Farmer Tools */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Farmer Tools</h3>
            <ul className="space-y-2">
              {farmerLinks.map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <button
                    onClick={() => navigate({ to: path })}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Icon className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} FarmSmart. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
