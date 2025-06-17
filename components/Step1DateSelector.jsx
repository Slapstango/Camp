export default function Step1DateSelector({ reservation, setReservation, nextStep }) {
  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 1: Select Dates</h2>
      <label>
        Start Date:
        <input type="date" name="startDate" value={reservation.startDate} onChange={handleChange} className="block border p-1 my-2" />
      </label>
      <label>
        End Date:
        <input type="date" name="endDate" value={reservation.endDate} onChange={handleChange} className="block border p-1 my-2" />
      </label>
      <button onClick={nextStep} disabled={!reservation.startDate || !reservation.endDate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Next
      </button>
    </div>
  );
}