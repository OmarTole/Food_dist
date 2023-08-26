
function forms() {
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...',
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('slider');
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `
            statusMessage.setAttribute('src', message.loading);
            form.insertAdjacentHTML('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            postData('http://localhost:3000/requests', json)
            .then(data => {
                statusModal(message.success);
                form.reset();
                console.log(data);
                statusMessage.remove();
            })
            .catch(() => {
                statusModal(message.failure);
            })
            .finally(() => {
                form.reset()
            })
            
        })
    }

    function statusModal(message) {
        const modalContent= document.querySelector('.modal__content');
        modalContent.style.display = 'none';
        openModal();

        const divContent = document.createElement('div'),
              modalDialog = document.querySelector('.modal__dialog');

        divContent.classList.add('modal__content');
        divContent.innerHTML = `
            <div>
            <div data-close class="modal__close">&times;</div>
            <div class="modal__tittle">${message}</div>
            </div>
        `;
        modalDialog.append(divContent);
        
        setTimeout(() => {
            divContent.remove();
            closeModal()
            modalContent.style.display = 'block';
        }, 4000)
    }

}

module.exports = forms;