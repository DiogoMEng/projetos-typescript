
-- First, make sure the lembrete column exists in the appointments table
-- If it doesn't exist, run this SQL in your Supabase SQL Editor:
-- ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS lembrete TEXT;

-- Now create a function to calculate and set the lembrete value
CREATE OR REPLACE FUNCTION calculate_lembrete()
RETURNS TRIGGER AS $$
DECLARE
  appointment_date DATE;
  appointment_time TEXT;
  reminder_datetime TIMESTAMP;
  formatted_reminder TEXT;
BEGIN
  appointment_date := NEW.data::DATE;
  appointment_time := NEW.hora;
  
  -- Parse the time and combine with date
  reminder_datetime := (appointment_date || ' ' || appointment_time)::TIMESTAMP - INTERVAL '2 hours';
  
  -- Format the reminder datetime as DD/MM/YYYY HH:MM
  formatted_reminder := TO_CHAR(reminder_datetime, 'DD/MM/YYYY HH24:MI');
  
  -- Set the lembrete field
  NEW.lembrete := formatted_reminder;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists, then create it
DROP TRIGGER IF EXISTS set_lembrete_trigger ON public.appointments;

CREATE TRIGGER set_lembrete_trigger
BEFORE INSERT OR UPDATE OF data, hora ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION calculate_lembrete();
