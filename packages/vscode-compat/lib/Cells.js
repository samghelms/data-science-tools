"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cells;
(function (Cells) {
    var global = window;
    var symbol = Symbol('Cells');
    function installCellsManager(cm) {
        if (global[symbol]) {
            console.error(new Error('Cells manager has been overridden'));
        }
        global[symbol] = cm;
    }
    Cells.installCellsManager = installCellsManager;
    function getCellsManager() {
        if (!global[symbol]) {
            console.error(new Error('Cells manager has not been installed'));
        }
        return global[symbol];
    }
    Cells.getCellsManager = getCellsManager;
})(Cells = exports.Cells || (exports.Cells = {}));
//# sourceMappingURL=Cells.js.map