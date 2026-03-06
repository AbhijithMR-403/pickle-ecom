import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FeaturedCard from '../components/FeaturedCard';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

export default function Home() {
    const bestSellers = [
        {
            id: "1",
            name: "Kadumanga",
            type: "Tender Mango",
            price: "180",
            image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=600&auto=format&fit=crop",
            isLiked: false
        },
        {
            id: "2",
            name: "Veluthulli",
            type: "Spicy Garlic",
            price: "165",
            image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=600&auto=format&fit=crop",
            isLiked: false
        },
        {
            id: "3",
            name: "Meen Achar",
            type: "Kerala King Fish",
            price: "320",
            image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=80&w=600&auto=format&fit=crop",
            isLiked: true
        },
        {
            id: "4",
            name: "Chemmeen",
            type: "Dried Prawns",
            price: "280",
            image: "https://images.unsplash.com/photo-1559841644-08984562005a?q=80&w=600&auto=format&fit=crop",
            isLiked: false
        }
    ];

    return (
        <div className="min-h-screen pb-24 bg-[#fffaf0] overflow-x-hidden">
            <Header />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <SearchBar />

                <div className="mt-1">
                    <FeaturedCard />
                </div>

                <div className="mt-4">
                    <CategoryList />
                </div>

                <div className="mt-6 px-4 mb-4 flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-[#8c6239] rounded-full"></div>
                        <h3 className="text-xl font-serif font-bold text-[#431407]">Best Sellers</h3>
                    </div>
                    <button className="text-[13px] font-bold text-brand-accent hover:text-brand-primary transition-colors tracking-wide pr-1">View All</button>
                </div>

                <div className="px-4 grid grid-cols-2 gap-3.5 pb-2">
                    {bestSellers.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
