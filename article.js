// Get article from Supabase or localStorage
async function getArticleById(id) {
    // Try Supabase first
    if (window.supabase && window.SUPABASE_CONFIG) {
        try {
            const supabase = window.supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anonKey
            );
            
            // Convert id to number if it's a string (Supabase uses numeric IDs)
            const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
            
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', numericId)
                .single();
            
            if (!error && data) {
                // Convert Supabase format to app format
                return {
                    id: data.id.toString(),
                    title: data.title,
                    description: data.description,
                    image: data.image_url,
                    content: data.content,
                    author: data.author,
                    createdAt: data.created_at
                };
            }
        } catch (e) {
            console.error('Error fetching from Supabase:', e);
        }
    }
    
    // Fallback to localStorage
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    return articles.find(article => article.id === id || article.id === id.toString());
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Convert markdown-style content to HTML
function formatContent(content) {
    let html = content;
    
    // Convert markdown headers to HTML (must be done first)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.split('\n').map(line => {
        if (line.startsWith('## ')) {
            return line.replace(/^## (.*)$/, '<h2>$1</h2>');
        } else if (line.startsWith('# ')) {
            return line.replace(/^# (.*)$/, '<h1>$1</h1>');
        }
        return line;
    }).join('\n');
    
    // Convert bullet points (handle lists)
    html = html.split('\n');
    let inList = false;
    html = html.map((line, index) => {
        if (line.trim().startsWith('- ')) {
            if (!inList) {
                inList = true;
                return '<ul><li>' + line.trim().substring(2) + '</li>';
            }
            return '<li>' + line.trim().substring(2) + '</li>';
        } else {
            if (inList) {
                inList = false;
                return '</ul>' + (line.trim() ? line : '');
            }
            return line;
        }
    }).join('\n');
    if (inList) {
        html += '</ul>';
    }
    
    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to paragraphs
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(p => {
        p = p.trim();
        if (!p) return '';
        // Don't wrap if it's already a tag or is whitespace only
        if (p.startsWith('<') || !p) {
            return p;
        }
        return '<p>' + p + '</p>';
    }).join('\n');
    
    return html;
}

// Display article (async to handle Supabase)
async function displayArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        document.getElementById('article-content').innerHTML = `
            <div class="article-error">
                <h2>Article not found</h2>
                <p>Sorry, we couldn't find the article you're looking for.</p>
                <a href="resources.html" class="btn-primary">Back to Resources</a>
            </div>
        `;
        return;
    }
    
    const article = await getArticleById(articleId);
    
    if (!article) {
        document.getElementById('article-content').innerHTML = `
            <div class="article-error">
                <h2>Article not found</h2>
                <p>Sorry, we couldn't find the article you're looking for.</p>
                <a href="resources.html" class="btn-primary">Back to Resources</a>
            </div>
        `;
        return;
    }
    
    const formattedContent = formatContent(article.content);
    
    document.getElementById('article-content').innerHTML = `
        <article class="article">
            ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-image">` : ''}
            <div class="article-header-content">
                <h1 class="article-title">${article.title}</h1>
                <div class="article-meta">
                    ${article.author ? `<span class="article-author"><i class="fas fa-user"></i> ${article.author}</span>` : ''}
                    <span class="article-date"><i class="fas fa-calendar"></i> ${formatDate(article.createdAt)}</span>
                </div>
            </div>
            <div class="article-body">
                ${formattedContent}
            </div>
        </article>
    `;
    
    // Update page title
    document.title = `${article.title} - Alli`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Display article (async)
    displayArticle().catch(err => {
        console.error('Error displaying article:', err);
    });
});

