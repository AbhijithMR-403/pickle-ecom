import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#431407] text-orange-50 mt-auto border-t-4 border-brand-primary">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white mb-4 tracking-tight">
                            Ammachi's Kitchen
                        </h2>
                        <p className="text-orange-200/80 text-sm leading-relaxed max-w-xs">
                            Bringing the authentic taste of Kerala's culinary heritage to your doorstep. Preservative-free, hand-crafted pickles made with love.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-orange-200/80 hover:text-white transition-colors text-sm">Home</a></li>
                            <li><a href="/products" className="text-orange-200/80 hover:text-white transition-colors text-sm">All Products</a></li>
                            <li><a href="#" className="text-orange-200/80 hover:text-white transition-colors text-sm">About Us</a></li>
                            <li><a href="#" className="text-orange-200/80 hover:text-white transition-colors text-sm">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Connect With Us</h3>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-100 hover:bg-brand-primary hover:text-white transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-100 hover:bg-brand-primary hover:text-white transition-all">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-100 hover:bg-brand-primary hover:text-white transition-all">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-orange-900 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-orange-200/60 text-xs">
                        &copy; {new Date().getFullYear()} Ammachi's Kitchen. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-orange-200/60 hover:text-white transition-colors text-xs">Privacy Policy</a>
                        <a href="#" className="text-orange-200/60 hover:text-white transition-colors text-xs">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
