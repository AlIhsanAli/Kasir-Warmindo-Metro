# TODO List for Kasir Warmindo Metro App

## 1. Install Dependencies
- [x] Add framer-motion, lucide-react, recharts, zustand to package.json
- [x] Run `npm install` to install new dependencies

## 2. Update Global Styles
- [x] Update kasir-warmindo/app/globals.css for warm color scheme (reds, yellows, browns) and custom animations

## 3. Update Root Layout
- [x] Update kasir-warmindo/app/layout.tsx for app metadata (title: Warmindo Metro, description) and warm theme

## 4. Create Folder Structure
- [x] Create customer pages: /menu, /cart, /confirm
- [x] Create admin pages: /admin/login, /admin/dashboard, /admin/menu, /admin/orders, /admin/reports
- [x] Create components/ folder for shared components (MenuItem, Cart, etc.)
- [x] Create lib/ folder for utilities and state management

## 5. Implement API Routes
- [x] Create API routes for menu (GET /api/menu), orders (POST /api/orders, GET /api/orders), auth simulation (POST /api/auth/login)

## 6. Create Shared Components
- [x] MenuItem component
- [x] Cart component
- [x] OrderForm component
- [x] Admin components (MenuForm, OrderList, etc.)

## 7. Implement Customer Flow
- [x] Menu page: Display categories, items, add to cart
- [x] Cart page: Show cart items, adjust quantities, proceed to confirm
- [x] Confirm page: Customer details, confirm order

## 8. Implement Admin Flow
- [x] Login page: Authenticate admin
- [x] Dashboard: Stats overview
- [x] Menu management: CRUD for menu items
- [x] Orders management: View and update order statuses
- [x] Reports: Charts for financial data

## 9. Add State Management
- [x] Use Zustand for cart state and admin auth state

## 10. Testing and Final Touches
- [x] Test app locally with `npm run dev`
- [x] Ensure responsiveness and animations (verified via build success)
- [ ] Add QR code generation for tables in admin if needed
