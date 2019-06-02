/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var main_1 = require("vscode-languageserver-protocol/lib/main");
var vscode_jsonrpc_1 = require("vscode-jsonrpc");
exports.Disposable = vscode_jsonrpc_1.Disposable;
exports.CancellationToken = vscode_jsonrpc_1.CancellationToken;
exports.Event = vscode_jsonrpc_1.Event;
exports.Emitter = vscode_jsonrpc_1.Emitter;
__export(require("vscode-languageserver-protocol/lib/main"));
var Services;
(function (Services) {
    var global = window;
    var symbol = "Services"; //Symbol('Services');
    Services.get = function () {
        var services = global[symbol];
        if (!services) {
            throw new Error('Language Client services has not been installed');
        }
        return services;
    };
    function install(services) {
        console.log("install called");
        global["test2"] = "fdafadsfas";
        if (global[symbol]) {
            console.error(new Error('Language Client services has been overriden'));
        }
        global[symbol] = services;
    }
    Services.install = install;
})(Services = exports.Services || (exports.Services = {}));
function isDocumentSelector(selector) {
    if (!selector || !Array.isArray(selector)) {
        return false;
    }
    return selector.every(function (value) { return typeof value === 'string' || main_1.DocumentFilter.is(value); });
}
exports.isDocumentSelector = isDocumentSelector;
var DocumentIdentifier;
(function (DocumentIdentifier) {
    function is(arg) {
        return !!arg && ('uri' in arg) && ('languageId' in arg);
    }
    DocumentIdentifier.is = is;
})(DocumentIdentifier = exports.DocumentIdentifier || (exports.DocumentIdentifier = {}));
var ConfigurationTarget;
(function (ConfigurationTarget) {
    ConfigurationTarget[ConfigurationTarget["Global"] = 1] = "Global";
    ConfigurationTarget[ConfigurationTarget["Workspace"] = 2] = "Workspace";
    ConfigurationTarget[ConfigurationTarget["WorkspaceFolder"] = 3] = "WorkspaceFolder";
})(ConfigurationTarget = exports.ConfigurationTarget || (exports.ConfigurationTarget = {}));
