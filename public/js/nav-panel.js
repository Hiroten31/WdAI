document.addEventListener("DOMContentLoaded", () => {
    const navPanel = document.querySelector(".nav-panel");
    const arrow = document.getElementById("arrow");

    arrow.addEventListener("click", () => {
        navPanel.classList.toggle("collapsed");
    });
});