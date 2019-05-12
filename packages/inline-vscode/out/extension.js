"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode = require("vscode");
const URI_SCHEME = 'inline-doc';
function activate(context) {
    console.log("starting activation");
    let activeTextEditor = vscode_1.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }
    console.log("active editor located");
    const selector = [
        { scheme: 'file', language: 'typescript' },
        { scheme: 'unknown', language: 'typescript' },
    ];
    const provider = new DocCodeInsetProvider();
    context.subscriptions.push(vscode_1.languages.registerCodeInsetProvider(selector, provider));
    context.subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider(URI_SCHEME, new InlineDocumentationProvider()));
    function commentLine() {
        vscode.commands.executeCommand('vscode.executeCodeInsetProvider');
    }
    // function _executeCodeInsetProvider() Thenable<vscode.CodeInset[]> {
    // 	const args = { resource };
    // 	return this._commands.executeCommand<modes.ICodeInsetSymbol[]>('_executeCodeInsetProvider', args)
    // 		.then(tryMapWith(item =>
    // 			new types.CodeInset(
    // 				typeConverters.Range.to(item.range),
    // 				URI.revive(item.uri))));
    // }
    context.subscriptions.push(vscode.commands.registerCommand('inline.test', commentLine));
    // provider.provideCodeInsets(activeTextEditor.document, null)
    // vscode.executeCodeInsetProvider
    // vscode.commands.executeCommand('vscode.executeCodeInsetProvider');
}
exports.activate = activate;
const html = `<!doctype html>
			<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				</head>
				<body>
					<script>window.onerror=function(){console.log('ERR!')}</script>
					<p id='error-message' style="display:none">Unable to embed content at ${"https://github.com/Microsoft/vscode/pull/66418/files"}. Some web sites do not support embedding.</p>
					<iframe id='hostframe' src="${"https://github.com/Microsoft/vscode/pull/66418/files"}" style="overflow:scroll" frameborder=0></iframe>
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
							const height = Math.min(${100}, body.scrollHeight);
							iframe.width = width;
							iframe.height = height;
							console.log("test");
							vscode.postMessage({ type: 'size-info', payload: { width: width, height: height } });
						}
					</script>
				</body>
			</html>`;
class DocCodeInsetProvider {
    provideCodeInsets(document, _cancellationToken) {
        console.log("provideCodeInsets called");
        return scanForRegexp(document);
    }
    resolveCodeInset(codeInset, webview, token) {
        console.log("resolve code inset called");
        webview.html = html;
        return codeInset;
    }
}
const inlineRegex = /INLINE\s+(https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/;
function scanForRegexp(doc) {
    console.log("scanning for regex");
    if (!doc) {
        return [];
    }
    let result = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const line = doc.lineAt(i);
        const match = inlineRegex.exec(line.text);
        if (match && match.length > 1) {
            const uri = vscode_1.Uri.parse(match[1]);
            const docUri = vscode_1.Uri.parse(`${URI_SCHEME}:${uri}`);
            result.push({
                range: line.range,
            });
        }
    }
    console.log(result);
    return result;
}
const MAX_HEIGHT = 1000;
class InlineDocumentationProvider {
    provideTextDocumentContent(docUri, _token) {
        console.log("provideTextDocumentContent");
        const uri = docUri.path;
        const html = `<!doctype html>
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
							console.log("test");
							vscode.postMessage({ type: 'size-info', payload: { width: width, height: height } });
						}
					</script>
				</body>
			</html>`;
        return html;
    }
}
//# sourceMappingURL=extension.js.map