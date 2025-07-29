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


        document.addEventListener("DOMContentLoaded", function() {
            const projectItems = document.querySelectorAll('.project-item-hover');
            const previewItems = document.querySelectorAll('.preview-item');
            const projectPreviewWrapper = document.querySelector('.project-preview-wrapper');
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            let slideshowInterval;
            let mobileSlideshowInterval;
            let currentProjectIndex = 0;

            function showPreview(id) {
                previewItems.forEach(item => {
                    item.classList.remove('active');
                    const images = item.querySelectorAll('img');
                    images.forEach(img => img.classList.remove('active'));
                });
                
                clearInterval(slideshowInterval);

                const activePreviewContainer = document.getElementById(`preview-${id}`);
                if (!activePreviewContainer) return;
                
                activePreviewContainer.classList.add('active');
                const images = activePreviewContainer.querySelectorAll('img');
                
                if (images.length > 0) {
                    images[0].classList.add('active');

                    if (images.length > 1) {
                        let currentImageIndex = 0;
                        slideshowInterval = setInterval(() => {
                            images[currentImageIndex].classList.remove('active');
                            currentImageIndex = (currentImageIndex + 1) % images.length;
                            images[currentImageIndex].classList.add('active');
                        }, 1000);
                    }
                }
            }

            function hideAllPreviews() {
                clearInterval(slideshowInterval);
                previewItems.forEach(item => {
                    item.classList.remove('active');
                    const images = item.querySelectorAll('img');
                    images.forEach(img => img.classList.remove('active'));
                });
            }

            function startMobileSlideshow() {
                const visibleProjects = Array.from(projectItems).filter(item => item.style.display !== 'none');
                
                if (visibleProjects.length === 0) return;

                clearInterval(mobileSlideshowInterval);
                currentProjectIndex = 0;
                
                activateMobileProject(visibleProjects[currentProjectIndex]);

                mobileSlideshowInterval = setInterval(() => {
                    visibleProjects[currentProjectIndex].classList.remove('active-mobile');
                    
                    const previousPreview = visibleProjects[currentProjectIndex].querySelector('.preview-item');
                    if (previousPreview) {
                        projectPreviewWrapper.appendChild(previousPreview);
                    }

                    currentProjectIndex = (currentProjectIndex + 1) % visibleProjects.length;
                    activateMobileProject(visibleProjects[currentProjectIndex]);
                }, 3000);
            }

            function activateMobileProject(project) {
                projectItems.forEach(item => item.classList.remove('active-mobile'));
                project.classList.add('active-mobile');
                
                const previewId = project.dataset.id;
                const previewElement = document.getElementById(`preview-${previewId}`);
                if (previewElement) {
                    project.appendChild(previewElement);
                    showPreview(previewId);
                }
            }
            
            // Gestione interazione desktop (hover)
            if (window.innerWidth > 768) {
                projectItems.forEach(item => {
                    item.addEventListener('mouseenter', function() {
                        const projectId = this.dataset.id;
                        showPreview(projectId);
                    });
                    item.addEventListener('mouseleave', function() {
                        hideAllPreviews();
                    });
                });
            } else {
                startMobileSlideshow();
            }

            // Gestione dei filtri
            filterButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const filter = this.getAttribute('data-filter');
                    
                    hideAllPreviews();
                    
                    projectItems.forEach(item => {
                        const filterTags = item.getAttribute('data-filter-tags');
                        const isVisible = (filter === 'all' || (filterTags && filterTags.toLowerCase().includes(filter.toLowerCase())));

                        item.style.display = isVisible ? '' : 'none';
                    });

                    if (window.innerWidth <= 768) {
                        startMobileSlideshow();
                    }
                });
            });

            // Gestione del custom cursor
            const body = document.body;
            const customCursor = document.querySelector('.custom-cursor');
            if (customCursor) {
                if (window.innerWidth > 768) { // Corretto per funzionare su tutti gli schermi desktop
                    document.addEventListener('mousemove', (e) => {
                        customCursor.style.left = e.clientX + 'px';
                        customCursor.style.top = e.clientY + 'px';
                    });
                    body.addEventListener('mouseenter', () => {
                        customCursor.style.opacity = '1';
                    });
                    body.addEventListener('mouseleave', () => {
                        customCursor.style.opacity = '0';
                    });
                    const hoverElements = document.querySelectorAll('a, button, .project-item-hover');
                    hoverElements.forEach(el => {
                        el.addEventListener('mouseenter', () => {
                            customCursor.classList.add('active');
                        });
                        el.addEventListener('mouseleave', () => {
                            customCursor.classList.remove('active');
                        });
                    });
                }
            }
        });