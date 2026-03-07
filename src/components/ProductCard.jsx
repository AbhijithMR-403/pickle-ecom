import { Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-[1.25rem] overflow-hidden border border-orange-100/60 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
        >
            <div className="relative h-40 overflow-hidden bg-orange-50/50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <button
                    className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    onClick={(e) => { e.stopPropagation(); /* toggle like logic */ }}
                >
                    <Heart size={14} className={product.isLiked ? 'fill-[#8c6239] text-[#8c6239]' : 'text-[#8c6239]'} />
                </button>
            </div>
            <div className="p-3.5 flex flex-col flex-grow">
                <h4 className="font-serif font-bold text-[#431407] leading-tight mb-1 text-[15px]">{product.name}</h4>
                <p className="text-[11px] text-[#8c6239]/80 font-medium mb-3 flex-grow">{product.type}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-brand-accent text-base">₹{product.price}</span>
                    <button
                        className="w-8 h-8 bg-[#25D366] hover:bg-[#128C7E] rounded-xl flex items-center justify-center text-white shadow-sm transition-colors active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            const message = `Hi, I am interested in buying ${product.name} (₹${product.price} each). Can you provide more details?`;
                            const whatsappUrl = import.meta.env.VITE_WHATSAPP_API;
                            const fullUrl = `${whatsappUrl}?text=${encodeURIComponent(message)}`;
                            window.open(fullUrl, '_blank');
                        }}
                    >
                        <MessageCircle size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
