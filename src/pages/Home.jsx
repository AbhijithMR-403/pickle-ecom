
import SearchBar from '../components/SearchBar';
import FeaturedCard from '../components/FeaturedCard';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const bestSellers = products.filter(product => product.isBestSeller);
    const navigate = useNavigate();

    return (
        <div className="pb-24 bg-[#fffaf0] overflow-x-hidden h-full">            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* <div className="md:px-4 lg:px-8 max-w-screen-xl mx-auto">
                <SearchBar />
            </div> */}

            <div className="mt-1 md:px-4 lg:px-8 max-w-screen-xl mx-auto">
                <FeaturedCard />
            </div>

            <div className="mt-4 md:px-4 lg:px-8 max-w-screen-xl mx-auto">
                <CategoryList />
            </div>

            <div className="mt-8 px-4 md:px-8 lg:px-12 mb-4 flex justify-between items-baseline max-w-screen-xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#8c6239] rounded-full"></div>
                    <h3 className="text-xl font-serif font-bold text-[#431407]">Best Sellers</h3>
                </div>
                <button onClick={() => navigate('/products')} className="text-[13px] font-bold text-brand-accent hover:text-brand-primary transition-colors tracking-wide pr-1">View All</button>
            </div>

            <div className="px-4 md:px-8 xl:px-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 md:gap-6 pb-12 max-w-screen-xl mx-auto">
                {bestSellers.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
        </div>
    );
}
