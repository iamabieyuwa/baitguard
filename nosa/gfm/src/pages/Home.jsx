import React from 'react';
import Hero from '../components/sections/Hero';
import FundProgress from '../components/sections/FundProgress';
import Testimonials from '../components/sections/Testimonials';
import Footer from '../components/footer/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FundProgress />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
