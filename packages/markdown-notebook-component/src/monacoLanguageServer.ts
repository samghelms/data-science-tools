import { languages, editor } from 'monaco-editor';
import { TextDocument } from "vscode-json-languageservice";

import { CompletionRequest, CompletionResolveRequest } from "vscode-languageserver-protocol";
import * as c2p from 'vscode-languageclient/lib/codeConverter';
import * as p2c from 'vscode-languageclient/lib/protocolConverter';
import CellsManager from './CellsManager';
const code2ProtocolConverter = c2p.createConverter();
const protocol2CodeConverter = p2c.createConverter();
import { CompletionTriggerKind } from 'vscode-languageserver-protocol/lib/main'
import { CancellationToken } from 'vscode-jsonrpc';
// always have things registered, just switch out what is called
// single client class, multiple objects for different language servers

// class LanguageServicesProvider {
//     constructor() {}

// }
const MODEL_URI = 'inmemory://model.json'

function createDocument(model: editor.IReadOnlyModel): TextDocument {
    return TextDocument.create(MODEL_URI, model.getModeId(), model.getVersionId(), model.getValue());
}

export const configureLanguageServer = (cellsManager: CellsManager) => {
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
}