import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../store/productStore';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Shop = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchProducts(selectedCategory === 'All' ? '' : selectedCategory, searchTerm);
    }, [selectedCategory, searchTerm]);

    const categories = ['All', 'Shoes', 'Clothing', 'Accessories'];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                <h1 className="text-5xl font-black">Store</h1>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="premium-input pl-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Filters */}
                <aside className="lg:w-64 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Filter size={18} /> Categories
                        </h3>
                        <div className="space-y-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`block w-full text-left px-4 py-2 rounded-xl transition-all ${
                                        selectedCategory === cat 
                                        ? 'bg-primary-600 text-white font-bold' 
                                        : 'hover:bg-gray-100 dark:hover:bg-dark-surface'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="h-[400px] rounded-3xl bg-gray-100 dark:bg-dark-surface animate-pulse" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-gray-400">No products found</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={product._id}
                                    className="group relative"
                                >
                                    <Link to={`/product/${product._id}`}>
                                        <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 dark:bg-dark-surface relative">
                                            <img 
                                                src={product.images[0]} 
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 group-hover:translate-x-0 translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="bg-white p-3 rounded-full shadow-xl hover:bg-primary-600 hover:text-white transition-colors">
                                                    <ShoppingBag size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium mb-1">{product.category}</p>
                                                    <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                                </div>
                                                <p className="text-xl font-black text-primary-600">Rs. {product.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
