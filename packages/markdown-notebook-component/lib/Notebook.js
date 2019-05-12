"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const monaco_editor_1 = require("monaco-editor");
const CellsManager_1 = __importDefault(require("./CellsManager"));
var Cells;
(function (Cells) {
    const global = window;
    const symbol = Symbol('Cells');
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
const startState = {
    language: 'markdown',
    newContentWidgets: true,
};
const defaultOptions = {
    glyphMargin: true,
    wordWrap: 'on'
};
let languageDefinitions = {};
function _loadLanguage(languageId) {
    const loader = languageDefinitions[languageId].loader;
    return loader().then((mod) => {
        monaco_editor_1.languages.setMonarchTokensProvider(languageId, mod.language);
        monaco_editor_1.languages.setLanguageConfiguration(languageId, mod.conf);
    });
}
let languagePromises = {};
function loadLanguage(languageId) {
    if (!languagePromises[languageId]) {
        languagePromises[languageId] = _loadLanguage(languageId);
    }
    return languagePromises[languageId];
}
exports.loadLanguage = loadLanguage;
function registerLanguage(def) {
    let languageId = def.id;
    languageDefinitions[languageId] = def;
    monaco_editor_1.languages.register(def);
    monaco_editor_1.languages.onLanguage(languageId, () => {
        loadLanguage(languageId);
    });
}
exports.registerLanguage = registerLanguage;
class Notebook extends React.Component {
    constructor(props) {
        super(props);
        this.monacoRef = React.createRef();
        this.outputAreaRegex = /^<div [\sA-Za-z="-]*(jp-OutputArea-output)/;
        this.height = 800; // TODO: stop hardcoding this
        console.log('creating notebook');
        // this.monacoRef = React.createRef();
        this._editor = null;
        this._cellsManager = null;
        this._model = monaco_editor_1.editor.createModel('', startState.language);
        this.props.registerModel(this._model);
        this.keyHandler = this.keyHandler.bind(this);
        this.save = this.save.bind(this);
    }
    async componentDidMount() {
        this._editor = monaco_editor_1.editor.create(this.monacoRef.current, defaultOptions);
        this._editor.setModel(this._model);
        if (this._cellsManager === null) {
            console.log(" ===== creating new cells manager ====");
            this._cellsManager = new CellsManager_1.default(this._model, this._editor, this.props.kernelManager);
            Cells.installCellsManager(this._cellsManager);
        }
        this._model.onDidChangeContent((changeEvent) => {
            if (this._cellsManager)
                this._cellsManager.updateCells(changeEvent);
        });
        this._editor.layout();
        if (this.props.path) {
            this.initializeModel();
        }
    }
    async getParseContent() {
        const content = await this.props.getContent();
        const contentSplit = content.split('\n'); // TODO: add better newline handling
        const editorContent = [];
        let outputs = 0;
        for (let i = 0; i < contentSplit.length; i++) {
            const item = contentSplit[i];
            if (item.match(this.outputAreaRegex) && this._cellsManager) {
                console.log("match!");
                console.log(item);
                // outputs.push({widgetContent: item, line: i - outputs.length})
                this._cellsManager.addSerializedOutput(item, i - outputs);
                outputs += 1;
            }
            else {
                editorContent.push(item);
            }
        }
        return editorContent.join('\n');
    }
    async initializeModel() {
        if (this.props.getContent) {
            const content = await this.getParseContent();
            this._model.pushEditOperations([], [
                {
                    range: this._model.getFullModelRange(),
                    text: content
                },
            ], (inverseEditOperations) => []);
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.path !== null && this.props.path !== newProps.path && !newProps.isRename && this._cellsManager) {
            this._cellsManager.disposeCells();
            // this.initializeModel(newProps.path)
            this.initializeModel();
        }
        if (newProps.style.width !== this.props.style.width && this._editor) {
            console.log("new width, ", this.props.style.width);
            this._editor.layout();
        }
    }
    save() {
        console.log("save called");
        if (!this._cellsManager)
            return;
        const serializedCells = this._cellsManager.serializeCells();
        const editorLines = this._model.getLinesContent();
        for (let i = 0; i < serializedCells.length; i++) {
            const { line, html } = serializedCells[i];
            if (html) {
                editorLines.splice(line + i, 0, html);
            }
        }
        console.log(editorLines);
        this.props.save(editorLines);
    }
    keyHandler(e) {
        if (e.metaKey && e.key == 's') {
            this.save();
            e.preventDefault();
        }
    }
    render() {
        return React.createElement("div", { style: { height: 700 }, onKeyDown: this.keyHandler, ref: this.monacoRef });
    }
}
exports.default = Notebook;
