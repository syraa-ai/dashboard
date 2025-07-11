// Script to insert test call data into Supabase
// Run with: node insert-test-data.js

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Create a client
const supabase = createClient(
  'https://haponvatucrovkijkywx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcG9udmF0dWNyb3ZraWpreXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODY4NzIsImV4cCI6MjA2MDM2Mjg3Mn0.S2bU6Xhel08hY5JRdc4q2StZlZ-pK_Ju1OiU-lk0otg'
);

// Generate test call data with proper field names
const generateTestCalls = (userId, count = 5) => {
  const calls = [];
  const patientNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Robert Brown', 'Emily Davis'];
  const statuses = ['completed', 'missed'];
  
  // Create current timestamp to ensure recent dates
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Create dates from very recent (today) to a few days old
    const daysAgo = Math.floor(Math.random() * 5);
    const callDate = new Date();
    callDate.setDate(now.getDate() - daysAgo);
    callDate.setHours(9 + Math.floor(Math.random() * 8));
    callDate.setMinutes(Math.floor(Math.random() * 60));
    
    // Create random end time 2-10 minutes after start
    const callEndDate = new Date(callDate);
    const duration = 2 + Math.floor(Math.random() * 8);
    callEndDate.setMinutes(callEndDate.getMinutes() + duration);
    
    // Random phone number
    const phoneNumber = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    
    // Format duration as MM:SS
    const durationStr = `${duration}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
    
    // Create call record with CORRECT field names that match the client interface
    calls.push({
      id: uuidv4(),
      user_id: userId,
      patient_name: patientNames[Math.floor(Math.random() * patientNames.length)],
      phone_number: phoneNumber,
      call_start: callDate.toISOString(), // Correct field name
      call_end: callEndDate.toISOString(), // Correct field name
      duration: durationStr,
      call_status: statuses[Math.floor(Math.random() * statuses.length)], // Correct field name
      created_at: callDate.toISOString(),
      summary: `Call with patient about ${Math.random() > 0.5 ? 'appointment scheduling' : 'consultation follow-up'}.`,
      age: 25 + Math.floor(Math.random() * 40)
    });
  }
  
  return calls;
};

// Function to insert test data for the given user ID
const insertTestData = async (userId) => {
  if (!userId) {
    console.error('User ID is required');
    return;
  }
  
  console.log(`Generating test call history for user: ${userId}`);
  const testCalls = generateTestCalls(userId, 10);
  
  // Insert the calls into the call_history table
  const { data, error } = await supabase.from('call_history').insert(testCalls);
  
  if (error) {
    console.error('Error inserting test data:', error);
  } else {
    console.log(`Successfully inserted ${testCalls.length} test calls!`);
  }
};

// Check if we're running this file directly
if (require.main === module) {
  // Get user ID from command line argument
  const userId = process.argv[2];
  if (!userId) {
    console.error('Please provide a user ID as a command line argument');
    console.log('Usage: node insert-test-data.js YOUR_USER_ID');
    process.exit(1);
  }
  
  insertTestData(userId)
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = { insertTestData };