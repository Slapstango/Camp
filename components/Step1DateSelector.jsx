import React, { useState } from 'react';

export default function Step1DateSelector({ reservation, setReservation, nextStep }) {
  // Local state for the two date inputs
  const [localDates, setLocalDates] = useState({
    startDate: reservation.startDate || '',
    endDate:   reservation.endDate   || '',
  });

  // Update local only
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalDates(d => ({
      ...d,
      [name]: value,
    }));
  };

  // When you click Next, push both into parent state then advance
  const handleNext = () => {
    setReservation(r => ({
      ...r,
      startDate: localDates.startDate,
      endDate:   localDates.endDate,
    }));
    nextStep();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Step 1: Select Dates</h2>

      <label className="block mb-2">
        Start Date:
        <input
          type="date"
          name="startDate"
          value={localDates.startDate}
          onChange={handleChange}
          className="block border p-2 w-full"
        />
      </label>

      <label className="block mb-4">
        End Date:
        <input
          type="date"
          name="endDate"
          value={localDates.endDate}
          onChange={handleChange}
          className="block border p-2 w-full"
        />
      </label>

      <button
        onClick={handleNext}
        disabled={!localDates.startDate || !localDates.endDate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
