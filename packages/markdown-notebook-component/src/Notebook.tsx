import * as React from 'react';
import { editor, languages } from 'monaco-editor';
import CellsManager from './CellsManager'


export namespace Cells {
    const global = window as any;
    const symbol = Symbol('Cells');
    export function installCellsManager(cm: any) {
        if (global[symbol]) {
            console.error(new Error('Cells manager has been overridden'));
        }
        global[symbol] = cm
    }
    
    export function getCellsManager(): string {
        if (!global[symbol]) {
            console.error(new Error('Cells manager has not been installed'));
        }
        return global[symbol]
    }
    
}


const startState = {
    language: 'markdown',
    newContentWidgets: true,
}

const defaultOptions: editor.IEditorConstructionOptions = {
    glyphMargin: true,
    wordWrap: 'on'
};

interface ILang extends languages.ILanguageExtensionPoint {
	loader: () => Promise<ILangImpl>;
}

interface ILangImpl {
	conf: languages.LanguageConfiguration;
	language: languages.IMonarchLanguage;
}

let languageDefinitions: { [languageId: string]: ILang } = {};

function _loadLanguage(languageId: string): Promise<void> {
	const loader = languageDefinitions[languageId].loader;
	return loader().then((mod) => {
		languages.setMonarchTokensProvider(languageId, mod.language);
		languages.setLanguageConfiguration(languageId, mod.conf);
	});
}

let languagePromises: { [languageId: string]: Promise<void> } = {};

export function loadLanguage(languageId: string): Promise<void> {
	if (!languagePromises[languageId]) {
		languagePromises[languageId] = _loadLanguage(languageId);
	}
	return languagePromises[languageId];
}

export function registerLanguage(def: ILang): void {
	let languageId = def.id;

	languageDefinitions[languageId] = def;
	languages.register(def);
	languages.onLanguage(languageId, () => {
		loadLanguage(languageId);
	});
}

export interface IMarkdownEditorProps {
    registerModel: (model: editor.ITextModel) => void;
    kernelManager: any; // TODO: assign real type here
    path: string;
    getContent: () => string;
    style: {width: string, height: string};
    save: (lines: Array<string>) => void;
    isRename: boolean;
}

export interface IMarkdownEditorState {

}


export default class Notebook extends React.Component<IMarkdownEditorProps, IMarkdownEditorState> {
    monacoRef = React.createRef<HTMLDivElement>();
    _editor: editor.IStandaloneCodeEditor | null;
    _model: editor.ITextModel;
    outputAreaRegex = /^<div [\sA-Za-z="-]*(jp-OutputArea-output)/
    height = 800 // TODO: stop hardcoding this
    _cellsManager: CellsManager | null;

    constructor(props: IMarkdownEditorProps) {
        super(props);
        console.log('creating notebook');
        // this.monacoRef = React.createRef();
        this._editor = null;
        this._cellsManager = null;
        this._model = editor.createModel('', startState.language);
        this.props.registerModel(this._model);
        this.keyHandler = this.keyHandler.bind(this)
        this.save = this.save.bind(this)
    }

    async componentDidMount() {
        this._editor = editor.create(this.monacoRef.current!, defaultOptions);
        this._editor.setModel(this._model)
        
        if (this._cellsManager === null) {
            console.log(" ===== creating new cells manager ====")
            this._cellsManager = new CellsManager(this._model, this._editor, this.props.kernelManager);
            Cells.installCellsManager(this._cellsManager);
        }

        this._model.onDidChangeContent((changeEvent) => {
            if (this._cellsManager) this._cellsManager.updateCells(changeEvent);
        })

        this._editor.layout()

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
            if (item.match(this.outputAreaRegex) && this._cellsManager) {
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
                ],
                (inverseEditOperations) => []
            )
        }
    }

    componentWillReceiveProps(newProps: IMarkdownEditorProps) {
        if (newProps.path !== null && this.props.path !== newProps.path && !newProps.isRename && this._cellsManager) {
            this._cellsManager.disposeCells()
            // this.initializeModel(newProps.path)
            this.initializeModel()
        }

        if (newProps.style.width !== this.props.style.width && this._editor) {
            console.log("new width, ", this.props.style.width)
            this._editor.layout()
        }
    }

    save() {
        console.log("save called")
        if (!this._cellsManager) return;
        const serializedCells = this._cellsManager.serializeCells()
        const editorLines = this._model.getLinesContent()
        for (let i = 0; i < serializedCells.length; i++) {
            const {line, html} = serializedCells[i]
            if (html) {
                editorLines.splice(line + i, 0, html)
            }
        }
        console.log(editorLines)
        this.props.save(editorLines)
    }

    keyHandler(e: React.KeyboardEvent<HTMLDivElement>) {
        if(e.metaKey && e.key == 's') {
            this.save()
            e.preventDefault()
        }
    }

    render() {
        return <div style={{height: 700}} onKeyDown={this.keyHandler} ref={this.monacoRef}/>
    }
}
