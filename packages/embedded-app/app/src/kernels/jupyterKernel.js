import { SimplifiedOutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { Kernel } from '@jupyterlab/services';

export default class JupyterKernel {
    constructor(settings) {
        this._settings = settings
        this._default = Kernel.getSpecs(settings).then(kernelSpecs => kernelSpecs.default)
        this.kernel = null
        // this.beginRegex = /```[\s]{0,5}python/g
    }

    async getKernelName(header) {
        // need to put some sort of non whitespace or alphanumeric character after to break it up
        const kernelNameRegex = /kernel: ([A-Za-z0-9\s]*)/
        const kernelName = header.match(kernelNameRegex)
        return kernelName && kernelName.length > 1 ? kernelName[1] : (await this._default)
    }

    execute(header, code) {
        console.log("exectue called")
        if (this.kernel) {
            console.log('executing', header, code)
            const model = new OutputAreaModel();
            const rendermime = new RenderMimeRegistry({ initialFactories });
            const outputArea = new SimplifiedOutputArea({ model, rendermime });
            const future = this.kernel.requestExecute({ code: code });
            outputArea.future = future;
            return {future, node: outputArea.node}    
        }
    }

    // execute(header, code) {
    //     console.log('executing', header, code)

    //     const model = new OutputAreaModel();
    //     const rendermime = new RenderMimeRegistry({ initialFactories });
    //     const outputArea = new SimplifiedOutputArea({ model, rendermime });
    //     console.log(this.kernel)
    //     const future = this.kernel.requestExecute({ code: 'a = 1' });
    //     future.done.then(() => {
    //         console.log('Future is fulfilled');
    //     });
    //     future.onIOPub = msg => {
    //         console.log(msg.content); // Print rich output data.
    //     };

    //     // outputArea.future = future;
    //     const executeResults = document.createElement("div")
    //     executeResults.innerHTML = 'test'
        
    //     return {node: executeResults}

    // }

    async initializeKernel(header) {
        const kernelName = await this.getKernelName(header);
        this.kernel = await this.getOrStartKernel(kernelName);
        console.log(kernelName)
    }

    async getRunning () {
        return await Kernel.listRunning(this._settings).then(kernelModels => {
            return kernelModels
        });
    }

    async getOrStartKernel(kernelName) {
        const runningKernels = await this.getRunning();
        const runningKernel = runningKernels.find(el => el.name === kernelName);
        console.log(runningKernel)
        if (runningKernel) {
            return Kernel.connectTo(runningKernel, this._settings);
        };

        let options = {
            name: await this._default,
            serverSettings: this._settings
        };
        console.log(options)
        return await Kernel.startNew(options)
    }

    // async open () {
    //     Kernel.listRunning(settings).then(kernelModels => {
    //         // const kernel = Kernel.connectTo(kernelModels[0]);
    //         console.log(kernelModels);
    //       });
    //       const jupyterKernel = await Kernel.getSpecs(settings).then(kernelSpecs => {
    //           console.log(kernelSpecs.default)
    //           return Kernel.startNew({
    //               name: kernelSpecs.default,
    //               serverSettings: settings
    //             });
    //       })
    // }

    match(header) {
        return true;
    }

    async close() {
        return await this.kernel.shutdown()
    }
}