import { BaseLanguageClient, MessageTransports, LanguageClientOptions } from "vscode-languageclient/lib/client";
import { IConnectionProvider, IConnection } from './connection';
export * from 'vscode-languageclient/lib/client';
export declare class MonacoLanguageClient extends BaseLanguageClient {
    static bypassConversion: (result: any) => any;
    protected readonly connectionProvider: IConnectionProvider;
    constructor({ id, name, clientOptions, connectionProvider }: MonacoLanguageClient.Options);
    protected doCreateConnection(): Thenable<IConnection>;
    protected createMessageTransports(encoding: string): Thenable<MessageTransports>;
    protected registerBuiltinFeatures(): void;
}
export declare namespace MonacoLanguageClient {
    interface Options {
        name: string;
        id?: string;
        clientOptions: LanguageClientOptions;
        connectionProvider: IConnectionProvider;
    }
}
