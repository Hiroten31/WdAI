document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('pop-upWindow');
    const addButton = document.querySelector('.add-button');
    const closeBtn = document.querySelector('.close-button');
    const form = document.getElementById('popup-form');

    // Show modal when clicking "Add a new sketch"
    addButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal on 'X' click
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('sketch-title').value;
        const description = document.getElementById('sketch-description').value;
        const type = document.getElementById('sketch-type').value;

        // Replace this with your real submit logic (API call, DOM update, etc.)
        console.log('Sketch submitted:', { title, description, type });

        alert(`Sketch "${title}" submitted!`);

        // Reset form and close modal
        form.reset();
        modal.style.display = 'none';
    });
});
