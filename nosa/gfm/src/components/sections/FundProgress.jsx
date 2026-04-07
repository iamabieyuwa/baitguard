import React, { useEffect, useState } from 'react';
import DonateButton from '../ui/DonateButton';

const FundProgress = () => {
  const [progress, setProgress] = useState(0);
  const target = 150000;
  const current = 112500; // Placeholder amount
  const percentage = (current / target) * 100;

  useEffect(() => {
    // Animate progress bar on mount
    const timer = setTimeout(() => setProgress(percentage), 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <section className="py-20 relative bg-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100 -mt-32">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Fundraising Progress</h2>
            <p className="text-slate-600">Help us reach our goal to expand our impact.</p>
          </div>

          <div className="relative mb-6">
            <div className="flex justify-between items-end mb-2 font-bold">
              <span className="text-4xl text-emerald-800">${current.toLocaleString()}</span>
              <span className="text-slate-400">of ${target.toLocaleString()} goal</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-6 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-full transition-all duration-1500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-500 mb-8">
            <span>2,340 donors</span>
            <span>12 days left</span>
          </div>

          <div className="text-center">
             <DonateButton 
              className="inline-flex justify-center items-center w-full md:w-auto bg-stone-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-stone-800 transition-all shadow-md hover:shadow-stone-900/20"
            >
              Make a Donation
            </DonateButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FundProgress;
