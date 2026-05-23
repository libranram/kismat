import ReactMarkdown from 'react-markdown';

export default function ProfileReport({ profile, onReset }) {
  if (!profile) return null;

  return (
    <div className="report-container fade-in" style={{ width: '100%' }}>
      <div className="card glass-effect report-card" style={{ borderTop: `4px solid ${profile.color}`, width: '100%', padding: '2rem' }}>
        <div className="report-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <h2 className="title-md" style={{ margin: 0 }}>{profile.name}</h2>
          <span className="code-badge" style={{ backgroundColor: profile.color, margin: 0 }}>{profile.code}</span>
        </div>

        <section className="report-section">
          <h3 className="section-title" style={{ color: profile.color }}>Executive Summary</h3>
          <p className="summary-text" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{profile.summary}</p>
        </section>

        <hr className="divider" />

        <section className="report-section">
          <h3 className="section-title" style={{ color: profile.color }}>Core Strengths</h3>
          <ul className="theme-list">
            {profile.themes.map((theme, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <ReactMarkdown>{theme}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </section>

        <hr className="divider" />

        <section className="report-section">
          <h3 className="section-title" style={{ color: profile.color }}>Workplace Collaboration</h3>
          <div className="collab-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div className="collab-item">
              <h4 style={{ fontSize: '0.95rem' }}>How to communicate:</h4>
              <ul style={{ fontSize: '0.85rem' }}>
                {profile.collaboration.communicate.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="collab-item">
              <h4 style={{ fontSize: '0.95rem' }}>Optimal environment:</h4>
              <p style={{ fontSize: '0.85rem' }}>{profile.collaboration.environment}</p>
            </div>
            <div className="collab-item warning-box" style={{ padding: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem' }}>Potential blind spots:</h4>
              <ul style={{ fontSize: '0.85rem' }}>
                {profile.collaboration.blindSpots.map((spot, idx) => (
                  <li key={idx}>{spot}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="report-section">
          <h3 className="section-title" style={{ color: profile.color }}>Complementary Partners</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Pairs well with{' '}
            {profile.partners.map((p, i) => (
              <strong key={i}>
                {p}
                {i < profile.partners.length - 1 ? ' or ' : ''}
              </strong>
            ))}
            {' '}to balance team dynamics.
          </p>
        </section>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={onReset} className="btn-secondary" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px' }}>
            &larr; Reset Profile & Demographics
          </button>
        </div>
      </div>
    </div>
  );
}
