import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();

    return (
        <header className="sticky top-0 z-10 bg-brand-light border-b border-orange-100/50 shadow-sm">
            <div className="flex items-center justify-between p-4 md:px-8 max-w-screen-xl mx-auto">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden border-2 border-orange-200 shadow-sm shrink-0">
                        <img src="/logo.jpg" alt="Ammachi's Kitchen Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-serif font-bold text-brand-primary tracking-tight">
                        Ammachi's Kitchen
                    </span>
                </Link>

                <nav className="flex items-center gap-2 md:gap-4 font-medium bg-white/60 backdrop-blur-md px-2 py-1.5 rounded-full shadow-sm border border-orange-100/50">
                    <Link
                        to="/"
                        className={`transition-all px-4 py-2 rounded-full text-sm md:text-base ${location.pathname === '/' ? 'bg-orange-100 text-brand-primary font-bold shadow-sm' : 'text-text-secondary hover:text-brand-primary hover:bg-orange-50'}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/products"
                        className={`transition-all px-4 py-2 rounded-full text-sm md:text-base ${location.pathname === '/products' ? 'bg-orange-100 text-brand-primary font-bold shadow-sm' : 'text-text-secondary hover:text-brand-primary hover:bg-orange-50'}`}
                    >
                        Products
                    </Link>
                </nav>
            </div>
        </header>
    );
}
