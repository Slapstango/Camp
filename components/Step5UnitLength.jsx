import React, { useState } from 'react';

export default function Step5UnitLength({ reservation, setReservation, nextStep, prevStep }) {
  const [unitLength, setUnitLength] = useState(reservation.unitLength || '');

  const handleChange = (e) => {
    setUnitLength(e.target.value);
  };

  const handleNext = () => {
    setReservation({ ...reservation, unitLength });
    nextStep();
  };

  // Only show this step for RV/trailer/class stays
  const requiresLength = ['Travel Trailer', 'Class A', 'Class B', 'Class C'];
  if (!requiresLength.includes(reservation.stayType)) {
    nextStep();
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 5: Enter Unit Length</h2>
      <label>
        Unit Length (ft):
        <input
          type="number"
          value={unitLength}
          onChange={handleChange}
          className="block border p-1 my-2 w-full"
        />
      </label>
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button onClick={handleNext} disabled={!unitLength} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}