import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { Trash2, ChevronLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useCartStore();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shipping = subtotal > 5000 ? 0 : 150;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-32 h-32 bg-gray-100 dark:bg-dark-surface rounded-full flex items-center justify-center mb-8 text-gray-400">
                    <ShoppingBag size={64} />
                </div>
                <h2 className="text-4xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-10 max-w-sm">Looks like you haven't added anything to your cart yet. Explore our collections and find something amazing!</p>
                <Link to="/shop" className="btn btn-primary px-10 py-4 text-lg">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-5xl font-black mb-12">Shopping Bag</h1>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Items List */}
                <div className="lg:w-2/3 space-y-8">
                    {cartItems.map((item, index) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={`${item.product}-${item.size}`}
                            className="glass-card rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-8"
                        >
                            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                                    <p className="text-gray-500 font-bold mb-2">Size: <span className="text-primary-600">{item.size}</span></p>
                                    <p className="text-xl font-black text-primary-600">Rs. {item.price}</p>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Quantity</p>
                                        <span className="text-xl font-bold">{item.qty}</span>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.product, item.size)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <button 
                        onClick={() => navigate('/shop')}
                        className="flex items-center gap-2 text-primary-600 font-bold hover:underline"
                    >
                        <ChevronLeft size={20} /> Continue Shopping
                    </button>
                </div>

                {/* Summary */}
                <div className="lg:w-1/3">
                    <div className="glass-card rounded-[3rem] p-10 sticky top-32">
                        <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
                        <div className="space-y-6 mb-8 text-lg">
                             <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold">Rs. {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-bold">{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-dark-border" />
                            <div className="flex justify-between text-2xl font-black">
                                <span>Total</span>
                                <span className="text-primary-600">Rs. {total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/checkout')}
                            className="btn btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-2xl"
                        >
                            Checkout Now <ArrowRight size={24} />
                        </button>

                        <p className="text-sm text-center text-gray-400 mt-6">Secure encrypted checkout powered by 10D Payments</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
