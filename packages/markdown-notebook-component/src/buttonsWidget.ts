import * as monaco from 'monaco-editor'


export const buttonsWidget = (
    startLineNumber: number, 
    editorWidth: number, 
    addOutputCB: any, 
    clearOutputCB: any, 
    getLineNumber: any
    ) => (
     {
        domNode: <HTMLDivElement>null,
        getId: function() {
            return 'my.content.widget.'+startLineNumber.toString();
        },
        getDomNode: function() {

            this.domNode = document.createElement('div');
            // this.domNode.innerHTML = 'My content widget';
            this.domNode.className = 'buttons'
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
        getPosition: function() {
            return {
                position: {
                    lineNumber: getLineNumber(),
                },
                preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
            };
        }
    }
)