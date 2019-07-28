"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function activate(context) {
    let activeTextEditor = vscode_1.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }
    const selector = [
        { scheme: 'file', language: 'typescript' },
        { scheme: 'unknown', language: 'typescript' },
    ];
    console.log("test");
    // const provider = new DocCodeInsetProvider();
    // context.subscriptions.push(
    // 	languages.registerCodeInsetProvider(selector, provider)
    // );
    // console.log("registered")
    // const ct = new CancellationTokenSource().token
    // provider.provideCodeInsets(activeTextEditor.document, ct)
    // activeTextEditor
    vscode_1.commands.registerCommand('extension.sayHello', async (args, brgs, crgs) => {
        if (!vscode_1.window.activeTextEditor) {
            return;
        }
        const inset = vscode_1.window.createWebviewTextEditorInset(vscode_1.window.activeTextEditor, vscode_1.window.activeTextEditor.selection.with({ end: vscode_1.window.activeTextEditor.selection.end.translate(8) }), { enableCommandUris: true, enableScripts: true });
        inset.onDidDispose(() => {
            console.log('WEBVIEW disposed...');
        });
        inset.webview.html = getWebviewContent();
        // Handle messages from the webview
        inset.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode_1.window.showErrorMessage(message.text);
                    return;
            }
        }, undefined, context.subscriptions);
    });
}
exports.activate = activate;
function getWebviewContent() {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
  </head>
  <body>
	  <button id="btn" style="z-index: 100;" onclick="close()">close</button>
	  <script>
		var btn = document.getElementById('btn')
		console.log(btn)
	</script>
	<div> test test </div>
	<div> test test </div>
	<div> test test </div>
  </body>
  </html>`;
}
