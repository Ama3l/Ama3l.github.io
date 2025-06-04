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

    // Project cards initial random rotation (from allwork.html, modified)
    // Applica la rotazione iniziale solo su desktop (> 768px)
    const applyInitialRotation = () => {
        const projects = document.querySelectorAll('.projects-grid .project-card');
        if (window.innerWidth > 768) {
            projects.forEach(project => {
                // Applica rotazione solo se l'elemento non è ancora animato (controlla la presenza della classe 'visible')
                if (!project.classList.contains('visible')) {
                    const rotation = (Math.random() - 0) * 0; // Rotazione casuale tra -2.5deg e 2.5deg
                    project.style.transform = `rotate(${rotation}deg) translateY(30px)`; // Combina con la traslazione iniziale
                }
            });
        } else {
            // Rimuovi le trasformazioni di rotazione su mobile/tablet per evitare problemi
            projects.forEach(project => {
                project.style.transform = 'none';
            });
        }
    };

    // Chiama la funzione all'avvio e al ridimensionamento
    applyInitialRotation();
    window.addEventListener('resize', applyInitialRotation);


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