# Specification

## Summary
**Goal:** Fix layout and visibility issues on the farmer dashboard, repair Quick Access/Quick Links sections, add a simulated payment method flow for the store and marketplace, and ensure all pages and navigation links across the app are fully functional and visually consistent.

**Planned changes:**
- Fix the farmer dashboard layout so all six feature cards (Soil Analysis, Crop Advisory, Marketplace, Our Store, Sell Crops, Buy from Farmers) are fully visible and scrollable without clipping or overflow issues
- Fix the Quick Access section on the dashboard and the footer's quick navigation links so all shortcuts render with correct icons, labels, and working routes
- Implement a simulated payment form modal/page at checkout for both the In-App Store and Seller Marketplace, collecting cardholder name, masked card number, expiry date, and CVV with field validation
- Show an order confirmation screen after simulated payment with order ID, items, total, and estimated delivery window
- Save completed orders (with payment confirmation status) to the backend per farmer and make them retrievable from order history
- Audit all routes in App.tsx to ensure every page renders without errors, unauthenticated users are redirected to login, and header/footer navigation links all work correctly
- Maintain visual consistency with the existing earthy green/amber nature-inspired theme across all pages and new components

**User-visible outcome:** Farmers can see the full dashboard with all feature sections, use Quick Access shortcuts, complete purchases in the store and marketplace via a simulated payment form with order confirmation, and navigate all pages of the app without errors or broken links.
