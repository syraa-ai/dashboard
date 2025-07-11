-- =============================
-- Syraa Clinic Database Schema
-- =============================

-- Table: user_settings
CREATE TABLE IF NOT EXISTS user_settings (
    row_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL,
    about text,
    services text,
    location text,
    calendar_email text,
    notify_email text,
    support_human_phone text,
    doctor_details jsonb DEFAULT '[]',
    working_hours text,
    lunch_hours text,
    holidays text,
    agent_voice text,
    custom_greetings text,
    custom_endings text,
    onboarding_step integer DEFAULT 1,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    calendar_auth json,
    agent_phone text
);

-- Table: appointment_details
CREATE TABLE IF NOT EXISTS appointment_details (
    row_id bigserial PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now(),
    patient_name text,
    appointment_reason text,
    appointment_date date,
    appointment_time time,
    event_id text,
    user_id uuid,
    call_id bigint,
    appointment_id bigint
);

-- Table: call_history
CREATE TABLE IF NOT EXISTS call_history (
    row_id bigserial PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now(),
    call_id text UNIQUE,
    caller_number text,
    called_number text,
    call_start timestamptz,
    call_end timestamptz,
    call_duration interval,
    call_status text,
    user_id uuid,
    appointment_status text DEFAULT 'Not Booked',
    call_summary text
);

-- Table: profiles
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    phone text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);