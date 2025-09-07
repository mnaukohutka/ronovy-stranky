// zobrazit/renderer.js
// Modul pro vykreslování miniatur a detailů článků

// Vytvoří miniaturku článku (DOM element)
export function createArticleThumbnail(article, isAuthenticated) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.setAttribute('data-aos', 'fade-up');
  
  // AI badge - pouze pokud je použita AI
  const aiBadge = article.ai_used ? '<span class="ai-badge">🤖 AI</span>' : '';
  
  // Zobrazení avataru autora ve velikosti emoji/textu
  const authorIcon = article.author_avatar_url ? 
    `<img src="${article.author_avatar_url}" alt="Autor" style="width: 1em; height: 1em; border-radius: 50%; object-fit: cover; vertical-align: baseline; display: inline-block; margin-right: 0.2em;" loading="lazy">` :
    '✍️ ';
  
  card.innerHTML = `
    ${article.image_url ? `<img src="${article.image_url}" alt="${escapeHtml(article.title)}" loading="lazy">` : ''}
    <div class="info">
      <h2>${escapeHtml(article.title)}</h2>
      <div class="meta">
        <span>📂 ${getCategoryName(article.category)}</span>
        <span>📅 ${formatDate(article.created_at)}</span>
        ${aiBadge}
      </div>
      ${article.description ? `<div class="description">${escapeHtml(article.description)}</div>` : ''}
      ${(article.author_name || article.author_avatar_url) ? `
        <div class="author-info">
          <span class="author-name">${authorIcon}${escapeHtml(article.author_name || 'Anonym')}</span>
        </div>` : ''}
      <div class="meta rating-display">
        <span class="stars">${generateStars(article.rating_average || 0)}</span>
        <span class="rating-text">(${article.rating_count || 0} hodnocení)</span>
      </div>
      <div class="recipe-actions">
        <button class="recipe-btn share-btn" onclick="shareArticle(${article.id}, event)" title="Sdílet článek">
          <i class="fas fa-share"></i><span>Sdílet</span>
        </button>
        <button class="recipe-btn ${isAuthenticated ? 'rating-btn' : 'rating-btn disabled'}" onclick="openRating(${article.id}, event)" title="${isAuthenticated ? 'Ohodnotit článek' : 'Pro hodnocení se musíte přihlásit'}">
          <i class="fas fa-star"></i><span>Hodnotit</span>
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// Vytvoří HTML string pro detail článku
export function renderArticleDetail(article, isAuthenticated) {
  // AI badge v detailu
  const aiBadge = article.ai_used ? '<span class="ai-badge">🤖 AI</span>' : '';
  
  // Zobrazení avataru autora ve správném formátu pro detail - s trochu nižším zarovnáním
  const authorDisplay = article.author_name ? 
    `<span style="display: inline-flex; align-items: flex-end; gap: 0.2em;">
      ${article.author_avatar_url ? 
        `<img src="${article.author_avatar_url}" alt="Autor" style="width: 1em; height: 1em; border-radius: 50%; object-fit: cover; flex-shrink: 0; margin-bottom: 0.1em;" loading="lazy">` :
        '✍️'
      }
      <span>${escapeHtml(article.author_name)}</span>
    </span>` : '';
  
  return `
    <div class="recipe-detail">
      <button class="close-btn" onclick="closeDetail()">×</button>
      ${article.image_url ? `<img src="${article.image_url}" alt="${escapeHtml(article.title)}" loading="lazy">` : ''}
      <h2>${escapeHtml(article.title)}</h2>
      <div class="meta" style="margin-bottom: 1rem;">
        <span>📂 ${getCategoryName(article.category)}</span>
        <span>📅 ${formatDate(article.created_at)}</span>
        ${authorDisplay}
        ${aiBadge}
      </div>
      ${article.keywords ? `<div class="meta">🔍 ${escapeHtml(article.keywords)}</div>` : ''}
      <div class="meta rating-display">
        <span class="stars">${generateStars(article.rating_average || 0)}</span>
        <span class="rating-text">(${article.rating_count || 0} hodnocení)</span>
      </div>
      <div class="recipe-actions" style="margin: 1rem 0;">
        <button class="recipe-btn share-btn" onclick="shareArticle(${article.id})">
          <i class="fas fa-share"></i><span>Sdílet článek</span>
        </button>
        <button class="recipe-btn ${isAuthenticated ? 'rating-btn' : 'rating-btn disabled'}" onclick="openRating(${article.id})" title="${isAuthenticated ? 'Ohodnotit článek' : 'Pro hodnocení se musíte přihlásit'}">
          <i class="fas fa-star"></i><span>Hodnotit</span>
        </button>
      </div>
      <section class="article-content">
        ${formatContent(article.content)}
      </section>
    </div>
  `;
}

// Pomocné funkce pro formátování (přesunuté z původního script.js)

function getCategoryName(category) {
  const names = {
    'technologie': 'Technologie',
    'aktuality': 'Aktuality',
    'ostatní': 'Ostatní',
    'knihy': 'Knihy'
  };
  return names[category] || category;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.*$)/gm, '<h1 style="color: var(--primary-color); margin: 1.5rem 0 1rem;">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 style="color: var(--secondary-color); margin: 1.25rem 0 0.75rem;">$2</h2>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 1rem 0;" loading="lazy">')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--secondary-color); font-weight: bold;" rel="noopener">$1</a>')
    .replace(/\n- (.*)/g, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul style="margin: 1rem 0; padding-left: 2rem;">$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.)/gm, '<p style="margin-bottom: 1rem;">$1')
    .replace(/(.)$/gm, '$1</p>');
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '⭐';
  }
  
  if (hasHalfStar) {
    stars += '⭐'; // Pro jednoduchost používáme plnou hvězdu
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }
  
  return stars + ` ${rating.toFixed(1)}`;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
