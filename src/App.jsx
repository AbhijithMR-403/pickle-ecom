import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Package } from 'lucide-react';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminProductForm from './pages/AdminProductForm';
import Header from './components/Header';
import Footer from './components/Footer';

function MobileBottomNav() {
  const location = useLocation();
  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Products', path: '/products', icon: Package }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 z-[9999] px-6 pt-3 pb-4 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {navItems.map(item => {
        const isActive = location.pathname === item.path || (item.path === '/products' && location.pathname.startsWith('/product/'));
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full min-w-[64px] transition-colors cursor-pointer touch-manipulation ${
              isActive ? 'text-brand-primary' : 'text-text-muted hover:text-brand-accent'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-orange-100' : 'bg-transparent'}`}>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-semibold ${isActive ? 'font-bold' : ''}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="w-full min-h-screen bg-brand-light relative overflow-x-hidden flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes — separate layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/product/add" element={<AdminProductForm />} />
        <Route path="/admin/product/edit/:id" element={<AdminProductForm />} />

        {/* Public pages */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
