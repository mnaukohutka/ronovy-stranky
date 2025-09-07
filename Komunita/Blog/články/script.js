// script.js
import createAuth0Client from '@auth0/auth0-spa-js';
import { createClient } from '@supabase/supabase-js';

// Konfigurace
const domain = 'ronovys.eu.auth0.com';
const clientId = 'PIsBVcJ5HbQA1S2ob3vdNOTGhtdP6z4K';
const SUPABASE_URL = 'https://dnidjzrljwlpifyhftwt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWRqenJsandscGlmeWhmdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NzczNDMsImV4cCI6MjA2ODM1MzM0M30.L2-Jl5Ob0cMDAr-n0_KcOdaEr-87kWCb7c0QcXy3_Hw';

let auth0Client;
let supabase;
let articles = [];
let userSub = null;
let isAuthenticated = false;
let filtersVisible = false;
let currentSort = 'smart';
const filtr = { hledat: '', category: '', ai: '' };

// Inicializace
window.addEventListener('DOMContentLoaded', async () => {
  // Auth0
  auth0Client = await createAuth0Client({ domain, client_id: clientId, cacheLocation: 'localstorage', useRefreshTokens: true, audience: `https://${domain}/api/v2/`, scope: 'openid profile email' });
  if (await auth0Client.isAuthenticated()) {
    const user = await auth0Client.getUser();
    userSub = user.sub;
    isAuthenticated = true;
    await loadUserAvatar();
  }
  // Supabase
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Menu
  fetch('../menu.html').then(r => r.text()).then(html => document.getElementById('menubar').innerHTML = html);

  await loadArticles();
  setupEventListeners();
  startAutoCleanup();
  AOS.init({ duration: 1000, once: true });
});

// Načtení avataru
async function loadUserAvatar() {
  try {
    const token = await auth0Client.getTokenSilently({ audience: `https://${domain}/api/v2/`, scope: 'read:current_user' });
    const res = await fetch(`https://${domain}/api/v2/users/${userSub}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return;
    const data = await res.json();
    document.getElementById('avatar-icon').src = data.user_metadata?.avatar_url || data.picture;
    if (data.app_metadata?.permissions?.includes('write_articles') && data.app_metadata.role === 'písař') {
      document.getElementById('admin-link').style.display = 'inline-flex';
    }
  } catch {} 
}

// Načíst články
async function loadArticles() {
  document.getElementById('loading').style.display = 'block';
  const { data, error } = await supabase.from('articles').select('*');
  document.getElementById('loading').style.display = 'none';
  if (error) return console.error(error);
  articles = data;
  displayArticles();
}

function displayArticles() {
  const list = document.getElementById('recipe-list');
  const no = document.getElementById('no-articles');
  let vys = articles.filter(a => matchFilter(a));
  vys = sortList(vys);
  list.innerHTML = '';
  if (!vys.length) { no.style.display = 'block'; return; } else no.style.display = 'none';
  vys.forEach((article, idx) => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (idx%5)*60);
    const aiBadge = article.ai_used ? '<span class="ai-badge">🤖 AI</span>' : '';
    const authorIcon = article.author_avatar_url ? `<img src="${article.author_avatar_url}" style="width:1em;height:1em;border-radius:50%;vertical-align:baseline;margin-right:0.2em;" loading="lazy">` : '✍️';
    card.innerHTML = `
      ${article.image_url? `<img src="${article.image_url}" loading="lazy">`: ''}
      <div class="info">
        <h2>${article.title}</h2>
        <div class="meta">📂 ${categoryName(article.category)} 📅 ${formatDate(article.created_at)} ${aiBadge}</div>
        <div class="description">${article.description||''}</div>
        <div class="author-info"><span>${authorIcon}${article.author_name||'Anonym'}</span></div>
        <div class="meta rating-display">${generateStars(article.rating_average)} (${article.rating_count})</div>
        <div class="recipe-actions">
          <button class="recipe-btn share-btn" onclick="shareArticle(${article.id},event)">Sdílet</button>
          <button class="recipe-btn ${isAuthenticated?'rating-btn':'rating-btn disabled'}" onclick="openRating(${article.id},event)">Hodnotit</button>
        </div>
      </div>
    `;
    card.addEventListener('click',()=>showDetail(article));
    list.appendChild(card);
  });
}

// Filtr a řazení (funkce matchFilter, sortList, categoryName, formatDate, generateStars), plus showDetail, closeDetail, shareArticle, openRating, showRatingModal, loadUserRating, rateArticle, updateArticleRating, startAutoCleanup, cleanupExpiredArticles implementujte dle původního scriptu bez změn.