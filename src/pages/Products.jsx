import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Filter, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';

export default function Products() {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector(s => s.products);
    const { items: categories } = useSelector(s => s.categories);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    // Filter states from URL
    const priceRange = searchParams.get('price') || 'all';
    const selectedCategories = searchParams.getAll('category');
    const dietary = searchParams.get('dietary') || 'all';

    const updateSearchParam = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === 'all' || value === false || value === '') {
            newParams.delete(key);
        } else if (Array.isArray(value)) {
            newParams.delete(key);
            if (value.length > 0) value.forEach(v => newParams.append(key, v));
        } else {
            newParams.set(key, String(value));
        }
        setSearchParams(newParams, { replace: true });
    };

    const setPriceRange = (val) => updateSearchParam('price', val);
    const setDietary = (val) => updateSearchParam('dietary', val);

    const toggleCategory = (catId) => {
        const str = String(catId);
        const newCats = selectedCategories.includes(str)
            ? selectedCategories.filter(c => c !== str)
            : [...selectedCategories, str];
        updateSearchParam('category', newCats);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            if (!product.is_active) return false;

            // Price filter
            const price = parseFloat(product.discount_price || product.price);
            if (priceRange === 'under200' && price >= 200) return false;
            if (priceRange === '200to300' && (price < 200 || price > 300)) return false;
            if (priceRange === 'over300' && price <= 300) return false;

            // Category filter
            if (selectedCategories.length > 0) {
                const productCatIds = (product.category_details || []).map(c => String(c.id));
                if (!selectedCategories.some(sc => productCatIds.includes(sc))) return false;
            }

            // Dietary filter
            if (dietary === 'veg' && !product.is_vegetarian) return false;
            if (dietary === 'non-veg' && product.is_vegetarian) return false;

            return true;
        });
    }, [products, priceRange, selectedCategories, dietary]);

    const clearFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('price');
        newParams.delete('category');
        newParams.delete('dietary');
        setSearchParams(newParams, { replace: true });
    };

    const activeFilterCount = [
        priceRange !== 'all' ? 1 : 0,
        selectedCategories.length,
        dietary !== 'all' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <div className="pb-24 bg-[var(--color-brand-light)] overflow-x-hidden h-full">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-main)]">All Products</h2>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-200 text-[#431407] shadow-sm font-medium"
                    >
                        <SlidersHorizontal size={18} />
                        Filters {activeFilterCount > 0 && <span className="bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div className={`
                        fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out
                        md:relative md:w-64 md:translate-x-0 md:bg-transparent md:shadow-none md:p-0 md:z-auto
                        ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="flex justify-between items-center mb-6 md:mb-4">
                            <h3 className="text-lg font-bold text-[#431407] flex items-center gap-2">
                                <Filter size={20} className="text-[#ea580c]" />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
                                )}
                            </h3>
                            <button onClick={() => setIsFilterOpen(false)} className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[#8c6239] mb-3 text-sm tracking-wide uppercase">Price Range</h4>
                            <div className="space-y-2">
                                {[
                                    { value: 'all', label: 'All Prices' },
                                    { value: 'under200', label: 'Under ₹200' },
                                    { value: '200to300', label: '₹200 – ₹300' },
                                    { value: 'over300', label: 'Over ₹300' }
                                ].map(option => (
                                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="price"
                                            value={option.value}
                                            checked={priceRange === option.value}
                                            onChange={e => setPriceRange(e.target.value)}
                                            className="peer appearance-none w-4 h-4 border border-orange-300 rounded-full checked:border-[#ea580c] checked:border-4 transition-all"
                                        />
                                        <span className={`text-sm ${priceRange === option.value ? 'font-semibold text-[#431407]' : 'text-gray-600 group-hover:text-[#431407]'}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Dietary Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-[#8c6239] mb-3 text-sm tracking-wide uppercase">Dietary</h4>
                            <div className="flex bg-orange-50 rounded-lg p-1 border border-orange-100">
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'veg', label: '🌿 Veg' },
                                    { id: 'non-veg', label: '🍖 Non-Veg' }
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setDietary(option.id)}
                                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${dietary === option.id
                                            ? 'bg-white text-[#ea580c] shadow-sm'
                                            : 'text-gray-500 hover:text-[#431407]'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Filter */}
                        {categories.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-semibold text-[#8c6239] mb-3 text-sm tracking-wide uppercase">Category</h4>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(String(cat.id))}
                                                onChange={() => toggleCategory(cat.id)}
                                                className="w-4 h-4 rounded border-orange-300 text-[#ea580c] focus:ring-[#ea580c] accent-[#ea580c] cursor-pointer"
                                            />
                                            <span className={`text-sm ${selectedCategories.includes(String(cat.id)) ? 'font-semibold text-[#431407]' : 'text-gray-600 group-hover:text-[#431407]'}`}>
                                                {cat.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Clear Filters */}
                        <button
                            onClick={clearFilters}
                            className="w-full py-2.5 text-sm font-bold text-gray-500 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors border border-gray-200"
                        >
                            Clear All Filters
                        </button>
                    </div>

                    {/* Overlay for mobile filter */}
                    {isFilterOpen && (
                        <div
                            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="mb-4 text-sm text-gray-500 font-medium">
                            {loading
                                ? 'Loading products…'
                                : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-24">
                                <Loader2 className="animate-spin text-orange-400" size={36} />
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-6 pb-12">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-orange-100 shadow-sm flex flex-col items-center">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                                    <Filter className="text-orange-300 w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-[#431407] mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    We couldn't find any products matching your current filters. Try adjusting them or clear to see all products.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-[#ea580c] text-white font-bold rounded-xl hover:bg-[#c24100] transition-all active:scale-95"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
