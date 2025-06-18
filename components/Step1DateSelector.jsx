import { useState } from 'react';

export default function Step1DateSelector({ reservation, setReservation, nextStep }) {
  // Local state for the two pickers:
  const [localDates, setLocalDates] = useState({
    startDate: reservation.startDate || '',
    endDate:   reservation.endDate   || '',
  });

  const handleChange = (e) => {
    setLocalDates(d => ({
      ...d,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = () => {
    // 1) Commit both dates into the shared "reservation" state
    setReservation(r => ({
      ...r,
      startDate: localDates.startDate,
      endDate:   localDates.endDate,
    }));
    // 2) Then advance the step
    nextStep();
  };
console.log('🔷 Current reservation:', reservation);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 1: Select Dates</h2>
      <label>
        Start Date:
        <input
          type="date"
          name="startDate"
          value={localDates.startDate}
          onChange={handleChange}
          className="block border p-1 my-2"
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          name="endDate"
          value={localDates.endDate}
          onChange={handleChange}
          className="block border p-1 my-2"
        />
      </label>
      <button
        onClick={handleNext}
        disabled={!localDates.startDate || !localDates.endDate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Next
      </button>
    </div>
  );
}
