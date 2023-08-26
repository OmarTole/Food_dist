
function slider() {
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
}

module.exports = slider;