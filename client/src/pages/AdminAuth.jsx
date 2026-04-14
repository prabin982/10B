import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const AdminAuth = () => {
    const [secretKey, setSecretKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { userInfo } = useAuthStore();

    const handleUpgrade = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            setError('Please log in to your account first.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await api.post('/users/upgrade', { secretKey });
            // Re-fetch user or just hack the role in storage for immediate access
            const updatedUser = { ...userInfo, role: 'organizer' };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            window.location.href = '/admin'; // Force reload to update store/UI
        } catch (err) {
            setError(err.response?.data?.message || 'Authorization failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-dark-bg">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-600/20">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-black mb-2">Admin Access</h1>
                    <p className="text-gray-500">Enter the master secret key to unlock organizer portals.</p>
                </div>

                <div className="glass-card rounded-[3rem] p-10 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleUpgrade} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Master Secret Key</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    className="premium-input pl-12"
                                    placeholder="Enter secret code"
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 shadow-xl"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Authorize Access'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400 font-medium leading-relaxed">
                        This is a restricted area. All access attempts are logged and monitored by the 10D security infrastructure.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminAuth;
