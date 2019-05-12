"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const monaco = __importStar(require("monaco-editor"));
exports.buttonsWidget = (startLineNumber, editorWidth, addOutputCB, clearOutputCB, getLineNumber) => ({
    domNode: null,
    getId: function () {
        return 'my.content.widget.' + startLineNumber.toString();
    },
    getDomNode: function () {
        this.domNode = document.createElement('div');
        // this.domNode.innerHTML = 'My content widget';
        this.domNode.className = 'buttons';
        this.domNode.style.pointerEvents = 'none';
        this.domNode.style.width = `1000px`;
        this.domNode.style.display = 'flex';
        this.domNode.style.justifyContent = 'flex-end';
        const internalDomNode = document.createElement('div');
        const btn = document.createElement('button');
        btn.innerHTML = 'run code';
        btn.onclick = (e) => {
            addOutputCB();
        };
        btn.style.pointerEvents = 'all';
        btn.style.marginRight = '20px';
        const btnClear = document.createElement('button');
        btnClear.innerHTML = 'clear output';
        btnClear.onclick = (e) => {
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
                lineNumber: getLineNumber(),
            },
            preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
        };
    }
});
