document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.window');

    modals.forEach((modal) => {
        const closeBtn = modal.querySelector('.close-button');

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
    });

    // Open modal buttons
    const openButtons = document.querySelectorAll('[data-open-modal]');
    openButtons.forEach((btn) => {
        const targetId = btn.dataset.openModal;
        btn.addEventListener('click', () => {
            const targetModal = document.getElementById(targetId);
            if (targetModal) targetModal.style.display = 'block';
        });
    });
});
