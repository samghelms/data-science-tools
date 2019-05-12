

/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { listen, MessageConnection } from '@sourcegraph/vscode-ws-jsonrpc'; 
import {
    CloseAction, ErrorAction,
    MonacoServices
} from 'monaco-languageclient';
import { createConnection } from './connection';
import { MonacoLanguageClient } from './MonacoLanguageClient';
import { editor } from 'monaco-editor';
import CellsManager from './CellsManager';

const normalizeUrl = require('normalize-url');
const ReconnectingWebSocket = require('reconnecting-websocket');

function createUrl() {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return normalizeUrl(`ws://localhost:3000/python`);
}

function createWebSocket(url: string): WebSocket {
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


function createLanguageClient(connection: MessageConnection, cellManager: CellsManager): MonacoLanguageClient {
    // connection.sendRequest()
    return new MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['markdown'],
            // disable the default error handler
            // errorHandler: {
            //     error: () => ErrorAction.Continue,
            //     closed: () => CloseAction.DoNotRestart
            // }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(createConnection(connection as any, errorHandler, closeHandler, cellManager))
            }
        }
    });
}

export default class CompletionProvider {
    languageClient: MonacoLanguageClient;
    constructor(editor: editor.IStandaloneCodeEditor, cellManager: CellsManager) {
        const url = createUrl()
        console.log(`connecting to ${url}`)
        const webSocket = createWebSocket(url);
        webSocket.onmessage = (msg) => {
            console.log("message")
            console.log(msg)
        }
        const this2 = this;

        webSocket.onerror = (msg) => {
            console.log("error")
            console.log(msg)
        }
        // // listen when the web socket is opened
        listen({
            webSocket,
            onConnection: connection => {
                console.log("listening")
                // this2.connection = connection;
                if (cellManager) {
                    MonacoServices.install(editor);
                    this2.languageClient = createLanguageClient(connection, cellManager)
                    const disposable = this2.languageClient.start();
                    connection.onClose(() => disposable.dispose());
                }
            }
        });

    }
}