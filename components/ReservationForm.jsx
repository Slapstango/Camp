import React, { useState } from 'react';
import Step1DateSelector from './Step1DateSelector';
import Step2AvailabilityGrid from './Step2AvailabilityGrid';
import Step3SiteSelector from './Step3SiteSelector';
import Step4GuestInfo from './Step4GuestInfo';
import Step5UnitLength from './Step5UnitLength';
import Step6GuestCount from './Step6GuestCount';
import Step7GuestDetails from './Step7GuestDetails';
import Step8ReviewSubmit from './Step8ReviewSubmit';

export default function ReservationForm() {
  const [step, setStep] = useState(1);
  const [reservation, setReservation] = useState({
    startDate: '',
    endDate:   '',
    siteId:    '',
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // Sanity-check log: what does reservation look like each render?
  console.log('🔷 Reservation state in ReservationForm:', reservation);

  return (
    <div className="max-w-lg mx-auto p-4">
      {step === 1 && (
        <Step1DateSelector
          reservation={reservation}
          setReservation={setReservation}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <Step2AvailabilityGrid
          reservation={reservation}
          setReservation={setReservation}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 3 && (
        <Step3SiteSelector
          reservation={reservation}
          setReservation={setReservation}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 4 && (
        <Step4GuestInfo
          reservation={reservation}
          setReservation={setReservation}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 5 && (
        <Step5UnitLength
          reservation={reservation}
          setReservation={setReservation}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 6 && (
        <Step6GuestCount
          reservation={reservation}
          setReservation={setReservation}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 7 && (
        <Step7GuestDetails
          reservation={reservation}
          setReservation={setReservation}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 8 && (
        <Step8ReviewSubmit
          reservation={reservation}
          prevStep={prevStep}
        />
      )}
    </div>
  );
}

