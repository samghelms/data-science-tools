import * as React from 'react';
import { SimplifiedOutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { Kernel } from '@jupyterlab/services';



class JupyterKernelDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        const running = Kernel.listRunning(this.props.settings).then(running => {
            this.setState({running})
        })

        const potentialKernels = Kernel.getSpecs(this.props.settings).then(potentialKernels => {
            this.setState({potentialKernels: potentialKernels.kernelspecs, defaultKernel: potentialKernels.default})
        })
    }

    async shutdown(run) {
        console.log("shutting kernel down")
        const kernel = await Kernel.connectTo(run);
        await kernel.shutdown()

        const running = await Kernel.listRunning(this.props.settings)
        this.setState({running})
    }

    async restart(run) {
        console.log("restarting kernel")
        const kernel = await Kernel.connectTo(run);
        await kernel.restart()
    }

    render() {
        return <div>
            {this.state.running ?
            <h4>running kernels</h4>: null}
            {this.state.running ? 
            this.state.running.map((run, i) => (
                <div key={i}>
                    <div>{run.name}</div>
                    <div>{run.execution_state}</div>
                    <div>{run.last_activity}</div>
                    <button onClick={() => this.shutdown(run)}>shut down</button>
                    <button onClick={() => this.restart(run)}>restart kernel</button>
                </div>
            )): null}
            {/* {this.state.potentialKernels ?
            <h4>Potential kernels</h4>: null}
            {this.state.potentialKernels ? 
            this.state.potentialKernels.map((k, i) => (
                <div key={i}>
                    <div>{k.name}</div>
                    <div>{k.execution_state}</div>
                    <div>{k.last_activity}</div>
                    <div>{k.connections}</div>
                </div>
            )): null} */}
        </div>
    }
}

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

    async list() {
        return await Kernel.listRunning(this._settings).then(kernelModels => {
            return kernelModels
        });
    }

    reactElement(parentKeyName, key) {
        return <JupyterKernelDisplay settings={this._settings} key={key}/>
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