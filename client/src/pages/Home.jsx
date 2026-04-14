import React from 'react';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const TeamMember = ({ name, role, image, phone }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="glass-card rounded-2xl p-6 text-center group"
    >
        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-100 group-hover:border-primary-500 transition-colors">
            <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">{role}</p>
        <div className="flex justify-center items-center space-x-4 text-gray-500">
            <a href={`tel:${phone}`} className="hover:text-primary-600"><Phone size={18} /></a>
            <a href="#" className="hover:text-primary-600"><Mail size={18} /></a>
        </div>
    </motion.div>
);

const Home = () => {
    const team = [
        {
            name: "Prabin Raj Dhungana",
            role: "CEO & CTO",
            phone: "+977-1234567890",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prabin"
        },
        {
            name: "Diwas Adhikari",
            role: "Event Manager",
            phone: "+977-1234567891",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diwas"
        },
        {
            name: "Dinesh Subedi",
            role: "Finance Manager",
            phone: "+977-1234567892",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dinesh"
        },
        {
            name: "Samip Benpal",
            role: "Marketing Manager",
            phone: "+977-1234567893",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samip"
        }
    ];

    return (
        <div>
            <Hero />
            
            {/* Team Section */}
            <section className="py-24 bg-gray-50 dark:bg-dark-surface/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Behind the Brand</h2>
                        <div className="w-20 h-1.5 bg-primary-600 mx-auto rounded-full"></div>
                        <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            The visionaries at IOE Pulchowk Campus bringing you the next generation of fashion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <TeamMember key={i} {...member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <h2 className="text-4xl font-bold mb-6">Stay Ahead of the Curve</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto">
                            Join the 10B newsletter and get exclusive access to drops, sales, and fashion insights.
                        </p>
                        <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="premium-input flex-1"
                            />
                            <button className="btn btn-primary whitespace-nowrap">Subscribe Now</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
