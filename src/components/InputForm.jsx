import { useState } from 'react';

export default function InputForm({ onCalculate, onLoadProfile }) {
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'returning'
  const [email, setEmail] = useState('');
  // Custom birth date state
  const [birthDateFields, setBirthDateFields] = useState({ day: '', month: '', year: '' });
  const [manualBirthDate, setManualBirthDate] = useState('');
  const [birthDateMode, setBirthDateMode] = useState('picker'); // 'picker' | 'manual'
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [emailError, setEmailError] = useState('');

  // Derive the date string for calculation
  const getBirthDateStr = () => {
    if (birthDateMode === 'manual' && manualBirthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return manualBirthDate;
    }
    const y = String(birthDateFields.year).padStart(4, '0');
    const m = String(birthDateFields.month).padStart(2, '0');
    const d = String(birthDateFields.day).padStart(2, '0');
    if (birthDateFields.year && birthDateFields.month && birthDateFields.day) return `${y}-${m}-${d}`;
    return '';
  };

  const handleNewSubmit = (e) => {
    e.preventDefault();
    const date = getBirthDateStr();
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
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setBirthDateMode('picker')}
                style={{
                  padding: '0.25rem 0.55rem', fontSize: '0.72rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter',
                  background: birthDateMode === 'picker' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${birthDateMode === 'picker' ? 'var(--accent-blue)' : 'var(--card-border)'}`,
                  color: birthDateMode === 'picker' ? '#fff' : 'var(--text-muted)'
                }}
              >Picker</button>
              <button
                type="button"
                onClick={() => setBirthDateMode('manual')}
                style={{
                  padding: '0.25rem 0.55rem', fontSize: '0.72rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter',
                  background: birthDateMode === 'manual' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${birthDateMode === 'manual' ? 'var(--accent-blue)' : 'var(--card-border)'}`,
                  color: birthDateMode === 'manual' ? '#fff' : 'var(--text-muted)'
                }}
              >Type Date</button>
            </div>

            {birthDateMode === 'picker' ? (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: '0 0 auto' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Day</label>
                  <select
                    value={birthDateFields.day}
                    onChange={(e) => setBirthDateFields(f => ({ ...f, day: e.target.value }))}
                    required={birthDateMode === 'picker'}
                    style={{ padding: '0.65rem 0.4rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter', minWidth: '64px', cursor: 'pointer' }}
                  >
                    <option value="" style={{ color: '#000' }}>DD</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d)} style={{ color: '#000' }}>{String(d).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: '1 1 110px' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Month</label>
                  <select
                    value={birthDateFields.month}
                    onChange={(e) => setBirthDateFields(f => ({ ...f, month: e.target.value }))}
                    required={birthDateMode === 'picker'}
                    style={{ padding: '0.65rem 0.4rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter', minWidth: '120px', cursor: 'pointer' }}
                  >
                    <option value="" style={{ color: '#000' }}>Month</option>
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map((mn, i) => (
                      <option key={mn} value={String(i + 1)} style={{ color: '#000' }}>{mn}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: '0 0 auto' }}>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Year</label>
                  <select
                    value={birthDateFields.year}
                    onChange={(e) => setBirthDateFields(f => ({ ...f, year: e.target.value }))}
                    required={birthDateMode === 'picker'}
                    style={{ padding: '0.65rem 0.4rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter', minWidth: '88px', cursor: 'pointer' }}
                  >
                    <option value="" style={{ color: '#000' }}>YYYY</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(yr => (
                      <option key={yr} value={String(yr)} style={{ color: '#000' }}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD  e.g. 1990-06-15"
                  value={manualBirthDate}
                  onChange={(e) => setManualBirthDate(e.target.value)}
                  required={birthDateMode === 'manual'}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enter date in YYYY-MM-DD format</span>
              </div>
            )}
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
