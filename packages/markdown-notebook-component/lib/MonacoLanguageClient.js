"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const client_1 = require("vscode-base-languageclient/lib/client");
const typeDefinition_1 = require("vscode-base-languageclient/lib/typeDefinition");
const implementation_1 = require("vscode-base-languageclient/lib/implementation");
const colorProvider_1 = require("vscode-base-languageclient/lib/colorProvider");
const workspaceFolders_1 = require("vscode-base-languageclient/lib/workspaceFolders");
const foldingRange_1 = require("vscode-base-languageclient/lib/foldingRange");
__export(require("vscode-base-languageclient/lib/client"));
class MonacoLanguageClient extends client_1.BaseLanguageClient {
    constructor({ id, name, clientOptions, connectionProvider }) {
        super(id || name.toLowerCase(), name, clientOptions);
        this.connectionProvider = connectionProvider;
        this.createConnection = this.doCreateConnection.bind(this);
        // bypass LSP <=> VS Code conversion
        const self = this;
        self._p2c = new Proxy(self._p2c, {
            get: (target, prop) => {
                if (prop === 'asUri') {
                    return target[prop];
                }
                return MonacoLanguageClient.bypassConversion;
            }
        });
        self._c2p = new Proxy(self._c2p, {
            get: (target, prop) => {
                if (prop === 'asUri') {
                    return target[prop];
                }
                if (prop === 'asCompletionParams') {
                    return (textDocument, position, context) => {
                        return {
                            textDocument: target.asTextDocumentIdentifier(textDocument),
                            position,
                            context
                        };
                    };
                }
                if (prop === 'asWillSaveTextDocumentParams') {
                    return (event) => {
                        return {
                            textDocument: target.asTextDocumentIdentifier(event.document),
                            reason: event.reason
                        };
                    };
                }
                if (prop.endsWith('Params')) {
                    return target[prop];
                }
                return MonacoLanguageClient.bypassConversion;
            }
        });
    }
    doCreateConnection() {
        const errorHandler = this.handleConnectionError.bind(this);
        const closeHandler = this.handleConnectionClosed.bind(this);
        return this.connectionProvider.get(errorHandler, closeHandler, this.outputChannel);
    }
    createMessageTransports(encoding) {
        throw new Error('Unsupported');
    }
    registerBuiltinFeatures() {
        super.registerBuiltinFeatures();
        this.registerFeature(new typeDefinition_1.TypeDefinitionFeature(this));
        this.registerFeature(new implementation_1.ImplementationFeature(this));
        this.registerFeature(new colorProvider_1.ColorProviderFeature(this));
        this.registerFeature(new workspaceFolders_1.WorkspaceFoldersFeature(this));
        const foldingRangeFeature = new foldingRange_1.FoldingRangeFeature(this);
        foldingRangeFeature['asFoldingRanges'] = MonacoLanguageClient.bypassConversion;
        this.registerFeature(foldingRangeFeature);
    }
}
MonacoLanguageClient.bypassConversion = (result) => result || undefined;
exports.MonacoLanguageClient = MonacoLanguageClient;
