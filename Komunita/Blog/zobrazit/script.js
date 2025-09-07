// zobrazit/script.js
import createAuth0Client from '@auth0/auth0-spa-js';
import { createClient } from '@supabase/supabase-js';

// Stejná konfigurace
const domain = 'ronovys.eu.auth0.com';
const clientId = 'PIsBVcJ5HbQA1S2ob3vdNOTGhtdP6z4K';
const SUPABASE_URL = 'https://dnidjzrljwlpifyhftwt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

let auth0Client, supabase;
let userSub, isAuthenticated=false;

window.addEventListener('DOMContentLoaded', async()=>{
  auth0Client = await createAuth0Client({domain,client_id:clientId,cacheLocation:'localstorage',useRefreshTokens:true,audience:`https://${domain}/api/v2/`,scope:'openid profile email'});
  if(await auth0Client.isAuthenticated()){const u=await auth0Client.getUser();userSub=u.sub;isAuthenticated=true;await loadUserAvatar();}
  supabase = createClient(SUPABASE_URL,SUPABASE_KEY);
  fetch('../menu.html').then(r=>r.text()).then(html=>document.getElementById('menubar').innerHTML=html);
  const id=Number(location.hash.replace('#',''));
  if(id) loadArticle(id);
  AOS.init({duration:1000,once:true});
});

async function loadUserAvatar(){try{const token=await auth0Client.getTokenSilently({audience:`https://${domain}/api/v2/`,scope:'read:current_user'});const res=await fetch(`https://${domain}/api/v2/users/${userSub}`,{headers:{Authorization:`Bearer ${token}`}});if(!res.ok)return;const d=await res.json();document.getElementById('avatar-icon').src=d.user_metadata?.avatar_url||d.picture; if(d.app_metadata?.permissions?.includes('write_articles')&&d.app_metadata.role==='písař')document.getElementById('admin-link').style.display='inline-flex';}catch{} }

async function loadArticle(id){const {data,error}=await supabase.from('articles').select('*').eq('id',id).single();if(error)return;showDetail(data);}
