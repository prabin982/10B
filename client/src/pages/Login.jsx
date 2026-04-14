import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Mail, Lock, AlertCircle, Loader2, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Login = () => {
    const [mode, setMode] = useState('user'); // 'user' or 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const { login, userInfo, loading, error } = useAuthStore();
    const [adminError, setAdminError] = useState(null);
    const [adminLoading, setAdminLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === 'organizer' || userInfo.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [userInfo, navigate]);

    const handleUserLogin = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setAdminError(null);
        setAdminLoading(true);
        
        try {
            // Step 1: Login normally
            const { data } = await api.post('/users/login', { email, password });

            // Step 2: Verify secret key
            const upgradeRes = await api.post('/users/upgrade', 
                { secretKey },
                { headers: { Authorization: `Bearer ${data.token}` } }
            );
            
            // Step 3: Store upgraded user
            const upgradedUser = { ...data, role: 'organizer' };
            localStorage.setItem('userInfo', JSON.stringify(upgradedUser));
            useAuthStore.setState({ userInfo: upgradedUser });
            setAdminLoading(false);
        } catch (err) {
            setAdminError(err.response?.data?.message || 'Invalid credentials or secret key');
            setAdminLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black mb-4">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to continue your premium experience</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-dark-surface p-1.5 rounded-[2rem] mb-8">
                    <button 
                        onClick={() => { setMode('user'); setAdminError(null); }}
                        className={`flex-1 py-3.5 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all ${mode === 'user' ? 'bg-white dark:bg-dark-bg shadow-lg text-primary-600' : 'text-gray-500'}`}
                    >
                        <User size={18} /> Customer
                    </button>
                    <button 
                        onClick={() => { setMode('admin'); }}
                        className={`flex-1 py-3.5 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all ${mode === 'admin' ? 'bg-white dark:bg-dark-bg shadow-lg text-primary-600' : 'text-gray-500'}`}
                    >
                        <ShieldCheck size={18} /> Admin
                    </button>
                </div>

                <div className="glass-card rounded-[2.5rem] p-10 shadow-2xl">
                    {/* User Login Error */}
                    {mode === 'user' && error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}
                    {/* Admin Login Error */}
                    {mode === 'admin' && adminError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                            <AlertCircle size={20} /> {adminError}
                        </div>
                    )}

                    {mode === 'user' ? (
                        <form onSubmit={handleUserLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="email" required
                                        className="premium-input pl-12"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="password" required
                                        className="premium-input pl-12"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : 'Log In as Customer'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleAdminLogin} className="space-y-6">
                            <div className="p-4 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 rounded-2xl text-sm font-medium text-center">
                                🔐 Restricted Area — Only authorized personnel
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Admin Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="email" required
                                        className="premium-input pl-12"
                                        placeholder="admin@10d.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="password" required
                                        className="premium-input pl-12"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Master Secret Key</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="password" required
                                        className="premium-input pl-12"
                                        placeholder="Enter master key"
                                        value={secretKey}
                                        onChange={(e) => setSecretKey(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button disabled={adminLoading} type="submit" className="btn w-full py-4 text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
                                {adminLoading ? <Loader2 className="animate-spin" /> : '🛡️ Authorize Admin Access'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-gray-500">
                        Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Sign up for free</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
