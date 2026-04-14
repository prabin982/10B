import React, { useState, useEffect } from 'react';
import useProductStore from '../store/productStore';
import api from '../services/api';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Users, ShoppingBag, Phone, Mail, Users2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { products, fetchProducts, createProduct, updateProduct, deleteProduct, loading: productLoading } = useProductStore();
    const [activeTab, setActiveTab] = useState('products');
    const [users, setUsers] = useState([]);
    const [team, setTeam] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [teamLoading, setTeamLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingMember, setEditingMember] = useState(null);
    
    // Member Form State
    const [memberData, setMemberData] = useState({ name: '', role: '', bio: '', image: '' });

    // Product Form State
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
        fetchTeam();
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

    const fetchTeam = async () => {
        setTeamLoading(true);
        try {
            const { data } = await api.get('/team');
            setTeam(data);
            setTeamLoading(false);
        } catch (error) {
            console.error(error);
            setTeamLoading(false);
        }
    };

    const handleEditProduct = (product) => {
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

    const handleEditMember = (member) => {
        setEditingMember(member);
        setMemberData({
            name: member.name,
            role: member.role,
            bio: member.bio,
            image: member.image
        });
    };

    const handleSaveMember = async (id) => {
        try {
            await api.put(`/team/${id}`, memberData);
            setEditingMember(null);
            fetchTeam();
        } catch (error) {
            alert('Failed to update member');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    const handleSubmitProduct = async (e) => {
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
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black mb-2">Organizer Hub</h1>
                    <p className="text-gray-500 font-medium">Control the 10B ecosystem.</p>
                </div>
                
                <div className="flex bg-gray-100 dark:bg-dark-surface p-1.5 rounded-[2rem] overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-white dark:bg-dark-bg shadow-lg text-primary-600' : 'text-gray-500'}`}
                    >
                        <ShoppingBag size={18} /> Inventory
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white dark:bg-dark-bg shadow-lg text-primary-600' : 'text-gray-500'}`}
                    >
                        <Users size={18} /> Customers
                    </button>
                    <button 
                        onClick={() => setActiveTab('team')}
                        className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'team' ? 'bg-white dark:bg-dark-bg shadow-lg text-primary-600' : 'text-gray-500'}`}
                    >
                        <Users2 size={18} /> Leadership
                    </button>
                </div>
            </div>

            {activeTab === 'products' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Current Stock</h2>
                        <button 
                            onClick={() => {
                                setEditingProduct(null);
                                setFormData({ name: '', price: '', description: '', category: 'Shoes', sizes: '7, 8, 9, 10, 11', stock: '', images: '' });
                                setIsModalOpen(true);
                            }}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Plus size={20} /> New Drop
                        </button>
                    </div>

                    <div className="glass-card rounded-[3rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 dark:bg-dark-surface/50">
                                    <tr>
                                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Design</th>
                                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
                                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Price (NPR)</th>
                                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <img src={product.images[0]} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                                                    <span className="font-bold text-lg">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-medium text-gray-500">{product.category}</td>
                                            <td className="px-8 py-6 font-black text-primary-600">Rs. {product.price.toLocaleString()}</td>
                                            <td className="px-8 py-6">
                                                <button onClick={() => handleEditProduct(product)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl mr-2"><Edit size={20} /></button>
                                                <button onClick={() => handleDeleteProduct(product._id)} className="p-3 text-red-600 hover:bg-red-50 rounded-2xl"><Trash2 size={20} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-2xl font-bold mb-8">Registered Users ({users.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {users.map((user) => (
                            <div key={user._id} className="glass-card rounded-[3rem] p-8 flex flex-col justify-between hover:border-primary-300 transition-all">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-black mb-6">
                                        {user.name[0]}
                                    </div>
                                    <h3 className="text-2xl font-black mb-1">{user.name}</h3>
                                    <p className="text-gray-500 font-medium mb-4">{user.email}</p>
                                    <div className="flex items-center gap-3 text-gray-600 font-bold mb-8">
                                        <Phone size={16} /> {user.phone}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <a href={`tel:${user.phone}`} className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2"><Phone size={16} /> Call</a>
                                    <a href={`mailto:${user.email}`} className="p-3 bg-gray-100 dark:bg-dark-surface rounded-2xl"><Mail size={18} /></a>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'team' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-2xl font-bold mb-8">Manage Leadership Profiles</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {team.map((member) => (
                            <div key={member.id} className="glass-card rounded-[3rem] p-8 flex flex-col md:flex-row gap-8">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden flex-shrink-0 shadow-lg border-4 border-white">
                                    <img src={editingMember?.id === member.id ? memberData.image : member.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                
                                <div className="flex-1">
                                    {editingMember?.id === member.id ? (
                                        <div className="space-y-4">
                                            <input className="premium-input text-sm" value={memberData.name} onChange={(e) => setMemberData({...memberData, name: e.target.value})} placeholder="Name" />
                                            <input className="premium-input text-sm" value={memberData.role} onChange={(e) => setMemberData({...memberData, role: e.target.value})} placeholder="Role" />
                                            <input className="premium-input text-sm" value={memberData.image} onChange={(e) => setMemberData({...memberData, image: e.target.value})} placeholder="Image URL" />
                                            <textarea className="premium-input text-sm h-24" value={memberData.bio} onChange={(e) => setMemberData({...memberData, bio: e.target.value})} placeholder="Bio" />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleSaveMember(member.id)} className="btn btn-primary px-6 py-2 flex items-center gap-2"><Save size={16} /> Save</button>
                                                <button onClick={() => setEditingMember(null)} className="px-6 py-2 font-bold text-gray-500 hover:underline">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-black">{member.name}</h3>
                                                    <p className="text-primary-600 font-bold uppercase text-xs tracking-widest">{member.role}</p>
                                                </div>
                                                <button onClick={() => handleEditMember(member)} className="p-3 bg-primary-50 text-primary-600 rounded-2xl hover:bg-primary-600 hover:text-white transition-all">
                                                    <Edit size={20} />
                                                </button>
                                            </div>
                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Product Modal - Re-used the same one but with refined styles */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-white dark:bg-dark-surface rounded-[4rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <h2 className="text-3xl font-black mb-10">{editingProduct ? 'Update Design' : 'New Drop Configuration'}</h2>
                            <form onSubmit={handleSubmitProduct} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Name</label>
                                        <input required className="premium-input bg-gray-50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Price (Rs.)</label>
                                        <input type="number" required className="premium-input bg-gray-50" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Image URL</label>
                                    <input required className="premium-input bg-gray-50" value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                                    <textarea required className="premium-input bg-gray-50 h-32" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                                </div>
                                <button type="submit" className="btn btn-primary w-full py-5 text-xl mt-6">Confirm Update</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
