document.addEventListener('DOMContentLoaded', () => {

    // Find all elements that open a modal
    const triggers = document.querySelectorAll('[data-open-modal]');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.openModal;
            const modal = document.getElementById(modalId);
            console.log('Modal:', modal);
            if (!modal) return;

            const hiddenInput = modal.querySelector('input[name="storyId"]');
            console.log('Hidden input:', hiddenInput);

            if (hiddenInput) {
                hiddenInput.value = trigger.dataset.storyId;
                console.log('Set hidden input value:', hiddenInput.value);
            }
        });
    });

});
