function toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('.dark-mode-toggle i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ---------

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('.dark-mode-toggle i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}


function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
}

function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    });
}


function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
            closeMobileMenu();
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    setupSmoothScrolling();
    setupKeyboardNavigation();
});


window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});


// ========== FORM VALIDATION ==========

function validateForm(event) {
    event.preventDefault();
    
    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Get error spans
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    
    // Reset errors
    clearErrors();
    
    let isValid = true;
    
    // Validate name
    if (name.value.trim() === '') {
        showError(name, nameError, 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (email.value.trim() === '') {
        showError(email, emailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showError(email, emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (message.value.trim() === '') {
        showError(message, messageError, 'Message is required');
        isValid = false;
    }
    
    // If all valid, show success message
    if (isValid) {
        showSuccessMessage();
        document.getElementById('contactForm').reset();
    }
    
    return false;
}

function showError(input, errorSpan, message) {
    input.classList.add('error');
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
    
    // Add shake animation
    input.style.animation = 'shake 0.3s';
    setTimeout(() => {
        input.style.animation = '';
    }, 300);
}

function clearErrors() {
    const inputs = document.querySelectorAll('.form-input');
    const errors = document.querySelectorAll('.error-message');
    
    inputs.forEach(input => {
        input.classList.remove('error');
    });
    
    errors.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    // Hide success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

function isValidEmail(email) {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}


// ========== SEARCH / FILTER FUNCTION ==========

function filterCards() {
    const searchInput = document.getElementById('searchInput');
    const filter = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title');
        const description = card.querySelector('.card-description');
        
        if (title && description) {
            const titleText = title.textContent.toLowerCase();
            const descText = description.textContent.toLowerCase();
            
            if (titleText.includes(filter) || descText.includes(filter)) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s';
            } else {
                card.style.display = 'none';
            }
        }
    });
}