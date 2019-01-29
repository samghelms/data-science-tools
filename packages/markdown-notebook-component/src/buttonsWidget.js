import * as monaco from 'monaco-editor'

export const buttonsWidget = (startLineNumber, editorWidth = 100, addOutputCB, getLineNumber) => (
     {
        domNode: null,
        getId: function() {
            return 'my.content.widget.'+startLineNumber.toString();
        },
        getDomNode: function() {
            this.viewZoneId = null

            this.domNode = document.createElement('div');
            // this.domNode.innerHTML = 'My content widget';
            this.domNode.className = 'test'
            this.domNode.style.pointerEvents = 'none';
            // this.domNode.style.background = 'grey';
            this.domNode.style.width = `${editorWidth}px`;
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
            internalDomNode.appendChild(btn);
            this.domNode.appendChild(internalDomNode);
                
            return this.domNode;
        },
        getPosition: function(test) {
            console.log("get position called");
            console.log(getLineNumber())
            return {
                position: {
                    lineNumber: getLineNumber(),
                },
                preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
            };
        }
    }
)