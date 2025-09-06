document.addEventListener("DOMContentLoaded", () => {
    const arrow = document.getElementById("arrow");

    arrow.addEventListener("click", () => {
        const html = document.documentElement;
        html.classList.toggle("nav-collapsed");
        localStorage.setItem("navPanelCollapsed", html.classList.contains("nav-collapsed"));
    });
});
