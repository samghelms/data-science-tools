"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var monaco = __importStar(require("monaco-editor"));
exports.buttonsWidget = function (startLineNumber, editorWidth, addOutputCB, clearOutputCB, getLineNumber) { return ({
    domNode: null,
    getId: function () {
        return 'my.content.widget.' + startLineNumber.toString();
    },
    getDomNode: function () {
        this.domNode = document.createElement('div');
        // this.domNode.innerHTML = 'My content widget';
        this.domNode.className = 'buttons';
        this.domNode.style.pointerEvents = 'none';
        this.domNode.style.width = "1000px";
        this.domNode.style.display = 'flex';
        this.domNode.style.justifyContent = 'flex-end';
        var internalDomNode = document.createElement('div');
        var btn = document.createElement('button');
        btn.innerHTML = 'run code';
        btn.onclick = function (e) {
            addOutputCB();
        };
        btn.style.pointerEvents = 'all';
        btn.style.marginRight = '20px';
        var btnClear = document.createElement('button');
        btnClear.innerHTML = 'clear output';
        btnClear.onclick = function (e) {
            clearOutputCB();
        };
        btnClear.style.pointerEvents = 'all';
        btnClear.style.marginRight = '40px';
        internalDomNode.appendChild(btn);
        internalDomNode.appendChild(btnClear);
        this.domNode.appendChild(internalDomNode);
        return this.domNode;
    },
    getPosition: function () {
        return {
            position: {
                lineNumber: getLineNumber()
            },
            preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
        };
    }
}); };
