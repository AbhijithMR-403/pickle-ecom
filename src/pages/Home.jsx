import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FeaturedCard from '../components/FeaturedCard';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchBanners } from '../store/slices/bannerSlice';
import { Loader2 } from 'lucide-react';

export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: products, loading } = useSelector(s => s.products);
    const { items: banners, loading: bannersLoading } = useSelector(s => s.banners);

    useEffect(() => {
        if (products.length === 0) dispatch(fetchProducts());
        if (banners.length === 0) dispatch(fetchBanners());
    }, [dispatch, products.length, banners.length]);

    const bestSellers = products.filter(p => p.best_seller === true);
    const activeBanners = banners.filter(b => b.is_active);

    return (
        <div className="pb-24 bg-[#fffaf0] overflow-x-hidden h-full">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="mt-1 md:px-4 lg:px-8 max-w-screen-xl mx-auto">
                {bannersLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-orange-400" size={28} />
                    </div>
                ) : activeBanners.length > 0 ? (
                    <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                        {activeBanners.map(banner => (
                            <div key={banner.id} className="min-w-full snap-center flex-shrink-0">
                                <FeaturedCard banner={banner} />
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="mt-4 md:px-4 lg:px-8 max-w-screen-xl mx-auto">
                <CategoryList />
            </div>

            <div className="mt-8 px-4 md:px-8 lg:px-12 mb-4 flex justify-between items-baseline max-w-screen-xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#8c6239] rounded-full"></div>
                    <h3 className="text-xl font-serif font-bold text-[#431407]">Best Sellers</h3>
                </div>
                <button
                    onClick={() => navigate('/products')}
                    className="text-[13px] font-bold text-brand-accent hover:text-brand-primary transition-colors tracking-wide pr-1"
                >
                    View All
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-orange-400" size={28} />
                </div>
            ) : bestSellers.length === 0 ? (
                <p className="text-center text-text-muted text-sm py-8 px-4">
                    No best sellers yet — mark products as Best Seller in the admin panel.
                </p>
            ) : (
                <div className="px-4 md:px-8 xl:px-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 md:gap-6 pb-12 max-w-screen-xl mx-auto">
                    {bestSellers.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

        </div>
        </div>
    );
}
