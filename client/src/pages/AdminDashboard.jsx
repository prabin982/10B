import React, { useState, useEffect } from 'react';
import useProductStore from '../store/productStore';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { products, fetchProducts, createProduct, updateProduct, deleteProduct, loading } = useProductStore();
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
    }, []);

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
        setFormData({ name: '', price: '', description: '', category: 'Shoes', sizes: '7, 8, 9, 10, 11', stock: '', images: '' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-black">Organizer Dashboard</h1>
                <button 
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', price: '', description: '', category: 'Shoes', sizes: 'S, M, L, XL', stock: '', images: '' });
                        setIsModalOpen(true);
                    }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add New Product
                </button>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border">
                        <tr>
                            <th className="px-6 py-4 font-bold">Product</th>
                            <th className="px-6 py-4 font-bold">Category</th>
                            <th className="px-6 py-4 font-bold">Price</th>
                            <th className="px-6 py-4 font-bold">Stock</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-dark-surface/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={product.images[0]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                        <span className="font-medium">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4 font-bold text-primary-600">Rs. {product.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock} in stock
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
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
                            className="relative w-full max-w-2xl bg-white dark:bg-dark-surface rounded-[2rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase">Product Name</label>
                                        <input 
                                            required
                                            className="premium-input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="e.g. Air Max 2026"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase">Category</label>
                                        <select 
                                            className="premium-input"
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            <option>Shoes</option>
                                            <option>Clothing</option>
                                            <option>Accessories</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase">Price (Rs.)</label>
                                        <input 
                                            type="number"
                                            required
                                            className="premium-input"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            placeholder="99.99"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase">Stock</label>
                                        <input 
                                            type="number"
                                            required
                                            className="premium-input"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                            placeholder="50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase">Description</label>
                                    <textarea 
                                        required
                                        className="premium-input h-32 resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Describe the premium details..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase">Sizes (comma separated)</label>
                                    <input 
                                        required
                                        className="premium-input"
                                        value={formData.sizes}
                                        onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                                        placeholder="S, M, L, XL or 7, 8, 9, 10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase">Image URL</label>
                                    <div className="flex gap-4">
                                        <input 
                                            required
                                            className="premium-input flex-1"
                                            value={formData.images}
                                            onChange={(e) => setFormData({...formData, images: e.target.value})}
                                            placeholder="Paste image link here"
                                        />
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                            {formData.images ? <img src={formData.images} className="object-cover w-full h-full" alt="" /> : <ImageIcon className="text-gray-400" />}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full py-4 text-lg mt-4 shadow-2xl">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
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
