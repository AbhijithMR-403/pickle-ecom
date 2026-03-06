import { Search } from 'lucide-react';

export default function SearchBar() {
    return (
        <div className="px-4 py-3">
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-orange-300" />
                </div>
                <input
                    type="text"
                    placeholder="Search traditional pickles..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 text-text-main shadow-sm border border-orange-50 font-sans placeholder-orange-300 transition-all font-medium text-sm"
                />
            </div>
        </div>
    );
}
