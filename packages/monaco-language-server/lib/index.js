"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const monaco_editor_1 = require("monaco-editor");
const vscode_json_languageservice_1 = require("vscode-json-languageservice");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const c2p = __importStar(require("vscode-base-languageclient/lib/codeConverter"));
const p2c = __importStar(require("vscode-base-languageclient/lib/protocolConverter"));
const code2ProtocolConverter = c2p.createConverter();
const protocol2CodeConverter = p2c.createConverter();
const main_1 = require("vscode-languageserver-protocol/lib/main");
// always have things registered, just switch out what is called
// single client class, multiple objects for different language servers
// class LanguageServicesProvider {
//     constructor() {}
// }
const MODEL_URI = 'inmemory://model.json';
function createDocument(model) {
    return vscode_json_languageservice_1.TextDocument.create(MODEL_URI, model.getModeId(), model.getVersionId(), model.getValue());
}
exports.configureLanguageServer = (cellsManager) => {
    monaco_editor_1.languages.registerCompletionItemProvider('markdown', {
        provideCompletionItems(model, position, context, token) {
            const client = cellsManager.getClientForCell(position.lineNumber); // returns a base client
            const res = client.then(cl => {
                const document = createDocument(model);
                const reqRes = cl.sendRequest(vscode_languageserver_protocol_1.CompletionRequest.type, code2ProtocolConverter.asCompletionParams(document, position, { triggerKind: main_1.CompletionTriggerKind.Invoked }), token)
                    .then(protocol2CodeConverter.asCompletionResult, (error) => {
                    // client.logFailedRequest(CompletionRequest.type, error);
                    return Promise.resolve([]);
                });
                return reqRes;
            });
            return res;
            // return {
            //     suggestions: suggestions
            // };
        },
        resolveCompletionItem(item, token) {
            // model: editor.ITextModel, position: any, item: languages.CompletionItem, token
            const client = cellsManager.getClientForCell(item.range.startLineNumber); // returns a base client
            const res = client.then(cl => cl.sendRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, code2ProtocolConverter.asCompletionItem(item), token).then(protocol2CodeConverter.asCompletionItem, (error) => Promise.resolve(item)));
            return res;
        }
    });
};
