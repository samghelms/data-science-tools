import * as React from 'react';
import * as monaco from 'monaco-editor';
import CellsManager from './CellsManager'

const startState = {
    language: 'markdown',
    // defaultVal: 'test\ntest',
    options: {
      glyphMargin: true,
      contextmenu: false,
      wordWrap: "on"
    },
    rows: [],
    contentWidgets: [],
    newContentWidgets: true,
}

export default class Notebook extends React.Component {

    constructor(props) {
        super(props);
        this.monacoRef = React.createRef();
        this._editor = null;
        this._model = monaco.editor.createModel(startState.defaultVal, startState.language);
        this.props.registerModel(this._model);
        this._cells = []
        this.keyHandler = this.keyHandler.bind(this)
        this.save = this.save.bind(this)
        this.outputAreaRegex = /^<div [\sA-Za-z="-]*(jp-OutputArea-output)/
    }

    async componentDidMount() {
        this._editor = monaco.editor.create(this.monacoRef, startState.options);
        this._editor.setModel(this._model)
        
        this._cellsManager = new CellsManager(this._model, this._editor, this.props.kernelManager);

        this._model.onDidChangeContent((changeEvent) => {
            this._cellsManager.updateCells(changeEvent);
        })

        window.addEventListener("resize", () => this._editor.layout());

        if (this.props.path) {
            this.initializeModel()
        }
    }

    async getParseContent() {
        const content = await this.props.getContent();
        const contentSplit = content.split('\n'); // TODO: add better newline handling
        const editorContent = []
        let outputs = 0;
        for (let i = 0; i < contentSplit.length; i++) {
            const item = contentSplit[i];
            if (item.match(this.outputAreaRegex)) {
                console.log("match!")
                console.log(item)
                // outputs.push({widgetContent: item, line: i - outputs.length})
                this._cellsManager.addSerializedOutput(item, i - outputs)
                outputs += 1;
            } else {
                editorContent.push(item)
            }
        }
        return editorContent.join('\n')
    }
    
    async initializeModel() {
        if (this.props.getContent) {
            const content = await this.getParseContent();
            this._model.pushEditOperations(
                [],
                [
                  {
                    range: this._model.getFullModelRange(),
                    text: content
                  },
                ]
            )
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.path !== null && this.props.path !== newProps.path && !newProps.isRename) {
            this._cellsManager.disposeCells()
            this.initializeModel(newProps.path)
            
        }
    }

    save() {
        console.log("save called")
        const serializedCells = this._cellsManager.serializeCells()
        const editorLines = this._model.getLinesContent()
        for (let i = 0; i < serializedCells.length; i++) {
            const {line, html} = serializedCells[i]
            editorLines.splice(line + i, 0, html)
        }
        console.log(editorLines)
        this.props.save(editorLines)
    }

    keyHandler(e) {
        if(e.metaKey && e.key == 's') {
            this.save()
            e.preventDefault()
        }
    }

    render() {
        return <div onKeyDown={this.keyHandler} style={this.props.style} ref={c => this.monacoRef = c}/>
    }
}
