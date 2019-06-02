import { MonacoCommands } from 'monaco-languageclient/lib/monaco-commands';
import { MonacoLanguages } from "monaco-languageclient/lib/monaco-languages";
import { MonacoWorkspace } from "monaco-languageclient/lib/monaco-workspace";
import { ConsoleWindow } from "monaco-languageclient/lib/console-window";
import { Services } from "./services";
import * as monaco from 'monaco-editor';
export interface MonacoServices extends Services {
    commands: MonacoCommands;
    languages: MonacoLanguages;
    workspace: MonacoWorkspace;
    window: ConsoleWindow;
}
export declare namespace MonacoServices {
    interface Options {
        rootUri?: string;
    }
    type Provider = () => MonacoServices;
    function create(editor: monaco.editor.IStandaloneCodeEditor, options?: Options): MonacoServices;
    function install(editor: monaco.editor.IStandaloneCodeEditor, options?: Options): MonacoServices;
    function get(): MonacoServices;
}
