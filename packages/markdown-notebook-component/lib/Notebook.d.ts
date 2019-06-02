/// <reference types="monaco-editor-core/monaco" />
import * as React from 'react';
import CellsManager from './CellsManager';
export declare namespace Cells {
    function installCellsManager(cm: any): void;
    function getCellsManager(): string;
}
interface ILang extends monaco.languages.ILanguageExtensionPoint {
    loader: () => Promise<ILangImpl>;
}
interface ILangImpl {
    conf: monaco.languages.LanguageConfiguration;
    language: monaco.languages.IMonarchLanguage;
}
export declare function loadLanguage(languageId: string): Promise<void>;
export declare function registerLanguage(def: ILang): void;
export interface IMarkdownEditorProps {
    kernelManager: any;
    path: string;
    getContent: () => string;
    style: {
        width: string;
        height: string;
    };
    save: (lines: Array<string>) => void;
}
export interface IMarkdownEditorState {
}
export default class Notebook extends React.Component<IMarkdownEditorProps, IMarkdownEditorState> {
    monacoRef: React.RefObject<HTMLDivElement>;
    _editor: monaco.editor.IStandaloneCodeEditor | null;
    _model: monaco.editor.ITextModel;
    outputAreaRegex: RegExp;
    height: number;
    _cellsManager: CellsManager | null;
    constructor(props: IMarkdownEditorProps);
    componentDidMount(): Promise<void>;
    getParseContent(): Promise<string>;
    componentWillReceiveProps(newProps: IMarkdownEditorProps): void;
    save(): void;
    keyHandler(e: React.KeyboardEvent<HTMLDivElement>): void;
    render(): JSX.Element;
}
export {};
