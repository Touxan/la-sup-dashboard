
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Get JWT from request
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the requester is authenticated and is an admin
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized: Failed to get authenticated user");
    }

    // Check if the requester is an admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      throw new Error("Unauthorized: Only admins can view user list");
    }

    // Get all users from auth.users using the admin API
    const { data: adminAuthResponse, error: adminAuthError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (adminAuthError) {
      throw adminAuthError;
    }

    // Format the response to include only what we need
    const users = adminAuthResponse.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    }));

    return new Response(
      JSON.stringify(users),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while fetching users' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    );
  }
});
