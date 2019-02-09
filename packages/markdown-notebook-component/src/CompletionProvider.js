

/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { listen } from '@sourcegraph/vscode-ws-jsonrpc'; 
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from 'monaco-languageclient';
const normalizeUrl = require('normalize-url');
import ReconnectingWebSocket from 'reconnecting-websocket';
import { MonacoToProtocolConverter, ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter';
import { MonacoLanguages } from "monaco-languageclient/lib/monaco-languages";

const m2p = new MonacoToProtocolConverter();
const p2m = new ProtocolToMonacoConverter();

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

function createLanguageClient(connection, services) {
    return new MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector        
            documentSelector: ['markdown'],
            // rootUri: null,
            // disable the default error handler            
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.DoNotRestart
            }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
            }
        }
    })
}

export default class CompletionProvider {
    constructor(editor) {
        console.log("creating comletion provider") 
        console.log(editor)
        const url = createUrl()
        const webSocket = createWebSocket(url);
        webSocket.onmessage = (msg) => {
            console.log("message")
            console.log(msg)
        }

        webSocket.onerror = (msg) => {
            console.log("error")
            console.log(msg)
        }
        // // listen when the web socket is opened
        listen({
            webSocket,
            onConnection: connection => {
                console.log("listening")
                const services = {
                    // commands: new MonacoCommands(editor),
                    languages: new MonacoLanguages(p2m, m2p),
                    // workspace: new MonacoWorkspace(p2m, m2p, options.rootUri),
                    // window: new ConsoleWindow()
                }
                MonacoServices.install(editor);
                const languageClient = createLanguageClient(connection, services)
                const disposable = languageClient.start();
                connection.onClose(() => disposable.dispose());
            }
        });

    }
}