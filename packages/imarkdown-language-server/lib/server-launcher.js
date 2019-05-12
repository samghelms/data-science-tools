"use strict";
exports.__esModule = true;
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var path = require("path");
var rpc = require("vscode-ws-jsonrpc");
var server = require("vscode-ws-jsonrpc/lib/server");
var lsp = require("vscode-languageserver");
function launch(socket) {
    console.log("server launched");
    var reader = new rpc.WebSocketMessageReader(socket);
    var writer = new rpc.WebSocketMessageWriter(socket);
    // start the language server as an external process
    var pythonServerPath = path.resolve(__dirname, 'python-language-server.py');
    var socketConnection = server.createConnection(reader, writer, function () { return console.log("created"); });
    var serverConnection = server.createServerProcess('python-ls', 'python', [pythonServerPath]);
    server.forward(socketConnection, serverConnection, function (message) {
        if (rpc.isRequestMessage(message)) {
            if (message.method === lsp.InitializeRequest.type.method) {
                var initializeParams = message.params;
                initializeParams.processId = process.pid;
            }
        }
        return message;
    });
}
exports.launch = launch;
