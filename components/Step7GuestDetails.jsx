import React, { useState } from 'react';

export default function Step7GuestDetails({ reservation, setReservation, nextStep, prevStep }) {
  const initialGuests = reservation.guests || [];
  const [guests, setGuests] = useState(
    Array.from({ length: reservation.guestCount }, (_, i) => initialGuests[i] || { name: '', age: '' })
  );

  const handleChange = (index, field, value) => {
    const updated = [...guests];
    updated[index] = { ...updated[index], [field]: value };
    setGuests(updated);
  };

  const handleNext = () => {
    setReservation({ ...reservation, guests });
    nextStep();
  };

  if (reservation.guestCount === 0) {
    nextStep();
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 7: Guest Details</h2>
      {guests.map((guest, idx) => (
        <div key={idx} className="border p-4 mb-4 rounded">
          <h3 className="font-semibold">Guest {idx + 1}</h3>
          <label>
            Name:
            <input
              type="text"
              value={guest.name}
              onChange={(e) => handleChange(idx, 'name', e.target.value)}
              className="block border p-1 my-2 w-full"
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              value={guest.age}
              onChange={(e) => handleChange(idx, 'age', e.target.value)}
              className="block border p-1 my-2 w-full"
            />
          </label>
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}