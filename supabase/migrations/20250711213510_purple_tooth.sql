/*
  # Add RLS Policies for Call History and Appointments

  1. Security Policies
    - Add policy for users to read their own call history records
    - Add policy for users to read their own appointment records
    - Add policy for users to insert their own records
    - Add policy for users to update their own records

  2. Tables Affected
    - `call_history` - users can access records where user_id matches their auth.uid()
    - `appointment_details` - users can access records where user_id matches their auth.uid()
*/

-- RLS Policies for call_history table
CREATE POLICY "Users can read own call history"
  ON call_history
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own call history"
  ON call_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own call history"
  ON call_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- RLS Policies for appointment_details table
CREATE POLICY "Users can read own appointments"
  ON appointment_details
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own appointments"
  ON appointment_details
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointment_details
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Ensure RLS is enabled on both tables (in case it's not already enabled)
ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_details ENABLE ROW LEVEL SECURITY;