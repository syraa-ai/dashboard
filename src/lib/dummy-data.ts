
import { Call } from '@/components/dashboard/CallHistoryCard';
import { Appointment } from '@/components/dashboard/AppointmentCard';
import { addDays, subDays } from 'date-fns';

// Generate some dummy calls for testing
export const generateDummyCalls = (count: number = 5): Call[] => {
  const dummyCalls: Call[] = [];
  
  const statuses = ['completed', 'missed', 'transferred'];
  const voices = ['default', 'premium', 'standard'];
  
  for (let i = 0; i < count; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 14));
    date.setHours(9 + Math.floor(Math.random() * 8));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    dummyCalls.push({
      id: `call-${i}`,
      call_date: date.toISOString(),
      duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      voice_used: voices[Math.floor(Math.random() * voices.length)],
      has_appointment: Math.random() > 0.5
    });
  }
  
  return dummyCalls;
};

// Generate some dummy appointments for testing
export const generateDummyAppointments = (count: number = 5): Appointment[] => {
  const dummyAppointments: Appointment[] = [];
  
  const patientNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Robert Brown', 'Emily Davis'];
  const diseases = ['Cold & Flu', 'Fever', 'Back Pain', 'Headache', 'Allergies', null, 'Stomach Pain'];
  
  for (let i = 0; i < count; i++) {
    // Generate a date that could be in the past, today, or future
    let date;
    const dateType = Math.floor(Math.random() * 3);
    
    if (dateType === 0) {
      date = subDays(new Date(), Math.floor(Math.random() * 5) + 1); // Past
    } else if (dateType === 1) {
      date = new Date(); // Today
    } else {
      date = addDays(new Date(), Math.floor(Math.random() * 5) + 1); // Future
    }
    
    const hour = 9 + Math.floor(Math.random() * 8);
    const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
    
    dummyAppointments.push({
      id: `appointment-${i}`,
      patient_name: patientNames[Math.floor(Math.random() * patientNames.length)],
      mobile_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      appointment_date: date.toISOString().split('T')[0],
      appointment_time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      amount_paid: Math.floor(Math.random() * 200) + 50,
      disease: diseases[Math.floor(Math.random() * diseases.length)],
      call_id: `call-${i}`
    });
  }
  
  return dummyAppointments;
};
