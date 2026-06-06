import { useState } from 'react';
import { generateCurrentDayDetails, generateFuturePlan } from '../engine/calculator';

export default function PreparationPanel({ archetypeKey, profile, userEmail, astrologyData, onSaveProfile }) {
  const getTomorrowDateStr = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTodayDateStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Custom mobile-friendly date state
  const initTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      day: String(tomorrow.getDate()),
      month: String(tomorrow.getMonth() + 1),
      year: String(tomorrow.getFullYear())
    };
  };

  const [dateFields, setDateFields] = useState(initTomorrow);
  const [manualDateStr, setManualDateStr] = useState('');
  const [dateInputMode, setDateInputMode] = useState('picker'); // 'picker' | 'manual'

  // Derive the selectedDate YYYY-MM-DD string from whichever mode is active
  const getSelectedDateStr = () => {
    if (dateInputMode === 'manual' && manualDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return manualDateStr;
    }
    const y = String(dateFields.year).padStart(4, '0');
    const m = String(dateFields.month).padStart(2, '0');
    const d = String(dateFields.day).padStart(2, '0');
    if (y.length >= 4 && m && d) return `${y}-${m}-${d}`;
    return getTomorrowDateStr();
  };

  const selectedDate = getSelectedDateStr();

  // Email form states
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Subscription states
  const [subEmail, setSubEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  const [prevUserEmail, setPrevUserEmail] = useState(userEmail);
  if (userEmail !== prevUserEmail) {
    setPrevUserEmail(userEmail);
    setEmail(userEmail || '');
    setSubEmail(userEmail || '');
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subEmail)) {
      setSubError('Please enter a valid email address.');
      return;
    }
    setSubError('');
    
    // Save to localStorage subscriptions
    const savedSubs = JSON.parse(localStorage.getItem('kismat_subscriptions') || '[]');
    const emailKey = subEmail.toLowerCase().trim();
    if (!savedSubs.some(s => s.email.toLowerCase().trim() === emailKey)) {
      savedSubs.push({
        email: subEmail,
        timestamp: new Date().toISOString(),
        status: 'active'
      });
      localStorage.setItem('kismat_subscriptions', JSON.stringify(savedSubs));
    }
    setSubscribed(true);

    // Save profile if callback is registered
    if (onSaveProfile && profile && astrologyData) {
      onSaveProfile(subEmail, profile, astrologyData);
    }
  };

  const dayDetails = archetypeKey && selectedDate 
    ? generateCurrentDayDetails(archetypeKey, new Date(selectedDate)) 
    : null;
  const roadmap = archetypeKey ? generateFuturePlan(archetypeKey) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSendingEmail(true);

    // Save profile if callback is registered
    if (onSaveProfile && profile && astrologyData) {
      onSaveProfile(email, profile, astrologyData);
    }

    // Format a beautiful plain-text email digest
    const subject = `[Kismat] Daily Preparation Report - ${dayDetails.date}`;
    const emailBody = `KISMAT CORPORATE PREPARATION REPORT
-----------------------------------------
Archetype: ${profile?.name || archetypeKey} (${profile?.code || ''})
Report Date: ${dayDetails.dayOfWeek}, ${dayDetails.date}

DAILY OPERATING ENVIRONMENT:
-----------------------------------------
👔 Dress Color & Style Cues:
   ${dayDetails.luckyColor} - ${dayDetails.dressAdvice}

🧠 How to Behave & Communicate:
   ${dayDetails.behavior}

🎯 Today's Tactical Execution Strategy:
   ${dayDetails.strategy}
   Optimal Execution Metric: ${dayDetails.luckyNumber}

❤️ Tomorrow's Health Action:
   ${dayDetails.healthTip}

🎭 Enjoy Life Suggestion:
   ${dayDetails.funnyTip}

FORWARD PLANNING ROADMAP:
-----------------------------------------
1-Day Tomorrow's Objective:
${roadmap.day1}

30-Day Macro Trajectory:
${roadmap.day30}

-----------------------------------------
Confidential & Proprietary. Generated by Kismat Corporate Analytics.`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    setTimeout(() => {
      setSendingEmail(false);
      setEmailSuccess(true);
      setShowEmailForm(false);
      // Trigger default mail client
      window.location.href = mailtoUrl;
    }, 1200);
  };

  if (!archetypeKey) {
    return (
      <div className="card glass-effect placeholder-card fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', padding: '3rem' }}>
        <div className="placeholder-icon" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', opacity: 0.5 }}>⚡</div>
        <h2 className="title-md" style={{ color: 'var(--text-muted)' }}>Daily Preparation Lock</h2>
        <p className="subtitle" style={{ maxWidth: '400px', margin: '0.5rem auto 0 auto' }}>
          Please complete your birth baseline entry on the left to activate your personalized behavioral guidelines, color selections, and daily operating plans.
        </p>
      </div>
    );
  }

  if (!dayDetails || !roadmap) {
    return (
      <div className="card glass-effect fade-in" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Map color names to CSS colors for visual rendering
  const cssColorMap = {
    "Navy Blue": "#1e3a8a",
    "Charcoal Grey": "#374151",
    "Emerald Green": "#047857",
    "Crimson": "#be123c",
    "Onyx": "#111827",
    "Sapphire": "#1d4ed8",
    "Warm Terracotta": "#c2410c",
    "Steel Blue": "#4682B4"
  };

  const badgeColor = cssColorMap[dayDetails.luckyColor] || 'var(--accent-blue)';

  return (
    <div className="preparation-container fade-in" style={{ width: '100%' }}>
      <div className="card glass-effect" style={{ width: '100%', padding: '2rem' }}>
        
        {/* Date Selection Header */}
        <div className="prep-header" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 className="title-md" style={{ marginBottom: '1rem' }}>Daily Operating Preparation</h2>
          <div className="date-selector-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                Select Date:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setDateInputMode('picker')}
                  style={{
                    padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter',
                    background: dateInputMode === 'picker' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${dateInputMode === 'picker' ? 'var(--accent-blue)' : 'var(--card-border)'}`,
                    color: dateInputMode === 'picker' ? '#fff' : 'var(--text-muted)'
                  }}
                >Picker</button>
                <button
                  type="button"
                  onClick={() => setDateInputMode('manual')}
                  style={{
                    padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter',
                    background: dateInputMode === 'manual' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${dateInputMode === 'manual' ? 'var(--accent-blue)' : 'var(--card-border)'}`,
                    color: dateInputMode === 'manual' ? '#fff' : 'var(--text-muted)'
                  }}
                >Type Date</button>
              </div>
            </div>

            {dateInputMode === 'picker' ? (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Day</label>
                  <select
                    value={dateFields.day}
                    onChange={(e) => setDateFields(f => ({ ...f, day: e.target.value }))}
                    style={{ padding: '0.6rem 0.4rem', borderRadius: '8px', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--card-border)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter', minWidth: '64px', cursor: 'pointer' }}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d)} style={{ color: '#000' }}>{String(d).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Month</label>
                  <select
                    value={dateFields.month}
                    onChange={(e) => setDateFields(f => ({ ...f, month: e.target.value }))}
                    style={{ padding: '0.6rem 0.4rem', borderRadius: '8px', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--card-border)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter', minWidth: '120px', cursor: 'pointer' }}
                  >
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map((mn, i) => (
                      <option key={mn} value={String(i + 1)} style={{ color: '#000' }}>{mn}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year</label>
                  <select
                    value={dateFields.year}
                    onChange={(e) => setDateFields(f => ({ ...f, year: e.target.value }))}
                    style={{ padding: '0.6rem 0.4rem', borderRadius: '8px', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--card-border)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter', minWidth: '88px', cursor: 'pointer' }}
                  >
                    {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(yr => (
                      <option key={yr} value={String(yr)} style={{ color: '#000' }}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD  e.g. 2026-06-15"
                  value={manualDateStr}
                  onChange={(e) => setManualDateStr(e.target.value)}
                  style={{
                    padding: '0.7rem 1rem', borderRadius: '8px',
                    background: 'rgba(0,0,0,0.35)', border: '1px solid var(--card-border)',
                    color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter', maxWidth: '260px'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enter date in YYYY-MM-DD format</span>
              </div>
            )}

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing preparation for <strong>{dayDetails.dayOfWeek}, {dayDetails.date}</strong>
            </span>
          </div>
        </div>

        {/* Tactical Preparations grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Planetary Environment Card */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h4 style={{ fontSize: '1rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              🌙 Planetary Environment — {dayDetails.dayOfWeek}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.8rem', color: '#c7d2fe' }}>
                🌕 Moon in {dayDetails.rashi}
              </span>
              <span style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.8rem', color: '#c7d2fe' }}>
                ✨ {dayDetails.nakshatra} Nakshatra
              </span>
              <span style={{
                background: dayDetails.alignmentType === 'same' ? 'rgba(16,185,129,0.12)' : dayDetails.alignmentType === 'complementary' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)',
                border: `1px solid ${dayDetails.alignmentType === 'same' ? 'rgba(16,185,129,0.35)' : dayDetails.alignmentType === 'complementary' ? 'rgba(59,130,246,0.35)' : 'rgba(245,158,11,0.35)'}`,
                borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.8rem',
                color: dayDetails.alignmentType === 'same' ? '#6ee7b7' : dayDetails.alignmentType === 'complementary' ? '#93c5fd' : '#fcd34d'
              }}>
                {dayDetails.alignmentType === 'same' ? '🔥 High Resonance' : dayDetails.alignmentType === 'complementary' ? '🌊 Complementary Flow' : '⚡ Constructive Friction'}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.55', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {dayDetails.planetaryInfluence}
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.5', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {dayDetails.alignmentNote}
            </p>
          </div>

          {/* Dress Color & Behave section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            
            {/* Color Recommendation */}
            <div className="collab-item" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                👔 Color of the Dress & Style Cues
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: badgeColor,
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: `0 4px 12px ${badgeColor}40`
                }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', color: dayDetails.luckyColor === 'Onyx' ? '#fff' : badgeColor }}>
                    {dayDetails.luckyColor}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {dayDetails.dressAdvice}
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Guidance */}
            <div className="collab-item" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                🧠 How to Behave
              </h4>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                {dayDetails.behavior}
              </p>
            </div>
            
          </div>

          {/* Tactical Execution Strategy */}
          <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--accent-blue)', borderRadius: '0 12px 12px 0', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
              🎯 Today's Tactical Execution Strategy
            </h4>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
              {dayDetails.strategy}
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Optimal Execution Metric (Lucky Number): <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{dayDetails.luckyNumber}</strong>
            </div>
          </div>

          {/* Health & Funny Tips Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {/* Health Tip */}
            <div style={{ background: 'rgba(16, 185, 129, 0.04)', borderLeft: '4px solid #10b981', borderRadius: '0 12px 12px 0', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                ❤️ Tomorrow's Health Action
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                {dayDetails.healthTip}
              </p>
            </div>
            
            {/* Funny Tip */}
            <div style={{ background: 'rgba(245, 158, 11, 0.04)', borderLeft: '4px solid #f59e0b', borderRadius: '0 12px 12px 0', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                🎭 Enjoy Life Suggestion
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                {dayDetails.funnyTip}
              </p>
            </div>
          </div>

          {/* Forward Planning / Objectives */}
          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Roadmap Objectives</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', borderLeft: '3px solid #E63946' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#E63946', fontWeight: 'bold' }}>Tomorrow's Objective</span>
                <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: '1.4' }}>{roadmap.day1}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', borderLeft: '3px solid #2A9D8F' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#2A9D8F', fontWeight: 'bold' }}>30-Day Trajectory</span>
                <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: '1.4' }}>{roadmap.day30}</p>
              </div>
            </div>
          </div>

          {/* Export & Sharing Options */}
          <div className="no-print" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Export & Share Report</h3>
            
            {!showEmailForm && !emailSuccess ? (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={handlePrint}
                  className="btn-secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '10px' }}
                >
                  📄 Export to PDF
                </button>
                <button 
                  onClick={() => setShowEmailForm(true)}
                  className="btn-secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '10px' }}
                >
                  ✉️ Send via Email
                </button>
              </div>
            ) : showEmailForm ? (
              <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter your corporate email address to receive your operating guidelines:</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    required
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.3)',
                      border: emailError ? '1px solid #ef4444' : '1px solid var(--card-border)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={sendingEmail}
                    style={{ margin: 0, width: 'auto', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}
                  >
                    {sendingEmail ? 'Sending...' : 'Send'}
                  </button>
                </div>
                {emailError && (
                  <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{emailError}</span>
                )}
                <button 
                  type="button" 
                  onClick={() => setShowEmailForm(false)} 
                  className="btn-secondary"
                  style={{ padding: '0.25rem', fontSize: '0.8rem', width: '60px', alignSelf: 'flex-end', border: 'none', background: 'transparent' }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <span style={{ color: '#10b981', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>✓ Email Dispatch Triggered</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Opened your default mail application to send the report digest to <strong>{email}</strong>.</p>
                <button 
                  onClick={() => {
                    setEmailSuccess(false);
                    setEmail('');
                  }}
                  className="btn-secondary"
                  style={{ marginTop: '0.75rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', border: 'none', background: 'rgba(255,255,255,0.05)' }}
                >
                  Send to another email
                </button>
              </div>
            )}
          </div>

          {/* Daily PDF Newsletter Subscription */}
          <div className="no-print" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Daily Preparation Subscription</h3>
            <p className="subtitle" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Subscribe to receive your personalized operating guidelines and health/lifestyle actions as a PDF directly in your inbox every morning at 6:00 AM.
            </p>
            
            {subscribed ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Daily Subscription Activated</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You will receive tomorrow's preparation report for <strong>{dayDetails.date}</strong> in your inbox daily.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="email"
                    placeholder="Enter email to subscribe"
                    value={subEmail}
                    onChange={(e) => {
                      setSubEmail(e.target.value);
                      setSubError('');
                    }}
                    required
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.3)',
                      border: subError ? '1px solid #ef4444' : '1px solid var(--card-border)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ margin: 0, width: 'auto', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}
                  >
                    Subscribe
                  </button>
                </div>
                {subError && (
                  <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{subError}</span>
                )}
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
