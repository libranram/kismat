export default function DailyDetails({ dailyData, onNext }) {
  return (
    <div className="card glass-effect fade-in" style={{maxWidth: '700px'}}>
      <h2 className="title-md">Current Day Operating Environment</h2>
      <p className="subtitle">Environmental variables and execution strategy for today.</p>
      
      <div className="collab-grid" style={{ marginBottom: '2rem' }}>
        <div className="collab-item">
          <strong>Current Date:</strong> {dailyData.date}
        </div>
        <div className="collab-item">
          <strong>Day of the Week:</strong> {dailyData.dayOfWeek}
        </div>
        <div className="collab-item">
          <strong>Current Moon Sign (Rashi):</strong> {dailyData.rashi}
        </div>
        <div className="collab-item">
          <strong>Current Lunar Mansion:</strong> {dailyData.nakshatra}
        </div>
      </div>

      <div className="collab-grid" style={{ gap: '1rem', marginTop: '1rem', marginBottom: '2rem' }}>
        <div className="collab-item" style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px' }}>
          <strong>Optimal Execution Metric:</strong> <span style={{fontSize: '1.2rem', color: 'var(--accent-blue)', fontWeight: 'bold'}}>{dailyData.luckyNumber}</span>
        </div>
        <div className="collab-item" style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '8px' }}>
          <strong>Focus Palette:</strong> <span style={{fontWeight: 'bold'}}>{dailyData.luckyColor}</span>
        </div>
        <div className="collab-item" style={{ gridColumn: '1 / -1', background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px', borderLeft: `4px solid var(--accent-blue)` }}>
          <strong>Today's Tactical Execution Strategy:</strong>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-main)' }}>{dailyData.strategy}</p>
        </div>
      </div>

      <button onClick={onNext} className="btn-primary">
        View Actionable Roadmap &rarr;
      </button>
    </div>
  );
}
