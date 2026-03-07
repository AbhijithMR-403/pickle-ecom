import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

export default function Products() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    // Filter states from URL
    const priceRange = searchParams.get('price') || 'all';
    const selectedTypes = searchParams.getAll('type');
    const dietary = searchParams.get('dietary') || 'all';
    const inStockOnly = searchParams.get('inStock') === 'true';

    const updateSearchParam = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (value === 'all' || value === false || value === '') {
            newParams.delete(key);
        } else if (Array.isArray(value)) {
            newParams.delete(key);
            if (value.length > 0) {
                value.forEach(v => newParams.append(key, v));
            }
        } else {
            newParams.set(key, String(value));
        }

        setSearchParams(newParams, { replace: true });
    };

    const setPriceRange = (val) => updateSearchParam('price', val);
    const setDietary = (val) => updateSearchParam('dietary', val);
    const setInStockOnly = (val) => updateSearchParam('inStock', val);

    // Derived distinct types
    const allTypes = useMemo(() => {
        const types = new Set(productsData.map(p => p.type));
        return Array.from(types);
    }, []);

    const toggleType = (type) => {
        const newTypes = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];
        updateSearchParam('type', newTypes);
    };

    // Filter logic
    const filteredProducts = useMemo(() => {
        return productsData.filter(product => {
            // Price Filter
            const price = parseInt(product.price);
            if (priceRange === 'under200' && price >= 200) return false;
            if (priceRange === '200to300' && (price < 200 || price > 300)) return false;
            if (priceRange === 'over300' && price <= 300) return false;

            // Type Filter
            if (selectedTypes.length > 0 && !selectedTypes.includes(product.type)) return false;

            // Dietary Filter
            if (dietary !== 'all' && product.dietary !== dietary) return false;

            // Availability Filter
            if (inStockOnly && !product.inStock) return false;

            return true;
        });
    }, [priceRange, selectedTypes, dietary, inStockOnly]);

    const clearFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('price');
        newParams.delete('type');
        newParams.delete('dietary');
        newParams.delete('inStock');
        setSearchParams(newParams, { replace: true });
    };

    return (
        <div className="pb-24 bg-[var(--color-brand-light)] overflow-x-hidden h-full">            <div className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-main)]">All Products</h2>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-200 text-[#431407] shadow-sm font-medium"
                >
                    <SlidersHorizontal size={18} />
                    Filters
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
                        </h3>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                        >
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
                                { value: '200to300', label: '₹200 - ₹300' },
                                { value: 'over300', label: 'Over ₹300' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="price"
                                            value={option.value}
                                            checked={priceRange === option.value}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className="peer appearance-none w-4 h-4 border border-orange-300 rounded-full checked:border-[#ea580c] checked:border-4 transition-all"
                                        />
                                    </div>
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
                                { id: 'veg', label: 'Veg' },
                                { id: 'non-veg', label: 'Non-Veg' }
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

                    {/* Type Filter */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-[#8c6239] mb-3 text-sm tracking-wide uppercase">Pickle Type</h4>
                        <div className="space-y-2">
                            {allTypes.map(type => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => toggleType(type)}
                                        className="w-4 h-4 rounded border-orange-300 text-[#ea580c] focus:ring-[#ea580c] focus:ring-offset-orange-50 accent-[#ea580c] cursor-pointer"
                                    />
                                    <span className={`text-sm ${selectedTypes.includes(type) ? 'font-semibold text-[#431407]' : 'text-gray-600 group-hover:text-[#431407]'}`}>
                                        {type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Availability Filter */}
                    <div className="mb-8 p-4 bg-white md:bg-orange-50/50 rounded-xl border border-orange-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                className="w-4 h-4 rounded border-orange-300 text-[#ea580c] focus:ring-[#ea580c] accent-[#ea580c]"
                            />
                            <span className={`text-sm font-medium ${inStockOnly ? 'text-[#431407]' : 'text-gray-600'}`}>
                                In Stock Only
                            </span>
                        </label>
                    </div>

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
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    </div>

                    {filteredProducts.length > 0 ? (
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
                                We couldn't find any products matching your current filters. Try adjusting them or clear filters to see all products.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-[#ea580c] text-white font-bold rounded-xl hover:bg-[#c24100] focus:ring-4 focus:ring-orange-200 transition-all active:scale-95"
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
