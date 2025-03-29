document.addEventListener("DOMContentLoaded", () => {
    // Custom Cursor
    const customCursor = document.createElement("div");
    customCursor.id = "custom-cursor";
    document.body.appendChild(customCursor);

    document.addEventListener("mousemove", (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });

    // Gestione immagini in hover
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        const projectInfo = project.querySelector('.project-info');
        const images = project.dataset.images ? project.dataset.images.split(',') : [];

        if (images.length > 0) {
            let currentIndex = 0;
            const hoverImage = document.createElement('img');
            hoverImage.classList.add('project-hover-image');
            hoverImage.src = images[currentIndex];

            projectInfo.appendChild(hoverImage);

            project.addEventListener('mousemove', (e) => {
                const rect = project.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                hoverImage.style.left = `${x}px`;
                hoverImage.style.top = `${y}px`;
            });

            let interval;
            project.addEventListener('mouseenter', () => {
                hoverImage.style.opacity = 1;

                interval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % images.length;
                    hoverImage.src = images[currentIndex];
                }, 1000);
            });

            project.addEventListener('mouseleave', () => {
                hoverImage.style.opacity = 0;
                clearInterval(interval);
            });

            project.addEventListener('click', () => {
                const projectName = project.dataset.project;
                window.location.href = `${projectName}.html`;
            });
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Lightbox Gallery Implementation
    const galleryContainer = document.querySelector('.additional-images');
    const coverImage = document.querySelector('.cover-image');
    const images = [...galleryContainer.querySelectorAll('img'), coverImage];

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    document.body.appendChild(lightbox);

    const lightboxImg = document.createElement('img');
    lightboxImg.classList.add('lightbox-image');
    lightbox.appendChild(lightboxImg);

    // Navigation controls
    const prevButton = document.createElement('button');
    prevButton.classList.add('lightbox-nav', 'prev');
    prevButton.innerHTML = '&#10094;';
    lightbox.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('lightbox-nav', 'next');
    nextButton.innerHTML = '&#10095;';
    lightbox.appendChild(nextButton);

    // Close button
    const closeButton = document.createElement('button');
    closeButton.classList.add('lightbox-close');
    closeButton.innerHTML = '&times;';
    lightbox.appendChild(closeButton);

    let currentImageIndex = 0;

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = images[index].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigate images
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
    }

    // Add click events to images
    images.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    // Close button
    closeButton.addEventListener('click', closeLightbox);

    // Navigation buttons
    nextButton.addEventListener('click', showNextImage);
    prevButton.addEventListener('click', showPrevImage);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
});