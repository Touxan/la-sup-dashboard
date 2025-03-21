
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables from Deno
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // SQL to create the upsert_data_sources function
    const sql = `
      CREATE OR REPLACE FUNCTION public.upsert_data_sources(_sources jsonb[])
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        _source jsonb;
      BEGIN
        FOREACH _source IN ARRAY _sources
        LOOP
          UPDATE public.data_sources
          SET 
            url = (_source->>'url')::text,
            updated_at = now()
          WHERE name = (_source->>'name')::text;
        END LOOP;
      END;
      $$;
    `;

    // Execute the SQL to create the function
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
