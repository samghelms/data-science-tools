import * as React from 'react';
import { SimplifiedOutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { Kernel } from '@jupyterlab/services';
import * as yaml from 'js-yaml';

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
            console.log(potentialKernels)
            this.setState({potentialKernels: Object.values(potentialKernels.kernelspecs), defaultKernel: potentialKernels.default})
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
            {this.state.potentialKernels ?
            <h4>Potential kernels</h4>: null}
            {this.state.potentialKernels ? 
            this.state.potentialKernels.map((k, i) => (
                <div key={i}>
                    <div><b>{k.name}</b></div>
                    <div>{`example block header: \`\`\`python {kernel: ${k.name}} `}</div>
                </div>
            )): null}
        </div>
    }
}

export default class JupyterKernel {
    constructor(settings) {
        this._settings = settings
        this._default = Kernel.getSpecs(settings).then(kernelSpecs => kernelSpecs.default)
        this.kernel = null
        this.beginRegex = /^```python/
        this._kernelCache = {}
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

    parseHeader(header) {
        console.log("parsing header")
        // Examine all text after the begin regex. Parses as if it is a yaml object.
        const headerStart = header.replace(this.beginRegex, "");

        // Get document, or throw exception on error
        try {
            return yaml.safeLoad(headerStart);
            console.log(doc);
        } catch (e) {
            console.log(e);
            return null;
        }
        
    }

    execute(header, code) {
        const model = new OutputAreaModel();
        const rendermime = new RenderMimeRegistry({ initialFactories });
        const outputArea = new SimplifiedOutputArea({ model, rendermime });

        this.getOrStartKernel(header).then(kernel => {
            const future = kernel.requestExecute({ code: code });
            outputArea.future = future;
        })

        return outputArea
    }

    async getRunning () {
        return await Kernel.listRunning(this._settings).then(kernelModels => {
            return kernelModels
        });
    }

    async getSpecs() {
        Kernel.getSpecs(this._settings).then(kernelSpecs => {
            console.log('Default spec:', kernelSpecs.default);
            console.log('Available specs', Object.keys(kernelSpecs.kernelspecs));
        })
    }

    async getOrStartKernel(header) {
        const parsedHeader = this.parseHeader(header)
        let kernelName = null;
        if (parsedHeader && 'kernel' in parsedHeader) {
            kernelName = parsedHeader['kernel']
        } else {
            kernelName = await this._default;
        }

        const runningKernels = await this.getRunning();

        this.getSpecs()
        let runningKernel;
        if ((runningKernels.length > 0) && (kernelName in this._kernelCache)) {
            const id = this._kernelCache[kernelName]
            runningKernel = runningKernels.find(el => el.name === kernelName && el.id ==id);
        }

        if (runningKernel) {
            console.log("found running kernel")
            return Kernel.connectTo(runningKernel, this._settings);
        }
        console.log("Alert, no kernel found, starting new")
        const newKernelName = (kernelName === 'default' || kernelName === null) ?  (await this._default) : kernelName
        let options = {
            name: newKernelName,
            serverSettings: this._settings
        };
        const newKernel = await Kernel.startNew(options)
        console.log("new kernel")
        console.log(newKernel)
        this._kernelCache[kernelName] = newKernel._id;
        return newKernel
    }

    match(header) {
        console.log("matching header", header)
        return header.match(this.beginRegex) !== null;
    }

    async close() {
        const runningKernels = await this.getRunning();
        for(let k of runningKernels) {
            if (k.id in this._kernelCache) {
                const kernel = await Kernel.connectTo(k);
                kernel.shutdown()
                delete this._kernelCache[k.id]
            }
        }
    }
}