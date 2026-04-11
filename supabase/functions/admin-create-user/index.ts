// supabase/functions/admin-create-user/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verificar que o caller é admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !caller) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .eq('active', true)
      .single();

    if (callerRole?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Criar o novo usuário
    const body = await req.json();
    const { email, role, subsection_id } = body;

    if (!email || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields: email, role' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const validRoles = ['admin', 'dev', 'presidente', 'user'];
    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const DEFAULT_PASSWORD = 'Mudar@123';

    const { data: { user: newUser }, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { must_change_password: true },
    });

    if (createError || !newUser) {
      return new Response(JSON.stringify({ error: createError?.message || 'Failed to create user' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Inserir registro em user_roles atomicamente
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
      user_id: newUser.id,
      role,
      subsection_id: subsection_id || null,
      active: true,
    });

    if (roleError) {
      // Rollback: remover usuário criado se inserção de role falhar
      await supabaseAdmin.auth.admin.deleteUser(newUser.id);
      return new Response(JSON.stringify({ error: 'Failed to assign role: ' + roleError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ user: { id: newUser.id, email: newUser.email } }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
