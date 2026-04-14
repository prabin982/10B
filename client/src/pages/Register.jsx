import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { User, Mail, Lock, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        adminCode: ''
    });
    
    const { register, userInfo, loading, error } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black mb-4">Create Account</h1>
                    <p className="text-gray-500">Join 10B and start your fashion journey</p>
                </div>

                <div className="glass-card rounded-[3rem] p-10 md:p-12 shadow-2xl">
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="text" 
                                        required
                                        className="premium-input pl-12"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="tel" 
                                        required
                                        className="premium-input pl-12"
                                        placeholder="+977-..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    className="premium-input pl-12"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    className="premium-input pl-12"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 px-1 italic">Must be at least 6 characters long</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Admin Code (Optional)</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    className="premium-input pl-12"
                                    placeholder="Enter secret code for organizer access"
                                    value={formData.adminCode}
                                    onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
                                <span className="text-sm text-gray-500 group-hover:text-gray-700">I agree to the <span className="text-primary-600 font-bold">Terms & Conditions</span></span>
                            </label>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-xl"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Create My Account'}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-gray-500">
                        Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Log in here</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
