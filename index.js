// Глобальные переменные
const allSections = document.querySelectorAll('section');
const navDots = document.querySelectorAll('.nav-dot');
const typingTexts = ["Frontend разработчик", "UI/UX дизайнер", "Web Developer"];
let currentTypingIndex = 0;
let isTyping = true;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initializeAOS();
    initializeParticles();
    startTypingAnimation();
    initializePortfolio();
    initializeContactForm();
    initializeTheme();
    initializeSkillsAnimation();
});

// Инициализация AOS (Animate On Scroll)
function initializeAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });
}

// Инициализация частиц фона
function initializeParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: { enable: true, speed: 2 }
        }
    });
}

// Анимация печатающегося текста
function startTypingAnimation() {
    const typedElement = document.querySelector('.typed-text');
    const cursorElement = document.querySelector('.cursor');
    
    function typeText() {
        const currentText = typingTexts[currentTypingIndex];
        let charIndex = 0;
        
        function type() {
            if (charIndex < currentText.length) {
                typedElement.textContent += currentText.charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            } else {
                setTimeout(eraseText, 2000);
            }
        }
        
        function eraseText() {
            if (charIndex > 0) {
                typedElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(eraseText, 50);
            } else {
                currentTypingIndex = (currentTypingIndex + 1) % typingTexts.length;
                setTimeout(typeText, 500);
            }
        }
        
        type();
    }
    
    typeText();
}

// Инициализация портфолио
function initializePortfolio() {
    const projects = document.querySelectorAll('.project-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Фильтрация проектов
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            projects.forEach(project => {
                const category = project.dataset.category;
                if (filter === 'all' || category === filter) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.8)';
                    setTimeout(() => project.style.display = 'none', 300);
                }
            });
        });
    });

    // Модальное окно для проектов
    projects.forEach(project => {
        project.addEventListener('click', () => {
            const modal = createProjectModal(project);
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('active'), 10);
        });
    });
}

// Создание модального окна проекта
function createProjectModal(project) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${project.querySelector('h3').textContent}</h2>
            <div class="project-gallery">
                ${project.dataset.gallery ? createGallery(project.dataset.gallery) : ''}
            </div>
            <div class="project-details">
                <p>${project.dataset.description || ''}</p>
                <div class="project-links">
                    <a href="${project.dataset.demo}" target="_blank">Live Demo</a>
                    <a href="${project.dataset.github}" target="_blank">GitHub</a>
                </div>
            </div>
        </div>
    `;
    
    modal.querySelector('.close-modal').onclick = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    return modal;
}

// Инициализация формы контактов
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(form);
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('Сообщение отправлено успешно!', 'success');
                form.reset();
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            showNotification('Ошибка отправки сообщения', 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// Инициализация темы
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(isDark) {
        document.body.dataset.theme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.dataset.theme === 'dark';
        setTheme(!isDark);
    });
    
    // Установка начальной темы
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme ? savedTheme === 'dark' : prefersDark.matches);
    
    // Следим за системными настройками
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });
}

// Анимация навыков
function initializeSkillsAnimation() {
    const skillBars = document.querySelectorAll('.progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const value = progress.dataset.progress;
                progress.style.width = value;
                observer.unobserve(progress);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Отслеживание прокрутки для анимации навигации
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const nav = document.querySelector('nav');
    
    // Скрытие/показ навигации
    if (scrollTop > lastScrollTop && scrollTop > nav.offsetHeight) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
    
    // Активные секции
    let current = '';
    allSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollTop >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    // Обновление активных точек навигации
    navDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.section === current);
    });
});

// Обработка прелоадера
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            // Инициализируем остальные функции только после скрытия прелоадера
            initializeWebsite();
        }, 500);
    }
});

// Основная инициализация сайта
function initializeWebsite() {
    // Инициализация AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false
        });
    }

    // Инициализация частиц
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80 },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: 3 },
                move: { enable: true, speed: 2 }
            }
        });
    }

    // Запуск остальных инициализаций
    startTypingAnimation();
    initializePortfolio();
    initializeContactForm();
    initializeTheme();
    initializeSkillsAnimation();
    initializeScrollEvents();
}