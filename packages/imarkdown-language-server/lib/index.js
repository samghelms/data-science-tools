"use strict";
exports.__esModule = true;
var vscode_languageserver_1 = require("vscode-languageserver");
var rpc = require("vscode-ws-jsonrpc");
// process.on('uncaughtException', function (err: any) {
//     console.error('Uncaught Exception: ', err.toString());
//     if (err.stack) {
//         console.error(err.stack);
//     }
// });
// // create the express application
// const app = express();
// console.log("launched app")
// // server the static content, i.e. index.html
// app.use(express.static(__dirname));
// // start the server
// const server = app.listen(3000);
// // create the web socket
// const wss = new ws.Server({
//     noServer: true,
//     perMessageDeflate: false
// });
// server.on('upgrade', (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
//     const pathname = request.url ? url.parse(request.url).pathname : undefined;
//     if (pathname === '/imarkdown') {
//         wss.handleUpgrade(request, socket, head, webSocket => {
//             const socket: rpc.IWebSocket = {
//                 send: content => webSocket.send(content, error => {
//                     if (error) {
//                         throw error;
//                     }
//                 }),
//                 onMessage: cb => webSocket.on('message', cb),
//                 onError: cb => webSocket.on('error', cb),
//                 onClose: cb => webSocket.on('close', cb),
//                 dispose: () => webSocket.close()
//             };
//             // launch the server when the web socket is opened
//             if (webSocket.readyState === webSocket.OPEN) {
//                 launch(socket);
//             } else {
//                 webSocket.on('open', () => launch(socket));
//             }
//         });
//     }
// })
// const WebSocket = require('ws');
// Create WebSocket connection.
// const socket = new WebSocket('ws://localhost:3000');
// const socket = new WebSocket('ws://localhost');
// Connection opened
// socket.addEventListener('open', function (event) {
//     // socket.send('Hello Server!');
//     // launch(socket);
// });
// // Listen for messages
// socket.addEventListener('message', function (event) {
//     // console.log('Message from server ', event.data);
// });
var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 3000 });
// launch(wss);
var pythonLS = new WebSocket('ws://localhost:4000/python');
// const cp = require('child_process');
// const n = cp.spawn(`python ${__dirname}/python-language-server.py`);
// n.on('message', (m) => {
//   console.log('PARENT got message:', m);
// })
// n.on('error', (err) => console.log(err));
// Causes the child to print: CHILD got message: { hello: 'world' }
// n.send({ hello: 'world' });
var LSRouter = /** @class */ (function () {
    function LSRouter(connection) {
        this.documents = new vscode_languageserver_1.TextDocuments();
        this.documents.listen(connection);
        this.documents.onDidChangeContent(function (change) {
            console.log("==== change ====="),
                console.log(change);
        });
        this.documents.onDidClose(function (event) {
            console.log("closing");
            // this.cleanPendingValidation(event.document);
            // this.cleanDiagnostics(event.document);
        });
        // this.connection.onInitialize(params => {
        //     console.log("initialized")
        //     const x = params;
        // })
        // this.documents.onDidClose(event => {
        //     this.cleanPendingValidation(event.document);
        //     this.cleanDiagnostics(event.document);
        // });
    }
    return LSRouter;
}());
// // export function start(reader: MessageReader, writer: MessageWriter): JsonServer {
var launch = function (socket) {
    var reader = new rpc.WebSocketMessageReader(socket);
    var writer = new rpc.WebSocketMessageWriter(socket);
    var connection = vscode_languageserver_1.createConnection(reader, writer);
    connection.listen();
    connection.onDidChangeTextDocument(function () { return console.log("change detected"); });
    // const documents = new TextDocuments();
    // documents.listen(connection);
    // documents.onDidChangeContent(change => {
    //     console.log("==== change =====");
    //     console.log(change)
    // })
    // connection.listen()
};
wss.on('connection', function connection(ws) {
    console.log("new connection initialised");
    pythonLS.on('message', function (message) {
        // console.log("message from python ls")
        // console.log(message)
        if (ws.readyState === ws.OPEN) {
            ws.send(message);
        }
    });
    var socket = {
        send: function (content) { return ws.send(content, function (error) {
            if (error) {
                throw error;
            }
        }); },
        onMessage: function (cb) { return ws.on('message', cb); },
        onError: function (cb) { return ws.on('error', cb); },
        onClose: function (cb) { return ws.on('close', cb); },
        dispose: function () { return ws.close(); }
    };
    // const reader = new rpc.WebSocketMessageReader(socket);
    // const writer = new rpc.WebSocketMessageWriter(socket);
    // const connection = createConnection(reader, writer);
    // const documents = new TextDocuments();
    // documents.listen(connection);
    // documents.onDidChangeContent(change => {
    //         // console.log(change);
    //         // change
    //         console.log(documents.get(change.document.uri).getText())
    //         console.log(change.document.getText())
    //         console.log(change.document)
    //     }
    // );
    // connection.onInitialize(params => {
    //     // if (params.rootPath) {
    //     //     this.workspaceRoot = Uri.file(params.rootPath);
    //     // } else if (params.rootUri) {
    //     //     this.workspaceRoot = Uri.parse(params.rootUri);
    //     // }
    //     this.connection.console.log("The server is initialized.");
    //     return {
    //         capabilities: {
    //             // textDocumentSync: documents.syncKind
    //         }
    //     }
    // });
    // connection.listen()
    // connection.onDidChangeTextDocument((params) => console.log("change detected"))
    // // launch(socket)
    // if (ws.readyState === ws.OPEN) {
    //     launch(socket);
    // } else {
    //     ws.on('open', () => launch(socket));
    // }
    ws.on('message', function incoming(message) {
        console.log(JSON.parse(message));
        pythonLS.send(message);
    });
});
// wss.on('message', function(message) {
//     console.log("message")
// })
// if (wss.readyState === wss.OPEN) {
//     launch(socket);
// }
// wss.on('open', function (event) {
//     launch(socket)
// })
