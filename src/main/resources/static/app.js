const API_URL = '/api';

// State
let state = {
    token: localStorage.getItem('token'),
    user: null, // We don't have a /me endpoint, so we just check if token exists
    posts: [],
    authMode: 'login' // 'login' or 'register'
};

// =======================
// INITIALIZATION
// =======================
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    if (state.token) {
        loadFeed();
    }
});

// =======================
// UI UPDATES
// =======================

function updateNav() {
    const navLinks = document.getElementById('nav-links');
    const searchContainer = document.getElementById('nav-search-container');
    const heroSection = document.getElementById('hero-section');
    const feedSection = document.getElementById('feed-section');

    if (state.token) {
        // Logged In
        navLinks.innerHTML = `
            <button class="btn btn-outline" onclick="logout()">
                <i data-lucide="log-out"></i> Logout
            </button>
        `;
        searchContainer.classList.remove('hidden');
        heroSection.classList.add('hidden');
        feedSection.classList.remove('hidden');
    } else {
        // Logged Out
        navLinks.innerHTML = `
            <button class="btn btn-outline" onclick="openModal('auth', 'login')">Login</button>
            <button class="btn btn-primary" onclick="openModal('auth', 'register')">Register</button>
        `;
        searchContainer.classList.add('hidden');
        heroSection.classList.remove('hidden');
        feedSection.classList.add('hidden');
    }
    lucide.createIcons();
}

function renderPosts(posts) {
    const grid = document.getElementById('posts-grid');
    if (!posts || posts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary)">No posts found. Create the first one!</p>';
        return;
    }

    grid.innerHTML = posts.map(post => `
        <div class="post-card glass-card">
            <h3 class="post-title">${escapeHTML(post.title)}</h3>
            <p class="post-content-preview">${escapeHTML(post.content)}</p>
            <div class="post-footer">
                <span>Post #${post.id}</span>
                <div class="post-actions">
                    <button class="btn btn-sm btn-outline" onclick="editPost(${post.id})"><i data-lucide="edit-2"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// =======================
// MODAL LOGIC
// =======================

function openModal(type, mode = null) {
    if (type === 'auth') {
        state.authMode = mode || 'login';
        updateAuthModalUI();
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('auth-error').classList.add('hidden');
    } else if (type === 'post') {
        document.getElementById('post-form').reset();
        document.getElementById('post-id').value = '';
        document.getElementById('post-modal-title').innerText = 'Create Post';
        document.getElementById('post-modal').classList.remove('hidden');
    }
}

function closeModal(type) {
    document.getElementById(`${type}-modal`).classList.add('hidden');
}

function toggleAuthMode() {
    state.authMode = state.authMode === 'login' ? 'register' : 'login';
    updateAuthModalUI();
}

function updateAuthModalUI() {
    const isLogin = state.authMode === 'login';
    document.getElementById('auth-title').innerText = isLogin ? 'Welcome Back' : 'Create Account';
    document.getElementById('auth-submit-btn').innerText = isLogin ? 'Login' : 'Register';
    document.getElementById('auth-toggle-text').innerText = isLogin ? "Don't have an account?" : "Already have an account?";
    document.querySelector('.modal-footer a').innerText = isLogin ? 'Sign up' : 'Log in';

    const userGroup = document.getElementById('username-group');
    if (isLogin) {
        userGroup.style.display = 'none';
        document.getElementById('auth-username').removeAttribute('required');
    } else {
        userGroup.style.display = 'block';
        document.getElementById('auth-username').setAttribute('required', 'true');
    }
}

// =======================
// API CALLS (AUTH)
// =======================

async function handleAuth(e) {
    e.preventDefault();
    const errorEl = document.getElementById('auth-error');
    errorEl.classList.add('hidden');

    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const username = document.getElementById('auth-username').value;

    try {
        if (state.authMode === 'register') {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username })
            });
            if (!res.ok) throw new Error('Registration failed');
            // Auto login after register
            state.authMode = 'login';
            await handleAuth(e); // retrigger login
            return;
        }

        // Login
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error('Invalid credentials');

        const token = await res.text();
        localStorage.setItem('token', token);
        state.token = token;

        closeModal('auth');
        updateNav();
        loadFeed();
    } catch (err) {
        errorEl.innerText = err.message;
        errorEl.classList.remove('hidden');
    }
}

function logout() {
    localStorage.removeItem('token');
    state.token = null;
    state.posts = [];
    updateNav();
}

// =======================
// API CALLS (POSTS)
// =======================

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
    };
}

async function loadFeed() {
    if (!state.token) return;
    try {
        const res = await fetch(`${API_URL}/posts`, { headers: getHeaders() });
        if (res.status === 403 || res.status === 401) return logout();
        state.posts = await res.json();
        renderPosts(state.posts);
    } catch (err) {
        console.error('Failed to load posts', err);
    }
}

async function handleSearch() {
    const keyword = document.getElementById('search-input').value;
    if (!keyword) return loadFeed();

    try {
        const res = await fetch(`${API_URL}/posts/search?keyword=${encodeURIComponent(keyword)}`, { headers: getHeaders() });
        const results = await res.json();
        renderPosts(results);
    } catch (err) {
        console.error('Search failed', err);
    }
}

async function handlePostSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('post-id').value;
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    const payload = { title, content };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/posts/${id}` : `${API_URL}/posts`;

    try {
        const res = await fetch(url, {
            method,
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to save post');
        closeModal('post');
        loadFeed();
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

function editPost(id) {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('post-id').value = post.id;
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-content').value = post.content;
    document.getElementById('post-modal-title').innerText = 'Edit Post';
    document.getElementById('post-modal').classList.remove('hidden');
}

async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const res = await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete post');
        loadFeed();
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

// =======================
// API CALLS (URL SCANNER)
// =======================

async function scanUrl() {
    const urlInput = document.getElementById('scanner-input').value;
    const resultBox = document.getElementById('scanner-result');
    const btn = document.getElementById('scan-btn');

    if (!urlInput) return;

    // Loading state
    btn.innerHTML = '<i class="lucide-loader"></i> Scanning...';
    btn.disabled = true;
    resultBox.classList.add('hidden');

    try {
        const res = await fetch(`${API_URL}/url/analyze`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ url: urlInput })
        });

        if (!res.ok) throw new Error('Failed to analyze URL');
        const data = await res.json();

        // Render result
        const badgeClass = data.safe ? 'safe' : 'unsafe';
        const icon = data.safe ? 'shield-check' : 'shield-alert';

        resultBox.innerHTML = `
            <h3>${escapeHTML(data.title)}</h3>
            <p>${escapeHTML(data.description)}</p>
            <div style="margin-top: 1rem;">
                <span class="safe-badge ${badgeClass}">
                    <i data-lucide="${icon}"></i> ${data.safe ? 'Safe to open' : 'Suspicious / Unsafe'}
                </span>
                <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
                    Reason: ${escapeHTML(data.safetyReason)}
                </p>
            </div>
        `;
        resultBox.classList.remove('hidden');
        lucide.createIcons();
    } catch (err) {
        console.error(err);
        resultBox.innerHTML = `<p style="color: var(--error-color);">Error: ${err.message}</p>`;
        resultBox.classList.remove('hidden');
    } finally {
        btn.innerHTML = 'Analyze';
        btn.disabled = false;
    }
}

// Helpers
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
