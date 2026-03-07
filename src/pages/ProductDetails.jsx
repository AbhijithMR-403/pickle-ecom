import { ArrowLeft, Share2, Flame, Shield, Hand, Star, Minus, Plus, ShoppingBag, Leaf, Droplet, Sun, Grid3x3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductDetails() {
    const navigate = useNavigate();

    const ingredients = [
        { name: 'Raw Mango', icon: Leaf, color: 'text-orange-600' },
        { name: 'Gingelly Oil', icon: Droplet, color: 'text-orange-600' },
        { name: 'Asafoetida', icon: Sun, color: 'text-orange-600' },
        { name: 'Mustard Seeds', icon: Grid3x3, color: 'text-orange-600' }
    ];

    return (
        <div className="min-h-screen pb-32 bg-gradient-to-br from-[#bad1c1] via-[#dcd2ac] to-[#f2ecdb] text-text-main relative font-sans selection:bg-brand-primary/20">

            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 sticky top-0 z-10 pt-safe max-w-screen-xl mx-auto md:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-[42px] h-[42px] rounded-full bg-black/5 flex items-center justify-center text-text-main hover:bg-black/10 transition-colors backdrop-blur-sm"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <span className="font-sans font-bold text-lg tracking-wide text-text-main/90">Product Details</span>
                <button className="w-[42px] h-[42px] rounded-full bg-black/5 flex items-center justify-center text-text-main hover:bg-black/10 transition-colors backdrop-blur-sm">
                    <Share2 size={20} className="-ml-0.5" strokeWidth={2} />
                </button>
            </div>

            <div className="md:flex md:gap-12 max-w-screen-xl mx-auto md:px-8 md:mt-4">
                {/* Left Col - Image */}
                <div className="md:w-1/2">
                    <div className="px-5 mb-5 mt-2 md:px-0 md:mb-0 md:mt-0">
                        <div className="rounded-[1.5rem] overflow-hidden shadow-2xl shadow-black/10 h-72 lg:h-[30rem] relative mx-auto max-w-md md:max-w-full ring-1 ring-black/5">
                            <img
                                src="/images/product_detail_pickle_1772787198951.png"
                                alt="Product"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=600&auto=format&fit=crop' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Col - Details */}
                <div className="md:w-1/2 flex flex-col">
                    {/* Title & Badges */}
                    <div className="px-5 mb-6 md:px-0">
                        <h1 className="text-[32px] md:text-4xl lg:text-5xl font-serif font-bold text-[#1a0f08] leading-[1.1] mb-5 tracking-tight">Traditional Kerala Mango Pickle</h1>
                        <div className="flex flex-wrap gap-2.5">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-orange-500/20 text-[10px] font-bold text-orange-700 uppercase tracking-widest shadow-sm bg-orange-100/30">
                                <Flame size={12} className="text-orange-500" strokeWidth={2.5} /> Spiciness: High
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-orange-500/20 text-[10px] font-bold text-orange-700 uppercase tracking-widest shadow-sm bg-orange-100/30">
                                <Shield size={12} className="text-orange-600" strokeWidth={2.5} /> Preservative Free
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-orange-500/20 text-[10px] font-bold text-orange-700 uppercase tracking-widest shadow-sm bg-orange-100/30">
                                <Hand size={12} className="text-orange-500" strokeWidth={2.5} /> Hand-Crafted
                            </span>
                        </div>
                    </div>

                    {/* Price & Rating */}
                    <div className="px-5 md:px-0 flex items-end justify-between mb-8">
                        <div>
                            <div className="text-[32px] font-bold text-brand-primary leading-none mb-1.5 tracking-tight">₹249.00</div>
                            <div className="text-[11px] text-text-muted/70 font-medium tracking-wide">Inclusive of all taxes</div>
                        </div>
                        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-md border border-white flex items-center gap-1.5 min-w-[120px] justify-center text-[#431407]">
                            <Star size={16} className="fill-yellow-400 text-yellow-400 -mt-0.5" />
                            <span className="font-bold text-[15px]">4.9</span>
                            <span className="text-[10px] text-text-muted/70 font-semibold tracking-wide ml-0.5">(124 reviews)</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-5 md:px-0 mb-8">
                        <h3 className="font-bold text-[19px] mb-3.5 tracking-tight text-[#2d1b11]">The Authentic Achaar</h3>
                        <p className="text-[15px] md:text-base leading-relaxed text-[#4a352a] mb-4.5 font-medium pr-2 md:pr-0">
                            Our traditional Kerala Mango Pickle is made using the age-old 'Kanni Manga' recipe passed down through generations. Each mango is hand-picked at its peak of freshness and sun-dried to perfection.
                        </p>
                        <p className="text-[15px] md:text-base leading-relaxed text-[#4a352a] font-medium pr-2 md:pr-0 mt-4">
                            Infused with roasted mustard seeds, hand-ground Kashmiri red chilies, and cold-pressed sesame oil, this pickle captures the soul of Kerala's culinary heritage. No artificial colors or vinegar are used, ensuring a purely natural experience.
                        </p>
                    </div>

                    {/* Key Ingredients */}
                    <div className="px-5 md:px-0 pb-8 relative z-0">
                        <h3 className="font-bold text-[19px] mb-4 tracking-tight text-[#2d1b11]">Key Ingredients</h3>
                        <div className="grid grid-cols-2 gap-3.5 md:gap-5">
                            {ingredients.map((item, i) => (
                                <div key={i} className="bg-white/60 hover:bg-white/80 transition-colors backdrop-blur-md px-3.5 py-4 rounded-[1.25rem] flex items-center gap-3.5 shadow-sm border border-white/60">
                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                        <item.icon size={18} className={item.color} strokeWidth={2} />
                                    </div>
                                    <span className="text-[13px] md:text-sm font-bold text-[#431407] leading-tight pr-2">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-[#f4ebe1] via-[#f4ebe1]/95 to-transparent pt-12 p-5 md:px-8 pb-safe z-50 pointer-events-none flex justify-center">
                <div className="flex items-center gap-4 pointer-events-auto bg-white/40 p-2 rounded-full backdrop-blur-xl border border-white shadow-2xl w-full max-w-md md:max-w-lg">
                    <div className="flex items-center justify-between h-14 px-1.5 min-w-[110px]">
                        <button className="w-11 h-11 rounded-full flex items-center justify-center text-brand-primary hover:bg-orange-50 active:bg-orange-100 transition-colors">
                            <Minus size={20} strokeWidth={2.5} />
                        </button>
                        <span className="font-bold text-xl w-6 text-center text-[#431407]">1</span>
                        <button className="w-11 h-11 rounded-full flex items-center justify-center text-brand-primary hover:bg-orange-50 active:bg-orange-100 transition-colors">
                            <Plus size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                    <button className="flex-1 h-14 bg-brand-primary hover:bg-brand-secondary active:scale-[0.98] transition-all rounded-[100px] flex items-center justify-center gap-2.5 text-white font-bold text-lg shadow-xl shadow-brand-primary/40 mr-1">
                        <ShoppingBag size={20} strokeWidth={2.5} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
