"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var vscode_json_languageservice_1 = require("vscode-json-languageservice");
var monaco_converter_1 = require("monaco-languageclient/lib/monaco-converter");
var LANGUAGE_ID = 'json';
var MODEL_URI = 'inmemory://model.json';
var MONACO_URI = monaco.Uri.parse(MODEL_URI);
// register the JSON language with Monaco
monaco.languages.register({
    id: LANGUAGE_ID,
    extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc'],
    aliases: ['JSON', 'json'],
    mimetypes: ['application/json'],
});
// create the Monaco editor
var value = "{\n    \"$schema\": \"http://json.schemastore.org/coffeelint\",\n    \"line_endings\": \"unix\"\n}";
monaco.editor.create(document.getElementById("container"), {
    model: monaco.editor.createModel(value, LANGUAGE_ID, MONACO_URI),
    glyphMargin: true,
    lightbulb: {
        enabled: true
    }
});
function getModel() {
    return monaco.editor.getModel(MONACO_URI);
}
function createDocument(model) {
    return vscode_json_languageservice_1.TextDocument.create(MODEL_URI, model.getModeId(), model.getVersionId(), model.getValue());
}
function resovleSchema(url) {
    var promise = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () { return resolve(xhr.responseText); };
        xhr.onerror = function () { return reject(xhr.statusText); };
        xhr.open("GET", url, true);
        xhr.send();
    });
    return promise;
}
var m2p = new monaco_converter_1.MonacoToProtocolConverter();
var p2m = new monaco_converter_1.ProtocolToMonacoConverter();
var jsonService = vscode_json_languageservice_1.getLanguageService({
    schemaRequestService: resovleSchema
});
var pendingValidationRequests = new Map();
monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
    provideCompletionItems: function (model, position, token) {
        var document = createDocument(model);
        var jsonDocument = jsonService.parseJSONDocument(document);
        return jsonService.doComplete(document, m2p.asPosition(position.lineNumber, position.column), jsonDocument).then(function (list) {
            return p2m.asCompletionResult(list);
        });
    },
    resolveCompletionItem: function (item, token) {
        return jsonService.doResolve(m2p.asCompletionItem(item)).then(function (result) { return p2m.asCompletionItem(result); });
    }
});
monaco.languages.registerDocumentRangeFormattingEditProvider(LANGUAGE_ID, {
    provideDocumentRangeFormattingEdits: function (model, range, options, token) {
        var document = createDocument(model);
        var edits = jsonService.format(document, m2p.asRange(range), m2p.asFormattingOptions(options));
        return p2m.asTextEdits(edits);
    }
});
monaco.languages.registerDocumentSymbolProvider(LANGUAGE_ID, {
    provideDocumentSymbols: function (model, token) {
        var document = createDocument(model);
        var jsonDocument = jsonService.parseJSONDocument(document);
        return p2m.asSymbolInformations(jsonService.findDocumentSymbols(document, jsonDocument));
    }
});
monaco.languages.registerHoverProvider(LANGUAGE_ID, {
    provideHover: function (model, position, token) {
        var document = createDocument(model);
        var jsonDocument = jsonService.parseJSONDocument(document);
        return jsonService.doHover(document, m2p.asPosition(position.lineNumber, position.column), jsonDocument).then(function (hover) {
            return p2m.asHover(hover);
        });
    }
});
getModel().onDidChangeContent(function (event) {
    validate();
});
function validate() {
    var document = createDocument(getModel());
    cleanPendingValidation(document);
    pendingValidationRequests.set(document.uri, setTimeout(function () {
        pendingValidationRequests.delete(document.uri);
        doValidate(document);
    }));
}
function cleanPendingValidation(document) {
    var request = pendingValidationRequests.get(document.uri);
    if (request !== undefined) {
        clearTimeout(request);
        pendingValidationRequests.delete(document.uri);
    }
}
function doValidate(document) {
    if (document.getText().length === 0) {
        cleanDiagnostics();
        return;
    }
    var jsonDocument = jsonService.parseJSONDocument(document);
    jsonService.doValidation(document, jsonDocument).then(function (diagnostics) {
        var markers = p2m.asDiagnostics(diagnostics);
        monaco.editor.setModelMarkers(getModel(), 'default', markers);
    });
}
function cleanDiagnostics() {
    monaco.editor.setModelMarkers(monaco.editor.getModel(MONACO_URI), 'default', []);
}
//# sourceMappingURL=client.js.map