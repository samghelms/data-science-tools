/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("vscode-languageserver-protocol/lib/main");
const Is = __importStar(require("vscode-languageserver-protocol/lib/utils/is"));
function createConnection(connection, errorHandler, closeHandler, cellManager) {
    connection.onError((data) => { errorHandler(data[0], data[1], data[2]); });
    connection.onClose(closeHandler);
    console.log("creating connection");
    console.log(cellManager);
    return {
        listen: () => connection.listen(),
        sendRequest: (type, ...params) => {
            console.log("sending request");
            console.log(params);
            // nasty nasty hack to inject the type of language code we are sending to the language server(s)
            const o = params[0];
            let language = null;
            if (cellManager) {
                language = cellManager.getTypeForLine();
            }
            let obj = Object.assign({ 'type': language }, o);
            params[0] = obj;
            console.log(params);
            return connection.sendRequest(Is.string(type) ? type : type.method, ...params);
        },
        onRequest: (type, handler) => {
            // const handlerWrapper = (...params: any) => {
            //     console.log("wrapper called")
            //     console.log(params)
            //     handler(...params)
            // }
            console.log("request received");
            connection.onRequest(Is.string(type) ? type : type.method, handler);
            // connection.
        },
        sendNotification: (type, params) => connection.sendNotification(Is.string(type) ? type : type.method, params),
        onNotification: (type, handler) => connection.onNotification(Is.string(type) ? type : type.method, handler),
        trace: (value, tracer, sendNotification = false) => connection.trace(value, tracer, sendNotification),
        initialize: (params) => connection.sendRequest(main_1.InitializeRequest.type, params),
        shutdown: () => connection.sendRequest(main_1.ShutdownRequest.type, undefined),
        exit: () => connection.sendNotification(main_1.ExitNotification.type),
        onLogMessage: (handler) => connection.onNotification(main_1.LogMessageNotification.type, handler),
        onShowMessage: (handler) => {
            console.log("onShowMessage received");
            const handlerWrapper = (params) => {
                console.log("onShowMessage called");
                console.log(params);
                handler(params);
            };
            connection.onNotification(main_1.ShowMessageNotification.type, handlerWrapper);
        },
        onTelemetry: (handler) => connection.onNotification(main_1.TelemetryEventNotification.type, handler),
        didChangeConfiguration: (params) => connection.sendNotification(main_1.DidChangeConfigurationNotification.type, params),
        didChangeWatchedFiles: (params) => connection.sendNotification(main_1.DidChangeWatchedFilesNotification.type, params),
        didOpenTextDocument: (params) => connection.sendNotification(main_1.DidOpenTextDocumentNotification.type, params),
        didChangeTextDocument: (params) => connection.sendNotification(main_1.DidChangeTextDocumentNotification.type, params),
        didCloseTextDocument: (params) => connection.sendNotification(main_1.DidCloseTextDocumentNotification.type, params),
        didSaveTextDocument: (params) => connection.sendNotification(main_1.DidSaveTextDocumentNotification.type, params),
        onDiagnostics: (handler) => {
            console.log("diagnostics received");
            connection.onNotification(main_1.PublishDiagnosticsNotification.type, handler);
        },
        dispose: () => connection.dispose()
    };
}
exports.createConnection = createConnection;
