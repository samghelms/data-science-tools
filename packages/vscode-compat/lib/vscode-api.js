"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_uri_1 = require("vscode-uri");
var disposable_1 = require("monaco-languageclient/lib/disposable");
var services_1 = require("monaco-languageclient/lib/services");
function createVSCodeApi(servicesProvider, getCellsManager) {
    var _this = this;
    var unsupported = function () { throw new Error('unsupported'); };
    var Uri = vscode_uri_1.default;
    var providers = {};
    var CompletionItem = /** @class */ (function () {
        function CompletionItem(label, kind) {
            this.label = label;
            this.kind = kind;
        }
        return CompletionItem;
    }());
    var CodeLens = /** @class */ (function () {
        function CodeLens(range, command) {
            this.range = range;
            this.command = command;
        }
        Object.defineProperty(CodeLens.prototype, "isResolved", {
            get: function () {
                return !!this.command;
            },
            enumerable: true,
            configurable: true
        });
        return CodeLens;
    }());
    var DocumentLink = /** @class */ (function () {
        function DocumentLink(range, target) {
            this.range = range;
            this.target = target;
        }
        return DocumentLink;
    }());
    var CodeActionKind = /** @class */ (function () {
        function CodeActionKind(value) {
            this.value = value;
            this.append = unsupported;
            this.contains = unsupported;
        }
        CodeActionKind.Empty = new CodeActionKind();
        CodeActionKind.QuickFix = new CodeActionKind('quickfix');
        CodeActionKind.Refactor = new CodeActionKind('refactor');
        CodeActionKind.RefactorExtract = new CodeActionKind('refactor.extract');
        CodeActionKind.RefactorInline = new CodeActionKind('refactor.inline');
        CodeActionKind.RefactorRewrite = new CodeActionKind('refactor.rewrite');
        CodeActionKind.Source = new CodeActionKind('source');
        CodeActionKind.SourceOrganizeImports = new CodeActionKind('source.organizeImports');
        return CodeActionKind;
    }());
    var workspace = {
        createFileSystemWatcher: function (globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents) {
            var services = servicesProvider();
            if (typeof globPattern !== 'string') {
                throw new Error('unsupported');
            }
            if (services.workspace.createFileSystemWatcher) {
                var watcher = services.workspace.createFileSystemWatcher(globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents);
                return __assign({}, watcher, { ignoreCreateEvents: !!ignoreCreateEvents, ignoreChangeEvents: !!ignoreChangeEvents, ignoreDeleteEvents: !!ignoreDeleteEvents });
            }
            return {
                ignoreCreateEvents: !!ignoreCreateEvents,
                ignoreChangeEvents: !!ignoreChangeEvents,
                ignoreDeleteEvents: !!ignoreDeleteEvents,
                onDidCreate: services_1.Event.None,
                onDidChange: services_1.Event.None,
                onDidDelete: services_1.Event.None,
                dispose: function () { }
            };
        },
        applyEdit: function (edit) { return __awaiter(_this, void 0, void 0, function () {
            var services;
            return __generator(this, function (_a) {
                services = servicesProvider();
                if (services_1.WorkspaceEdit.is(edit)) {
                    return [2 /*return*/, services.workspace.applyEdit(edit)];
                }
                throw new Error('unsupported');
            });
        }); },
        getConfiguration: function (section, resource) {
            var workspace = servicesProvider().workspace;
            var configuration = workspace.configurations ?
                workspace.configurations.getConfiguration(section, resource ? resource.toString() : undefined) :
                undefined;
            var result = {
                get: function (section, defaultValue) {
                    return configuration ? configuration.get(section, defaultValue) : defaultValue;
                },
                has: function (section) {
                    return configuration ? configuration.has(section) : false;
                },
                inspect: unsupported,
                update: unsupported
            };
            return __assign({}, result, { toJSON: function () { return configuration ? configuration.toJSON() : undefined; } });
        },
        get onDidChangeConfiguration() {
            var services = servicesProvider();
            if (services.workspace.configurations) {
                return services.workspace.configurations.onDidChangeConfiguration;
            }
            return services_1.Event.None;
        },
        get workspaceFolders() {
            var services = servicesProvider();
            var rootUri = services.workspace.rootUri;
            if (!rootUri) {
                return undefined;
            }
            var uri = Uri.parse(rootUri);
            return [{
                    uri: uri,
                    index: 0,
                    name: uri.toString()
                }];
        },
        get textDocuments() {
            var services = servicesProvider();
            return services.workspace.textDocuments;
        },
        get onDidOpenTextDocument() {
            var services = servicesProvider();
            return services.workspace.onDidOpenTextDocument;
        },
        get onDidCloseTextDocument() {
            var services = servicesProvider();
            return services.workspace.onDidCloseTextDocument;
        },
        get onDidChangeTextDocument() {
            var services = servicesProvider();
            return function (listener, thisArgs, disposables) {
                return services.workspace.onDidChangeTextDocument(function (_a) {
                    var textDocument = _a.textDocument, contentChanges = _a.contentChanges;
                    var l = listener.bind(thisArgs);
                    l({
                        document: textDocument,
                        contentChanges: contentChanges
                    });
                }, undefined, disposables);
            };
        },
        get onWillSaveTextDocument() {
            var services = servicesProvider();
            var onWillSaveTextDocument = services.workspace.onWillSaveTextDocument;
            if (!onWillSaveTextDocument) {
                return services_1.Event.None;
            }
            return function (listener, thisArgs, disposables) {
                return onWillSaveTextDocument(function (_a) {
                    var textDocument = _a.textDocument, reason = _a.reason, waitUntil = _a.waitUntil;
                    var l = listener.bind(thisArgs);
                    l({
                        document: textDocument,
                        reason: reason,
                        waitUntil: function (edits) {
                            if (waitUntil) {
                                waitUntil(edits);
                            }
                        }
                    });
                }, undefined, disposables);
            };
        },
        get onDidSaveTextDocument() {
            var services = servicesProvider();
            return services.workspace.onDidSaveTextDocument || services_1.Event.None;
        },
        onDidChangeWorkspaceFolders: services_1.Event.None,
        getWorkspaceFolder: unsupported,
        asRelativePath: unsupported,
        updateWorkspaceFolders: unsupported,
        findFiles: unsupported,
        saveAll: unsupported,
        openTextDocument: unsupported,
        registerTextDocumentContentProvider: unsupported,
        registerTaskProvider: unsupported,
        registerFileSystemProvider: unsupported,
        rootPath: undefined,
        name: undefined
    };
    var languages = {
        match: function (selector, document) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            if (!services_1.DocumentIdentifier.is(document)) {
                throw new Error('unexpected document: ' + JSON.stringify(document));
            }
            var services = servicesProvider();
            var result = services.languages.match(selector, document);
            return result ? 1 : 0;
        },
        createDiagnosticCollection: function (name) {
            var services = servicesProvider();
            var collection = services.languages.createDiagnosticCollection ?
                services.languages.createDiagnosticCollection(name) : undefined;
            return {
                name: name || 'default',
                set: function (arg0, arg1) {
                    if (collection) {
                        if (arg1) {
                            collection.set(arg0.toString(), arg1);
                        }
                        else {
                            collection.set(arg0.toString(), []);
                        }
                    }
                },
                dispose: function () {
                    if (collection) {
                        collection.dispose();
                    }
                },
                delete: unsupported,
                clear: unsupported,
                forEach: unsupported,
                get: unsupported,
                has: unsupported
            };
        },
        registerCompletionItemProvider: function (selector, provider) {
            var triggerCharacters = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                triggerCharacters[_i - 2] = arguments[_i];
            }
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerCompletionItemProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            console.log("registering");
            console.log(provider);
            console.log(selector);
            var cm = getCellsManager();
            cm.setLanguageServerProvider(provider, selector);
            var resolveCompletionItem = provider.resolveCompletionItem;
            var _selector = ["markdown"];
            return languages.registerCompletionItemProvider.apply(languages, [_selector, {
                    provideCompletionItems: function (_a, token) {
                        var textDocument = _a.textDocument, position = _a.position, context = _a.context;
                        return __awaiter(this, void 0, void 0, function () {
                            var cm, cell, cellProvider;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        cm = getCellsManager();
                                        return [4 /*yield*/, cm.inCellValue(position.line)];
                                    case 1:
                                        cell = _b.sent();
                                        cellProvider = cell ? cell.getLanguageServerProvider() : null;
                                        // console.log('providing completion')
                                        if (cell && cellProvider) {
                                            return [2 /*return*/, cellProvider.provideCompletionItems(textDocument, position, token, context || {
                                                    triggerKind: services_1.CompletionTriggerKind.Invoked
                                                })];
                                        }
                                        return [2 /*return*/, null];
                                }
                            });
                        });
                    },
                    resolveCompletionItem: resolveCompletionItem ? function (item, token) {
                        return resolveCompletionItem(item, token);
                    } : undefined
                }].concat(triggerCharacters));
        },
        registerCodeActionsProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerCodeActionsProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerCodeActionsProvider(selector, {
                provideCodeActions: function (_a, token) {
                    var textDocument = _a.textDocument, range = _a.range, context = _a.context;
                    return provider.provideCodeActions(textDocument, range, context, token);
                }
            });
        },
        registerCodeLensProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerCodeLensProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            var resolveCodeLens = provider.resolveCodeLens;
            return languages.registerCodeLensProvider(selector, {
                provideCodeLenses: function (_a, token) {
                    var textDocument = _a.textDocument;
                    return provider.provideCodeLenses(textDocument, token);
                },
                resolveCodeLens: resolveCodeLens ? function (codeLens, token) {
                    return resolveCodeLens(codeLens, token);
                } : undefined
            });
        },
        registerDefinitionProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerDefinitionProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerDefinitionProvider(selector, {
                provideDefinition: function (_a, token) {
                    var textDocument = _a.textDocument, position = _a.position;
                    return provider.provideDefinition(textDocument, position, token);
                }
            });
        },
        registerImplementationProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerImplementationProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerImplementationProvider(selector, {
                provideImplementation: function (_a, token) {
                    var textDocument = _a.textDocument, position = _a.position;
                    return provider.provideImplementation(textDocument, position, token);
                }
            });
        },
        registerTypeDefinitionProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerTypeDefinitionProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerTypeDefinitionProvider(selector, {
                provideTypeDefinition: function (_a, token) {
                    var textDocument = _a.textDocument, position = _a.position;
                    return provider.provideTypeDefinition(textDocument, position, token);
                }
            });
        },
        registerHoverProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (languages.registerHoverProvider) {
                return languages.registerHoverProvider(selector, {
                    provideHover: function (_a, token) {
                        var textDocument = _a.textDocument, position = _a.position;
                        return provider.provideHover(textDocument, position, token);
                    }
                });
            }
            return disposable_1.Disposable.create(function () { });
        },
        registerDocumentHighlightProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerDocumentHighlightProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerDocumentHighlightProvider(selector, {
                provideDocumentHighlights: function (_a, token) {
                    var textDocument = _a.textDocument, position = _a.position;
                    return provider.provideDocumentHighlights(textDocument, position, token);
                }
            });
        },
        registerDocumentSymbolProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerDocumentSymbolProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerDocumentSymbolProvider(selector, {
                provideDocumentSymbols: function (_a, token) {
                    var textDocument = _a.textDocument;
                    return provider.provideDocumentSymbols(textDocument, token);
                }
            });
        },
        registerWorkspaceSymbolProvider: function (provider) {
            var languages = servicesProvider().languages;
            if (!languages.registerWorkspaceSymbolProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerWorkspaceSymbolProvider({
                provideWorkspaceSymbols: function (_a, token) {
                    var query = _a.query;
                    return provider.provideWorkspaceSymbols(query, token);
                }
            });
        },
        registerReferenceProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerReferenceProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerReferenceProvider(selector, {
                provideReferences: function (_a, token) {
                    var textDocument = _a.textDocument, position = _a.position, context = _a.context;
                    return provider.provideReferences(textDocument, position, context, token);
                }
            });
        },
        registerRenameProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerRenameProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerRenameProvider(selector, {
                provideRenameEdits: function (_a, token) {
                    var textDocument = _a.textDocument, position = _a.position, newName = _a.newName;
                    return provider.provideRenameEdits(textDocument, position, newName, token);
                }
            });
        },
        registerDocumentFormattingEditProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerDocumentFormattingEditProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerDocumentFormattingEditProvider(selector, {
                provideDocumentFormattingEdits: function (_a, token) {
                    var textDocument = _a.textDocument, options = _a.options;
                    return provider.provideDocumentFormattingEdits(textDocument, options, token);
                }
            });
        },
        registerDocumentRangeFormattingEditProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerDocumentRangeFormattingEditProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerDocumentRangeFormattingEditProvider(selector, {
                provideDocumentRangeFormattingEdits: function (_a, token) {
                    var textDocument = _a.textDocument, range = _a.range, options = _a.options;
                    return provider.provideDocumentRangeFormattingEdits(textDocument, range, options, token);
                }
            });
        },
        registerOnTypeFormattingEditProvider: function (selector, provider, firstTriggerCharacter) {
            var moreTriggerCharacter = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                moreTriggerCharacter[_i - 3] = arguments[_i];
            }
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerOnTypeFormattingEditProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerOnTypeFormattingEditProvider.apply(languages, [selector, {
                    provideOnTypeFormattingEdits: function (_a, token) {
                        var textDocument = _a.textDocument, position = _a.position, ch = _a.ch, options = _a.options;
                        return provider.provideOnTypeFormattingEdits(textDocument, position, ch, options, token);
                    }
                }, firstTriggerCharacter].concat(moreTriggerCharacter));
        },
        registerSignatureHelpProvider: function (selector, provider) {
            var triggerCharacter = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                triggerCharacter[_i - 2] = arguments[_i];
            }
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerSignatureHelpProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerSignatureHelpProvider.apply(languages, [selector, {
                    provideSignatureHelp: function (_a, token) {
                        var textDocument = _a.textDocument, position = _a.position;
                        return provider.provideSignatureHelp(textDocument, position, token);
                    }
                }].concat(triggerCharacter));
        },
        registerDocumentLinkProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerDocumentLinkProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            var resolveDocumentLink = provider.resolveDocumentLink;
            return languages.registerDocumentLinkProvider(selector, {
                provideDocumentLinks: function (_a, token) {
                    var textDocument = _a.textDocument;
                    return provider.provideDocumentLinks(textDocument, token);
                },
                resolveDocumentLink: resolveDocumentLink ? function (link, token) {
                    return resolveDocumentLink(link, token);
                } : undefined
            });
        },
        registerColorProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerColorProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerColorProvider(selector, {
                provideDocumentColors: function (_a, token) {
                    var textDocument = _a.textDocument;
                    return provider.provideDocumentColors(textDocument, token);
                },
                provideColorPresentations: function (_a, token) {
                    var textDocument = _a.textDocument, color = _a.color, range = _a.range;
                    return provider.provideColorPresentations(color, {
                        document: textDocument,
                        range: range
                    }, token);
                }
            });
        },
        registerFoldingRangeProvider: function (selector, provider) {
            if (!services_1.isDocumentSelector(selector)) {
                throw new Error('unexpected selector: ' + JSON.stringify(selector));
            }
            var languages = servicesProvider().languages;
            if (!languages.registerFoldingRangeProvider) {
                return disposable_1.Disposable.create(function () { });
            }
            return languages.registerFoldingRangeProvider(selector, {
                provideFoldingRanges: function (_a, token) {
                    var textDocument = _a.textDocument;
                    return provider.provideFoldingRanges(textDocument, {}, token);
                }
            });
        },
        getLanguages: unsupported,
        getDiagnostics: unsupported,
        setLanguageConfiguration: unsupported,
        onDidChangeDiagnostics: unsupported
    };
    function showMessage(type, arg0, arg1) {
        if (typeof arg0 !== "string") {
            throw new Error('unexpected message: ' + JSON.stringify(arg0));
        }
        var message = arg0;
        if (arg1 !== undefined && !Array.isArray(arg1)) {
            throw new Error('unexpected actions: ' + JSON.stringify(arg1));
        }
        var actions = arg1 || [];
        var window = servicesProvider().window;
        if (!window) {
            return Promise.resolve(undefined);
        }
        return window.showMessage.apply(window, [type, message].concat(actions));
    }
    var window = {
        showInformationMessage: showMessage.bind(undefined, services_1.MessageType.Info),
        showWarningMessage: showMessage.bind(undefined, services_1.MessageType.Warning),
        showErrorMessage: showMessage.bind(undefined, services_1.MessageType.Error),
        createOutputChannel: function (name) {
            var window = servicesProvider().window;
            var createOutputChannel = window ? window.createOutputChannel : undefined;
            var channel = createOutputChannel ? createOutputChannel.bind(window)(name) : undefined;
            return {
                name: name,
                append: channel.append.bind(channel),
                appendLine: channel.appendLine.bind(channel),
                clear: unsupported,
                show: channel.show.bind(channel),
                hide: unsupported,
                dispose: channel.dispose.bind(channel)
            };
        },
        showTextDocument: unsupported,
        createTextEditorDecorationType: unsupported,
        showQuickPick: unsupported,
        showWorkspaceFolderPick: unsupported,
        showOpenDialog: unsupported,
        showSaveDialog: unsupported,
        showInputBox: unsupported,
        createWebviewPanel: unsupported,
        setStatusBarMessage: unsupported,
        withScmProgress: unsupported,
        withProgress: unsupported,
        createStatusBarItem: unsupported,
        createTerminal: unsupported,
        registerTreeDataProvider: unsupported,
        createTreeView: unsupported,
        registerWebviewPanelSerializer: unsupported,
        get activeTextEditor() {
            return unsupported();
        },
        get visibleTextEditors() {
            return unsupported();
        },
        onDidChangeActiveTextEditor: unsupported,
        onDidChangeVisibleTextEditors: unsupported,
        onDidChangeTextEditorSelection: unsupported,
        onDidChangeTextEditorVisibleRanges: unsupported,
        onDidChangeTextEditorOptions: unsupported,
        onDidChangeTextEditorViewColumn: unsupported,
        onDidCloseTerminal: unsupported,
        get state() {
            return unsupported();
        },
        onDidChangeWindowState: unsupported
    };
    var commands = {
        registerCommand: function (command, callback, thisArg) {
            var commands = servicesProvider().commands;
            if (!commands) {
                return disposable_1.Disposable.create(function () { });
            }
            return commands.registerCommand(command, callback, thisArg);
        },
        registerTextEditorCommand: unsupported,
        executeCommand: unsupported,
        getCommands: unsupported
    };
    var CodeDisposable = /** @class */ (function () {
        function CodeDisposable(callOnDispose) {
            this.callOnDispose = callOnDispose;
        }
        CodeDisposable.prototype.dispose = function () {
            this.callOnDispose();
        };
        return CodeDisposable;
    }());
    return {
        workspace: workspace,
        languages: languages,
        window: window,
        commands: commands,
        Uri: Uri,
        CompletionItem: CompletionItem,
        CodeLens: CodeLens,
        DocumentLink: DocumentLink,
        CodeActionKind: CodeActionKind,
        Disposable: CodeDisposable
    };
}
exports.createVSCodeApi = createVSCodeApi;
//# sourceMappingURL=vscode-api.js.map