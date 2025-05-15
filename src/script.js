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
        const elementsToObserve = document.querySelectorAll('.subtitle, .project-card, .site-footer, .bg-element, .social-link, .section-title, .scroll-down');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Smetti di osservare gli elementi che animano una sola volta
                     if (entry.target.classList.contains('subtitle') ||
                         entry.target.classList.contains('site-footer') ||
                         entry.target.classList.contains('bg-element') ||
                         entry.target.classList.contains('social-link') ||
                         entry.target.classList.contains('section-title') ||
                         entry.target.classList.contains('scroll-down')) {
                         observer.unobserve(entry.target);
                    }
                }
                // Opzionale: rimuovere la classe 'visible' quando escono per animazione ripetuta
                // else { entry.target.classList.remove('visible'); }
            });
        }, {
            threshold: 0.1, // Percentuale dell'elemento visibile per triggerare
            rootMargin: '0px 0px -50px 0px' // Riduci la bottom margin per triggerare prima che l'elemento raggiunga la fine del viewport
        });

        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    };


    // Header hide/show on scroll (from index.html)
    // Funzione per gestire il listener di scroll per l'header
    let headerScrollListener = null;

     const addHeaderScrollListener = () => {
         const header = document.querySelector('.site-header');
         // Applica il listener solo su desktop (> 1024px) e se non è già attivo
         if (header && window.innerWidth > 1024 && !headerScrollListener) {
             let lastScroll = 0;
             headerScrollListener = () => {
                 const currentScroll = window.scrollY;
                 if (currentScroll <= 0) {
                     header.classList.remove('scrolled');
                     header.classList.add('visible'); // Assicura che sia visibile all'inizio pagina
                     return;
                 }
                 if (currentScroll > lastScroll && !header.classList.contains('scrolled')) {
                     header.classList.add('scrolled');
                     header.classList.remove('visible'); // Rimuove 'visible' quando si scorre giù
                 } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
                     header.classList.remove('scrolled');
                     header.classList.add('visible');
                 }
                 lastScroll = currentScroll;
             };
             window.addEventListener('scroll', headerScrollListener);
             // Assicura che l'header sia visibile appena caricata la pagina su desktop
             header.classList.add('visible');
         }
     };

     const removeHeaderScrollListener = () => {
         if (headerScrollListener) {
             window.removeEventListener('scroll', headerScrollListener);
             headerScrollListener = null;
         }
     };

     // Aggiungi il listener all'avvio su desktop
     addHeaderScrollListener();


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
                projectsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Project cards initial random rotation (from allwork.html, modified)
    // Applica la rotazione iniziale solo su desktop (> 768px)
    const applyInitialRotation = () => {
        const projects = document.querySelectorAll('.projects-grid .project-card');
        if (window.innerWidth > 768) {
             projects.forEach(project => {
                // Applica rotazione solo se l'elemento non è ancora animato dall'Observer
                 if (!project.classList.contains('visible')) {
                    const rotation = -1 + Math.random() * 2;
                    // Combina la trasformazione iniziale di translateY (dal CSS) con la rotazione
                    project.style.transform = `translateY(30px) rotate(${rotation}deg)`;
                 } else {
                     // Se l'elemento è già visibile (animato dall'Observer), rimuovi la rotazione se presente
                      // Questo gestisce il caso in cui l'Observer scatta prima della rotazione o al resize
                      if (project.style.transform.includes('rotate')) {
                           project.style.transform = project.style.transform.replace(/ ?rotate\([^\)]+\)/g, '');
                           // Se dopo la rimozione della rotazione non c'è translate, assicurati che ci sia translateY(0)
                           if (!project.style.transform.includes('translateY')) {
                                project.style.transform += ' translateY(0px)';
                           }
                      }
                 }
            });
        } else {
             // Su mobile (< 769px), rimuovi qualsiasi trasformazione applicata via JS
             const projects = document.querySelectorAll('.projects-grid .project-card');
             projects.forEach(project => {
                 project.style.transform = ''; // Reset transform JS
                 project.style.opacity = '1'; // Assicura visibilità su mobile
                 project.classList.add('visible'); // Aggiungi classe visible su mobile
             });
        }
    };

     // Applica la rotazione iniziale al caricamento della pagina
     applyInitialRotation();


    // Basic script to handle active navigation link (from allwork.html and about.html)
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else if (currentPath === '' && linkPath === 'index.html') {
            // Gestisce index.html come pagina di default
            link.classList.add('active');
        } else {
             link.classList.remove('active'); // Rimuovi active se non è la pagina corrente
        }
    });


    // Script per aggiornare la posizione sticky dell'immagine su about.html (da about.html)
    function updateStickyImagePosition() {
        const imageCol = document.querySelector('.about-image-col');
        const headerElement = document.querySelector('.site-header');
        // Applica sticky solo su desktop (> 1024px)
        if (imageCol && headerElement && window.innerWidth > 1024) {
            imageCol.style.top = headerElement.offsetHeight + 30 + 'px';
            imageCol.style.position = 'sticky';
            imageCol.style.alignSelf = 'start';
        } else if (imageCol) {
            // Rimuovi sticky su schermi più piccoli
            imageCol.style.top = 'auto';
            imageCol.style.position = 'static';
            imageCol.style.alignSelf = 'auto';
        }
    }
     updateStickyImagePosition(); // Chiamata iniziale


    // Gestisce gli effetti al ridimensionamento della finestra
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        const isDesktop = window.innerWidth > 1024;

        // Riapplica la rotazione iniziale e gestisci le transizioni delle project card
        applyInitialRotation(); // Questa funzione ora gestisce mobile/desktop

        // Reset Hero parallax based on breakpoint
         if (hero) {
             if (window.innerWidth <= 768) {
                 hero.style.transform = 'none';
             } // Parallax riattivato automaticamente dal listener mousemove su schermi più grandi
         }

         // Reset custom cursor based on breakpoint
         if (cursor) {
             if (window.innerWidth <= 1024) {
                 cursor.style.opacity = '0';
                 cursor.classList.remove('active');
             } // Cursore riattivato automaticamente dal listener mousemove su schermi più grandi
         }

        // Gestisce il listener di scroll dell'header al ridimensionamento
         if (window.innerWidth <= 1024) {
             removeHeaderScrollListener(); // Rimuove il listener su mobile/tablet
             const header = document.querySelector('.site-header');
             if(header) {
                 header.classList.remove('scrolled', 'visible');
                 header.style.transform = 'none'; // Rimuove trasformazioni JS
             }
         } else {
             addHeaderScrollListener(); // Aggiunge il listener su desktop
         }

        // Aggiorna la posizione sticky dell'immagine al ridimensionamento
        updateStickyImagePosition();

        // Reinicializza Intersection Observer? Generalmente non necessario a meno che
        // non ci siano modifiche drastiche al layout che influenzano la visibilità.
        // Le classi 'visible' persistono finché non vengono rimosse (es. su mobile).
        // Se necessario, si potrebbe re-osservare gli elementi, ma potrebbe causare animazioni indesiderate.
        // animateOnScroll(); // Commentato per evitare re-animazioni al resize
    });

    // Inizializza le animazioni Intersection Observer al caricamento
    animateOnScroll();

});