import React from 'react';
import { Heart, Mail, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-white mb-6">
              <Heart className="w-8 h-8 text-emerald-500 fill-emerald-500" />
              Yoshiki Charity
            </Link>
            <p className="text-stone-400 mb-6 max-w-sm">
              Dedicated to making a lasting impact in the lives of those who need it most. Join our movement of kindness and generosity.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://t.me/+18647899613" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-stone-800 rounded-full hover:bg-emerald-600 transition-colors"
                title="Join us on Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
              <li><Link to="/get-involved" className="hover:text-emerald-500 transition-colors">Get Involved</Link></li>
              <li><a href="https://t.me/+18647899613" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Donate</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>+1 (864) 789-9613</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 text-center text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} Yoshiki Charity Organization. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
