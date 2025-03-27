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
