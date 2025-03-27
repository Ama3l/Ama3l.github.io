document.addEventListener("DOMContentLoaded", () => {
    const customCursor = document.createElement("div");
    customCursor.id = "custom-cursor";
    document.body.appendChild(customCursor);

    document.addEventListener("mousemove", (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        const projectInfo = project.querySelector('.project-info');
        const hoverImage = document.createElement('img');
        hoverImage.classList.add('project-hover-image');
        
        const imagePath = project.dataset.image;
        if (imagePath) {
            hoverImage.src = imagePath;
        }
        
        projectInfo.appendChild(hoverImage);

        project.addEventListener('mousemove', (e) => {
            const rect = project.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            hoverImage.style.left = `${x}px`;
            hoverImage.style.top = `${y}px`;
        });

        project.addEventListener('click', () => {
            const projectName = project.dataset.project;
            window.location.href = `${projectName}.html`;
        });
        
    });
});