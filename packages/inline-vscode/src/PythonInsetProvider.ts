import * as vscode from 'vscode';
import {TextDocument, CancellationToken, ProviderResult, CodeInset, Webview} from 'vscode'

// export class CodeInset {
// 	range: Range;
// 	height?: number;
// 	constructor(range: Range, height?: number);
// }

export class PythonInsetProvider implements vscode.CodeInsetProvider {
	provideCodeInsets(document: TextDocument, token: CancellationToken): ProviderResult<CodeInset[]> {
		console.log("provideCodeInsets called")
		token
		document
		return [new CodeInset(new vscode.Range(0, 1, 0, 6), 5)]
	}
	resolveCodeInset(codeInset: CodeInset, webview: Webview, token: CancellationToken): ProviderResult<CodeInset> {
		console.log("resolveCodeInset called")
		token
		webview.html = '<div>hello world</div>'
		return codeInset
	}
}
