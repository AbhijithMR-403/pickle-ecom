import { Bell, ShoppingBag } from 'lucide-react';

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-brand-light sticky top-0 z-10 border-b border-orange-100/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden border-2 border-orange-200 shadow-sm">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-xl font-serif font-bold text-text-main tracking-tight">
                    Malabar Delights
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-brand-primary relative shadow-sm hover:bg-orange-200 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-orange-100"></span>
                </button>
                <button className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/30 hover:bg-brand-secondary transition-colors">
                    <ShoppingBag size={20} />
                </button>
            </div>
        </header>
    );
}
