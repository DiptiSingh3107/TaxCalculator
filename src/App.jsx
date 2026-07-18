import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import WizardShell from './components/WizardShell';
import ResultPage from './components/ResultPage';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing', 'wizard', 'result'
  const [formData, setFormData] = useState(null);

  const handleStart = () => {
    setCurrentScreen('wizard');
  };

  const handleFinish = (data) => {
    setFormData(data);
    setCurrentScreen('result');
  };

  const handleRestart = () => {
    setCurrentScreen('landing');
  };

  return (
    <div className="font-sans antialiased text-gray-900 min-h-screen">
      {currentScreen === 'landing' && <LandingPage onStart={handleStart} />}
      {currentScreen === 'wizard' && <WizardShell onFinish={handleFinish} />}
      {currentScreen === 'result' && <ResultPage onRestart={handleRestart} data={formData} />}
    </div>
  );
}

export default App;
