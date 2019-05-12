import { MonacoLanguageClient } from './MonacoLanguageClient';
import { editor } from 'monaco-editor';
import CellsManager from './CellsManager';
export default class CompletionProvider {
    languageClient: MonacoLanguageClient;
    constructor(editor: editor.IStandaloneCodeEditor, cellManager: CellsManager);
}
