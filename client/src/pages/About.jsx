import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

const TeamCard = ({ name, role, bio, image, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="glass-card rounded-[3rem] p-10 flex flex-col md:flex-row gap-10 items-center hover:shadow-primary-600/10 transition-shadow"
    >
        <div className="w-48 h-48 rounded-3xl overflow-hidden flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 shadow-xl">
            <img src={image} alt={name} className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700" />
        </div>
        <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                <h3 className="text-3xl font-black">{name}</h3>
                <span className="px-4 py-1 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full text-sm font-bold w-fit">
                    {role}
                </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                {bio}
            </p>
            <div className="flex gap-4">
                <a href="#" className="p-3 bg-gray-50 dark:bg-dark-surface rounded-2xl hover:bg-primary-600 hover:text-white transition-all">
                    <Linkedin size={20} />
                </a>
                <a href="#" className="p-3 bg-gray-50 dark:bg-dark-surface rounded-2xl hover:bg-primary-600 hover:text-white transition-all">
                    <Github size={20} />
                </a>
                <a href="#" className="p-3 bg-gray-50 dark:bg-dark-surface rounded-2xl hover:bg-primary-600 hover:text-white transition-all">
                    <Mail size={20} />
                </a>
            </div>
        </div>
    </motion.div>
);

const About = () => {
    const team = [
        {
            name: "Prabin Raj Dhungana",
            role: "CEO & CTO",
            bio: "A visionary technologist from Pulchowk Campus, leading the engineering and strategy at 10B. Passionate about blending high-performance computing with modern fashion aesthetics.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prabin",
            delay: 0.1
        },
        {
            name: "Diwas Adhikari",
            role: "Event Manager",
            bio: "The creative force behind 10B's premium events and product launches, ensuring every interaction with the brand is an unforgettable experience.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diwas",
            delay: 0.2
        },
        {
            name: "Dinesh Subedi",
            role: "Finance Manager",
            bio: "Overseeing the financial health and sustainable growth of 10B, ensuring that premium quality is matched with operational excellence.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dinesh",
            delay: 0.3
        },
        {
            name: "Samip Benpal",
            role: "Marketing Manager",
            bio: "Crafting the story of 10B and connecting our elite footwear to fashion enthusiasts worldwide through innovative digital storytelling.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samip",
            delay: 0.4
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="max-w-4xl mb-24">
                <motion.h1 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-6xl md:text-8xl font-black mb-8 leading-tight"
                >
                    Defining the Future of <span className="text-primary-600">Premium</span> Streetwear.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl text-gray-500 dark:text-gray-400 leading-relaxed"
                >
                    10B isn't just a brand; it's a movement born out of the Pulchowk Campus, 
                    dedicated to those who value craftsmanship, exclusivity, and technological innovation.
                </motion.p>
            </div>

            <div className="space-y-12">
                <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
                    The Leadership <div className="h-px bg-gray-200 flex-1" />
                </h2>
                
                <div className="grid grid-cols-1 gap-12">
                    {team.map((member, i) => (
                        <TeamCard key={i} {...member} />
                    ))}
                </div>
            </div>

            <div className="mt-32 glass-card rounded-[4rem] p-16 md:p-24 text-center">
                <h2 className="text-5xl font-black mb-8">Our Mission</h2>
                <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    To disrupt the global fashion landscape by integrating advanced materials, 
                    sustainable practices, and elite design principles.
                </p>
                <div className="mt-12 flex justify-center gap-12 text-7xl font-black opacity-10 select-none">
                    <span>10B</span>
                    <span>10B</span>
                    <span>10B</span>
                </div>
            </div>
        </div>
    );
};

export default About;
