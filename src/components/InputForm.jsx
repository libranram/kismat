import { useState } from 'react';

export default function InputForm({ onCalculate, onLoadProfile }) {
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'returning'
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleNewSubmit = (e) => {
    e.preventDefault();
    if (date && time && location) {
      onCalculate(date, time, location);
    }
  };

  const handleReturningSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    onLoadProfile(email);
  };

  return (
    <div className="card glass-effect">
      <h2 className="title-md">Input Demographics</h2>
      <p className="subtitle">Choose whether to create a new profile or load an existing one.</p>
      
      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <button 
          type="button" 
          onClick={() => {
            setActiveTab('new');
            setEmailError('');
          }} 
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid ' + (activeTab === 'new' ? 'var(--accent-blue)' : 'var(--card-border)'),
            background: activeTab === 'new' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.01)',
            color: activeTab === 'new' ? '#fff' : 'var(--text-muted)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🆕 Generate Profile
        </button>
        <button 
          type="button" 
          onClick={() => {
            setActiveTab('returning');
            setEmailError('');
          }} 
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid ' + (activeTab === 'returning' ? 'var(--accent-blue)' : 'var(--card-border)'),
            background: activeTab === 'returning' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.01)',
            color: activeTab === 'returning' ? '#fff' : 'var(--text-muted)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🔑 Load Profile
        </button>
      </div>

      {activeTab === 'new' ? (
        <form onSubmit={handleNewSubmit} className="form-container">
          <div className="form-group">
            <label>Birth Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Birth Time</label>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Birth Location</label>
            <input 
              type="text" 
              placeholder="City, State/Country"
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary">
            Generate Kismat Profile
          </button>
        </form>
      ) : (
        <form onSubmit={handleReturningSubmit} className="form-container">
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            borderLeft: '4px solid var(--accent-blue)',
            borderRadius: '0 8px 8px 0',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            lineHeight: '1.4',
            color: 'var(--text-main)',
            marginBottom: '1.5rem'
          }}>
            ℹ️ If you have previously subscribed to our daily digest or emailed a report, your profile was saved automatically. Enter that email here to retrieve it instantly.
          </div>

          <div className="form-group">
            <label>Registered Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }} 
              required 
            />
            {emailError && (
              <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {emailError}
              </span>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Retrieve Profile &rarr;
          </button>
        </form>
      )}
    </div>
  );
}
