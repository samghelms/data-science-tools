"use strict";
exports.__esModule = true;
var rpc = require("vscode-ws-jsonrpc");
var vscode_languageserver_1 = require("vscode-languageserver");
function start(reader, writer) {
    var connection = vscode_languageserver_1.createConnection(reader, writer);
    // const server = new JsonServer(connection);
    // server.start();
    // return server;
    var documents = new vscode_languageserver_1.TextDocuments();
    documents.listen(connection);
    documents.onDidChangeContent(function (change) {
        return console.log("content change");
    }
    // this.validate(change.document)
    );
    connection.listen();
}
exports.start = start;
function launch(socket) {
    var reader = new rpc.WebSocketMessageReader(socket);
    var writer = new rpc.WebSocketMessageWriter(socket);
    // const asExternalProccess = process.argv.findIndex(value => value === '--external') !== -1;
    // if (asExternalProccess)  {
    //     // start the language server as an external process
    //     const extJsonServerPath = path.resolve(__dirname, 'ext-json-server.js');
    //     const socketConnection = server.createConnection(reader, writer, () => socket.dispose());
    //     const serverConnection = server.createServerProcess('JSON', 'node', [extJsonServerPath]);
    //     server.forward(socketConnection, serverConnection, message => {
    //         if (rpc.isRequestMessage(message)) {
    //             if (message.method === lsp.InitializeRequest.type.method) {
    //                 const initializeParams = message.params as lsp.InitializeParams;
    //                 initializeParams.processId = process.pid;
    //             }
    //         }
    //         return message;
    //     });
    // } else {
    // start the language server inside the current process
    start(reader, writer);
    // }
}
exports.launch = launch;
