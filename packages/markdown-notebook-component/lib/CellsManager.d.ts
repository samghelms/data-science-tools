/// <reference types="monaco-editor-core/monaco" />
import CompletionProvider from './CompletionProvider';
declare class Cell {
    start: number;
    end: number;
    editor: monaco.editor.IStandaloneCodeEditor;
    _model: monaco.editor.ITextModel;
    _kernelManager: any;
    zone: {
        afterLineNumber: number;
        heightInPx: number;
        domNode: HTMLDivElement;
        marginDomNode: HTMLDivElement;
    };
    viewZoneId: number;
    outputNode: HTMLDivElement;
    zoneHeight: number;
    buttonsWidget: any;
    outputExpanded: boolean;
    constructor(start: number, end: number, editor: monaco.editor.IStandaloneCodeEditor, model: monaco.editor.ITextModel, kernelManager: any);
    getHeader(): string;
    getLanguageServerProvider(): Promise<any>;
    addSerializedOutput(html: string): void;
    addExecuteOutput(line?: number): void;
    clearExecuteOutput(): void;
    _addOutput(nodeToAdd: HTMLDivElement): void;
    getStartLine(): number;
    updateStart(lineDiff: number): void;
    updateEnd(lineDiff: number): void;
    contains(lineNum: number): boolean;
    dispose(): void;
}
export default class CellsManager {
    _model: monaco.editor.ITextModel;
    _editor: monaco.editor.IStandaloneCodeEditor;
    _cells: Map<string, Cell>;
    _kernelManager: any;
    serializedOutputs: Map<string, string>;
    _completionProvider: CompletionProvider;
    constructor(model: monaco.editor.ITextModel, editor: monaco.editor.IStandaloneCodeEditor, kernelManager: any);
    executeCursorCell(): void;
    executeCursorLine(): void;
    addSerializedOutput(serializeOutput: string, line: number): void;
    addCell(start: number, end: number): void;
    updateCells(changeEvent: monaco.editor.IModelContentChangedEvent): void;
    setLanguageServerProvider(provider: any, selectorId: string): void;
    getTypeForLine(): string;
    inCell(lineNum: number): boolean;
    inCellValue(lineNum: number): Cell;
    cellsInside(start: number, end: number): string[];
    cellContaining(lineNum: number): {
        key: string;
        value: Cell;
    };
    onCellBoundary(line: number): 1 | 0 | 2;
    disposeCells(): void;
    serializeCells(): {
        line: number;
        html: string;
    }[];
}
export {};
