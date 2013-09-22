var RootPane    = require('./lib/RootPane');

var rootPane    = null,
    rootEl      = null;

function init() {

    rootPane = new RootPane();
    rootEl = document.body;
    rootEl.className = 'hk';
    rootEl.appendChild(rootPane.getRoot());

    return rootPane;

}

function xc(klass) {
    exports[klass] = require('./lib/' + klass);
}

exports.init = init;

xc('Widget');
xc('Box');
xc('RootPane');
xc('SplitPane');
xc('CodeEditor');
xc('Console');
xc('Canvas2D');
xc('TabPane');

var constants = require('./lib/constants');
Object.keys(constants).forEach(function(k) {
    exports[k] = constants[k];
});