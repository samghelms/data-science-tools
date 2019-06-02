/// <reference types="monaco-editor-core/monaco" />
import { MonacoLanguageClient } from 'monaco-languageclient';
import CellsManager from './CellsManager';
export default class CompletionProvider {
    languageClient: MonacoLanguageClient;
    constructor(_editor: monaco.editor.IStandaloneCodeEditor, cellManager: CellsManager);
}
