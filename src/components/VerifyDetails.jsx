import { useState } from 'react';

const availableRashis = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function VerifyDetails({ initialData, onConfirm }) {
  const [rashi, setRashi] = useState(initialData.rashi);
  const [nakshatra, setNakshatra] = useState(initialData.nakshatra);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      ...initialData,
      rashi,
      nakshatra
    });
  };

  return (
    <div className="card glass-effect fade-in" style={{maxWidth: '700px'}}>
      <h2 className="title-md">Astrological Baseline</h2>
      <p className="subtitle">Please verify your generated astrological parameters. If you have a different Moon Sign (Rashi) according to a specific chart, update it here.</p>
      
      <div className="collab-grid" style={{ marginBottom: '2rem' }}>
        <div className="collab-item">
          <strong>Day of Birth:</strong> {initialData.dayOfWeek}
        </div>
        <div className="collab-item">
          <strong>Sun Degree:</strong> {initialData.sunLocation}
        </div>
        <div className="collab-item">
          <strong>Moon Degree:</strong> {initialData.moonLocation}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Moon Sign (Rashi)</label>
          <select 
            value={rashi} 
            onChange={(e) => setRashi(e.target.value)} 
            required 
            style={{width: '100%', padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'Inter'}}
          >
            {availableRashis.map(r => (
              <option key={r} value={r} style={{color: '#000'}}>{r}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Lunar Mansion (Nakshatra)</label>
          <input 
            type="text" 
            value={nakshatra} 
            onChange={(e) => setNakshatra(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn-primary">
          Confirm & Generate Corporate Profile &rarr;
        </button>
      </form>
    </div>
  );
}
