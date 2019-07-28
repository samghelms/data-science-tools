"use strict";
exports.__esModule = true;
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var vscode_ws_jsonrpc_1 = require("@sourcegraph/vscode-ws-jsonrpc");
var monaco_languageclient_1 = require("monaco-languageclient");
var connection_1 = require("./connection");
// const normalizeUrl = require('normalize-url');
var ReconnectingWebSocket = require('reconnecting-websocket');
function createUrl() {
    var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return "ws://" + location.host + "/imarkdown/language-server";
}
function createWebSocket(url) {
    var socketOptions = {
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
    return new monaco_languageclient_1.MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['markdown']
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: function (errorHandler, closeHandler) {
                console.log("get called");
                return Promise.resolve(connection_1.createConnection(connection, errorHandler, closeHandler, cellManager));
            }
        }
    });
}
var CompletionProvider = /** @class */ (function () {
    function CompletionProvider(_editor, cellManager) {
        var url = createUrl();
        console.log("connecting to " + url);
        var webSocket = createWebSocket(url);
        webSocket.onmessage = function (msg) {
            console.log("message");
            console.log(msg);
        };
        var this2 = this;
        webSocket.onerror = function (msg) {
            console.log("error");
            console.log(msg);
        };
        // // listen when the web socket is opened
        vscode_ws_jsonrpc_1.listen({
            webSocket: webSocket,
            onConnection: function (connection) {
                console.log("listening");
                // this2.connection = connection;
                if (cellManager) {
                    console.log("installing");
                    console.log(_editor);
                    monaco_languageclient_1.MonacoServices.install(_editor);
                    console.log(monaco_languageclient_1.MonacoServices.get());
                    console.log("services get");
                    // console.log(Services.get())
                    // Services.install(MonacoServices.get())
                    var glbl = window;
                    // glbl[Symbol("test")] = "testdfdsaf"
                    // (<any>window)['test'] = 'testdfasdf'
                    // console.log(global[Symbol("Services")])
                    this2.languageClient = createLanguageClient(connection, cellManager);
                    var disposable_1 = this2.languageClient.start();
                    connection.onClose(function () { return disposable_1.dispose(); });
                }
            }
        });
    }
    return CompletionProvider;
}());
exports["default"] = CompletionProvider;
