import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="text-4xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                            10B
                        </Link>
                        <p className="text-gray-500 leading-relaxed">
                            Elite fashion for the modern era. Designed at Pulchowk Campus, worn globally. 
                            Join the movement of premium craftsmanship and innovation.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-3 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:text-primary-600 transition-all"><Instagram size={20}/></a>
                            <a href="#" className="p-3 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:text-primary-600 transition-all"><Twitter size={20}/></a>
                            <a href="#" className="p-3 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:text-primary-600 transition-all"><Facebook size={20}/></a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-xl font-bold mb-8">Shop Collections</h4>
                        <ul className="space-y-4 text-gray-500 font-medium">
                            <li><Link to="/shop" className="hover:text-primary-600">All Products</Link></li>
                            <li><Link to="/shop?category=Shoes" className="hover:text-primary-600">Footwear</Link></li>
                            <li><Link to="/shop?category=Clothing" className="hover:text-primary-600">Apparel</Link></li>
                            <li><Link to="/shop?category=Accessories" className="hover:text-primary-600">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-xl font-bold mb-8">Quick Links</h4>
                        <ul className="space-y-4 text-gray-500 font-medium">
                            <li><Link to="/about" className="hover:text-primary-600">Our Vision</Link></li>
                            <li><Link to="/about" className="hover:text-primary-600">The Team</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-600">Contact Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-600">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xl font-bold mb-8">Contact Info</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 text-gray-500">
                                <Phone size={20} className="text-primary-600" />
                                <span>+977-9828745004</span>
                            </li>
                            <li className="flex gap-4 text-gray-500">
                                <Mail size={20} className="text-primary-600" />
                                <span>078bei026.prabin@pcampus.edu.np</span>
                            </li>
                            <li className="flex gap-4 text-gray-500">
                                <MapPin size={20} className="text-primary-600" />
                                <span>Pulchowk Campus, Lalitpur, Nepal</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-gray-100 dark:border-dark-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 font-medium">
                        © 2026 <span className="text-primary-600 font-bold">10B Ltd</span>. All rights reserved.
                    </p>
                    <div className="flex gap-10 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-primary-600">Privacy Policy</a>
                        <a href="#" className="hover:text-primary-600">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
