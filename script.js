// script.js
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.getElementById("main-nav");
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    const faqItems = document.querySelectorAll(".faq-item");
    const counters = document.querySelectorAll(".js-counter");
    const revealEls = document.querySelectorAll(".reveal");
    const sections = document.querySelectorAll("main section[id]");

    /* -----------------------------
       Header: sombra al hacer scroll
       ----------------------------- */
    const handleScrollHeader = () => {
        if (window.scrollY > 10) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    };
    handleScrollHeader();
    window.addEventListener("scroll", handleScrollHeader);

    /* -----------------------------
       Menú móvil (hamburguesa)
       ----------------------------- */
    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.classList.toggle("is-open");
            mainNav.style.display = isOpen ? "block" : "none";
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    const closeMobileMenu = () => {
        if (navToggle && mainNav && window.innerWidth < 768) {
            navToggle.classList.remove("is-open");
            mainNav.style.display = "none";
            navToggle.setAttribute("aria-expanded", "false");
        }
    };

    /* -----------------------------
       Scroll suave para todos los enlaces internos
       ----------------------------- */
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href").substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerOffset = header.offsetHeight || 0;
                const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                closeMobileMenu();
            }
        });
    });

    /* -----------------------------
       FAQ desplegable (acordeón)
       ----------------------------- */
    faqItems.forEach(item => {
        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!button || !answer) return;

        button.addEventListener("click", () => {
            const isOpen = item.classList.toggle("open");
            if (isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

    /* -----------------------------
       Animación de contadores (hero)
       ----------------------------- */
    const animateCounter = (el) => {
        const target = parseFloat(el.dataset.target || "0");
        const suffix = el.dataset.suffix || "";
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const duration = 1200;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = target * progress;
            el.textContent = value.toFixed(decimals) + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
        // Contadores: se activan cuando el mockup entra en pantalla
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => {
                        if (!counter.dataset.started) {
                            counter.dataset.started = "true";
                            animateCounter(counter);
                        }
                    });
                    obs.disconnect();
                }
            });
        }, { threshold: 0.4 });

        const metricsContainer = document.querySelector(".mockup-metrics");
        if (metricsContainer && counters.length > 0) {
            counterObserver.observe(metricsContainer);
        }

        // Aparición suave de elementos .reveal
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        revealEls.forEach(el => revealObserver.observe(el));

        // Resaltado de sección activa en el menú
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const link = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (!link) return;

                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove("is-active"));
                    link.classList.add("is-active");
                }
            });
        }, { threshold: 0.45 });

        sections.forEach(section => sectionObserver.observe(section));
    } else {
        // Fallback: si no hay IntersectionObserver, marcar reveal visibles
        revealEls.forEach(el => el.classList.add("is-visible"));
    }
});
