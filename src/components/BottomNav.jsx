import { Home, LayoutGrid, ReceiptText, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: LayoutGrid, label: 'Explore', path: '/explore' },
        { icon: ReceiptText, label: 'Orders', path: '/orders' },
        { icon: User, label: 'Profile', path: '/profile' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-orange-100 pb-safe z-50">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors ${isActive ? 'text-brand-primary' : 'text-orange-300 hover:text-orange-400'}`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'fill-brand-primary/10' : ''} />
                            <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
