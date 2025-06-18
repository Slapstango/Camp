import React, { useState } from 'react';
import Step2AvailabilityGrid from '../components/Step2AvailabilityGrid';

export default function Home() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSite, setSelectedSite] = useState('');

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Make a Reservation</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e=>setStartDate(e.target.value)}
            className="block border p-1 w-full"
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e=>setEndDate(e.target.value)}
            className="block border p-1 w-full"
          />
        </div>
      </div>

      {startDate && endDate && (
        <Step2AvailabilityGrid
          startDate={startDate}
          endDate={endDate}
          selectedSite={selectedSite}
          onSelect={setSelectedSite}
        />
      )}

      {selectedSite && <p className="mt-4">You selected: {selectedSite}</p>}
    </div>
  );
}