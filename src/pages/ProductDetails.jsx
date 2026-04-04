import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, MessageCircle, Flame, Shield, Leaf, Minus, Plus, Loader2, Package } from 'lucide-react';
import { fetchProducts } from '../store/slices/productSlice';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=600&auto=format&fit=crop';

const TASTE_LABEL = {
    Very_Spicy: 'Very Spicy',
    Medium_Spicy: 'Medium Spicy',
    Mild_Spicy: 'Mild Spicy',
    Sour: 'Sour',
    Sweet: 'Sweet',
    Sweet_Sour: 'Sweet & Sour',
    Spicy_Sour: 'Spicy & Sour',
    Spicy_Sweet: 'Spicy & Sweet',
};

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState(null);

    const { items: products, loading } = useSelector(s => s.products);

    useEffect(() => {
        if (products.length === 0) dispatch(fetchProducts());
    }, [dispatch, products.length]);

    const product = products.find(p => String(p.id) === String(id));

    // Image gallery handling
    const images = product?.images || [];
    const highlightImg = images.find(i => i.is_highlight)?.image || images[0]?.image || FALLBACK_IMAGE;
    const displayImg = activeImg || highlightImg;

    useEffect(() => {
        setActiveImg(null); // reset when product changes
    }, [id]);

    if (loading && !product) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-orange-400" size={36} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Package size={48} className="text-orange-200" />
                <h2 className="text-xl font-bold text-[#431407]">Product not found</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-2 bg-[#ea580c] text-white font-bold rounded-xl hover:bg-[#c24100] transition-all"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    const displayPrice = product.discount_price || product.price;
    const hasDiscount = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);
    const ingredients = product.ingredient_details || [];
    const categories = product.category_details || [];

    return (
        <div className="pb-32 bg-gradient-to-br from-[#bad1c1] via-[#dcd2ac] to-[#f2ecdb] text-text-main relative font-sans h-full">

            {/* Back Button */}
            <div className="flex items-center px-4 py-3 max-w-screen-xl mx-auto md:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-main hover:bg-black/10 transition-colors backdrop-blur-sm shadow-sm"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
            </div>

            <div className="md:flex md:gap-12 max-w-screen-xl mx-auto md:px-8 md:mt-4">
                {/* Left Col - Image */}
                <div className="md:w-1/2">
                    <div className="px-5 mb-5 mt-2 md:px-0 md:mb-0 md:mt-0">
                        <div className="rounded-[1.5rem] overflow-hidden shadow-2xl shadow-black/10 h-72 lg:h-[30rem] relative mx-auto max-w-md md:max-w-full ring-1 ring-black/5">
                            <img
                                src={displayImg}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-500"
                                onError={e => { e.target.src = FALLBACK_IMAGE; }}
                            />
                        </div>
                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-3 px-1 justify-center">
                                {images.map(img => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImg(img.image)}
                                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${displayImg === img.image ? 'border-orange-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img.image} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = FALLBACK_IMAGE; }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col - Details */}
                <div className="md:w-1/2 flex flex-col">
                    {/* Title & Badges */}
                    <div className="px-5 mb-5 md:px-0">
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {categories.map(cat => (
                                    <span key={cat.id} className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-100/50 border border-orange-200/60 px-2.5 py-1 rounded-full">
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}
                        <h1 className="text-[32px] md:text-4xl lg:text-5xl font-serif font-bold text-[#1a0f08] leading-[1.1] mb-4 tracking-tight">
                            {product.name}
                        </h1>
                        {product.sub_description && (
                            <p className="text-[15px] text-[#8c6239] font-medium italic mb-4">{product.sub_description}</p>
                        )}
                        <div className="flex flex-wrap gap-2.5">
                            {product.taste && (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-orange-500/20 text-[10px] font-bold text-orange-700 uppercase tracking-widest bg-orange-100/30">
                                    <Flame size={12} className="text-orange-500" strokeWidth={2.5} />
                                    {TASTE_LABEL[product.taste] || product.taste}
                                </span>
                            )}
                            {product.is_preservation_free && (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-green-500/20 text-[10px] font-bold text-green-700 uppercase tracking-widest bg-green-100/30">
                                    <Shield size={12} className="text-green-600" strokeWidth={2.5} />
                                    Preservative Free
                                </span>
                            )}
                            {product.is_vegetarian && (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-green-500/20 text-[10px] font-bold text-green-700 uppercase tracking-widest bg-green-100/30">
                                    <Leaf size={12} className="text-green-600" strokeWidth={2.5} />
                                    Vegetarian
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="px-5 md:px-0 flex items-end gap-4 mb-6">
                        <div>
                            <div className="text-[32px] font-bold text-brand-primary leading-none mb-1 tracking-tight">₹{displayPrice}</div>
                            {hasDiscount && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                        {Math.round((1 - parseFloat(product.discount_price) / parseFloat(product.price)) * 100)}% OFF
                                    </span>
                                </div>
                            )}
                            <div className="text-[11px] text-text-muted/70 font-medium tracking-wide mt-0.5">Inclusive of all taxes</div>
                        </div>
                    </div>

                    {/* Product details row */}
                    <div className="px-5 md:px-0 mb-6 flex flex-wrap gap-3">
                        {product.net_weight && (
                            <div className="bg-white/60 rounded-xl px-4 py-2 text-center">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Net Weight</div>
                                <div className="text-sm font-bold text-[#431407]">{product.net_weight}</div>
                            </div>
                        )}
                        {product.shelf_life_days > 0 && (
                            <div className="bg-white/60 rounded-xl px-4 py-2 text-center">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Shelf Life</div>
                                <div className="text-sm font-bold text-[#431407]">{product.shelf_life_days} days</div>
                            </div>
                        )}
                        <div className="bg-white/60 rounded-xl px-4 py-2 text-center">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">In Stock</div>
                            <div className={`text-sm font-bold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock_quantity}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-5 md:px-0 mb-6">
                        <h3 className="font-bold text-[19px] mb-3 tracking-tight text-[#2d1b11]">About this Pickle</h3>
                        <p className="text-[15px] md:text-base leading-relaxed text-[#4a352a] font-medium">
                            {product.description}
                        </p>
                    </div>

                    {/* Key Ingredients */}
                    {ingredients.length > 0 && (
                        <div className="px-5 md:px-0 pb-8">
                            <h3 className="font-bold text-[19px] mb-3 tracking-tight text-[#2d1b11]">Key Ingredients</h3>
                            <ul className="space-y-2">
                                {ingredients.map(item => (
                                    <li key={item.id} className="flex items-center gap-3 text-[15px] md:text-base font-medium text-[#4a352a]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4a352a]/50 shrink-0"></div>
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-[#f4ebe1] via-[#f4ebe1]/95 to-transparent pt-12 p-5 md:px-8 pb-safe z-50 pointer-events-none flex justify-center">
                <div className="flex items-center gap-4 pointer-events-auto bg-white/40 p-2 rounded-full backdrop-blur-xl border border-white shadow-2xl w-full max-w-md md:max-w-lg">
                    <div className="flex items-center justify-between h-14 px-1.5 min-w-[110px]">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-11 h-11 rounded-full flex items-center justify-center text-brand-primary hover:bg-orange-50 active:bg-orange-100 transition-colors"
                        >
                            <Minus size={20} strokeWidth={2.5} />
                        </button>
                        <span className="font-bold text-xl w-6 text-center text-[#431407]">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-11 h-11 rounded-full flex items-center justify-center text-brand-primary hover:bg-orange-50 active:bg-orange-100 transition-colors"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            const message = `Hi, I am interested in buying ${quantity}x ${product.name} (₹${displayPrice} each). Can you provide more details?`;
                            const whatsappUrl = import.meta.env.VITE_WHATSAPP_API;
                            window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="flex-1 h-14 bg-[#25D366] hover:bg-[#128C7E] active:scale-[0.98] transition-all rounded-[100px] flex items-center justify-center gap-2.5 text-white font-bold text-lg shadow-xl shadow-[#25D366]/40 mr-1"
                    >
                        <MessageCircle size={20} strokeWidth={2.5} />
                        Chat on WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}
