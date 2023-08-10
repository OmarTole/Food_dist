
document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabParent = document.querySelector('.tabheader__items');
          
    function hideTabContent() {
        tabsContent.forEach(element => {
            element.style.display = 'none';
        });

        tabs.forEach(element => {
            element.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active')
    }

    hideTabContent()
    showTabContent()
    

    tabParent.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideTabContent()
                    showTabContent(i)
                }
            })
        }
    })

// Job with Date

    const date = '2023-08-25';

    function getTimeDeadline(deadline) {
        let days, hours, minutes, seconds;
        const t = Date.parse(deadline) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(((t / 1000) / 60 / 60 / 24) % 30);
            hours = Math.floor(t / (1000 * 60 * 60) % 24);
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }


        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        }
    }

    function getZero(number) {
        if (number < 10 && number > 0) {
            return number = `0${number}`
        } else {
            return number
        }
    }

    function changeTimeDeadline(selector, deadline) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock()

        function updateClock() {
            const t = getTimeDeadline(deadline);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);


            if (t.total <= 0) {
                clearInterval(timeInterval)
            }
        }
    }

    changeTimeDeadline('.timer', date)

    // Modal

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
            console.log('Escape');
        }
    });

    const addTimeModal = setTimeout(openModal, 5000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal()
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    
    window.addEventListener('scroll', showModalByScroll);
});
