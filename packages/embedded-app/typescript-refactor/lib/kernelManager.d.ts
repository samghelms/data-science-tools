export default class KernelManager {
    _kernels: Array<any>;
    warningMessageCB: any;
    constructor(warningMessageCB: any);
    execute(header: string, body: string): any;
    findMatchingKernel(header: string): any;
    getLanguageServerProvider(header: string): Promise<any>;
    register(newKernel: any): void;
    list(): any[];
    close(): Promise<void>;
}
//# sourceMappingURL=kernelManager.d.ts.map