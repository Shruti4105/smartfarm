import { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Menu,
  Leaf,
  FlaskConical,
  BookOpen,
  ShoppingBag,
  Store,
  Wheat,
  Users,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  ClipboardList,
  Package,
  History,
} from 'lucide-react';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Soil Analysis', path: '/soil-analysis', icon: FlaskConical },
  { label: 'Crop Advisory', path: '/crop-advisory', icon: BookOpen },
  { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  { label: 'Our Store', path: '/our-store', icon: Store },
  { label: 'Sell Crops', path: '/sell-crops', icon: Wheat },
  { label: 'Buy from Farmers', path: '/buy-from-farmers', icon: Users },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/auth' });
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity"
          >
            <img src="/assets/generated/app-logo.dim_128x128.png" alt="FarmSmart" className="w-8 h-8 rounded-lg" />
            <span className="hidden sm:block">FarmSmart</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate({ to: path })}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block max-w-[120px] truncate">
                      {userProfile?.username ?? 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: '/my-crop-listings' })}>
                    <ClipboardList className="w-4 h-4 mr-2" /> My Crop Listings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: '/seller-product-management' })}>
                    <Package className="w-4 h-4 mr-2" /> Seller Management
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: '/order-history' })}>
                    <History className="w-4 h-4 mr-2" /> Order History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAuth} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                size="sm"
                className="bg-primary text-primary-foreground"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 p-4 border-b border-border">
                    <Leaf className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg text-primary">FarmSmart</span>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navLinks.map(({ label, path, icon: Icon }) => (
                      <SheetClose asChild key={path}>
                        <button
                          onClick={() => navigate({ to: path })}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive(path)
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      </SheetClose>
                    ))}
                    <div className="pt-2 border-t border-border mt-2">
                      <SheetClose asChild>
                        <button
                          onClick={() => navigate({ to: '/my-crop-listings' })}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <ClipboardList className="w-4 h-4" /> My Crop Listings
                        </button>
                      </SheetClose>
                      <SheetClose asChild>
                        <button
                          onClick={() => navigate({ to: '/seller-product-management' })}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Package className="w-4 h-4" /> Seller Management
                        </button>
                      </SheetClose>
                      <SheetClose asChild>
                        <button
                          onClick={() => navigate({ to: '/order-history' })}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <History className="w-4 h-4" /> Order History
                        </button>
                      </SheetClose>
                    </div>
                  </nav>
                  <div className="p-4 border-t border-border">
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => { handleAuth(); setMobileOpen(false); }}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-primary text-primary-foreground"
                        onClick={() => { handleAuth(); setMobileOpen(false); }}
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
