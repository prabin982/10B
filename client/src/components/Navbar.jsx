import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );
    const { userInfo, logout } = useAuthStore();
    const { cartItems } = useCartStore();
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setDarkMode(!darkMode);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                            10B
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/shop" className="font-medium hover:text-primary-600 transition-colors">Shop</Link>
                        <Link to="/about" className="font-medium hover:text-primary-600 transition-colors">Our Team</Link>
                        <Link to="/contact" className="font-medium hover:text-primary-600 transition-colors">Contact</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-5">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
                            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                        </button>

                        <Link to="/cart" className="relative p-2 hover:text-primary-600 transition-colors">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-dark-surface">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {userInfo ? (
                            <div className="flex items-center space-x-4">
                                <Link to={userInfo.role === 'admin' || userInfo.role === 'organizer' ? '/admin' : '/profile'} className="flex items-center space-x-2 group">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        {userInfo.name[0]}
                                    </div>
                                </Link>
                                <button onClick={() => { logout(); navigate('/login'); }} className="p-2 hover:text-red-500 transition-colors">
                                    <LogOut size={22} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary text-sm">
                                Login
                            </Link>
                        )}

                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-card border-t border-gray-100 dark:border-dark-border py-4 px-4 space-y-4">
                    <Link to="/shop" onClick={() => setIsOpen(false)} className="block font-medium">Shop</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)} className="block font-medium">Our Team</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="block font-medium">Contact</Link>
                    {(userInfo?.role === 'admin' || userInfo?.role === 'organizer') && (
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="block font-bold text-primary-600">Admin Panel</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
