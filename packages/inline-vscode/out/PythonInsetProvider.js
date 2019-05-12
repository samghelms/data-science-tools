"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
// export class CodeInset {
// 	range: Range;
// 	height?: number;
// 	constructor(range: Range, height?: number);
// }
class PythonInsetProvider {
    provideCodeInsets(document, token) {
        console.log("provideCodeInsets called");
        return [new vscode_1.CodeInset(new vscode.Range(0, 1, 0, 6), 5)];
    }
    resolveCodeInset(codeInset, webview, token) {
        console.log("resolveCodeInset called");
        webview.html = '<div>hello world</div>';
        return codeInset;
    }
}
exports.PythonInsetProvider = PythonInsetProvider;
//# sourceMappingURL=PythonInsetProvider.js.map