/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as path from 'path';
import * as rpc from "vscode-ws-jsonrpc";
import * as server from "vscode-ws-jsonrpc/lib/server";
import * as lsp from "vscode-languageserver";

export function launch(socket: rpc.IWebSocket) {
    console.log("server launched");
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    // start the language server as an external process
    const pythonServerPath = path.resolve(__dirname, 'python-language-server.py');
    const socketConnection = server.createConnection(reader, writer, () => console.log("created"));
    const serverConnection = server.createServerProcess('python-ls', 'python', [pythonServerPath]);
    // serverConnection.forward()
    server.forward(socketConnection, serverConnection, message => {
        if (rpc.isRequestMessage(message)) {
            if (message.method === lsp.InitializeRequest.type.method) {
                const initializeParams = message.params as lsp.InitializeParams;
                initializeParams.processId = process.pid;
            }
        }
        return message;
    });
    
}