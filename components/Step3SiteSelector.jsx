import React from 'react';

export default function Step3SiteSelector({ reservation, setReservation, nextStep, prevStep }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Step 3: Confirm Site Selection</h2>
      <p className="mb-4">You've selected site: <strong>{reservation.siteId}</strong></p>
      <div className="flex gap-4">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded">Continue</button>
      </div>
    </div>
  );
}
