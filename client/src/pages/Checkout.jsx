import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { Truck, MapPin, Phone, User, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const { cartItems, clearCart } = useCartStore();
    const { userInfo } = useAuthStore();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        fullName: userInfo?.name || '',
        phone: '',
        address: '',
        city: '',
        district: '',
        landmark: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shipping = subtotal > 5000 ? 0 : 150;
    const total = subtotal + shipping;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await api.post('/orders', {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    size: item.size,
                    product: item.product
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    landmark: formData.landmark
                },
                paymentMethod: 'Cash on Delivery',
                totalPrice: total
            });
            
            setSuccess(true);
            clearCart();
            setTimeout(() => navigate('/profile'), 3000);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-4xl font-black mb-4">Order Placed! 🎉</h2>
                    <p className="text-gray-500 text-lg mb-2">Our team has been notified and will call you shortly to confirm delivery.</p>
                    <p className="text-primary-600 font-bold">Redirecting to your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-black mb-4">Your cart is empty</h2>
                    <button onClick={() => navigate('/shop')} className="btn btn-primary">Browse Shop</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-5xl font-black mb-12">Checkout</h1>
            
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Shipping Form */}
                <div className="lg:w-2/3">
                    <form onSubmit={handleSubmit} id="checkout-form" className="space-y-8">
                        <div className="glass-card rounded-[3rem] p-10">
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <Truck className="text-primary-600" size={24} /> Delivery Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input required className="premium-input pl-12" placeholder="Your full name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input required type="tel" className="premium-input pl-12" placeholder="+977-98XXXXXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mt-6">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Street Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required className="premium-input pl-12" placeholder="House No., Street, Tole" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">City</label>
                                    <input required className="premium-input" placeholder="e.g. Lalitpur" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">District</label>
                                    <input required className="premium-input" placeholder="e.g. Lalitpur" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Landmark</label>
                                    <input className="premium-input" placeholder="Near..." value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-[3rem] p-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <CreditCard className="text-primary-600" size={24} /> Payment Method
                            </h3>
                            <div className="p-6 border-2 border-primary-200 bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl flex items-center gap-4">
                                <div className="w-5 h-5 rounded-full border-[6px] border-primary-600"></div>
                                <div>
                                    <p className="font-bold text-lg">Cash on Delivery (COD)</p>
                                    <p className="text-sm text-gray-500">Pay when you receive your premium order</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="glass-card rounded-[3rem] p-10 sticky top-32">
                        <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
                        
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <div key={`${item.product}-${item.size}`} className="flex items-center gap-4">
                                    <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">Size: {item.size} × {item.qty}</p>
                                    </div>
                                    <p className="font-black text-primary-600">Rs. {(item.price * item.qty).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 py-6 border-t border-gray-100 dark:border-dark-border text-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold">Rs. {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Delivery</span>
                                <span className="font-bold">{shipping === 0 ? <span className="text-green-600">FREE 🎉</span> : `Rs. ${shipping}`}</span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-gray-400 italic">Free delivery on orders above Rs. 5,000</p>
                            )}
                        </div>

                        <div className="flex justify-between text-2xl font-black pt-4 border-t border-gray-100 dark:border-dark-border mb-8">
                            <span>Total</span>
                            <span className="text-primary-600">Rs. {total.toLocaleString()}</span>
                        </div>

                        <button 
                            form="checkout-form"
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-2xl"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Place Order 🚀'}
                        </button>
                        <p className="text-sm text-center text-gray-400 mt-4">Our team will call you to confirm</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
