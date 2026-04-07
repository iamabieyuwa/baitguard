import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Community Volunteer",
    text: "Working with Yoshiki Charity has been a life-changing experience. Seeing the direct impact of our contributions is incredibly rewarding.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Beneficiary",
    text: "The support I received helped me get back on my feet. I am forever grateful to this amazing organization and its donors.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Regular Donor",
    text: "I trust Yoshiki Charity to use my donations effectively. Their transparency and dedication are unmatched in the sector.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Voices of Impact</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Hear from those who power our mission and those whose lives have been changed.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100">
              <Quote className="w-10 h-10 text-emerald-500 mb-6 opacity-20" />
              <p className="text-stone-600 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <h4 className="font-bold text-stone-900">{testimonial.name}</h4>
                  <p className="text-sm text-emerald-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
