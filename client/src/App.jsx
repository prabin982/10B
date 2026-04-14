import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children, isAdmin = false }) => {
    const { userInfo } = useAuthStore();
    
    if (!userInfo) {
        return <Navigate to="/login" />;
    }
    
    if (isAdmin && userInfo.role !== 'admin' && userInfo.role !== 'organizer') {
        return <Navigate to="/" />;
    }
    
    return children;
};

function App() {
  return (
    <Router>
        <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
            <Navbar />
            <main className="pt-20">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/admin" element={
                        <ProtectedRoute isAdmin={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <Footer />
        </div>
    </Router>
  );
}

export default App;
