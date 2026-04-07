import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import DonateButton from '../ui/DonateButton';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
          <Heart className="w-8 h-8 text-emerald-600 fill-emerald-600" />
          Yoshiki Charity
        </Link>
        <div className="hidden md:flex items-center gap-8 font-medium text-stone-700">
          <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-emerald-700 transition-colors">About Us</Link>
          <Link to="/get-involved" className="hover:text-emerald-700 transition-colors">Get Involved</Link>
          <a href="https://t.me/+18647899613" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 transition-colors">Contact Us</a>
        </div>
        <DonateButton 
          className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white px-6 py-2.5 rounded-full font-semibold shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.02] transition-all duration-300"
        >
          Donate Now
        </DonateButton>
      </div>
    </nav>
  );
};

export default Navbar;
