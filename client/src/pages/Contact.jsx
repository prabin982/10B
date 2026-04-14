import React from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, MapPin, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="text-center mb-24">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-black mb-6"
                >
                    Get in <span className="text-primary-600">Touch</span>
                </motion.h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Have questions about our collections or an existing order? Our team is here to help 24/7.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-20">
                {/* Contact Info */}
                <div className="lg:w-1/3 space-y-12">
                    <div className="glass-card rounded-[2.5rem] p-10 space-y-10">
                        <section className="flex gap-6">
                            <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Phone size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1">Call Us</h4>
                                <p className="text-gray-500 font-medium">+977-984XXXXXXX</p>
                                <p className="text-gray-400 text-sm">Mon - Sun, 9am - 10pm</p>
                            </div>
                        </section>

                        <section className="flex gap-6">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Mail size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1">Email Support</h4>
                                <p className="text-gray-500 font-medium">support@10b.com</p>
                                <p className="text-gray-400 text-sm">Response within 2 hours</p>
                            </div>
                        </section>

                        <section className="flex gap-6">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <MapPin size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1">Visit Studio</h4>
                                <p className="text-gray-500 font-medium">Pulchowk Campus, Lalitpur</p>
                                <p className="text-gray-400 text-sm">Nepal, 44600</p>
                            </div>
                        </section>
                    </div>

                    <div className="flex justify-center lg:justify-start gap-6">
                        <a href="#" className="p-4 glass-card rounded-2xl hover:text-primary-600 transition-colors"><Instagram /></a>
                        <a href="#" className="p-4 glass-card rounded-2xl hover:text-primary-600 transition-colors"><Twitter /></a>
                        <a href="#" className="p-4 glass-card rounded-2xl hover:text-primary-600 transition-colors"><Facebook /></a>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:w-2/3">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-[3.5rem] p-12 shadow-2xl"
                    >
                        <h3 className="text-3xl font-bold mb-10">Send a Message</h3>
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="premium-input bg-gray-50 border-transparent dark:bg-dark-surface" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="premium-input bg-gray-50 border-transparent dark:bg-dark-surface" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Subject</label>
                                <input type="text" placeholder="How can we help?" className="premium-input bg-gray-50 border-transparent dark:bg-dark-surface" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Message</label>
                                <textarea placeholder="Tell us about your inquiry..." className="premium-input bg-gray-50 border-transparent dark:bg-dark-surface h-48 resize-none pt-4" />
                            </div>

                            <button className="btn btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-2xl">
                                Send Message <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
