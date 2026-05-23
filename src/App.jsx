import { useState } from 'react';
import InputForm from './components/InputForm';
import VerifyDetails from './components/VerifyDetails';
import ProfileReport from './components/ProfileReport';
import PreparationPanel from './components/PreparationPanel';

import { 
  generateInitialAstrology, 
  generateCorporateProfile 
} from './engine/calculator';
import './index.css';

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // State objects
  const [astrologyData, setAstrologyData] = useState(null);
  const [profile, setProfile] = useState(null);

  // Handlers
  const handleInputSubmit = (date, time, location) => {
    setLoading(true);
    setTimeout(() => {
      const astro = generateInitialAstrology(date, time, location);
      setAstrologyData(astro);
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyConfirm = (verifiedData) => {
    setAstrologyData(verifiedData);
    setLoading(true);
    setTimeout(() => {
      const newProfile = generateCorporateProfile(verifiedData.rashi);
      setProfile(newProfile);
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  const handleRestart = () => {
    setStep(1);
    setAstrologyData(null);
    setProfile(null);
  };

  // Helper to derive archetype key
  const getArchetypeKey = (profileObj) => {
    if (!profileObj || !profileObj.code) return null;
    const prefix = profileObj.code.split('-')[0];
    if (prefix === 'PNR') return 'Pioneer';
    if (prefix === 'GRD') return 'Guardian';
    if (prefix === 'DRV') return 'Driver';
    if (prefix === 'INT') return 'Integrator';
    return null;
  };

  const archetypeKey = getArchetypeKey(profile);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="logo">Kismet.</h1>
        <p className="tagline">Corporate Behavioral Analytics & Daily Preparation</p>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loader-container fade-in">
            <div className="spinner"></div>
            <p>Analyzing behavioral alignment...</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* Left Panel: Profile Input / Display */}
            <div className="left-panel">
              {step === 1 && <InputForm onCalculate={handleInputSubmit} />}
              {step === 2 && <VerifyDetails initialData={astrologyData} onConfirm={handleVerifyConfirm} />}
              {step === 3 && <ProfileReport profile={profile} onReset={handleRestart} />}
            </div>

            {/* Right Panel: Daily preparation details */}
            <div className="right-panel">
              <PreparationPanel archetypeKey={archetypeKey} />
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Kismet Corporate Insights. Confidential & Proprietary.</p>
      </footer>
    </div>
  );
}

export default App;
