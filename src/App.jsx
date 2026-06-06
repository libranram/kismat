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
  const [showAdmin, setShowAdmin] = useState(false);

  // State objects
  const [email, setEmail] = useState('');
  const [astrologyData, setAstrologyData] = useState(null);
  const [profile, setProfile] = useState(null);

  // Handlers
  const handleInputSubmit = (date, time, location) => {
    setLoading(true);
    setTimeout(() => {
      const astro = generateInitialAstrology(date, time, location);
      setAstrologyData({ ...astro, date, time, location });
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleLoadProfile = (enteredEmail) => {
    setLoading(true);
    setTimeout(() => {
      const savedProfiles = JSON.parse(localStorage.getItem('kismat_profiles') || '{}');
      const emailKey = enteredEmail.toLowerCase().trim();
      if (savedProfiles[emailKey]) {
        const saved = savedProfiles[emailKey];
        setEmail(enteredEmail);
        setAstrologyData(saved.astrologyData);
        setProfile(saved.profile);
        setLoading(false);
        setStep(3);
        alert(`Welcome back! Loaded profile for ${enteredEmail}`);
      } else {
        setLoading(false);
        alert(`No profile found for "${enteredEmail}". Please generate a new profile first.`);
      }
    }, 600);
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

  const handleSaveProfile = (savedEmail, savedProfile, savedAstro) => {
    const emailKey = savedEmail.toLowerCase().trim();
    setEmail(savedEmail);

    // Save to localStorage profiles db
    const savedProfiles = JSON.parse(localStorage.getItem('kismat_profiles') || '{}');
    savedProfiles[emailKey] = {
      email: savedEmail,
      date: savedAstro.date || '',
      time: savedAstro.time || '',
      location: savedAstro.location || '',
      astrologyData: savedAstro,
      profile: savedProfile
    };
    localStorage.setItem('kismat_profiles', JSON.stringify(savedProfiles));

    // Save to localStorage leads db
    const savedLeads = JSON.parse(localStorage.getItem('kismat_leads') || '[]');
    if (!savedLeads.some(l => l.email.toLowerCase().trim() === emailKey)) {
      savedLeads.push({
        email: savedEmail,
        timestamp: new Date().toISOString(),
        archetype: savedProfile.name,
        code: savedProfile.code
      });
      localStorage.setItem('kismat_leads', JSON.stringify(savedLeads));
    }
  };

  const handleRestart = () => {
    setStep(1);
    setEmail('');
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

  const downloadLeadsCSV = () => {
    const leadsList = JSON.parse(localStorage.getItem('kismat_leads') || '[]');
    if (leadsList.length === 0) {
      alert("No leads captured yet!");
      return;
    }
    const headers = ["Email", "Timestamp", "Archetype", "Code"];
    const rows = leadsList.map(l => [l.email, l.timestamp, l.archetype, l.code]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kismat_customer_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSubsCSV = () => {
    const subsList = JSON.parse(localStorage.getItem('kismat_subscriptions') || '[]');
    if (subsList.length === 0) {
      alert("No subscribers yet!");
      return;
    }
    const headers = ["Email", "Timestamp", "Status"];
    const rows = subsList.map(s => [s.email, s.timestamp, s.status]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kismat_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearData = () => {
    if (confirm("Are you sure you want to clear all profiles, leads, and subscriptions?")) {
      localStorage.removeItem('kismat_profiles');
      localStorage.removeItem('kismat_leads');
      localStorage.removeItem('kismat_subscriptions');
      alert("All data cleared successfully.");
      handleRestart();
    }
  };

  const leads = JSON.parse(localStorage.getItem('kismat_leads') || '[]');
  const subs = JSON.parse(localStorage.getItem('kismat_subscriptions') || '[]');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="logo">Kismat.</h1>
        <p className="tagline">Only You have the power to turn it around</p>
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
              {step === 1 && <InputForm onCalculate={handleInputSubmit} onLoadProfile={handleLoadProfile} />}
              {step === 2 && <VerifyDetails initialData={astrologyData} onConfirm={handleVerifyConfirm} />}
              {step === 3 && <ProfileReport profile={profile} onReset={handleRestart} />}
            </div>

            {/* Right Panel: Daily preparation details */}
            <div className="right-panel">
              <PreparationPanel
                archetypeKey={archetypeKey}
                profile={profile}
                userEmail={email}
                astrologyData={astrologyData}
                onSaveProfile={handleSaveProfile}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <p>&copy; {new Date().getFullYear()} Kismat Corporate Insights. Confidential & Proprietary.</p>
        <button
          onClick={() => setShowAdmin(true)}
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.02)', borderColor: 'var(--card-border)' }}
        >
          ⚙️ Lead Management Admin
        </button>
      </footer>

      {showAdmin && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="card glass-effect fade-in" style={{
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="title-md" style={{ margin: 0, background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
                Lead & Analytics Management
              </h2>
              <button
                onClick={() => setShowAdmin(false)}
                className="btn-secondary"
                style={{ padding: '0.25rem 0.75rem', border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}
              >
                ✕ Close
              </button>
            </div>

            <p className="subtitle" style={{ margin: 0 }}>
              Review captured customer leads and newsletter subscriptions. Use the exports to ingest into CRM or billing software.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', minHeight: '0' }}>

              {/* Leads Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Customer Leads ({leads.length})</h3>
                  <button onClick={downloadLeadsCSV} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} disabled={leads.length === 0}>
                    📥 Export CSV
                  </button>
                </div>

                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '1rem',
                  height: '250px',
                  overflowY: 'auto',
                  fontSize: '0.85rem'
                }}>
                  {leads.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4.5rem' }}>No leads captured yet.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {leads.map((l, i) => (
                        <li key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                          <div style={{ fontWeight: '600' }}>{l.email}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                            <span>{l.archetype} ({l.code})</span>
                            <span>{new Date(l.timestamp).toLocaleDateString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Subscriptions Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Daily Subscribers ({subs.length})</h3>
                  <button onClick={downloadSubsCSV} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} disabled={subs.length === 0}>
                    📥 Export CSV
                  </button>
                </div>

                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '1rem',
                  height: '250px',
                  overflowY: 'auto',
                  fontSize: '0.85rem'
                }}>
                  {subs.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4.5rem' }}>No subscribers yet.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {subs.map((s, i) => (
                        <li key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                          <div style={{ fontWeight: '600' }}>{s.email}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                            <span>Active</span>
                            <span>{new Date(s.timestamp).toLocaleDateString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={clearData}
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem' }}
              >
                🗑️ Clear All App Data
              </button>
              <button
                onClick={() => setShowAdmin(false)}
                className="btn-primary"
                style={{ width: 'auto', margin: 0, padding: '0.5rem 1.5rem' }}
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
