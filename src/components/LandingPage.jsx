import React from 'react';

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Which tax regime actually saves you money?
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">
              Answer 8 simple questions. Get a clear answer in under 2 minutes.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-1">
              <span role="img" aria-label="private">🔒</span> Private — runs in your browser
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-600">✓</span> FY 2025-26
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-600">✓</span> Budget 2025 updated
            </span>
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-blue-700 text-white text-lg font-semibold rounded-xl shadow hover:bg-blue-800 transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Find out — it's free →
            </button>
            <p className="text-sm text-gray-500">
              No sign-up. No email. Everything stays on your device.
            </p>
          </div>

        </div>

        {/* What you'll get Section */}
        <div className="w-full max-w-5xl mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4 text-xl">
                ⚖️
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Which regime saves you more</h3>
              <p className="text-gray-600">Get a clear verdict with the exact rupee difference.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4 text-xl">
                📊
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Slab-by-slab breakdown</h3>
              <p className="text-gray-600">See exactly how your income is taxed in each bracket.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4 text-xl">
                💡
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Personalised tips</h3>
              <p className="text-gray-600">Tailored advice based on your actual situation and investments.</p>
            </div>
          </div>
        </div>

        {/* Mock Preview Section */}
        <div className="w-full max-w-3xl mt-20">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Your result will look like this</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
            <div className="p-6 md:p-8 blur-[1px] opacity-90 select-none">
              <div className="bg-green-50 text-green-800 font-bold px-4 py-3 rounded-lg inline-flex items-center gap-2 mb-6 text-lg border border-green-200">
                <span>✅</span> New Regime saves ₹23,400
              </div>
              
              <div className="grid grid-cols-3 text-sm md:text-base border-t border-b border-gray-100 divide-x divide-gray-100">
                <div className="py-4 font-semibold text-gray-500 pr-4">Breakdown</div>
                <div className="py-4 font-bold text-center px-4">Old Regime</div>
                <div className="py-4 font-bold text-center px-4 bg-green-50/30">New Regime</div>
                
                {/* Mock Row 1 */}
                <div className="py-3 text-gray-600 pr-4 border-t border-gray-50">Taxable Income</div>
                <div className="py-3 text-center border-t border-gray-50">₹14,50,000</div>
                <div className="py-3 text-center font-semibold bg-green-50/30 border-t border-green-50/50">₹14,40,000</div>
                
                {/* Mock Row 2 */}
                <div className="py-3 text-gray-600 pr-4 border-t border-gray-50">Total Tax</div>
                <div className="py-3 text-center border-t border-gray-50">₹1,56,000</div>
                <div className="py-3 text-center font-bold text-green-700 bg-green-50/30 border-t border-green-50/50">₹1,32,600</div>
              </div>
            </div>
            
            {/* Overlay to encourage click */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-white/40">
              <button onClick={onStart} className="px-6 py-2 bg-white text-blue-700 font-bold rounded-full shadow-md hover:bg-gray-50 transition border border-gray-100">
                Calculate Yours Now
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="w-full max-w-3xl mt-24 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Common Questions</h2>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-1">I don't know my CTC — can I still use this?</h4>
            <p className="text-gray-600">Yes, we start from your monthly take-home salary and work out the rest for you.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-1">Is this calculator accurate?</h4>
            <p className="text-gray-600">Yes, it is fully updated with the latest Budget 2025 proposals for FY 2025-26 (AY 2026-27).</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-8 px-4 text-center text-sm text-gray-500">
        <div className="max-w-4xl mx-auto">
          <p className="mb-2">Made for Indian salaried employees.</p>
          <p>
            Tax rules sourced from Income Tax Act, 1961 as amended by Finance Act 2025. 
            Always verify with a CA for complex situations. This tool is for estimation purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
