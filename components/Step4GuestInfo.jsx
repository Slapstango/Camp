import { useState } from 'react';

const cabinSites = ['C8', 'C9', '76'];

export default function Step4GuestInfo({ reservation, setReservation, nextStep, prevStep }) {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
    setError('');
  };

  const validateAndProceed = () => {
    const { siteId, stayType } = reservation;

    if (!siteId || !stayType) {
      setError("Please select a site and a stay type.");
      return;
    }

    const isCabin = cabinSites.includes(siteId);
    const isCabinStay = stayType === 'Cabin';

    if (isCabin && !isCabinStay) {
      setError('Cabins must be reserved with stay type "Cabin".');
      return;
    }

    if (!isCabin && isCabinStay) {
      setError('Stay type "Cabin" can only be used with cabin sites (C8, C9, 76).');
      return;
    }

    nextStep();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 4: Guest Info</h2>
      <label>
        Name:
        <input type="text" name="primaryName" value={reservation.primaryName} onChange={handleChange} className="block border p-1 my-2 w-full" />
      </label>
      <label>
        Phone:
        <input type="text" name="phone" value={reservation.phone} onChange={handleChange} className="block border p-1 my-2 w-full" />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={reservation.email} onChange={handleChange} className="block border p-1 my-2 w-full" />
      </label>
      <label>
        Age:
        <input type="number" name="age" value={reservation.age} onChange={handleChange} className="block border p-1 my-2 w-full" />
      </label>
      <label>
        Stay Type:
        <select name="stayType" value={reservation.stayType} onChange={handleChange} className="block border p-1 my-2 w-full">
          <option value="">Select...</option>
          <option value="Tent">Tent</option>
          <option value="Travel Trailer">Travel Trailer</option>
          <option value="Class A">Class A</option>
          <option value="Class B">Class B</option>
          <option value="Class C">Class C</option>
          <option value="Cabin">Cabin</option>
        </select>
      </label>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button onClick={validateAndProceed} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}