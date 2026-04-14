import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 right-0 -z-10 w-1/2 h-full opacity-50 dark:opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400 rounded-full blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2"
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold tracking-wider uppercase">
            New Arrival 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            Step Into <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Elite</span> Fashion
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg">
            Experience the perfect blend of performance and style with 10B. 
            Crafted for those who dare to move differently.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/shop" className="btn btn-primary px-10 py-4 flex items-center gap-2 text-lg">
              Explore Collection <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="text-gray-900 dark:text-white font-bold hover:underline">
              Meet the Founders
            </Link>
          </div>
          
          <div className="mt-16 flex items-center gap-12 border-t border-gray-100 dark:border-dark-border pt-10">
            <div>
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm text-gray-500">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1.2k+</div>
              <div className="text-sm text-gray-500">Premium Designs</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99%</div>
              <div className="text-sm text-gray-500">Positive Reviews</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="md:w-1/2 relative"
        >
          <div className="relative z-10 scale-110 md:scale-125">
             {/* Using a placeholder for now, ideally an image generated via tool */}
             <img 
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Shoe" 
              className="drop-shadow-[0_35px_35px_rgba(58,102,245,0.3)] hover:rotate-6 transition-transform duration-700"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[2px] border-primary-500/10 rounded-full animate-ping pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
