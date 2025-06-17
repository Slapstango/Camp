import React, { useState } from 'react';

export default function Step6GuestCount({ reservation, setReservation, nextStep, prevStep }) {
  const [guestCount, setGuestCount] = useState(reservation.guestCount || 0);

  const handleChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setGuestCount(isNaN(count) ? 0 : count);
  };

  const handleNext = () => {
    setReservation({ ...reservation, guestCount });
    nextStep();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 6: Number of Additional Guests</h2>
      <label>
        Additional Guests:
        <input
          type="number"
          min="0"
          value={guestCount}
          onChange={handleChange}
          className="block border p-1 my-2 w-full"
        />
      </label>
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}