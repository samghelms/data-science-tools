"use strict";
exports.__esModule = true;
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var monaco_converter_1 = require("monaco-languageclient/lib/monaco-converter");
var monaco_commands_1 = require("monaco-languageclient/lib/monaco-commands");
var monaco_languages_1 = require("monaco-languageclient/lib/monaco-languages");
var monaco_workspace_1 = require("monaco-languageclient/lib/monaco-workspace");
var console_window_1 = require("monaco-languageclient/lib/console-window");
var services_1 = require("./services");
var MonacoServices;
(function (MonacoServices) {
    function create(editor, options) {
        if (options === void 0) { options = {}; }
        var m2p = new monaco_converter_1.MonacoToProtocolConverter();
        var p2m = new monaco_converter_1.ProtocolToMonacoConverter();
        return {
            commands: new monaco_commands_1.MonacoCommands(editor),
            languages: new monaco_languages_1.MonacoLanguages(p2m, m2p),
            workspace: new monaco_workspace_1.MonacoWorkspace(p2m, m2p, options.rootUri),
            window: new console_window_1.ConsoleWindow()
        };
    }
    MonacoServices.create = create;
    function install(editor, options) {
        if (options === void 0) { options = {}; }
        var services = create(editor, options);
        services_1.Services.install(services);
        return services;
    }
    MonacoServices.install = install;
    function get() {
        return services_1.Services.get();
    }
    MonacoServices.get = get;
})(MonacoServices = exports.MonacoServices || (exports.MonacoServices = {}));
