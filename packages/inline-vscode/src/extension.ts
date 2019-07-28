/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	CancellationToken,
	ExtensionContext,
	languages,
	ProviderResult,
	TextDocument,
	window,
	Webview,
	CancellationTokenSource,
	commands,
	WebviewOptions,
} from 'vscode';

export function activate(context: ExtensionContext): void {
	let activeTextEditor = window.activeTextEditor;
	if (!activeTextEditor) { return; }

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
	commands.registerCommand('extension.sayHello', async (args, brgs, crgs) => {
        if (!window.activeTextEditor) {
            return;
		}

        const inset = window.createWebviewTextEditorInset(
            window.activeTextEditor,
            window.activeTextEditor.selection.with({ end: window.activeTextEditor.selection.end.translate(8) }),
            { enableCommandUris: true, enableScripts: true }
        );
        inset.onDidDispose(() => {
            console.log('WEBVIEW disposed...');
		});
		inset.webview.html = getWebviewContent();
		
		// Handle messages from the webview
		inset.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'alert':
				  window.showErrorMessage(message.text);
				  return;
			  }
			},
			undefined,
			context.subscriptions
		  );
    });
}

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