import React from 'react';
import Footer from '../components/footer/Footer';
import { Target, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 pb-12 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About Yoshiki Charity</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Founded with a vision to bridge the gap between disparity and opportunity.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1542833178-9904d9c40334?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Our Team" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                At Yoshiki Charity, we believe that kindness has the power to transform lives. Our mission is to provide essential resources, education, and healthcare to underserved communities across the globe.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                We are driven by transparency, compassion, and the unwavering belief that every individual deserves a chance to thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
           <div className="grid md:grid-cols-3 gap-8 text-center">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Target className="w-8 h-8 text-blue-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Focused Impact</h3>
               <p className="text-slate-600">Targeted initiatives that address the root causes of poverty.</p>
             </div>
             
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Users className="w-8 h-8 text-amber-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Community Led</h3>
               <p className="text-slate-600">Working hand-in-hand with local leaders to ensure sustainable change.</p>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Award className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Transparent</h3>
               <p className="text-slate-600">100% committed to financial integrity and open reporting.</p>
             </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
