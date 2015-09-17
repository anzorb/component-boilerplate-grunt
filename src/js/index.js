var headerTmpl = require('../template/component.html');

(function() {
    var entryPoint = document.querySelector('div#component');
    entryPoint.innerHTML = headerTmpl;
})();