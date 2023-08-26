'use strict'

function modal() {
    const btnModal = document.querySelectorAll('button[data-modal]'),
          btnClose = document.querySelector('div[data-close]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(addTimeModal)
    }

    btnModal.forEach(button => {
        button.addEventListener('click', openModal)
    });

    function closeModal() {
        document.body.style.overflow = '';
        modal.classList.add('hide');
        modal.classList.remove('show');
    };

    btnClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    modal.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.style.contains('block: none')) {
            closeModal();
        }
    });

    const addTimeModal = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal()
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    
    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;