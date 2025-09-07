// načíst/api.js
// Modul pro komunikaci s Supabase a Auth0

import { createClient } from '@supabase/supabase-js';
import createAuth0Client from '@auth0/auth0-spa-js';
import {fetchAllPosts, initAuth0}from './api.js';

const domain = 'ronovys.eu.auth0.com';
const clientId = 'PIsBVcJ5HbQA1S2ob3vdNOTGhtdP6z4K';

const SUPABASE_URL = 'https://dnidjzrljwlpifyhftwt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWRqenJsandscGlmeWhmdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NzczNDMsImV4cCI6MjA2ODM1MzM0M30.L2-Jl5Ob0cMDAr-n0_KcOdaEr-87kWCb7c0QcXy3_Hw';

// Inicializace Supabase klienta
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Vrátí všechna data z tabulky articles
export async function fetchAllPosts() {
  const { data, error } = await supabase
    .from('articles')
    .select('*');
  if (error) throw error;
  return data;
}

// Vrátí detail článku podle ID
export async function fetchPostById(id) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Inicializuje Auth0 client a vrátí instanci
export async function initAuth0() {
  return await createAuth0Client({
    domain,
    client_id: clientId,
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
    audience: `https://${domain}/api/v2/`,
    scope: 'openid profile email'
  });
}
