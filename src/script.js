document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor (from index.html and mobius.html)
    const cursor = document.querySelector('.custom-cursor');
    // Attiva cursore solo su desktop (breakpoint > 1024px definito in CSS)
    if (cursor && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.opacity = '1';
        });



        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        const hoverElements = document.querySelectorAll('a, button, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }

    // Scroll progress indicator (from index.html)
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
        });
    }


    // Intersection Observer for animations (from index.html)
    // Gestisce l'aggiunta della classe 'visible' quando gli elementi entrano nel viewport
    const animateOnScroll = () => {
        // Elementi che animano all'ingresso nel viewport
        // Rimosso '.scroll-down' da questa lista
        const elementsToObserve = document.querySelectorAll('.subtitle, .project-card, .site-footer, .bg-element, .social-link, .section-title');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Smetti di osservare gli elementi che animano una sola volta
                     if (entry.target.classList.contains('subtitle') ||
                         entry.target.classList.contains('site-footer') ||
                         entry.target.classList.contains('bg-element') ||
                         entry.target.classList.contains('social-link') ||
                         entry.target.classList.contains('section-title')) { // 'scroll-down' rimosso
                         observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    };


    // Header scroll behavior (New or modified for fixed header)
    const header = document.querySelector('.site-header');
    if (header) {
        const updateHeaderOnScroll = () => {
            if (window.scrollY > 50) { // Aggiungi la classe 'scrolled' dopo 50px di scroll
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        // Chiamata iniziale e listener per lo scroll
        updateHeaderOnScroll(); // Chiamata iniziale per impostare lo stato dell'header al caricamento
        window.addEventListener('scroll', updateHeaderOnScroll);

        // Nel resize event listener, assicurati che le classi dell'header siano gestite correttamente
        window.addEventListener('resize', () => {
            // Gestione del cursore custom al ridimensionamento
            if (cursor) {
                if (window.innerWidth <= 1024) {
                    cursor.style.opacity = '0';
                    cursor.classList.remove('active');
                } else {
                    // Riattiva il cursore se si torna a desktop
                    document.dispatchEvent(new MouseEvent('mousemove', {
                        clientX: event.clientX,
                        clientY: event.clientY
                    }));
                }
            }

            // Gestisce il listener di scroll dell'header al ridimensionamento
            if (window.innerWidth <= 1024) {
                // Su mobile/tablet, l'header dovrebbe essere sempre "scrolled" (con sfondo) e fisso
                header.classList.add('scrolled');
                header.style.transform = 'none'; // Rimuove eventuali trasformazioni JS
                window.removeEventListener('scroll', updateHeaderOnScroll); // Rimuove il listener di scroll dinamico su mobile
            } else {
                // Sul desktop, il comportamento normale basato sullo scroll
                window.addEventListener('scroll', updateHeaderOnScroll); // Riattiva il listener di scroll dinamico su desktop
                updateHeaderOnScroll(); // Applica lo stato iniziale corretto
            }

        });
    }

    // Hero parallax effect (from index.html)
    const hero = document.querySelector('.hero');
    // Applica effetto solo su desktop/tablet (> 768px)
    if (hero && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            hero.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Smooth scroll to projects (from index.html)
    const scrollDown = document.querySelector('.scroll-down');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            const projectsSection = document.querySelector('.projects-container');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // RIMOSSO: Project cards initial random rotation


    // Funzione per aggiornare la posizione sticky dell'immagine (per about.html)
    const updateStickyImagePosition = () => {
        const aboutImageCol = document.querySelector('.about-image-col');
        if (aboutImageCol) {
            if (window.innerWidth <= 1024) {
                aboutImageCol.style.position = 'static'; // Rimuovi sticky su mobile
                aboutImageCol.style.top = 'auto';
            } else {
                aboutImageCol.style.position = 'sticky'; // Riattiva sticky su desktop
                aboutImageCol.style.top = '100px'; // Regola in base all'altezza dell'header
            }
        }
    };

    // Chiamata iniziale e listener al resize per l'immagine sticky
    updateStickyImagePosition();
    window.addEventListener('resize', updateStickyImagePosition);


    // Inizializza le animazioni Intersection Observer al caricamento
    animateOnScroll();

});


if (document.body.classList.contains('all-work-page')) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();

            const details = this.nextElementSibling; // Get the associated details element
            const isMobile = window.matchMedia("(max-width: 768px)").matches; // Use 768px as a general mobile breakpoint

            // Close all other open details, unless it's the one we're clicking again
            document.querySelectorAll('.project-details.open').forEach(d => {
                if (d !== details) {
                    d.classList.remove('open', 'side-by-side');
                    d.style.gridColumn = ''; // Reset grid column
                    d.style.marginTop = ''; // Reset margin top
                    d.style.marginLeft = ''; // Reset margin left
                }
            });

            // Toggle current project details
            if (details.classList.contains('open')) {
                details.classList.remove('open', 'side-by-side');
                details.style.gridColumn = '';
                details.style.marginTop = '';
                details.style.marginLeft = '';
                return;
            }

            details.classList.add('open');

            if (!isMobile) {
                // On desktop, try to open side-by-side.
                details.classList.add('side-by-side');
                this.after(details); // Ensure the details element is correctly positioned in the DOM
            } else {
                // On mobile, always open below.
                details.classList.remove('side-by-by'); // Make sure this class is removed
                this.after(details); // Ensure it's still after the clicked card for sequential flow
            }

            // Scroll into view
            setTimeout(() => {
                details.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        });
    });
}