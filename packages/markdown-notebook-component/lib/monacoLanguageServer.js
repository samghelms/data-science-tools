"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_json_languageservice_1 = require("vscode-json-languageservice");
const c2p = __importStar(require("vscode-languageclient/lib/codeConverter"));
const p2c = __importStar(require("vscode-languageclient/lib/protocolConverter"));
const code2ProtocolConverter = c2p.createConverter();
const protocol2CodeConverter = p2c.createConverter();
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
    // languages.registerCompletionItemProvider('markdown', {
    //     provideCompletionItems(model, position, context, token): PromiseLike<languages.CompletionList> {
    //         const client = cellsManager.getClientForCell(position.lineNumber) // returns a base client
    //         const res = client.then(cl => {
    //             const document = createDocument(model);
    //             const reqRes = cl.sendRequest(CompletionRequest.type, code2ProtocolConverter.asCompletionParams(document, position, {triggerKind: CompletionTriggerKind.Invoked}), token)
    //             .then(
    //                 protocol2CodeConverter.asCompletionResult,
    //                 (error: any) => {
    //                     // client.logFailedRequest(CompletionRequest.type, error);
    //                     return Promise.resolve([]);
    //                 }
    //             );
    //             return reqRes;
    //         })
    //         return res as PromiseLike<languages.CompletionList>;
    //         // return {
    //         //     suggestions: suggestions
    //         // };
    //     },
    // resolveCompletionItem(model, position, context, token): PromiseLike<languages.CompletionItem> {
    //     // model: editor.ITextModel, position: any, item: languages.CompletionItem, token
    //     const client = cellsManager.getClientForCell(position.lineNumber) // returns a base client
    //     const res = client.then(
    //         cl => cl.sendRequest(CompletionResolveRequest.type, code2ProtocolConverter.asCompletionItem(model), token).then(
    //             protocol2CodeConverter.asCompletionItem,
    //             // (error) => Promise.resolve(item)
    //         )
    //     );
    //     return res as PromiseLike<languages.CompletionItem>;
    // }
    // });
};
