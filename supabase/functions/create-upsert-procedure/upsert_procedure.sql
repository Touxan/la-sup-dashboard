
-- Create the function to create the upsert procedure if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_upsert_procedure_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the function already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'upsert_data_sources' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Create the upsert_data_sources function
    EXECUTE '
      CREATE OR REPLACE FUNCTION public.upsert_data_sources(_sources jsonb[])
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $func$
      DECLARE
        _source jsonb;
      BEGIN
        FOREACH _source IN ARRAY _sources
        LOOP
          UPDATE public.data_sources
          SET 
            url = _source->>''url'',
            updated_at = now()
          WHERE name = _source->>''name'';
        END LOOP;
      END;
      $func$;
    ';
  END IF;
END;
$$;
