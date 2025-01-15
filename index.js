document.addEventListener('DOMContentLoaded', () => {
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Активная ссылка при прокрутке
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Переключатель темы
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function toggleTheme() {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', document.body.dataset.theme);
    }

    // Устанавливаем тему при загрузке
    const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    document.body.dataset.theme = savedTheme;

    themeToggle.addEventListener('click', toggleTheme);

    // Анимация прогресс-баров при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.progress;
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress').forEach(progress => {
        observer.observe(progress);
    });

    // Обработка формы
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // Здесь можно добавить логику отправки формы
        alert('Сообщение отправлено!');
    });

    const typedTextSpan = document.querySelector(".typed-text");
    const texts = ["Frontend разработчик", "UI/UX дизайнер", "Web Developer"];
    let textIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < texts[textIndex].length) {
            typedTextSpan.textContent += texts[textIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = texts[textIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(type, 1000);
    });
});