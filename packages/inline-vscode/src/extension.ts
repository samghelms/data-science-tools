/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	CancellationToken,
	CodeInset,
	CodeInsetProvider,
	ExtensionContext,
	languages,
	ProviderResult,
	TextDocument,
	window,
	Webview,
	CancellationTokenSource,
	commands,
} from 'vscode';

export function activate(context: ExtensionContext): void {
	let activeTextEditor = window.activeTextEditor;
	if (!activeTextEditor) { return; }

	const selector = [
		{ scheme: 'file', language: 'typescript' },
		{ scheme: 'unknown', language: 'typescript' },
	];
	const provider = new DocCodeInsetProvider();
	context.subscriptions.push(
		languages.registerCodeInsetProvider(selector, provider)
	);
	// console.log("registered")
	// const ct = new CancellationTokenSource().token
	// provider.provideCodeInsets(activeTextEditor.document, ct)

	// activeTextEditor
}

const inlineRegex = /INLINE\s+(https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/;

class DocCodeInsetProvider implements CodeInsetProvider {
	private urlForLine: { [line: number]: string } = {};

	provideCodeInsets(document: TextDocument, _cancellationToken: CancellationToken): ProviderResult<CodeInset[]> {
		console.log("providing insets");
		let result: CodeInset[] = [];
		for (let i = 0; i < document.lineCount; i++) {
			const line = document.lineAt(i);
			const match = inlineRegex.exec(line.text);
			if (match && match.length > 1) {
				this.urlForLine[line.range.end.line] = match[1];
				result.push({ range: line.range });
			}
		}
		console.log(result)
		commands.executeCommand('vscode.executeCodeInsetProvider')
		return result;
	}

	resolveCodeInset(codeInset: CodeInset, webview: Webview, _token: CancellationToken): ProviderResult<CodeInset> {
		const MAX_HEIGHT = 1000;
		console.log("resolveCodeInset");
		const uri = this.urlForLine[codeInset.range.end.line];
		webview.html = `<!doctype html>
			<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				</head>
				<body>
					<script>window.onerror=function(){console.log('ERR!')}</script>
					<p id='error-message' style="display:none">Unable to embed content at ${uri}. Some web sites do not support embedding.</p>
					<iframe id='hostframe' src="${uri}" style="overflow:scroll" frameborder=0></iframe>
					<script>
						const vscode = acquireVsCodeApi();
						const iframe = document.getElementById('hostframe');
						iframe.onload = function() {
							const body = iframe.contentWindow.document.body;
							if (!body.innerHTML) {
								document.getElementById('error-message').style.display = 'block';
								iframe.style.display = 'none';
							}
							const width = body.scrollWidth;
							const height = Math.min(${MAX_HEIGHT}, body.scrollHeight);
							iframe.width = width;
							iframe.height = height;
							vscode.postMessage({ type: 'size-info', payload: { width: width, height: height } });
						}
					</script>
				</body>
			</html>`;
		return codeInset;
	}
}