"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeInsetProvider {
    provideCodeInsets(document, token) {
        return null;
    }
    resolveCodeInset(codeInset, webview, token) {
        webview.html = '<div>hello world</div>';
        return null;
    }
}
exports.CodeInsetProvider = CodeInsetProvider;
//# sourceMappingURL=InsetProvider.js.map