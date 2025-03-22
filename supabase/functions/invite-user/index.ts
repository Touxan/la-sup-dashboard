
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      throw new Error("Email and role are required");
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Get the authenticated user making the invitation
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized: Failed to get authenticated user");
    }

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      throw new Error("Unauthorized: Only admins can invite users");
    }

    // Create a unique token for the invitation
    const token_uuid = crypto.randomUUID();
    const invitation_token = btoa(token_uuid).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    // Set expiration to 7 days from now
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);
    
    // Insert the invitation into the database
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitations')
      .insert({
        email,
        token: invitation_token,
        role,
        created_by: user.id,
        expires_at: expires_at.toISOString()
      })
      .select()
      .single();
    
    if (invitationError) {
      throw invitationError;
    }

    // In a real application, send an email with the invitation link
    // For now, we'll just return the invitation data
    const invitationUrl = `${req.headers.get('origin')}/auth?invitation=${invitation_token}`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          ...invitation,
          invitationUrl 
        }
      }),
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
        success: false, 
        error: error.message 
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
