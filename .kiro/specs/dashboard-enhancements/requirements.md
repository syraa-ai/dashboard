# Requirements Document

## Introduction

This feature enhances the existing dashboard by improving user experience through better user identification, comprehensive appointment management, and intelligent caller identification. The enhancements focus on displaying authenticated user information, providing a complete view of appointments with associated caller details, and improving data connectivity between different system components.

## Requirements

### Requirement 1

**User Story:** As a logged-in user, I want to see my email address displayed in the sidebar below my account name, so that I can easily verify which account I'm currently using.

#### Acceptance Criteria

1. WHEN a user is authenticated THEN the system SHALL fetch the user's email from the authentication system
2. WHEN the email is successfully retrieved THEN the system SHALL display it below the account name in the dashboard sidebar
3. IF the email cannot be retrieved THEN the system SHALL display a fallback message or hide the email field gracefully
4. WHEN the user logs out and logs back in THEN the system SHALL update the displayed email to match the current authenticated user

### Requirement 2

**User Story:** As a healthcare provider, I want to view a comprehensive list of all appointments on my dashboard, so that I can manage my schedule effectively and see all upcoming and past appointments.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the system SHALL fetch appointment data from the "appointments_detail" table
2. WHEN appointment data is retrieved THEN the system SHALL display all appointments in a structured list format
3. WHEN displaying appointments THEN the system SHALL show relevant appointment details including date, time, and appointment type
4. IF no appointments exist THEN the system SHALL display an appropriate empty state message
5. WHEN appointment data fails to load THEN the system SHALL display an error message and provide retry functionality

### Requirement 3

**User Story:** As a healthcare provider, I want to see the caller's name for each appointment when available, so that I can quickly identify who made the appointment and prepare accordingly.

#### Acceptance Criteria

1. WHEN displaying appointments THEN the system SHALL attempt to match call_id between appointments_detail and call_history tables
2. WHEN a matching call_id is found THEN the system SHALL display the caller's name from the call_history table
3. WHEN no matching call_id is found OR caller name is not available THEN the system SHALL display "Unknown" as the caller name
4. WHEN multiple appointments exist THEN the system SHALL perform caller name lookup for each appointment independently
5. WHEN database queries fail THEN the system SHALL gracefully handle errors and display "Unknown" for affected appointments