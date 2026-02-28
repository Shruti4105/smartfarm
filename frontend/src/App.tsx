import { RouterProvider, createRouter, createRoute, createRootRoute, redirect, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import SoilAnalysis from './pages/SoilAnalysis';
import CropAdvisory from './pages/CropAdvisory';
import Marketplace from './pages/Marketplace';
import OurStore from './pages/OurStore';
import SellCrops from './pages/SellCrops';
import BuyFromFarmers from './pages/BuyFromFarmers';
import MyCropListings from './pages/MyCropListings';
import SellerProductManagement from './pages/SellerProductManagement';
import CheckoutSuccess from './pages/CheckoutSuccess';
import OrderHistory from './pages/OrderHistory';

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/dashboard' }); },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const soilAnalysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/soil-analysis',
  component: SoilAnalysis,
});

const cropAdvisoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crop-advisory',
  component: CropAdvisory,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace',
  component: Marketplace,
});

const ourStoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/our-store',
  component: OurStore,
});

const sellCropsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sell-crops',
  component: SellCrops,
});

const buyFromFarmersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/buy-from-farmers',
  component: BuyFromFarmers,
});

const myCropListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-crop-listings',
  component: MyCropListings,
});

const sellerProductManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller-product-management',
  component: SellerProductManagement,
});

const checkoutSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout-success',
  component: CheckoutSuccess,
});

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-history',
  component: OrderHistory,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  dashboardRoute,
  soilAnalysisRoute,
  cropAdvisoryRoute,
  marketplaceRoute,
  ourStoreRoute,
  sellCropsRoute,
  buyFromFarmersRoute,
  myCropListingsRoute,
  sellerProductManagementRoute,
  checkoutSuccessRoute,
  orderHistoryRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
