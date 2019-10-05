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
	CodeLensProvider,
	CodeLens,
	Range,
	Command,
	SnippetString,
	Position
} from 'vscode';

const CELL_REGEX = "```python";
const CELL_END_REGEX = "```";

class MyCodeLensProvider implements CodeLensProvider {
	provideCodeLenses(document: TextDocument): CodeLens[] {
		console.log("providing")
		let i = 0
		let lenses = [];
		while (i < document.lineCount) {
			let curLine = document.lineAt(i);
			if (curLine.text.match(CELL_REGEX)) {
				let location = new Range(i, 0, i, 0);
				i++;
				curLine = document.lineAt(i);
				while (i < document.lineCount && !curLine.text.match(CELL_END_REGEX)) {
					i++;
					curLine = document.lineAt(i);
				}
				let c: Command = {
					command: 'extension.addConsoleLog',
					title: 'Insert console.log',
					arguments: [ i ]
				}
				let codeLens = new CodeLens(location, c)
				lenses.push(codeLens)
			}
			i ++;
		}
		return lenses;
	}
}

async function addConsoleLog(lineNum: number) {
	if (window.activeTextEditor) {
		const inset = window.createWebviewTextEditorInset(window.activeTextEditor, lineNum, 3, {  });
		const html = "<div> hello </div>"
        inset.webview.html = html; // WebPanel.generateReactHtml(htmlpath);
	}
}

export function activate(context: ExtensionContext): void {
	let activeTextEditor = window.activeTextEditor;
	if (!activeTextEditor) { return; }

	let commandDisposable = commands.registerCommand(
		'extension.addConsoleLog',
		addConsoleLog
	)
	  
	context.subscriptions.push(commandDisposable)

	const selector = [
		{ scheme: 'file', language: 'markdown' },
		{ scheme: 'unknown', language: 'markdown' },
	];
	// languages.re

	const clp = new MyCodeLensProvider();
	
	let codeLensProviderDisposable = languages.registerCodeLensProvider(
		'markdown',
		clp
	)
	  
	context.subscriptions.push(codeLensProviderDisposable)
}
