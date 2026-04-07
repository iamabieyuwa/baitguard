import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import DonateButton from '../ui/DonateButton';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Charity Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-stone-900/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in-up">
          <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span className="text-sm font-medium tracking-wide text-emerald-50">Help make a difference today</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
          Empowering Hope,<br />
          <span className="bg-gradient-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent">Changing Lives.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-emerald-50 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
          Join the Yoshiki Charity Organization in our mission to bring aid and support to those who need it most.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
          <DonateButton 
            className="group bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
          >
            Donate Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </DonateButton>
          <a 
            href="/about"
            className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
