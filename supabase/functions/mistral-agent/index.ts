
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
    // Get Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Mistral configuration from data_sources table
    const { data: mistralConfig, error: configError } = await supabase
      .from('data_sources')
      .select('url, config')
      .eq('name', 'mistral')
      .single();

    if (configError || !mistralConfig) {
      throw new Error(`Error fetching Mistral configuration: ${configError?.message || 'Configuration not found'}`);
    }

    if (!mistralConfig.config || typeof mistralConfig.config !== 'object') {
      throw new Error('Invalid Mistral configuration format');
    }

    const config = mistralConfig.config as { api_key: string, agent_id: string };
    
    if (!config.api_key || !config.agent_id) {
      throw new Error('Missing required Mistral configuration values (api_key or agent_id)');
    }

    // Get user's message
    const { messages } = await req.json();

    // Call Mistral AI API
    const response = await fetch(mistralConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.api_key}`,
      },
      body: JSON.stringify({
        agent_id: config.agent_id,
        messages: messages
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mistral API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in mistral-agent function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
