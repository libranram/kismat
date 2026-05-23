export default function ActionablePlan({ futureData, onFinish }) {
  return (
    <div className="card glass-effect fade-in" style={{maxWidth: '800px'}}>
      <h2 className="title-md">Strategic Action Plan</h2>
      <p className="subtitle">Your personalized roadmap for maximum corporate impact.</p>
      
      <div className="collab-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem', marginBottom: '2rem' }}>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid #E63946' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#E63946' }}>Tomorrow's Objective (1-Day)</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{futureData.day1}</p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid #2A9D8F' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#2A9D8F' }}>Macro Trajectory (30-Day)</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{futureData.day30}</p>
        </div>

      </div>

      <button onClick={onFinish} className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
        Complete Wizard & Restart
      </button>
    </div>
  );
}
