import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Spinner from './components/ui/Spinner';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ShopProvider, useShop } from './context/ShopContext';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerLogin from './pages/CustomerLogin';
import CustomerOrders from './pages/CustomerOrders';
import CustomerRegister from './pages/CustomerRegister';
import Home from './pages/Home';
import OrderConfirmation from './pages/OrderConfirmation';
import PaymentReturn from './pages/PaymentReturn';
import OrderTracking from './pages/OrderTracking';
import ProductDetail from './pages/ProductDetail';
import ProductListing from './pages/ProductListing';

function ShopError({ error }) {
  return (
    <div className="page-loader">
      <p className="text-5xl mb-3">🏪</p>
      <h2 className="text-xl font-semibold text-slate-700">Shop Not Found</h2>
      <p className="text-slate-500 text-sm">{error}</p>
    </div>
  );
}

function AppRoutes() {
  const { shop, loading, error } = useShop();

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner size="lg" />
        <p>Loading your store...</p>
      </div>
    );
  }

  if (error || !shop) {
    return <ShopError error={error || 'No active shop found for this domain.'} />;
  }

  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"                               element={<Home />} />
                <Route path="/products"                       element={<ProductListing />} />
                <Route path="/products/:slug"                 element={<ProductDetail />} />
                <Route path="/cart"                           element={<Cart />} />
                <Route path="/checkout"                       element={<Checkout />} />
                <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                <Route path="/track-order"                    element={<OrderTracking />} />
                <Route path="/login"                          element={<CustomerLogin />} />
                <Route path="/register"                       element={<CustomerRegister />} />
                <Route path="/account/orders"                 element={<CustomerOrders />} />
                <Route path="/payment-return"                 element={<PaymentReturn />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppRoutes />
    </ShopProvider>
  );
}
