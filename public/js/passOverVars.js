document.addEventListener('DOMContentLoaded', () => {

    // Find all elements that open a modal
    const triggers = document.querySelectorAll('[data-open-modal]');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.openModal;
            const modal = document.getElementById(modalId);
            console.log('Modal:', modal);
            if (!modal) return;

            // Try storyId first, fallback to noteId
            let hiddenInput = modal.querySelector('input[name="storyId"]');
            let datasetValue = trigger.dataset.storyId;

            if (!hiddenInput) {
                hiddenInput = modal.querySelector('input[name="noteId"]');
                datasetValue = trigger.dataset.noteId;
            }

            if (hiddenInput && datasetValue) {
                hiddenInput.value = datasetValue;
                console.log('Set hidden input value:', hiddenInput.value);
            }
        });
    });

});
