export default class KernelManager {
    _kernels: Array<any>
    warningMessageCB: any;
    constructor(warningMessageCB: any) {
        this._kernels = []
        this.warningMessageCB = warningMessageCB
    }

    // return a promise that resolves when the entire execution is done as well as an initial placeholder
    // allows you to pass arbitrary string arguments to your kernel
    execute(header: string, body: string) {
        const kernel = this.findMatchingKernel(header)
        if (kernel) {
            return kernel.execute(header, body)
        }
        this.warningMessageCB(`error: could not find kernel for ${header}`)
        return null;
    }

    findMatchingKernel(header: string) {
        for (let k of this._kernels) {
            if (k.match(header)) {
                return k;
            }
        }
        return null;
    }

    // startLSIfNeeded(header: string, editor) {
    //     const kernel = this.findMatchingKernel(header);
    //     if (kernel) kernel.startLSIfNeeded(header, editor);
    // }

    async getLanguageServerProvider(header: string) {
        const kernel = this.findMatchingKernel(header);
        if (kernel) {
            return await kernel.getLanguageServerProvider(header);
        }
        return null;
    }

    register(newKernel: any) {
        this._kernels.push(newKernel);
    }

    list() {
        return this._kernels.map((k, i) => k.reactElement(i))
    }

    async close() {
        for (let k of this._kernels) {
            await k.close()
        }
        // closes connections to all open kernels
    }
}