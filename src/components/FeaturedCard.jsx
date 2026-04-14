import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedCard({ banner }) {
    const navigate = useNavigate();

    if (!banner || !banner.product_details) return null;

    const product = banner.product_details;

    return (
        <div className="px-4 py-2" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="rounded-2xl overflow-hidden bg-[#996b42] text-white shadow-lg relative cursor-pointer group active:scale-[0.98] transition-all">
                <div className="h-48 sm:h-56 md:h-72 lg:h-80 xl:h-96 overflow-hidden bg-[#4a3933]">
                    {/* using the image from banner api */}
                    <img
                        src={banner.image}
                        alt={banner.title || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 mix-blend-overlay"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=600&auto=format&fit=crop' }}
                    />
                </div>
                <div className="p-4 bg-gradient-to-t from-[#825a36] to-[#996b42]">
                    <div className="flex justify-between items-start mb-2">
                        <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider shadow-sm uppercase">
                            {banner.title || "FEATURED"}
                        </span>
                        <div className="flex items-center gap-1 bg-green-700/95 px-2.5 py-0.5 rounded-full shadow-sm">
                            <CheckCircle2 size={12} className="text-white" />
                            <span className="text-[10px] font-bold text-white tracking-wide">AUTHENTIC</span>
                        </div>
                    </div>
                    <h2 className="text-xl font-serif font-bold mb-1.5 text-white tracking-wide">{product.name}</h2>
                    <p className="text-xs text-orange-50/90 leading-relaxed mb-4 font-sans pr-2 font-medium line-clamp-2">
                        {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-white tracking-tight">₹{product.discount_price || product.price}</span>
                            <span className="text-[10px] text-orange-200/80 font-medium">/ {product.net_weight + ' g' || '100 g'}</span>
                        </div>
                        <button className="bg-white text-[#825a36] hover:bg-orange-50 font-bold py-1.5 px-5 rounded-full text-sm transition-colors shadow-sm">
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
