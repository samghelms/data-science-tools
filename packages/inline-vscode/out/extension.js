"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const CELL_REGEX = "```python";
const CELL_END_REGEX = "```";
class MyCodeLensProvider {
    provideCodeLenses(document) {
        console.log("providing");
        let i = 0;
        let lenses = [];
        while (i < document.lineCount) {
            let curLine = document.lineAt(i);
            if (curLine.text.match(CELL_REGEX)) {
                let location = new vscode_1.Range(i, 0, i, 0);
                i++;
                curLine = document.lineAt(i);
                while (i < document.lineCount && !curLine.text.match(CELL_END_REGEX)) {
                    i++;
                    curLine = document.lineAt(i);
                }
                let c = {
                    command: 'extension.addConsoleLog',
                    title: 'Insert console.log',
                    arguments: [i]
                };
                let codeLens = new vscode_1.CodeLens(location, c);
                lenses.push(codeLens);
            }
            i++;
        }
        return lenses;
    }
}
async function addConsoleLog(lineNum) {
    if (vscode_1.window.activeTextEditor) {
        const inset = vscode_1.window.createWebviewTextEditorInset(vscode_1.window.activeTextEditor, lineNum, 3, {});
        const html = "<div> hello </div>";
        inset.webview.html = html; // WebPanel.generateReactHtml(htmlpath);
    }
}
function activate(context) {
    let activeTextEditor = vscode_1.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }
    let commandDisposable = vscode_1.commands.registerCommand('extension.addConsoleLog', addConsoleLog);
    context.subscriptions.push(commandDisposable);
    const selector = [
        { scheme: 'file', language: 'markdown' },
        { scheme: 'unknown', language: 'markdown' },
    ];
    // languages.re
    const clp = new MyCodeLensProvider();
    let codeLensProviderDisposable = vscode_1.languages.registerCodeLensProvider('markdown', clp);
    context.subscriptions.push(codeLensProviderDisposable);
}
exports.activate = activate;
