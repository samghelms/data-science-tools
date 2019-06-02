"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.__esModule = true;
var React = __importStar(require("react"));
// import { editor, languages } from 'monaco-editor';
var CellsManager_1 = __importDefault(require("./CellsManager"));
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
var startState = {
    language: 'markdown',
    newContentWidgets: true
};
var defaultOptions = {
    glyphMargin: true,
    wordWrap: 'on'
};
var languageDefinitions = {};
function _loadLanguage(languageId) {
    var loader = languageDefinitions[languageId].loader;
    return loader().then(function (mod) {
        monaco.languages.setMonarchTokensProvider(languageId, mod.language);
        monaco.languages.setLanguageConfiguration(languageId, mod.conf);
    });
}
var languagePromises = {};
function loadLanguage(languageId) {
    if (!languagePromises[languageId]) {
        languagePromises[languageId] = _loadLanguage(languageId);
    }
    return languagePromises[languageId];
}
exports.loadLanguage = loadLanguage;
function registerLanguage(def) {
    var languageId = def.id;
    languageDefinitions[languageId] = def;
    monaco.languages.register(def);
    monaco.languages.onLanguage(languageId, function () {
        loadLanguage(languageId);
    });
}
exports.registerLanguage = registerLanguage;
var Notebook = /** @class */ (function (_super) {
    __extends(Notebook, _super);
    function Notebook(props) {
        var _this = _super.call(this, props) || this;
        _this.monacoRef = React.createRef();
        _this.outputAreaRegex = /^<div [\sA-Za-z="-]*(jp-OutputArea)/;
        _this.height = 800; // TODO: stop hardcoding this
        console.log('creating notebook');
        // this.monacoRef = React.createRef();
        _this._editor = null;
        _this._cellsManager = null;
        _this._model = monaco.editor.createModel('', startState.language);
        // this.props.registerModel(this._model);
        _this.keyHandler = _this.keyHandler.bind(_this);
        _this.save = _this.save.bind(_this);
        return _this;
    }
    Notebook.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._editor = monaco.editor.create(this.monacoRef.current, defaultOptions);
                this._editor.setModel(this._model);
                if (this._cellsManager === null) {
                    this._cellsManager = new CellsManager_1["default"](this._model, this._editor, this.props.kernelManager);
                    Cells.installCellsManager(this._cellsManager);
                }
                this._model.onDidChangeContent(function (changeEvent) {
                    if (_this._cellsManager)
                        _this._cellsManager.updateCells(changeEvent);
                });
                this._editor.layout();
                return [2 /*return*/];
            });
        });
    };
    Notebook.prototype.getParseContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var content, contentSplit, editorContent, outputs, i, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.props.getContent()];
                    case 1:
                        content = _a.sent();
                        contentSplit = content.split('\n');
                        editorContent = [];
                        outputs = 0;
                        for (i = 0; i < contentSplit.length; i++) {
                            item = contentSplit[i];
                            console.log(item);
                            console.log(item.match(this.outputAreaRegex));
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
                        return [2 /*return*/, editorContent.join('\n')];
                }
            });
        });
    };
    // async initializeModel() {
    //     if (this.props.getContent) {
    //         const content = await this.getParseContent();
    //         this._model.pushEditOperations(
    //             [],
    //             [
    //               {
    //                 range: this._model.getFullModelRange(),
    //                 text: content
    //               },
    //             ],
    //             (inverseEditOperations) => []
    //         )
    //     }
    // }
    Notebook.prototype.componentWillReceiveProps = function (newProps) {
        // if (newProps.path !== null && this.props.path !== newProps.path && !newProps.isRename && this._cellsManager) {
        //     this._cellsManager.disposeCells()
        //     // this.initializeModel(newProps.path)
        //     this.initializeModel()
        // }
        if (newProps.style.width !== this.props.style.width && this._editor) {
            console.log("new width, ", this.props.style.width);
            this._editor.layout();
        }
    };
    Notebook.prototype.save = function () {
        console.log("save called");
        if (!this._cellsManager)
            return;
        var serializedCells = this._cellsManager.serializeCells();
        var editorLines = this._model.getLinesContent();
        for (var i = 0; i < serializedCells.length; i++) {
            var _a = serializedCells[i], line = _a.line, html = _a.html;
            if (html) {
                editorLines.splice(line + i, 0, html);
            }
        }
        console.log(editorLines);
        this.props.save(editorLines);
    };
    Notebook.prototype.keyHandler = function (e) {
        if (e.metaKey && e.key === 's') {
            this.save();
            e.preventDefault();
        }
        if (e.shiftKey && e.key === 'Enter') {
            console.log("enter hit");
            console.log(this._cellsManager);
            if (this._cellsManager) {
                this._cellsManager.executeCursorCell();
            }
            e.preventDefault();
        }
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (this._cellsManager) {
                this._cellsManager.executeCursorLine();
            }
            console.log("prevent default?");
        }
    };
    Notebook.prototype.render = function () {
        return React.createElement("div", { style: { height: 700 }, onKeyDown: this.keyHandler, ref: this.monacoRef });
    };
    return Notebook;
}(React.Component));
exports["default"] = Notebook;
