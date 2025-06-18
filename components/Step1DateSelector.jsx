import React, { useState } from 'react';

export default function Step1DateSelector({ reservation, setReservation, nextStep }) {
  // Local state for the two pickers:
  const [localDates, setLocalDates] = useState({
    startDate: reservation.startDate || '',
    endDate:   reservation.endDate   || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalDates((d) => ({
      ...d,
      [name]: value,
    }));
  };

  const handleNext = () => {
    // 1) Commit both dates at once
    setReservation((r) => ({
      ...r,
      startDate: localDates.startDate,
      endDate:   localDates.endDate,
    }));
    // 2) Then move to step 2
    nextStep();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 1: Select Dates</h2>

      <label className="block mb-2">
        Start Date:
        <input
          type="date"
          name="startDate"
          value={localDates.startDate}
          onChange={handleChange}
          className="block border p-1 my-2 w-full"
        />
      </label>

      <label className="block mb-4">
        End Date:
        <input
          type="date"
          name="endDate"
          value={localDates.endDate}
          onChange={handleChange}
          className="block border p-1 my-2 w-full"
        />
      </label>

      <button
        onClick={handleNext}
        disabled={!localDates.startDate || !localDates.endDate}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

