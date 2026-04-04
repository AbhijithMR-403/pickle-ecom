import { Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=600&auto=format&fit=crop';

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    const highlightImage = product.images?.find(img => img.is_highlight)?.image
        || product.images?.[0]?.image
        || FALLBACK_IMAGE;

    const displayPrice = product.discount_price || product.price;
    const hasDiscount = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);

    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-[1.25rem] overflow-hidden border border-orange-100/60 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
        >
            <div className="relative h-40 overflow-hidden bg-orange-50/50">
                <img
                    src={highlightImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={e => { e.target.src = FALLBACK_IMAGE; }}
                />
                <button
                    className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    onClick={e => { e.stopPropagation(); }}
                >
                    <Heart size={14} className="text-[#8c6239]" />
                </button>
                {product.best_seller && (
                    <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Best Seller
                    </span>
                )}
            </div>
            <div className="p-3.5 flex flex-col flex-grow">
                <h4 className="font-serif font-bold text-[#431407] leading-tight mb-1 text-[15px]">{product.name}</h4>
                <p className="text-[11px] text-[#8c6239]/80 font-medium mb-3 flex-grow line-clamp-2">
                    {product.sub_description || (product.category_details?.[0]?.name)}
                </p>
                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <span className="font-bold text-brand-accent text-base">₹{displayPrice}</span>
                        {hasDiscount && (
                            <span className="text-[11px] text-gray-400 line-through ml-1.5">₹{product.price}</span>
                        )}
                    </div>
                    <button
                        className="w-8 h-8 bg-[#25D366] hover:bg-[#128C7E] rounded-xl flex items-center justify-center text-white shadow-sm transition-colors active:scale-95 cursor-pointer"
                        onClick={e => {
                            e.stopPropagation();
                            const message = `Hi, I am interested in buying ${product.name} (₹${displayPrice} each). Can you provide more details?`;
                            const whatsappUrl = import.meta.env.VITE_WHATSAPP_API;
                            window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                    >
                        <MessageCircle size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
