/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as ws from "ws";
import * as http from "http";
import * as url from "url";
import * as net from "net";
import * as express from "express";
import { IConnection, TextDocuments, createConnection, TextDocumentSyncKind } from 'vscode-languageserver';
import * as rpc from "vscode-ws-jsonrpc";
import { StreamMessageReader, StreamMessageWriter } from 'vscode-jsonrpc';
import { MessageReader, MessageWriter } from "vscode-jsonrpc";

import * as server from "vscode-ws-jsonrpc/lib/server";

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

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

// launch(wss);


const pythonLS = new WebSocket('ws://localhost:4000/python');

// const cp = require('child_process');
// const n = cp.spawn(`python ${__dirname}/python-language-server.py`);

// n.on('message', (m) => {
//   console.log('PARENT got message:', m);
// })

// n.on('error', (err) => console.log(err));

// Causes the child to print: CHILD got message: { hello: 'world' }
// n.send({ hello: 'world' });

class LSRouter {
    protected readonly documents = new TextDocuments();
    

    constructor(
        connection: IConnection
    ) {
        this.documents.listen(connection);
        this.documents.onDidChangeContent(change => {
            console.log("==== change ====="),
            console.log(change)
        }
        );
        this.documents.onDidClose(event => {
            console.log("closing")
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
}


// // export function start(reader: MessageReader, writer: MessageWriter): JsonServer {

const launch = (socket) => {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const connection = createConnection(reader, writer);
    connection.listen()
    connection.onDidChangeTextDocument(() => console.log("change detected"))
    // const documents = new TextDocuments();
    // documents.listen(connection);
    // documents.onDidChangeContent(change => {
    //     console.log("==== change =====");
    //     console.log(change)
    // })
    // connection.listen()
}


wss.on('connection', function connection(ws) {
    console.log("new connection initialised")

    pythonLS.on('message', function(message) {
        // console.log("message from python ls")
        // console.log(message)
        if (ws.readyState === ws.OPEN) {
            ws.send(message)
        }
    })

    const socket: rpc.IWebSocket = {
        send: content => ws.send(content, error => {
            if (error) {
                throw error;
            }
        }),
        onMessage: cb => ws.on('message', cb),
        onError: cb => ws.on('error', cb),
        onClose: cb => ws.on('close', cb),
        dispose: () => ws.close()
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
        console.log(JSON.parse(message))
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
