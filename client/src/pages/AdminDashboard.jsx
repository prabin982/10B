import React, { useState, useEffect } from 'react';
import useProductStore from '../store/productStore';
import api from '../services/api';
import { io } from 'socket.io-client';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Users, ShoppingBag, Phone, Mail, Users2, Save, Package, Bell, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const AdminDashboard = () => {
    const { products, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();
    const [activeTab, setActiveTab] = useState('products');
    const [users, setUsers] = useState([]);
    const [team, setTeam] = useState([]);
    const [orders, setOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingMember, setEditingMember] = useState(null);
    const [memberData, setMemberData] = useState({ name: '', role: '', bio: '', image: '' });

    const [formData, setFormData] = useState({
        name: '', price: '', description: '', category: 'Shoes',
        sizes: '7, 8, 9, 10, 11', stock: '',
        images: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        featured: false, trending: false
    });

    useEffect(() => {
        fetchProducts();
        fetchUsers();
        fetchTeam();
        fetchOrders();

        // Listen for real-time new orders
        socket.on('new_order', (order) => {
            setNotifications(prev => [{
                id: Date.now(),
                type: 'order',
                message: `New order from ${order.customerName}!`,
                phone: order.customerPhone,
                total: order.totalPrice,
                time: new Date().toLocaleTimeString(),
                read: false
            }, ...prev]);

            // Also add to orders
            setOrders(prev => [order, ...prev]);
        });

        return () => socket.off('new_order');
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (e) { console.error(e); }
    };

    const fetchTeam = async () => {
        try {
            const { data } = await api.get('/team');
            setTeam(data);
        } catch (e) { console.error(e); }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (e) { console.error(e); }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name, price: product.price, description: product.description,
            category: product.category, sizes: product.sizes?.join(', ') || '',
            stock: product.stock, images: product.images?.[0] || '',
            featured: product.featured || false, trending: product.trending || false
        });
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Delete this product permanently?')) await deleteProduct(id);
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        const data = {
            ...formData, price: Number(formData.price), stock: Number(formData.stock),
            sizes: formData.sizes.split(',').map(s => s.trim()), images: [formData.images]
        };
        if (editingProduct) await updateProduct(editingProduct._id, data);
        else await createProduct(data);
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleEditMember = (member) => {
        setEditingMember(member);
        setMemberData({ name: member.name, role: member.role, bio: member.bio, image: member.image });
    };

    const handleSaveMember = async (id) => {
        try {
            await api.put(`/team/${id}`, memberData);
            setEditingMember(null);
            fetchTeam();
        } catch (e) { alert('Failed to save'); }
    };

    const handleMarkDelivered = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}`, { isDelivered: true, isPaid: true });
            fetchOrders();
        } catch (e) { alert('Failed to update'); }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Stats
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.role === 'user').length;

    const tabs = [
        { id: 'products', icon: ShoppingBag, label: 'Inventory' },
        { id: 'orders', icon: Package, label: `Orders (${totalOrders})` },
        { id: 'users', icon: Users, label: `Customers (${totalCustomers})` },
        { id: 'team', icon: Users2, label: 'Leadership' },
        { id: 'notifications', icon: Bell, label: `Alerts ${unreadCount > 0 ? `(${unreadCount})` : ''}` },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-5xl font-black mb-2">Control Center</h1>
                    <p className="text-gray-500">Manage your entire 10B ecosystem</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="glass-card rounded-[2rem] p-6 border-l-8 border-primary-600">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
                    <p className="text-3xl font-black">Rs. {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="glass-card rounded-[2rem] p-6 border-l-8 border-green-500">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Orders</p>
                    <p className="text-3xl font-black">{totalOrders}</p>
                </div>
                <div className="glass-card rounded-[2rem] p-6 border-l-8 border-purple-500">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Customers</p>
                    <p className="text-3xl font-black">{totalCustomers}</p>
                </div>
                <div className="glass-card rounded-[2rem] p-6 border-l-8 border-orange-500">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Products</p>
                    <p className="text-3xl font-black">{products.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-dark-surface p-1.5 rounded-[2rem] mb-10 overflow-x-auto">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all whitespace-nowrap text-sm ${activeTab === tab.id ? 'bg-white dark:bg-dark-bg shadow-lg text-primary-600' : 'text-gray-500'}`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* ===== PRODUCTS TAB ===== */}
            {activeTab === 'products' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">All Products</h2>
                        <button onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', description: '', category: 'Shoes', sizes: '7, 8, 9, 10, 11', stock: '', images: '', featured: false, trending: false }); setIsModalOpen(true); }} className="btn btn-primary flex items-center gap-2">
                            <Plus size={20} /> New Product
                        </button>
                    </div>
                    <div className="glass-card rounded-[3rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 dark:bg-dark-surface/50">
                                    <tr>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Product</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Stock</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Tags</th>
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                    {products.map(p => (
                                        <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={p.images?.[0]} className="w-12 h-12 rounded-xl object-cover" alt="" /><div><p className="font-bold">{p.name}</p><p className="text-xs text-gray-400">{p.category}</p></div></div></td>
                                            <td className="px-6 py-4 font-black text-primary-600">Rs. {p.price?.toLocaleString()}</td>
                                            <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.stock}</span></td>
                                            <td className="px-6 py-4"><div className="flex gap-1">{p.featured && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-bold">Featured</span>}{p.trending && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold">Trending</span>}</div></td>
                                            <td className="px-6 py-4 text-right"><button onClick={() => handleEditProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl mr-1"><Edit size={18} /></button><button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ===== ORDERS TAB ===== */}
            {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold mb-8">Customer Orders</h2>
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id || order.id} className="glass-card rounded-[2.5rem] p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-black">{order.User?.name || order.customerName || 'Customer'}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {order.isDelivered ? 'Delivered' : 'Pending'}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm">{order.User?.email || order.customerEmail}</p>
                                        <p className="text-primary-600 font-bold text-sm">{order.User?.phone || order.customerPhone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-primary-600">Rs. {order.totalPrice?.toLocaleString()}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                {order.shippingAddress && (
                                    <div className="bg-gray-50 dark:bg-dark-bg rounded-2xl p-4 mb-6 text-sm">
                                        <p className="font-bold mb-1">📍 Delivery Address</p>
                                        <p className="text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.district}</p>
                                        {order.shippingAddress.landmark && <p className="text-gray-400 text-xs">Landmark: {order.shippingAddress.landmark}</p>}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    <a href={`tel:${order.User?.phone || order.customerPhone}`} className="btn btn-primary py-2 px-6 flex items-center gap-2 text-sm">
                                        <Phone size={16} /> Call Customer
                                    </a>
                                    {!order.isDelivered && (
                                        <button onClick={() => handleMarkDelivered(order._id || order.id)} className="btn btn-outline py-2 px-6 flex items-center gap-2 text-sm">
                                            <CheckCircle size={16} /> Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <p className="text-center text-gray-400 py-12">No orders yet. Share your store!</p>}
                    </div>
                </motion.div>
            )}

            {/* ===== USERS TAB ===== */}
            {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold mb-8">Registered Customers ({users.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {users.map(user => (
                            <div key={user._id} className="glass-card rounded-[3rem] p-8">
                                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-black mb-4">{user.name?.[0]}</div>
                                <h3 className="text-xl font-black">{user.name}</h3>
                                <p className="text-gray-500 text-sm mb-1">{user.email}</p>
                                <p className="text-primary-600 font-bold mb-6">{user.phone}</p>
                                <div className="flex gap-3">
                                    <a href={`tel:${user.phone}`} className="flex-1 btn btn-primary py-2 flex items-center justify-center gap-2 text-sm"><Phone size={14} /> Call</a>
                                    <a href={`mailto:${user.email}`} className="p-2 bg-gray-100 dark:bg-dark-surface rounded-xl"><Mail size={16} /></a>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ===== TEAM TAB ===== */}
            {activeTab === 'team' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold mb-8">Leadership Profiles</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {team.map(member => (
                            <div key={member.id} className="glass-card rounded-[3rem] p-8 flex flex-col md:flex-row gap-6">
                                <div className="w-32 h-32 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-lg border-4 border-white">
                                    <img src={editingMember?.id === member.id ? memberData.image : member.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    {editingMember?.id === member.id ? (
                                        <div className="space-y-3">
                                            <input className="premium-input text-sm" value={memberData.name} onChange={e => setMemberData({...memberData, name: e.target.value})} />
                                            <input className="premium-input text-sm" value={memberData.role} onChange={e => setMemberData({...memberData, role: e.target.value})} />
                                            <input className="premium-input text-sm" value={memberData.image} onChange={e => setMemberData({...memberData, image: e.target.value})} placeholder="Image URL" />
                                            <textarea className="premium-input text-sm h-20" value={memberData.bio} onChange={e => setMemberData({...memberData, bio: e.target.value})} />
                                            <div className="flex gap-2"><button onClick={() => handleSaveMember(member.id)} className="btn btn-primary px-4 py-2 text-sm flex items-center gap-1"><Save size={14} /> Save</button><button onClick={() => setEditingMember(null)} className="text-gray-500 font-bold text-sm">Cancel</button></div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <div><h3 className="text-xl font-black">{member.name}</h3><p className="text-primary-600 font-bold text-xs uppercase tracking-widest">{member.role}</p></div>
                                                <button onClick={() => handleEditMember(member)} className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all"><Edit size={16} /></button>
                                            </div>
                                            <p className="text-gray-500 text-sm">{member.bio}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ===== NOTIFICATIONS TAB ===== */}
            {activeTab === 'notifications' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold mb-8">Live Notifications</h2>
                    {notifications.length === 0 ? (
                        <div className="glass-card rounded-[3rem] p-16 text-center text-gray-400">
                            <Bell size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No new notifications</p>
                            <p className="text-sm">When a customer places an order, you'll be alerted here in real-time.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map(n => (
                                <div key={n.id} className="glass-card rounded-[2rem] p-6 flex items-center justify-between gap-4 border-l-8 border-green-500">
                                    <div>
                                        <p className="font-bold text-lg">{n.message}</p>
                                        <p className="text-primary-600 font-bold">Rs. {n.total?.toLocaleString()} • {n.time}</p>
                                    </div>
                                    <a href={`tel:${n.phone}`} className="btn btn-primary py-2 px-6 flex items-center gap-2 text-sm whitespace-nowrap">
                                        <Phone size={16} /> Call Now
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* ===== PRODUCT MODAL ===== */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white dark:bg-dark-surface rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmitProduct} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Name</label><input required className="premium-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Category</label><select className="premium-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option>Shoes</option><option>Clothing</option><option>Accessories</option></select></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Price (Rs.)</label><input type="number" required className="premium-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Stock</label><input type="number" required className="premium-input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} /></div>
                                </div>
                                <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Description</label><textarea required className="premium-input h-28 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                                <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Sizes (comma separated)</label><input required className="premium-input" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} /></div>
                                <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Image URL</label><div className="flex gap-3"><input required className="premium-input flex-1" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} /><div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border">{formData.images ? <img src={formData.images} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="text-gray-400 m-3" />}</div></div></div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 rounded" /><span className="font-bold text-sm">Featured</span></label>
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.trending} onChange={e => setFormData({...formData, trending: e.target.checked})} className="w-5 h-5 rounded" /><span className="font-bold text-sm">Trending</span></label>
                                </div>
                                <button type="submit" className="btn btn-primary w-full py-4 text-lg">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
