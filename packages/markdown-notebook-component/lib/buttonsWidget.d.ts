import * as monaco from 'monaco-editor';
export declare const buttonsWidget: (startLineNumber: number, editorWidth: number, addOutputCB: any, clearOutputCB: any, getLineNumber: any) => {
    domNode: HTMLDivElement;
    getId: () => string;
    getDomNode: () => HTMLDivElement;
    getPosition: () => {
        position: {
            lineNumber: any;
        };
        preference: monaco.editor.ContentWidgetPositionPreference[];
    };
};
