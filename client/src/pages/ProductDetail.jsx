import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import { ShoppingBag, ChevronLeft, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [qty, setQty] = useState(1);
    const { addToCart } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                if (data.sizes.length > 0) setSelectedSize(data.sizes[0]);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product, qty, selectedSize);
        navigate('/cart');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white mb-10 transition-colors"
            >
                <ChevronLeft size={20} /> Back to Shop
            </button>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Image Gallery */}
                <div className="lg:w-1/2">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-dark-surface aspect-square"
                    >
                        <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                {/* Product Info */}
                <div className="lg:w-1/2 space-y-10">
                    <div>
                        <p className="text-primary-600 font-bold tracking-widest uppercase mb-4">{product.category}</p>
                        <h1 className="text-5xl font-black mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex text-yellow-500">
                                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill={i <= 4 ? "currentColor" : "none"} />)}
                            </div>
                            <span className="text-gray-500 font-medium">(120 Reviews)</span>
                        </div>
                    </div>

                    <p className="text-4xl font-black text-primary-600">${product.price}</p>

                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Size Selector */}
                    <div className="space-y-4">
                        <label className="text-lg font-bold">Select Size</label>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold transition-all ${
                                        selectedSize === size
                                            ? 'border-primary-600 bg-primary-600 text-white'
                                            : 'border-gray-200 dark:border-dark-border hover:border-primary-400'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-6 pt-6">
                        <div className="flex items-center border-2 border-gray-100 dark:border-dark-border rounded-2xl p-1">
                            <button 
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-50 dark:hover:bg-dark-surface rounded-xl transition-colors"
                            >-</button>
                            <span className="w-12 text-center text-xl font-bold">{qty}</span>
                            <button 
                                onClick={() => setQty(qty + 1)}
                                className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-50 dark:hover:bg-dark-surface rounded-xl transition-colors"
                            >+</button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="btn btn-primary flex-1 py-5 text-xl flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={24} /> Add to Cart
                        </button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-100 dark:border-dark-border">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Truck size={24} /></div>
                            <div>
                                <p className="font-bold">Free Shipping</p>
                                <p className="text-sm text-gray-500">Orders over $200</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><ShieldCheck size={24} /></div>
                            <div>
                                <p className="font-bold">Original Product</p>
                                <p className="text-sm text-gray-500">100% Quality Assurance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
