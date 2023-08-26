
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

    // offer Slide

    class MenuCard {
        constructor(src, alt, title, descr, price, parentElement, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 449;
            this.changeToUAH();
            this.parent = document.querySelector(parentElement);
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item'
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className))
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> тг.</div>
                </div>`

            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json()
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
            })
        });

    //Forms
     
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


    // Slider

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          sliderWrapper = document.querySelector('.offer__slider-wrapper'),
          current = document.getElementById('current'),
          total = document.getElementById('total'),
          inner = document.querySelector('.offer__slider-inner'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          width = window.getComputedStyle(sliderWrapper).width;

    let indexSlide = 1;
        offset = 0;
        
    if (indexSlide < 10) {
        total.innerHTML = `0${slides.length}`;
        current.innerHTML = `0${indexSlide}`;
    } else {
        total.innerHTML = slides.length;
        current.innerHTML = indexSlide;
    };

    inner.style.width = 100 * slides.length + '%';
    inner.style.display = 'flex';
    inner.style.transition = '0.5s all';

    sliderWrapper.style.overflow = 'hidden';

    slider.style.position = 'relative';

    const indicator = document.createElement('ol'),
          dots = [];

    indicator.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicator);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-index-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        if (i == 0) {
            dot.style.opacity = '1';
        }
        indicator.append(dot);
        dots.push(dot);
    };

    function changeCurrentSlide() {

        if (indexSlide < 10) {
            current.innerHTML = `0${indexSlide}`;
        } else {
            current.innerHTML = indexSlide;
        };
    }

    function dotStyleOpacity() {

        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[indexSlide - 1].style.opacity = '1';
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const indexTo = e.target.getAttribute('data-index-to')
            indexSlide = indexTo;

            offset = +width.slice(0, width.length - 2) * (indexTo - 1);
            inner.style.transform = `translateX(-${offset}px)`;

            changeCurrentSlide()
            dotStyleOpacity()
        })
    })

    next.addEventListener('click', () => {

        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        inner.style.transform = `translateX(-${offset}px)`

        if (indexSlide == slides.length) {
            indexSlide = 1;
        } else {
            ++indexSlide;
        };

        changeCurrentSlide()
        dotStyleOpacity()
    });

    prev.addEventListener('click', () => {
        
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        inner.style.transform = `translateX(-${offset}px)`

        if (indexSlide == 1) {
            indexSlide = slides.length;
        } else {
            --indexSlide;
        };

        changeCurrentSlide()
        dotStyleOpacity()
    });

    
// Calc


    const result = document.querySelector('.calculating__result span');
    let sex, weight, height, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        localStorage.setItem('ratio', 1.375);
    }

    

    // const parentElement2 = document.querySelectorAll('.calculating__choose_big div');
    // parentElement2.forEach(item => {
    //     item.classList.remove('calculating__choose-item_active');
    //     if (item.getAttribute('data-active') == localStorage.getItem('ratio')) {
    //         item.classList.add('calculating__choose-item_active')
    //     }
    // })

    function changeStorageAttribute(parentClass, activeClass) {
        const parentElement = document.querySelectorAll(`${parentClass} div`);
        parentElement.forEach(item => {
            item.classList.remove(activeClass);
            if (item.getAttribute('id') == localStorage.getItem('sex')) {
                item.classList.add(activeClass);
            }

            if (item.getAttribute('data-active') == localStorage.getItem('ratio')) {
                item.classList.add(activeClass);
            }
        })
    }

    changeStorageAttribute('#gender', 'calculating__choose-item_active');
    changeStorageAttribute('.calculating__choose_big', 'calculating__choose-item_active');

    function calculationResult() {
        
        if (!sex || !weight || !height || !age || !ratio) {
            result.textContent = "______";
            return;
        }

        if (sex == "male") {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        } else {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }

    }

    calculationResult()

    function chooseActive(parentClass, activeClass) {
        const elements = document.querySelectorAll(`${parentClass} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-active')) {
                    ratio = +e.target.getAttribute('data-active');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }
    
                console.log(ratio, sex);
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calculationResult();
            })
        })

    }

    chooseActive('#gender', 'calculating__choose-item_active');
    chooseActive('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if(input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(selector) {
                case `#weight`:
                    weight = input.value;
                    break;
                
                case `#height`:
                    height = input.value;
                    break;

                case `#age`:
                    age = input.value;
                    break;
            }

            calculationResult();
        })
    }

    getDynamicInformation('#weight');
    getDynamicInformation('#height');
    getDynamicInformation('#age');

});
