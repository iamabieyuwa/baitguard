import React from 'react';
import Footer from '../components/footer/Footer';
import { HandHeart, Users, Share2 } from 'lucide-react';
import DonateButton from '../components/ui/DonateButton';

const GetInvolved = () => {
  return (
    <div className="flex flex-col min-h-screen">
       <div className="pt-24 pb-12 bg-gradient-to-br from-emerald-900 to-stone-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Involved</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            There are many ways to support our cause. Find the one that fits you best.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
               <div className="bg-emerald-600 p-8 h-full text-white flex flex-col items-center text-center">
                 <HandHeart className="w-16 h-16 mb-6 text-emerald-200" />
                 <h3 className="text-2xl font-bold mb-4">Volunteer</h3>
                 <p className="mb-8 text-emerald-100">Join our team of dedicated volunteers on the ground.</p>
                 <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-bold hover:bg-emerald-50 transition-colors mt-auto">
                   Apply Now
                 </button>
               </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
               <div className="bg-teal-600 p-8 h-full text-white flex flex-col items-center text-center">
                 <Share2 className="w-16 h-16 mb-6 text-teal-200" />
                 <h3 className="text-2xl font-bold mb-4">Spread the Word</h3>
                 <p className="mb-8 text-teal-100">Share our mission with your network and amplify our impact.</p>
                 <button className="bg-white text-teal-600 px-6 py-2 rounded-full font-bold hover:bg-teal-50 transition-colors mt-auto">
                   Share Now
                 </button>
               </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
               <div className="bg-stone-600 p-8 h-full text-white flex flex-col items-center text-center">
                 <Users className="w-16 h-16 mb-6 text-stone-300" />
                 <h3 className="text-2xl font-bold mb-4">Partner With Us</h3>
                 <p className="mb-8 text-stone-200">Collaborate with us for corporate social responsibility initiatives.</p>
                 <button className="bg-white text-stone-600 px-6 py-2 rounded-full font-bold hover:bg-stone-50 transition-colors mt-auto">
                   Contact Us
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50 text-center">
         <div className="container mx-auto px-6">
           <h2 className="text-3xl font-bold text-stone-900 mb-6">Ready to make a difference?</h2>
           <DonateButton 
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-1 transition-all duration-300"
            >
              Donate Now
            </DonateButton>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default GetInvolved;
