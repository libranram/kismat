import { useState } from 'react';

export default function InputForm({ onCalculate }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date && time && location) {
      onCalculate(date, time, location);
    }
  };

  return (
    <div className="card glass-effect">
      <h2 className="title-md">Input Demographics</h2>
      <p className="subtitle">Enter foundational data to generate the behavioral profile.</p>
      
      <form onSubmit={handleSubmit} className="form-container">
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
    </div>
  );
}
