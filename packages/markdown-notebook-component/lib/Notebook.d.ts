import * as React from 'react';
import { editor, languages } from 'monaco-editor';
import CellsManager from './CellsManager';
export declare namespace Cells {
    function installCellsManager(cm: any): void;
    function getCellsManager(): string;
}
interface ILang extends languages.ILanguageExtensionPoint {
    loader: () => Promise<ILangImpl>;
}
interface ILangImpl {
    conf: languages.LanguageConfiguration;
    language: languages.IMonarchLanguage;
}
export declare function loadLanguage(languageId: string): Promise<void>;
export declare function registerLanguage(def: ILang): void;
export interface IMarkdownEditorProps {
    registerModel: (model: editor.ITextModel) => void;
    kernelManager: any;
    path: string;
    getContent: () => string;
    style: {
        width: string;
        height: string;
    };
    save: (lines: Array<string>) => void;
    isRename: boolean;
}
export interface IMarkdownEditorState {
}
export default class Notebook extends React.Component<IMarkdownEditorProps, IMarkdownEditorState> {
    monacoRef: React.RefObject<HTMLDivElement>;
    _editor: editor.IStandaloneCodeEditor | null;
    _model: editor.ITextModel;
    outputAreaRegex: RegExp;
    height: number;
    _cellsManager: CellsManager | null;
    constructor(props: IMarkdownEditorProps);
    componentDidMount(): Promise<void>;
    getParseContent(): Promise<string>;
    initializeModel(): Promise<void>;
    componentWillReceiveProps(newProps: IMarkdownEditorProps): void;
    save(): void;
    keyHandler(e: React.KeyboardEvent<HTMLDivElement>): void;
    render(): JSX.Element;
}
export {};
