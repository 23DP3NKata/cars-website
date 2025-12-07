function toggleDarkMode() {
    const theme = document.body.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.querySelector('.dark-mode-toggle i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', theme);
    const icon = document.querySelector('.dark-mode-toggle i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.hamburger');
    menu.classList.toggle('active');
    btn.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.querySelector('.hamburger').classList.remove('active');
    document.body.style.overflow = '';
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = '';
}

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal[style*="block"]').forEach(m => closeModal(m.id));
        closeMobileMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
});

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    if (document.getElementById('weatherBtn')) displaySearchHistory();
});


function validateForm(e) {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let valid = true;

    clearErrors();

    if (!name.value.trim()) {
        showError(name, 'nameError', 'Name is required');
        valid = false;
    }

    if (!email.value.trim()) {
        showError(email, 'emailError', 'Email is required');
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'emailError', 'Invalid email');
        valid = false;
    }

    if (!message.value.trim()) {
        showError(message, 'messageError', 'Message is required');
        valid = false;
    }

    if (valid) {
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('contactForm').reset();
        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
        }, 5000);
    }
}

function showError(input, errorId, msg) {
    input.classList.add('error');
    const error = document.getElementById(errorId);
    error.textContent = msg;
    error.style.display = 'block';
}

function clearErrors() {
    document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
}


function filterCards() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
        card.style.display = (title.includes(search) || desc.includes(search)) ? '' : 'none';
    });
}


//


function searchGitHubUsers() {
    const btn = document.getElementById('weatherBtn');
    const query = (document.getElementById('cityInput')?.value || '').trim();
    const container = document.getElementById('weatherContainer');

    if (!query) {
        container.innerHTML = '<div class="error-box">Please enter a search term</div>';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Loading...';

    fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`).then(r => { if (!r.ok) throw new Error('API error'); return r.json(); }).then(json => {
            const items = Array.isArray(json.items) ? json.items.slice(0, 6) : [];
            if (!items.length) throw new Error('No results');
            container.innerHTML = items.map(user => `<div class="weather-card fade-in">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <img src="${user.avatar_url}" alt="${user.login}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;">
                        <div>
                            <h3>${user.login}</h3>
                            <a href="${user.html_url}" target="_blank" rel="noopener">View profile</a>
                        </div>
                    </div>
                </div>`).join('');

            saveSearch(query);
            btn.disabled = false;
            btn.textContent = 'Search';
        }).catch(() => {container.innerHTML = '<div class="error-box">Data not available</div>';
            btn.disabled = false;
            btn.textContent = 'Search';
        });
}

function saveSearch(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.unshift(query);
    history = [...new Set(history)].slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    displaySearchHistory();
}

function displaySearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const container = document.getElementById('searchHistory');
    if (!container) return;

    if (!history.length) {container.innerHTML = '<p>No search history</p>';
        return;
    }
    container.innerHTML = '<h4>Recent Searches:</h4>' + history.map(q => `<div class="history-item" onclick="fillCity('${q}')">${q}</div>`).join('');
}

function fillCity(query) {const input = document.getElementById('cityInput');
    if (input) input.value = query;
}