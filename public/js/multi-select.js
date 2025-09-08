document.querySelectorAll(".multiselect").forEach(multiselect => {
    const selectBox = multiselect.querySelector(".selectBox");
    const checkboxes = multiselect.querySelector(".checkboxes");

    let expanded = false;

    selectBox.addEventListener("click", () => {
        expanded = !expanded;
        checkboxes.style.display = expanded ? "block" : "none";
    });

    // Optional: close dropdown if clicking outside
    document.addEventListener("click", e => {
        if (!multiselect.contains(e.target)) {
            checkboxes.style.display = "none";
            expanded = false;
        }
    });
});