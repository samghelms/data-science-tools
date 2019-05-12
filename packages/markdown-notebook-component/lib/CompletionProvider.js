"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_ws_jsonrpc_1 = require("@sourcegraph/vscode-ws-jsonrpc");
const monaco_languageclient_1 = require("monaco-languageclient");
const connection_1 = require("./connection");
const MonacoLanguageClient_1 = require("./MonacoLanguageClient");
const normalizeUrl = require('normalize-url');
const ReconnectingWebSocket = require('reconnecting-websocket');
function createUrl() {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return normalizeUrl(`ws://localhost:3000/python`);
}
function createWebSocket(url) {
    const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false
    };
    return new ReconnectingWebSocket(url, undefined, socketOptions);
}
function createLanguageClient(connection, cellManager) {
    // connection.sendRequest()
    return new MonacoLanguageClient_1.MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['markdown'],
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(connection_1.createConnection(connection, errorHandler, closeHandler, cellManager));
            }
        }
    });
}
class CompletionProvider {
    constructor(editor, cellManager) {
        const url = createUrl();
        console.log(`connecting to ${url}`);
        const webSocket = createWebSocket(url);
        webSocket.onmessage = (msg) => {
            console.log("message");
            console.log(msg);
        };
        const this2 = this;
        webSocket.onerror = (msg) => {
            console.log("error");
            console.log(msg);
        };
        // // listen when the web socket is opened
        vscode_ws_jsonrpc_1.listen({
            webSocket,
            onConnection: connection => {
                console.log("listening");
                // this2.connection = connection;
                if (cellManager) {
                    monaco_languageclient_1.MonacoServices.install(editor);
                    this2.languageClient = createLanguageClient(connection, cellManager);
                    const disposable = this2.languageClient.start();
                    connection.onClose(() => disposable.dispose());
                }
            }
        });
    }
}
exports.default = CompletionProvider;
