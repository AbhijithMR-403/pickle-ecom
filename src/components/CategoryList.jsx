import { Leaf, Sun, Infinity, Fish, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CategoryList() {
    const navigate = useNavigate();
    const categories = [
        { name: 'Mango', type: 'Tender Mango', icon: Leaf, color: 'bg-red-50 text-brand-accent border-red-100' },
        { name: 'Lime', type: 'Traditional Mango', icon: Sun, color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
        { name: 'Garlic', type: 'Spicy Garlic', icon: Infinity, color: 'bg-slate-50 text-slate-700 border-slate-200' },
        { name: 'Fish', type: 'Kerala King Fish', icon: Fish, color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { name: 'Prawns', type: 'Dried Prawns', icon: Waves, color: 'bg-orange-50 text-orange-500 border-orange-100' },
    ];

    return (
        <div className="py-2">
            <div className="flex items-center justify-between px-4 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#8c6239] rounded-full"></div>
                    <h3 className="text-lg font-serif font-bold text-[#623c14]">Traditional Varieties</h3>
                </div>
            </div>
            <div className="flex overflow-x-auto hide-scrollbar px-4 gap-3 pb-2 pt-1">
                {categories.map((cat, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 min-w-[66px] cursor-pointer">
                        <button
                            onClick={() => {
                                const params = new URLSearchParams({ type: cat.type });
                                navigate(`/products?${params.toString()}`);
                            }}
                            className={`cursor-pointer w-[60px] h-[60px] rounded-2xl flex items-center justify-center border shadow-sm transition-transform active:scale-95 ${cat.color}`}
                        >
                            <cat.icon size={26} strokeWidth={1.5} />
                        </button>
                        <span className="text-[11px] font-semibold text-text-main">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
