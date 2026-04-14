import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { User, Package, Settings, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { userInfo, logout } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    if (!userInfo) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Sidebar */}
                <aside className="lg:w-1/4">
                    <div className="glass-card rounded-[2.5rem] p-8 text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-black">
                            {userInfo.name[0]}
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{userInfo.name}</h2>
                        <p className="text-gray-500 mb-6">{userInfo.email}</p>
                        <button 
                            onClick={logout}
                            className="flex items-center justify-center gap-2 w-full text-red-500 font-bold hover:bg-red-50 py-3 rounded-2xl transition-colors"
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>

                    <div className="glass-card rounded-[2.5rem] overflow-hidden">
                        <button className="w-full flex items-center gap-4 px-8 py-5 bg-primary-600 text-white font-bold">
                            <User size={20} /> Profile Details
                        </button>
                        <button className="w-full flex items-center gap-4 px-8 py-5 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                            <Package size={20} /> Order History
                        </button>
                        <button className="w-full flex items-center gap-4 px-8 py-5 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                            <Settings size={20} /> Account Settings
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:w-3/4 space-y-12">
                    <section>
                        <h1 className="text-4xl font-black mb-10">My Dashboard</h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="glass-card rounded-[2rem] p-8 border-l-8 border-primary-600">
                                <p className="text-gray-500 font-bold mb-2 uppercase text-xs tracking-widest">Total Orders</p>
                                <p className="text-4xl font-black">{orders.length}</p>
                            </div>
                            <div className="glass-card rounded-[2rem] p-8 border-l-8 border-green-500">
                                <p className="text-gray-500 font-bold mb-2 uppercase text-xs tracking-widest">Rewards Points</p>
                                <p className="text-4xl font-black">450</p>
                            </div>
                            <div className="glass-card rounded-[2rem] p-8 border-l-8 border-purple-500">
                                <p className="text-gray-500 font-bold mb-2 uppercase text-xs tracking-widest">Wishlist Items</p>
                                <p className="text-4xl font-black">12</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold">Recent Orders</h3>
                            <button className="text-primary-600 font-bold hover:underline flex items-center gap-1">View All <ChevronRight size={18} /></button>
                        </div>

                        {loading ? (
                            <div className="text-center py-10">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="glass-card rounded-[2.5rem] p-12 text-center text-gray-500">
                                <p className="text-lg">You haven't placed any orders yet.</p>
                                <Link to="/shop" className="text-primary-600 font-bold hover:underline mt-4 block">Shop Now</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="glass-card rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-primary-300 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-2xl group-hover:bg-primary-50 transition-colors">
                                                <Package className="text-gray-400 group-hover:text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Order #{order._id.substring(0, 8)}</p>
                                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-lg">Rs. {order.totalPrice?.toLocaleString()}</p>
                                            <p className={`text-xs font-bold uppercase ${order.isDelivered ? 'text-green-500' : 'text-orange-500'}`}>
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Profile;
