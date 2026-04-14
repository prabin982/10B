import React, { useState, useEffect } from 'react';
import useProductStore from '../store/productStore';
import api from '../services/api';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Users, ShoppingBag, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { products, fetchProducts, createProduct, updateProduct, deleteProduct, loading: productLoading } = useProductStore();
    const [activeTab, setActiveTab] = useState('products');
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Shoes',
        sizes: '7, 8, 9, 10, 11',
        stock: '',
        images: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    });

    useEffect(() => {
        fetchProducts();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setUserLoading(true);
        try {
            const { data } = await api.get('/users');
            setUsers(data);
            setUserLoading(false);
        } catch (error) {
            console.error(error);
            setUserLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            sizes: product.sizes.join(', '),
            stock: product.stock,
            images: product.images[0]
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            sizes: formData.sizes.split(',').map(s => s.trim()),
            images: [formData.images]
        };

        if (editingProduct) {
            await updateProduct(editingProduct._id, data);
        } else {
            await createProduct(data);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black mb-2">Organizer Hub</h1>
                    <p className="text-gray-500">Manage your elite fashion inventory and customers.</p>
                </div>
                
                <div className="flex bg-gray-100 dark:bg-dark-surface p-1.5 rounded-2xl">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'products' ? 'bg-white dark:bg-dark-bg shadow-sm text-primary-600' : 'text-gray-500'}`}
                    >
                        <ShoppingBag size={18} /> Products
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'users' ? 'bg-white dark:bg-dark-bg shadow-sm text-primary-600' : 'text-gray-500'}`}
                    >
                        <Users size={18} /> Customers
                    </button>
                </div>
            </div>

            {activeTab === 'products' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Inventory List</h2>
                        <button 
                            onClick={() => {
                                setEditingProduct(null);
                                setFormData({ name: '', price: '', description: '', category: 'Shoes', sizes: '7, 8, 9, 10, 11', stock: '', images: '' });
                                setIsModalOpen(true);
                            }}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Plus size={20} /> Add Product
                        </button>
                    </div>

                    <div className="glass-card rounded-[2.5rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 dark:bg-dark-surface/50 border-b border-gray-100 dark:border-dark-border">
                                    <tr>
                                        <th className="px-8 py-5 font-bold text-gray-400 uppercase text-xs tracking-widest">Product</th>
                                        <th className="px-8 py-5 font-bold text-gray-400 uppercase text-xs tracking-widest">Category</th>
                                        <th className="px-8 py-5 font-bold text-gray-400 uppercase text-xs tracking-widest">Price</th>
                                        <th className="px-8 py-5 font-bold text-gray-400 uppercase text-xs tracking-widest">Stock</th>
                                        <th className="px-8 py-5 font-bold text-gray-400 uppercase text-xs tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-surface/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <img src={product.images[0]} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                                                    <span className="font-bold text-lg">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-gray-500 font-medium">{product.category}</td>
                                            <td className="px-8 py-6 font-black text-primary-600">Rs. {product.price.toLocaleString()}</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {product.stock} Units
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button onClick={() => handleEdit(product)} className="p-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all mr-2">
                                                    <Edit size={20} />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all">
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Registered Customers ({users.length})</h2>
                        <button onClick={fetchUsers} className="text-primary-600 font-bold hover:underline">Refresh List</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {users.map((user) => (
                            <div key={user._id} className="glass-card rounded-[2.5rem] p-8 hover:border-primary-300 transition-all flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-3xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-2xl font-black">
                                        {user.name[0]}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'organizer' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {user.role}
                                    </span>
                                </div>
                                
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black mb-1">{user.name}</h3>
                                    <p className="text-gray-500 font-medium truncate mb-4">{user.email}</p>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                            <Phone size={16} /> <span className="font-bold">{user.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                            <span className="text-xs font-bold uppercase opacity-50">Joined:</span> 
                                            <span className="font-medium text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-dark-border">
                                    <a 
                                        href={`tel:${user.phone}`}
                                        className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Phone size={16} /> Call Now
                                    </a>
                                    <a 
                                        href={`mailto:${user.email}`}
                                        className="p-3 bg-gray-100 dark:bg-dark-surface rounded-2xl hover:bg-gray-200 dark:hover:bg-dark-border transition-all"
                                    >
                                        <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-dark-surface rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black">{editingProduct ? 'Update Elite Item' : 'Add New Design'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors">
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Product Name</label>
                                        <input 
                                            required
                                            className="premium-input bg-gray-50/50"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="e.g. Apex Runner v2"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                                        <select 
                                            className="premium-input bg-gray-50/50"
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            <option>Shoes</option>
                                            <option>Clothing</option>
                                            <option>Accessories</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Price (Rs.)</label>
                                        <input 
                                            type="number"
                                            required
                                            className="premium-input bg-gray-50/50"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            placeholder="12000"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Stock Units</label>
                                        <input 
                                            type="number"
                                            required
                                            className="premium-input bg-gray-50/50"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                            placeholder="25"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                                    <textarea 
                                        required
                                        className="premium-input h-32 resize-none bg-gray-50/50"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Enter the craftsmanship and material details..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Available Sizes (NPR Scale)</label>
                                    <input 
                                        required
                                        className="premium-input bg-gray-50/50"
                                        value={formData.sizes}
                                        onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                                        placeholder="e.g. 7, 8, 9, 10, 11"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Image URL</label>
                                    <div className="flex gap-4 items-center">
                                        <input 
                                            required
                                            className="premium-input flex-1 bg-gray-50/50"
                                            value={formData.images}
                                            onChange={(e) => setFormData({...formData, images: e.target.value})}
                                            placeholder="https://..."
                                        />
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-primary-100">
                                            {formData.images ? <img src={formData.images} className="object-cover w-full h-full" alt="" /> : <ImageIcon className="text-gray-400" />}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full py-5 text-xl mt-6 shadow-2xl">
                                    {editingProduct ? 'Update Elite Collection' : 'Confirm New Drop'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
