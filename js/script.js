
document.addEventListener('DOMContentLoaded', () => {
    const timer = require('./modules/timer'),
          tabs = require('./modules/tabs'),
          slider = require('./modules/slider'),
          modal = require('./modules/modal'),
          forms = require('./modules/forms'),
          cards = require('./modules/cards'),
          calc = require('./modules/calc');

    timer();
    tabs();
    slider();
    modal();
    forms();
    cards();
    calc();
});
