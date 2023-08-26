
function calc() {
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
}

module.exports = calc;