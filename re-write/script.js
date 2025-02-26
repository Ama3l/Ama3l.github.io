document.addEventListener("DOMContentLoaded", () => {
    const circle = document.querySelector(".circle");
    const body = document.querySelector("body");

    // Movimento del cerchio che segue il puntatore del mouse
    document.addEventListener("mousemove", (e) => {
        circle.style.left = `${e.pageX}px`;
        circle.style.top = `${e.pageY}px`;
    });

    // Cambia tema al clic (dark/light mode)
    document.addEventListener("click", () => {
        if (body.classList.contains("body-light")) {
            body.classList.remove("body-light");
            body.classList.add("body");
        } else {
            body.classList.remove("body");
            body.classList.add("body-light");
        }
    });
});
