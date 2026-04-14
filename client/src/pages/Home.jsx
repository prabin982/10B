import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { Mail, Phone, Loader2 } from 'lucide-react';
import api from '../services/api';

const TeamMember = ({ name, role, image, phone }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="glass-card rounded-[2.5rem] p-8 text-center group transition-all duration-500"
    >
        <div className="w-40 h-40 mx-auto mb-8 rounded-[2rem] overflow-hidden border-4 border-primary-50 group-hover:border-primary-500 transition-all duration-500 shadow-lg">
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <h3 className="text-2xl font-black mb-1">{name}</h3>
        <p className="text-primary-600 dark:text-primary-400 font-bold mb-6 text-sm uppercase tracking-widest">{role}</p>
        <div className="flex justify-center items-center space-x-6 text-gray-400">
            <a href={`tel:${phone}`} className="p-3 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                <Phone size={18} />
            </a>
            <a href="#" className="p-3 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                <Mail size={18} />
            </a>
        </div>
    </motion.div>
);

const Home = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const { data } = await api.get('/team');
                setTeam(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    return (
        <div>
            <Hero />
            
            {/* Team Section */}
            <section className="py-32 bg-gray-50 dark:bg-[#080808]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black mb-4">Behind the <span className="text-primary-600">Brand</span></h2>
                            <p className="text-xl text-gray-500 max-w-xl">Meet the visionaries redefining elite streetwear and footwear from Nepal to the world.</p>
                        </div>
                        <div className="hidden md:block w-32 h-1 bg-primary-600 rounded-full mb-4"></div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-primary-600" size={48} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {team.map((member) => (
                                <TeamMember 
                                    key={member.id} 
                                    {...member} 
                                    phone="+977-9828745004" 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
