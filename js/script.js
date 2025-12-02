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





function getWeatherByCity() {
    const btn = document.getElementById('weatherBtn');
    const city = (document.getElementById('cityInput')?.value || '').trim();
    const container = document.getElementById('weatherContainer');

    if (!city) {
        container.innerHTML = '<div class="error-box">Please enter a city</div>';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Loading...';

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
        .then(r => { if (!r.ok) throw new Error('Geocoding failed'); return r.json(); })
        .then(geo => {
            if (!geo.results || geo.results.length === 0) throw new Error('City not found');
            const g = geo.results[0];
            const lat = g.latitude;
            const lon = g.longitude;
            const displayName = `${g.name}${g.country ? ', ' + g.country : ''}`;

            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`)
                .then(r => { if (!r.ok) throw new Error('Weather API failed'); return r.json(); })
                .then(data => ({ data, displayName }));
        })
        .then(({ data, displayName }) => {
            displayWeather(data, displayName);
            saveSearch(displayName);
            btn.disabled = false;
            btn.textContent = 'Get Weather';
        })
        .catch(err => {
            container.innerHTML = '<div class="error-box">Weather data not available</div>';
            btn.disabled = false;
            btn.textContent = 'Get Weather';
        });
}

function displayWeather(data, placeName) {
    const temp = data.current?.temperature_2m;
    const code = data.current?.weathercode;
    const desc = getWeatherDesc(code);
    const icon = getWeatherIcon(code);

    const html = `
        <div class="weather-card fade-in">
            <div class="weather-icon">${icon}</div>
            <h3>${placeName || 'Location'}</h3>
            <div class="weather-temp">${temp}°C</div>
        </div>
    `;
    document.getElementById('weatherContainer').innerHTML = html;
}

function getWeatherDesc(code) {
    const weather = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
        61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
        80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy rain showers', 95: 'Thunderstorm'
    };
    return weather[code] || 'Unknown';
}

function getWeatherIcon(code) {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2 || code === 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 75) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 95) return '⛈️';
    return '🌤️';
}

function saveSearch(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.unshift({ city: city, time: new Date().toLocaleString() });
    history = history.slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    displaySearchHistory();
}

function displaySearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const container = document.getElementById('searchHistory');
    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = '<p>No search history</p>';
        return;
    }

    container.innerHTML = '<h4>Recent Searches:</h4>' + 
        history.map(item => `<div class="history-item" onclick="fillCity('${item.city}')">${item.city} - ${item.time}</div>`).join('');
}

function fillCity(city) {
    const input = document.getElementById('cityInput');
    if (input) input.value = city;
}