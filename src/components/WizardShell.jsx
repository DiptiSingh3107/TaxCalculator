import React, { useState } from 'react';
import LivePreview from './LivePreview';
import AgeStep from './steps/AgeStep';
import SalaryStep from './steps/SalaryStep';
import BonusStep from './steps/BonusStep';
import ProfTaxStep from './steps/ProfTaxStep';
import PFStep from './steps/PFStep';
import RentStep from './steps/RentStep';
import InvestmentsStep from './steps/InvestmentsStep';
import NPSStep from './steps/NPSStep';
import HealthStep from './steps/HealthStep';
import HomeLoanStep from './steps/HomeLoanStep';
import InterestStep from './steps/InterestStep';

const STEPS = [
  { id: 'age', component: AgeStep, label: 'Age' },
  { id: 'salary', component: SalaryStep, label: 'Income' },
  { id: 'bonus', component: BonusStep, label: 'Bonus' },
  { id: 'pt', component: ProfTaxStep, label: 'Prof. Tax' },
  { id: 'pf', component: PFStep, label: 'PF' },
  { id: 'rent', component: RentStep, label: 'Rent' },
  { id: 'investments', component: InvestmentsStep, label: '80C Investments' },
  { id: 'nps', component: NPSStep, label: 'NPS' },
  { id: 'health', component: HealthStep, label: 'Health' },
  { id: 'homeloan', component: HomeLoanStep, label: 'Home Loan' },
  { id: 'interest', component: InterestStep, label: 'Interest' },
];

export default function WizardShell({ onFinish }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  const totalSteps = STEPS.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onFinish(formData);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const CurrentStepComponent = STEPS[currentStepIndex].component;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans">
      
      {/* LEFT COLUMN: WIZARD */}
      <div className="w-full md:w-[55%] flex flex-col relative pb-24 md:pb-0">
        
        {/* Header & Progress Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-100 px-6 py-4">
          <div className="max-w-xl mx-auto flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Step {currentStepIndex + 1} of {totalSteps} &middot; {STEPS[currentStepIndex].label}
            </span>
            <span className="text-sm font-medium text-blue-700">{progressPercent}%</span>
          </div>
          <div className="max-w-xl mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* Wizard Content Area */}
        <div className="flex-grow flex flex-col px-6 py-8 md:py-12 overflow-y-auto">
          <div className="w-full max-w-xl mx-auto flex flex-col h-full">
            
            <div className="mb-8 flex-grow">
              <CurrentStepComponent data={formData} updateData={updateFormData} />
            </div>
            
            {/* Navigation Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
              <button 
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className={`px-5 py-2.5 font-medium rounded-lg transition ${currentStepIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                ← Back
              </button>
              <button 
                onClick={handleNext}
                className="px-8 py-3 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-sm"
              >
                {currentStepIndex === totalSteps - 1 ? 'Finish Wizard' : 'Next →'}
              </button>
            </div>

          </div>
        </div>
      </div>
      
      {/* RIGHT COLUMN: LIVE PREVIEW (Desktop) */}
      <div className="hidden md:block w-full md:w-[45%] bg-gray-50 border-l border-gray-200">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <LivePreview data={formData} />
        </div>
      </div>

      {/* MOBILE ACCORDION: LIVE PREVIEW */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
          className="w-full flex items-center justify-between px-6 py-4 font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 transition"
        >
          <span className="flex items-center gap-2">
            <span className="text-green-600">✅</span> 
            See Live Estimate
          </span>
          <span className={`transform transition-transform ${isMobilePreviewOpen ? 'rotate-180' : ''}`}>
            ▴
          </span>
        </button>
        
        {isMobilePreviewOpen && (
          <div className="max-h-[60vh] overflow-y-auto border-t border-gray-100">
            <LivePreview data={formData} />
          </div>
        )}
      </div>

    </div>
  );
}
