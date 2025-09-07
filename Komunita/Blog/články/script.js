// články/script.js
import { fetchAllPosts } from '../načíst/api.js';
import { createArticleThumbnail, renderArticleDetail } from '../zobrazit/renderer.js';

// Globální stav
let posts = [];
let isAuthenticated = false;

// Inicializace Auth0 a Supabase
async function initAuth() {
  const auth0Client = await createAuth0Client({
    domain: 'ronovys.eu.auth0.com',
    client_id: 'PIsBVcJ5HbQA1S2ob3vdNOTGhtdP6z4K',
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
    audience: 'https://ronovys.eu.auth0.com/api/v2/',
    scope: 'openid profile email'
  });
  isAuthenticated = await auth0Client.isAuthenticated();
}

// Načtení a render
async function main() {
  await initAuth();
  document.getElementById('loading').style.display = 'block';
  try {
    posts = await fetchAllPosts();
    displayArticles();
  } catch (e) {
    document.getElementById('recipe-list').innerHTML = `<p>❌ Chyba: ${e.message}</p>`;
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', main);

function displayArticles() {
  const listEl = document.getElementById('recipe-list');
  listEl.innerHTML = '';
  posts.forEach(post => {
    const thumb = createArticleThumbnail(post, isAuthenticated);
    thumb.addEventListener('click', () => {
      window.location.href = `../zobrazit/index.html?id=${post.id}`;
    });
    listEl.appendChild(thumb);
  });
}

// Filtrace a řazení (volitelné, implementujte dle potřeby)
