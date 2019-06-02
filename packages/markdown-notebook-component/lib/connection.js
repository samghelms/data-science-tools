/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var main_1 = require("vscode-languageserver-protocol/lib/main");
var Is = __importStar(require("vscode-languageserver-protocol/lib/utils/is"));
function createConnection(connection, errorHandler, closeHandler, cellManager) {
    connection.onError(function (data) { errorHandler(data[0], data[1], data[2]); });
    connection.onClose(closeHandler);
    console.log("creating connection");
    console.log(cellManager);
    return {
        listen: function () { return connection.listen(); },
        sendRequest: function (type) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            console.log("sending request");
            // console.log(params)
            // nasty nasty hack to inject the type of language code we are sending to the language server(s)
            var o = params[0];
            var language = null;
            if (cellManager) {
                language = cellManager.getTypeForLine();
            }
            var obj = __assign({ 'type': language }, o);
            params[0] = obj;
            // console.log(params)
            return connection.sendRequest.apply(connection, [Is.string(type) ? type : type.method].concat(params));
        },
        onRequest: function (type, handler) {
            // const handlerWrapper = (...params: any) => {
            //     console.log("wrapper called")
            //     console.log(params)
            //     handler(...params)
            // }
            // console.log("request received")
            connection.onRequest(Is.string(type) ? type : type.method, handler);
            // connection.
        },
        sendNotification: function (type, params) { return connection.sendNotification(Is.string(type) ? type : type.method, params); },
        onNotification: function (type, handler) { return connection.onNotification(Is.string(type) ? type : type.method, handler); },
        trace: function (value, tracer, sendNotification) {
            if (sendNotification === void 0) { sendNotification = false; }
            return connection.trace(value, tracer, sendNotification);
        },
        initialize: function (params) { return connection.sendRequest(main_1.InitializeRequest.type, params); },
        shutdown: function () { return connection.sendRequest(main_1.ShutdownRequest.type, undefined); },
        exit: function () { return connection.sendNotification(main_1.ExitNotification.type); },
        onLogMessage: function (handler) { return connection.onNotification(main_1.LogMessageNotification.type, handler); },
        onShowMessage: function (handler) {
            // console.log("onShowMessage received")
            var handlerWrapper = function (params) {
                // console.log("onShowMessage called")
                // console.log(params)
                handler(params);
            };
            connection.onNotification(main_1.ShowMessageNotification.type, handlerWrapper);
        },
        onTelemetry: function (handler) { return connection.onNotification(main_1.TelemetryEventNotification.type, handler); },
        didChangeConfiguration: function (params) { return connection.sendNotification(main_1.DidChangeConfigurationNotification.type, params); },
        didChangeWatchedFiles: function (params) { return connection.sendNotification(main_1.DidChangeWatchedFilesNotification.type, params); },
        didOpenTextDocument: function (params) { return connection.sendNotification(main_1.DidOpenTextDocumentNotification.type, params); },
        didChangeTextDocument: function (params) { return connection.sendNotification(main_1.DidChangeTextDocumentNotification.type, params); },
        didCloseTextDocument: function (params) { return connection.sendNotification(main_1.DidCloseTextDocumentNotification.type, params); },
        didSaveTextDocument: function (params) { return connection.sendNotification(main_1.DidSaveTextDocumentNotification.type, params); },
        onDiagnostics: function (handler) {
            // console.log("diagnostics received")
            connection.onNotification(main_1.PublishDiagnosticsNotification.type, handler);
        },
        dispose: function () { return connection.dispose(); }
    };
}
exports.createConnection = createConnection;
