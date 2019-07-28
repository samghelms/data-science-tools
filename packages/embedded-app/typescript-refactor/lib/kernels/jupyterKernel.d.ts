import { Kernel } from '@jupyterlab/services';
export interface JupyterKernelDisplayProps {
    settings: any;
}
export interface JupyterKernelDisplayState {
    settings: any;
    running: any | null;
    potentialKernels: any | null;
    defaultKernel: any | null;
}
export default class JupyterKernel {
    _settings: any;
    _default: any;
    kernel: any;
    beginRegex: RegExp;
    _kernelCache: any;
    _languageServerPort: any;
    _languageServers: any;
    constructor(settings: any, languageServerPort?: number);
    getParsedHeader(header: string): Promise<any>;
    setLanguageServerProvider(provider: any, id: any): Promise<void>;
    getKernelName(header: string): Promise<any>;
    list(): Promise<Kernel.IModel[]>;
    reactElement(parentKeyName: any, key: any): JSX.Element;
    parseHeader(header: string): any;
    execute(header: string, code: string): any;
    getRunning(): Promise<Kernel.IModel[]>;
    getSpecs(): Promise<void>;
    getOrStartKernel(header: string): Promise<Kernel.IKernel>;
    match(header: string): boolean;
    close(): Promise<void>;
}
//# sourceMappingURL=jupyterKernel.d.ts.map