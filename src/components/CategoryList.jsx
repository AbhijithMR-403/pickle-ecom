import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { COLORS } from './TailwindColorPicker';
import { Loader2 } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Convert any string to PascalCase — "leaf" → "Leaf", "sea-fish" → "SeaFish"
const toPascalCase = (str) =>
  (str || '').replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
             .replace(/^(.)/, (c) => c.toUpperCase());

export default function CategoryList() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/categories`)
            .then(r => r.json())
            .then(data => setCategories(Array.isArray(data) ? data : data.results ?? []))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="py-4 flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-400" size={20} />
            </div>
        );
    }

    if (categories.length === 0) return null;

    return (
        <div className="py-2">
            <div className="flex items-center justify-between px-4 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#8c6239] rounded-full"></div>
                    <h3 className="text-lg font-serif font-bold text-[#623c14]">Traditional Varieties</h3>
                </div>
            </div>
            <div className="flex overflow-x-auto hide-scrollbar px-4 gap-3 pb-2 pt-1">
                {categories.map(cat => {
                    const Icon = LucideIcons[toPascalCase(cat.icon)];
                    const hex = COLORS.find(c => c.value === cat.color)?.hex || '#f97316';

                    return (
                        <div key={cat.id} className="flex flex-col items-center gap-1.5 min-w-[66px] cursor-pointer">
                            <button
                                onClick={() => navigate(`/products?category=${cat.id}`)}
                                className="cursor-pointer w-[60px] h-[60px] rounded-2xl flex items-center justify-center border shadow-sm transition-transform active:scale-95 hover:scale-105"
                                style={{
                                    backgroundColor: hex + '18',
                                    borderColor: hex + '40',
                                    color: hex,
                                }}
                            >
                                {Icon
                                    ? <Icon size={26} strokeWidth={1.5} style={{ color: hex }} />
                                    : <span className="text-lg font-bold" style={{ color: hex }}>
                                        {cat.name.charAt(0).toUpperCase()}
                                      </span>
                                }
                            </button>
                            <span className="text-[11px] font-semibold text-text-main text-center leading-tight max-w-[66px] truncate">
                                {cat.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
